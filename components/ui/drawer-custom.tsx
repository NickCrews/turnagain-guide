'use client'

import React, { createContext, useContext, useState, useRef, useCallback, useEffect, ReactNode } from 'react'
import { cn } from '@/lib/utils'

const TRANSITIONS = { DURATION: 0.5, EASE: [0.32, 0.72, 0, 1] } as const;
const VELOCITY_THRESHOLD = 0.4 as const;
const SCROLL_LOCK_TIMEOUT = 100 as const;
const DRAG_CLASS = 'vaul-dragging' as const;

interface DrawerContextType {
  openAmountRef: React.RefObject<number>
  drawerHeightRef: React.RefObject<number>
  drawerRef: React.RefObject<HTMLDivElement | null>
  overlayRef: React.RefObject<HTMLDivElement | null>
  snapPoints: SnapPoint[]
  activeSnapPoint: SnapPoint
  setActiveSnapPoint: (snap: SnapPoint) => void
  setTransform: (element: HTMLElement, pixelsOpen: number, transition: boolean) => void
  shouldDrag: (el: HTMLElement, isClosing: boolean) => boolean
  onPress: (event: React.PointerEvent<HTMLDivElement>) => { dragStartTime: Date; pointerStart: number } | null
  onDrag: (event: React.PointerEvent<HTMLDivElement>, pointerStart: number, isAllowedToDrag: React.RefObject<boolean>) => void
  onRelease: (event: React.PointerEvent<HTMLDivElement> | null, dragStartTime: Date, pointerStart: number) => void
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined)

function useDrawerContext() {
  const ctx = useContext(DrawerContext)
  if (!ctx) throw new Error('Drawer compound components must be used within Drawer.Root')
  return ctx
}

type Branded<T, B> = T & { __brand: B }
type Px = Branded<number, 'px'>
type Fraction = Branded<number, 'fraction'>
interface SnapPoint {
  px: Px
  fraction: Fraction
}

export interface ResizeEvent {
  newSize: {
    px: Px
    fraction: Fraction
  }
  closestSnap: {
    px: Px
    fraction: Fraction
  }
}
export interface RootProps {
  children?: ReactNode
  snapPoints: number[]
  onResize?: (event: ResizeEvent) => void
}

