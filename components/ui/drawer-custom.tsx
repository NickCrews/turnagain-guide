'use client'

import React, { createContext, useContext, useState, useRef, useCallback, useEffect, useLayoutEffect, ReactNode } from 'react'
import { cn } from '@/lib/utils'

const TRANSITIONS = { DURATION: 0.5, EASE: [0.32, 0.72, 0, 1] } as const;
const SPEED_THRESHOLD = 0.4 as const;

interface DrawerContextType {
  drawerRef: React.RefObject<HTMLDivElement | null>
  getOpenAmount: () => Position
  dragTo: (px: Px | Fraction | Position) => Position
  snapTo: (px: Px | Fraction | Position) => Position
  getResolvedSnapPoints: () => Array<Position>
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
interface Position {
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
  defaultOpenAmount?: number
  onSnap?: (event: ResizeEvent) => void
}

export function Root({
  children,
  snapPoints: abstractSnapPoints,
  defaultOpenAmount: defaultOpenAmountProp,
  onSnap,
}: RootProps) {
  const defaultOpenAmount = defaultOpenAmountProp ?? abstractSnapPoints[0];

  if (abstractSnapPoints.length === 0) {
    throw new Error('Drawer.Root requires at least one snap point')
  }

  const drawerRef = useRef<HTMLDivElement>(null)

  const dummyPositionManager: PositionManager = {
    getContainer: () => document.createElement('div'),
    getContainerHeight: () => 0 as Px,
    getOpenAmount: () => ({ px: 0 as Px, fraction: 0 as Fraction }),
    setOpenAmount: (amount: Px | Fraction | Position) => ({ px: 0 as Px, fraction: 0 as Fraction }),
    getAbstractSnapPoints: () => abstractSnapPoints as Array<Px | Fraction>,
    getResolvedSnapPoints: () => [],
    disconnect: () => { },
  }
  const [pm, setPositionManager] = useState<PositionManager>(dummyPositionManager)

  function handleDraggedTo(px: Px | Fraction | Position) {
    const resolved = pm.setOpenAmount(px)
    _syncTransform(false)
    return resolved;
  }

  function handleSnappedTo(openAmount: Px | Fraction | Position) {
    // get the nearest snap point, we round to that
    const resolved = resolveOpenAmount(openAmount, pm.getContainerHeight())
    const snapped = findClosestSnapPoint(pm.getResolvedSnapPoints(), resolved.px)
    pm.setOpenAmount(snapped)
    _syncTransform(true)
    onSnap?.({ newOpenAmount: snapped })
    return snapped;
  }

  useEffect(() => {
    const container = window.document.documentElement;
    const pm = positionManager({
      container,
      initialOpenAmount: defaultOpenAmount as Px | Fraction,
      abstractSnapPoints: abstractSnapPoints as Array<Px>,
    })
    setPositionManager(pm)
    _syncTransform(false)
    return () => {
      pm.disconnect()
    }
  }, [JSON.stringify(abstractSnapPoints), onSnap])

  function _syncTransform(transition: boolean) {
    const translateY = Math.max(0, pm.getContainerHeight() - pm.getOpenAmount().px)
    const element = drawerRef.current
    if (!element) return
    element.style.transform = `translate3d(0, ${translateY}px, 0)`
    if (transition) {
      element.style.transition = `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`
    } else {
      element.style.transition = 'none'
    }
  }

  return (
    <DrawerContext.Provider
      value={{
        drawerRef,
        getOpenAmount: () => pm.getOpenAmount(),
        getResolvedSnapPoints: () => pm.getResolvedSnapPoints(),
        dragTo: handleDraggedTo,
        snapTo: handleSnappedTo,
      }}
    >
      <div
        data-drawer-root
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          pointerEvents: 'none',
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
  const { drawerRef, getResolvedSnapPoints, getOpenAmount, dragTo, snapTo } = useDrawerContext()

  const dragDetector = useDragDetector({
    getOpenAmount: () => getOpenAmount().px,
    getSnapPoints: getResolvedSnapPoints,
    onDraggedTo: dragTo,
    onSnappedTo: snapTo,
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
        pointerEvents: 'auto',
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
  getOpenAmount: () => Px
  getSnapPoints: () => Array<Position>
  onDraggedTo?: (px: Px) => void
  onSnappedTo?: (px: Px) => void
}

function useDragDetector(options: DragDetectorOptions): DragDetector {
  const dragStartInfoRef = useRef<{ x: number; y: number, time: number, openAmount: Px } | null>(null)

  const handlePointerDownCapture = (e: React.PointerEvent<HTMLDivElement>) => {
    dragStartInfoRef.current = { x: e.pageX, y: e.pageY, time: Date.now(), openAmount: options.getOpenAmount() }
  }

  function isFullyOpen(): boolean {
    const snapPoints = options.getSnapPoints()
    const lastSnapPoint = snapPoints[snapPoints.length - 1]
    return options.getOpenAmount() >= lastSnapPoint.px - 1
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

    // console.log('handlePointerMoveCapture', { deltaY, deltaYAbs, deltaXAbs })

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
    console.log('dragging...')
    const startingOpenAmount = dragStartInfoRef.current.openAmount
    const newOpenAmount = startingOpenAmount - deltaY as Px

    e.stopPropagation()
    options.onDraggedTo?.(newOpenAmount)
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

    const newOpenAmount = options.getOpenAmount() - draggedDistance as Px
    const closestSnapPoint = findClosestSnapPoint(options.getSnapPoints(), newOpenAmount)
    options.onSnappedTo?.(closestSnapPoint.px)
    dragStartInfoRef.current = null
  }

  return {
    handlers: {
      onPointerDownCapture: handlePointerDownCapture,
      onPointerMoveCapture: handlePointerMoveCapture,
      onPointerUpCapture: handlePointerUpCapture,
    },
  }
}

interface PositionManager {
  getContainer: () => HTMLElement
  getContainerHeight: () => Px
  getOpenAmount: () => Position
  setOpenAmount: (amount: Px | Fraction | Position) => Position
  getAbstractSnapPoints: () => Array<Px | Fraction>
  getResolvedSnapPoints: () => Array<Position>
  disconnect: () => void
}

interface PositionManagerOptions {
  container: HTMLElement
  initialOpenAmount: Position | Px | Fraction
  abstractSnapPoints: Array<Px | Fraction>
}

function positionManager(options: PositionManagerOptions): PositionManager {
  const container = options.container
  let containerHeight = container.getBoundingClientRect().height as Px
  let openAmount = resolveOpenAmount(options.initialOpenAmount, containerHeight)

  const ro = new ResizeObserver(handleContainerResize)
  ro.observe(container)

  function handleContainerResize() {
    const oldHeight = containerHeight
    const newHeight = container.getBoundingClientRect().height as Px

    const oldSnapPoints = resolveSnapPoints(options.abstractSnapPoints, oldHeight)
    const newSnapPoints = resolveSnapPoints(options.abstractSnapPoints, newHeight)
    const closestOldSnapIndex = findClosestSnapPointIndex(oldSnapPoints, openAmount.px)
    const closestNewSnap = newSnapPoints[closestOldSnapIndex]

    openAmount = closestNewSnap
    containerHeight = newHeight
  }

  function disconnect() {
    ro.disconnect()
  }

  function setOpenAmount(amount: Px | Fraction | Position): Position {
    const newPosition = resolveOpenAmount(amount, containerHeight)
    openAmount = newPosition
    return newPosition
  }

  return {
    getContainer: () => options.container,
    getContainerHeight: () => containerHeight,
    getOpenAmount: () => openAmount,
    setOpenAmount,
    getAbstractSnapPoints: () => options.abstractSnapPoints,
    getResolvedSnapPoints: () => resolveSnapPoints(options.abstractSnapPoints, containerHeight),
    disconnect,
  }
}

function findClosestSnapPointIndex(snapPoints: Array<Position>, openAmount: Px) {
  let closestIndex = 0
  let closestDistance = Infinity
  snapPoints.forEach((snapPoint, index) => {
    const distance = Math.abs(snapPoint.px - openAmount)
    if (distance < closestDistance) {
      closestDistance = distance
      closestIndex = index
    }
  })
  return closestIndex
}
function findClosestSnapPoint(snapPoints: Array<Position>, openAmount: Px) {
  const i = findClosestSnapPointIndex(snapPoints, openAmount)
  return snapPoints[i];
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

function resolveOpenAmount(
  amount: Px | Fraction | Position,
  containerHeight: Px
): Position {
  if (typeof amount !== 'number') {
    return amount
  }
  if (amount < 1) {
    // fraction
    return {
      px: Math.round(containerHeight * amount) as Px,
      fraction: amount as Fraction,
    }
  } else {
    // pixels
    const clampedPx = Math.max(0, Math.min(amount as Px, containerHeight))
    return {
      px: clampedPx as Px,
      fraction: containerHeight == 0 ? 0 as Fraction : (clampedPx / containerHeight) as Fraction,
    }
  }
}

/**
 * Translates snap points to pixel values. In output, 0 means 0 pixels from closed, 50 means 50 pixels open, etc.
 */
function resolveSnapPoint(value: number, containerHeight: number): Position {
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

function resolveSnapPoints(snapPoints: number[], containerHeight: number): Array<Position> {
  const offsets = snapPoints.map(value => resolveSnapPoint(value, containerHeight))
  return Array.from(new Set(offsets)).sort((a, b) => a.px - b.px)
}