'use client'

import React, { createContext, useContext, useState, useRef, useCallback, useEffect, ReactNode, use } from 'react'
import { cn } from '@/lib/utils'

const TRANSITIONS = { DURATION: 0.5, EASE: [0.32, 0.72, 0, 1] } as const;
const SPEED_THRESHOLD = 0.4 as const;
const DRAG_CLASS = 'vaul-dragging' as const;

interface DrawerContextType {
  openAmount: Px
  setOpenAmount: (px: Px, transition: boolean) => void
  drawerRef: React.RefObject<HTMLDivElement | null>
  snapPoints: SnapPoint[]
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

/** All numbers are positive, meaning amount the drawer is open.
 * 
 * eg 0 means closed, 50 means 50 pixels open, 300 means 300 pixels open.
 * A fraction means that fraction of the container height is open, eg 0.5 means half the container height is open.
 */
interface SnapPoint {
  px: Px
  fraction: Fraction
}

export interface ResizeEvent {
  newOpenAmount: {
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

  const containerRef = useRef<HTMLElement | null>(null)
  const containerHeightRef = useRef(0 as Px)
  const drawerRef = useRef<HTMLDivElement>(null)
  const openAmountRef = useRef(0 as Px)
  const snapPoints = useRef<SnapPoint[]>([])

  function updateContainerRef(element: HTMLElement | null) {
    console.log('updateContainerRef', element)
    if (containerRef.current !== element) {
      containerRef.current = element
    }
    if (!element) return () => undefined
    handleContainerResize()
    element.addEventListener('resize', handleContainerResize)
    return () => {
      element.removeEventListener('resize', handleContainerResize)
    }
  }

  function handleContainerResize() {
    const container = containerRef.current
    if (!container) return
    const height = container.getBoundingClientRect().height as Px
    snapPoints.current = normSnapPoints(snapPointsRaw, height)
    containerHeightRef.current = height
    console.log('handleContainerResize', { height, snapPoints: snapPoints.current })
  }

  useEffect(() => {
    return updateContainerRef(window.document.documentElement)
  }, [])

  function setOpenAmount(pixelsOpen: number, transition: boolean) {
    console.log('setOpenAmount', pixelsOpen, transition)
    const element = drawerRef.current
    if (!element) return
    const height = containerHeightRef.current;
    const clampedOpen = Math.max(0, Math.min(pixelsOpen, height))
    openAmountRef.current = clampedOpen as Px
    const translateY = Math.max(0, height - clampedOpen)
    element.style.transform = `translate3d(0, ${translateY}px, 0)`
    if (transition) {
      element.style.transition = `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`
    } else {
      element.style.transition = 'none'
    }
    onResize?.({
      newOpenAmount: {
        px: clampedOpen as Px,
        fraction: height == 0 ? 0 as Fraction : (clampedOpen / height) as Fraction,
      }
    })
  }

  return (
    <DrawerContext.Provider
      value={{
        drawerRef,
        openAmount: openAmountRef.current,
        setOpenAmount,
        snapPoints: snapPoints.current,
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
  const { drawerRef, snapPoints, openAmount, setOpenAmount } = useDrawerContext()

  const dragDetector = useDragDetector({
    startingOpenAmount: openAmount,
    snapPoints,
    onOpenAmountChange: (px, transition) => {
      setOpenAmount(px, transition)
    },
  })

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

  return (
    <div
      ref={composedRef}
      data-drawer-content=""
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[30px] border bg-background',
        className
      )}
      style={{
        ...props.style,
        // touchAction: 'pan-y',
      } as React.CSSProperties}
      {...dragDetector.handlers}
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

/** This is responsible for listening to events and determining what action to take.
 * 
 * It does not handle rendering, styling, or layout.
 */
interface DragDetector {
  /** Handlers to be spread onto the draggable element */
  handlers: {
    onPointerDownCapture: (e: React.PointerEvent<HTMLDivElement>) => void
    onPointerMoveCapture: (e: React.PointerEvent<HTMLDivElement>) => void
    onPointerUpCapture: (e: React.PointerEvent<HTMLDivElement>) => void
  }
}

interface DragDetectorOptions {
  startingOpenAmount: Px
  snapPoints: SnapPoint[]
  onOpenAmountChange?: (px: Px, transition: boolean) => void
}

function useDragDetector(options: DragDetectorOptions): DragDetector {
  const dragStartInfoRef = useRef<{ x: number; y: number, time: number } | null>(null)
  const openAmountRef = useRef<Px>(options.startingOpenAmount)

  const handlePointerDownCapture = (e: React.PointerEvent<HTMLDivElement>) => {
    dragStartInfoRef.current = { x: e.pageX, y: e.pageY, time: Date.now() }
  }

  function isFullyOpen(): boolean {
    const lastSnapPoint = options.snapPoints[options.snapPoints.length - 1]
    return openAmountRef.current >= lastSnapPoint.px - 1
  }

  function shouldDrag(element: HTMLElement, isClosing: boolean): boolean {
    if (element.tagName === 'SELECT') return false
    if (element.hasAttribute('data-vaul-no-drag') || element.closest('[data-vaul-no-drag]'))
      return false

    const highlightedText = window.getSelection()?.toString()
    if (highlightedText && highlightedText.length > 0) return false

    const scrollParent = getScrollParent(element)
    if (scrollParent) {
      if (!isClosing && !isFullyOpen()) {
        return true
      }
      if (isClosing && scrollParent.scrollTop === 0) {
        return true
      }
      return false
    }

    while (element) {
      if (element.scrollHeight > element.clientHeight) {
        if (element.scrollTop !== 0) {
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

  const handlePointerMoveCapture = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStartInfoRef.current) return

    // These are in screen space, eg positive Y is down the screen
    const deltaY = e.pageY - dragStartInfoRef.current.y
    const deltaYAbs = Math.abs(deltaY)
    const deltaXAbs = Math.abs(e.pageX - dragStartInfoRef.current.x)
    const threshold = e.pointerType === 'touch' ? 10 : 2

    console.log('handlePointerMoveCapture', { deltaY, deltaYAbs, deltaXAbs })

    if (deltaYAbs <= threshold && deltaXAbs <= threshold) {
      return
    }
    if (deltaXAbs > deltaYAbs) {
      // This cancels the drag, the user needs to trigger onPointerDown again to start a new drag
      dragStartInfoRef.current = null
      return
    }
    const isClosing = deltaY > 0
    if (!shouldDrag(e.target as HTMLElement, isClosing)) {
      console.log('not dragging because shouldDrag returned false')
      return
    }

    e.stopPropagation()
    options.onOpenAmountChange?.(openAmountRef.current - deltaY as Px, false)
  }


  const handlePointerUpCapture = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStartInfoRef.current) return

    // in screen space, positive Y is down the screen
    const draggedDistance = e.pageY - dragStartInfoRef.current.y
    const timeTakenMs = Date.now() - dragStartInfoRef.current.time
    const speed = Math.abs(draggedDistance) / timeTakenMs

    if (speed > SPEED_THRESHOLD) {
      // Skip velocity-based snapping for now
    }

    const newOpenAmount = openAmountRef.current - draggedDistance as Px
    const closestSnapPoint = options.snapPoints.reduce((prev, curr) => {
      return Math.abs(curr.px - newOpenAmount) < Math.abs(prev.px - newOpenAmount) ? curr : prev
    })

    options.onOpenAmountChange?.(closestSnapPoint.px, true)
    openAmountRef.current = closestSnapPoint.px
    dragStartInfoRef.current = null

    // console.log('handlePointerUpCapture', {
    //   draggedDistance,
    //   timeTakenMs,
    //   speed,
    //   newOpenAmount,
    //   closestSnapPoint,
    // })
  }

  return {
    handlers: {
      onPointerDownCapture: handlePointerDownCapture,
      onPointerMoveCapture: handlePointerMoveCapture,
      onPointerUpCapture: handlePointerUpCapture,
    },
  }
}