export function Root({
  children,
  snapPoints: snapPointsRaw,
  onResize,
}: RootProps) {
  const snapPoints = normSnapPoints(snapPointsRaw, window.innerHeight)
  const [activeSnapPoint, setActiveSnapPoint] = useState(snapPoints[0])

  const drawerRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const openAmountRef = useRef(0)
  const drawerHeightRef = useRef(0)
  const lastTimeDragPrevented = useRef<Date | null>(null)

  const activeSnapPointIndex = snapPoints.findIndex(p => p.px === activeSnapPoint.px)

  function setTransformStyle(element: HTMLElement, pixelsOpen: number, transition: boolean) {
    if (!element) return
    const height = drawerHeightRef.current;
    const clampedOpen = Math.max(0, Math.min(pixelsOpen, height))
    openAmountRef.current = clampedOpen
    const translateY = Math.max(0, height - clampedOpen)
    element.style.transform = `translate3d(0, ${translateY}px, 0)`
    if (transition) {
      element.style.transition = `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`
    } else {
      element.style.transition = 'none'
    }
  }

  function shouldDrag(element: HTMLElement, isClosing: boolean): boolean {
    if (element.tagName === 'SELECT') return false
    if (element.hasAttribute('data-vaul-no-drag') || element.closest('[data-vaul-no-drag]'))
      return false

    const highlightedText = window.getSelection()?.toString()
    if (highlightedText && highlightedText.length > 0) return false

    const now = new Date()
    if (
      lastTimeDragPrevented.current &&
      now.getTime() - lastTimeDragPrevented.current.getTime() < SCROLL_LOCK_TIMEOUT &&
      openAmountRef.current === 0
    ) {
      lastTimeDragPrevented.current = now
      return false
    }

    const scrollParent = getScrollParent(element)
    const fullyOpen = activeSnapPointIndex === snapPoints.length - 1 && snapPoints.length > 0

    if (scrollParent) {
      if (!isClosing && !fullyOpen) {
        return true
      }
      if (isClosing && scrollParent.scrollTop === 0) {
        return true
      }
      lastTimeDragPrevented.current = now
      return false
    }

    while (element) {
      if (element.scrollHeight > element.clientHeight) {
        if (element.scrollTop !== 0) {
          lastTimeDragPrevented.current = now
          return false
        }
        if (element.getAttribute('role') === 'dialog') {
          return true
        }
      }
      element = element.parentNode as HTMLElement
    }

    return true
  }

  function onPress(event: React.PointerEvent<HTMLDivElement>): { dragStartTime: Date; pointerStart: number } | null {
    if (!drawerRef.current) return null
    if (!drawerRef.current.contains(event.target as Node)) return null
    drawerHeightRef.current = drawerRef.current.getBoundingClientRect().height
    return { dragStartTime: new Date(), pointerStart: event.pageY }
  }

  function onDrag(
    event: React.PointerEvent<HTMLDivElement>,
    pointerStart: number,
    isAllowedToDrag: React.RefObject<boolean>
  ) {
    if (!drawerRef.current) return

    const draggedDistance = pointerStart - event.pageY
    const isClosing = draggedDistance < 0

    if (!isAllowedToDrag.current && !shouldDrag(event.target as HTMLElement, isClosing)) return

    isAllowedToDrag.current = true
    drawerRef.current.classList.add(DRAG_CLASS)

    if (!snapPoints) return

    const absDraggedDistance = Math.abs(draggedDistance)

    if (activeSnapPointIndex === null || activeSnapPointIndex === -1) return

    const currentOffset = snapPoints[activeSnapPointIndex]
    const newValue = isClosing ? currentOffset.px - absDraggedDistance : currentOffset.px + absDraggedDistance

    const maxValue = snapPoints[snapPoints.length - 1].px
    const minValue = 0

    if (newValue < minValue || newValue > maxValue) return

    setTransformStyle(drawerRef.current, newValue, false)
  }

  function onRelease(
    event: React.PointerEvent<HTMLDivElement> | null,
    dragStartTime: Date,
    pointerStart: number
  ) {
    if (!drawerRef.current) return

    drawerRef.current.classList.remove(DRAG_CLASS)

    if (!event || !shouldDrag(event.target as HTMLElement, false) || !snapPoints) return

    const dragEndTime = new Date()
    const timeTaken = dragEndTime.getTime() - dragStartTime.getTime()
    const draggedDistance = pointerStart - event.pageY
    const velocity = Math.abs(draggedDistance) / timeTaken

    const activeIndex = activeSnapPointIndex ?? 0

    if (velocity > VELOCITY_THRESHOLD && Math.abs(draggedDistance) < window.innerHeight * 0.4) {
      const isClosing = draggedDistance < 0
      const nextIndexRaw = isClosing ? activeIndex - 1 : activeIndex + 1
      const nextIndex = Math.max(0, Math.min(nextIndexRaw, snapPoints.length - 1))
      const nextSnapOffset = snapPoints[nextIndex]
      setActiveSnapPoint(nextSnapOffset)
      setTransformStyle(drawerRef.current, nextSnapOffset.px, true)
      return
    }

    const closestSnapPoint = snapPoints.reduce((prev, curr) => {
      return Math.abs(curr.px - openAmountRef.current) < Math.abs(prev.px - openAmountRef.current) ? curr : prev
    })
    const closestIndex = snapPoints.indexOf(closestSnapPoint)
    if (closestIndex === -1) return

    setActiveSnapPoint(closestSnapPoint)
    setTransformStyle(drawerRef.current, closestSnapPoint.px, true)
  }

  return (
    <DrawerContext.Provider
      value={{
        drawerRef,
        drawerHeightRef,
        overlayRef,
        openAmountRef,
        snapPoints,
        activeSnapPoint,
        setActiveSnapPoint,
        setTransform: setTransformStyle,
        shouldDrag,
        onPress,
        onDrag,
        onRelease,
      }}
    >
      <div
        data-drawer-root
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
        }}
      >
        {children}
      </div>
    </DrawerContext.Provider>
  )
}

export const Content = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { drawerRef, snapPoints, onPress, onDrag, onRelease, openAmountRef } =
    useDrawerContext()

  const composedRef = useCallback(
    (element: HTMLDivElement | null) => {
      if (drawerRef.current !== element) {
        drawerRef.current = element
      }
      if (typeof ref === 'function') ref(element)
      else if (ref) ref.current = element
    },
    [ref, drawerRef]
  )

  const pointerStartRef = useRef<{ x: number; y: number } | null>(null)
  const wasBeyondThresholdRef = useRef(false)
  const isAllowedToDragRef = useRef(false)
  const dragStartTimeRef = useRef<Date | null>(null)
  const pointerStartYRef = useRef(0)

  const maxSnapPoint = snapPoints[snapPoints.length - 1]

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    pointerStartRef.current = { x: e.pageX, y: e.pageY }
    wasBeyondThresholdRef.current = false
    isAllowedToDragRef.current = false
    const pressResult = onPress(e)
    if (pressResult) {
      dragStartTimeRef.current = pressResult.dragStartTime
      pointerStartYRef.current = pressResult.pointerStart
    }
    props.onPointerDown?.(e)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerStartRef.current) return

    const deltaY = Math.abs(e.pageY - pointerStartRef.current.y)
    const deltaX = Math.abs(e.pageX - pointerStartRef.current.x)
    const threshold = e.pointerType === 'touch' ? 10 : 2

    if (!wasBeyondThresholdRef.current && deltaY <= threshold && deltaX <= threshold) {
      return
    }

    if (deltaX > deltaY) {
      pointerStartRef.current = null
      return
    }

    wasBeyondThresholdRef.current = true

    const pxDragged = e.pageY - pointerStartRef.current.y
    const isDraggingDown = pxDragged > 0
    const amountOpenWithDrag = openAmountRef.current + (isDraggingDown ? -pxDragged : pxDragged)
    const fullyOpen = amountOpenWithDrag >= maxSnapPoint.px - 1
    const scrollParent = getScrollParent(e.target as HTMLElement)
    if (!fullyOpen && !isDraggingDown) {
      e.preventDefault()
    } else if (fullyOpen && isDraggingDown && scrollParent && scrollParent.scrollTop === 0) {
      e.preventDefault()
    }

    onDrag(e, pointerStartYRef.current, isAllowedToDragRef)
    props.onPointerMove?.(e)
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    pointerStartRef.current = null
    wasBeyondThresholdRef.current = false
    if (dragStartTimeRef.current) {
      onRelease(e, dragStartTimeRef.current, pointerStartYRef.current)
    }
    isAllowedToDragRef.current = false
    dragStartTimeRef.current = null
    props.onPointerUp?.(e)
  }

  return (
    <div
      ref={composedRef}
      data-drawer-content=""
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[30px] border bg-background',
        className
      )}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        ...props.style,
        touchAction: 'pan-y',
      } as React.CSSProperties}
      {...props}
    >
      {children}
    </div>
  )
})
Content.displayName = 'Drawer.Content'

export const Handle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'mx-auto mt-2 h-2 w-[100px] rounded-full bg-foreground',
      className
    )}
    data-drawer-handle=""
    {...props}
  />
))
Handle.displayName = 'Drawer.Handle'

export const Title = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-2xl font-bold leading-none tracking-tight', className)}
    {...props}
  />
))
Title.displayName = 'Drawer.Title'

export const Close = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean
  }
>(({ onClick, asChild, children, ...props }, ref) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      ...props,
      onClick: (e: React.MouseEvent<HTMLElement>) => {
        (children as React.ReactElement<any>).props.onClick?.(e)
        onClick?.(e as any)
      },
      ref,
    } as any)
  }

  return (
    <button
      ref={ref}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
})
Close.displayName = 'Drawer.Close'

export const Drawer = {
  Root,
  Content,
  Handle,
  Title,
  Close,
}

// Find nearest scrollable ancestor (module scope so both Root and Content can use it)
function getScrollParent(node: HTMLElement | null): HTMLElement | null {
  let el = node
  while (el) {
    const hasScrollableContent = el.scrollHeight > el.clientHeight
    const overflowY = getComputedStyle(el).overflowY
    const isScroll = overflowY !== 'visible' && overflowY !== 'hidden'
    if (hasScrollableContent && isScroll) return el
    el = el.parentElement
  }
  return null
}

/**
 * Translates snap points to pixel values. In output, 0 means 0 pixels from closed, 50 means 50 pixels open, etc.
 */
function normSnapPoint(value: number, containerHeight: number): SnapPoint {
  if (value < 1) {
    return {
      px: Math.round(containerHeight * value) as Px,
      fraction: value as Fraction,
    }
  } else {
    return {
      px: Math.round(value) as Px,
      fraction: (value / containerHeight) as Fraction,
    }
  }
}

function normSnapPoints(snapPoints: number[], containerHeight: number): Array<SnapPoint> {
  const offsets = snapPoints.map(value => normSnapPoint(value, containerHeight))
  return Array.from(new Set(offsets)).sort((a, b) => a.px - b.px)
}