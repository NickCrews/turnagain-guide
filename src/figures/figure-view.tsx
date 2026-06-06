'use client'

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { TransformWrapper, TransformComponent, MiniMap, useControls, useTransformEffect } from 'react-zoom-pan-pinch'
import { Undo, X, ZoomIn, ZoomOut } from 'lucide-react'
import { type Figure } from '@/figures'
import { NextButton, PrevButton } from '@/figures/image-carousel'
import { takeFigureOrigin, type OriginRect } from '@/figures/figure-origin'
import { META_COL_WIDTH_PX, MOBILE_SHEET_HEIGHT_PX, PINCH_EASING, PINCH_MS } from '@/figures/figure-layout'
import { Elevation } from '@/components/app/units'
import { useIsBelowWidth } from '@/lib/widths'

function cardinalDirection(degrees: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round(degrees / 45) % 8]!
}

/** eg Jan 20, 2024, 11:15 AM */
function formatDatetime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit',
  })
}

function PhotoMeta({ figure }: { figure: Figure }) {
  const { datetime, subject_coordinates, subject_elevation, direction } = figure
  if (!datetime && !subject_coordinates && subject_elevation == null && direction == null) {
    return null
  }
  return (
    <dl className="text-sm space-y-1 text-muted-foreground">
      {datetime && (
        <div className="flex gap-2">
          <dt className="font-medium text-foreground w-20 shrink-0">Date</dt>
          <dd>{formatDatetime(datetime)}</dd>
        </div>
      )}
      {subject_coordinates && (
        <div className="flex gap-2">
          <dt className="font-medium text-foreground w-20 shrink-0">Location</dt>
          <dd>{subject_coordinates.lat.toFixed(5)}, {subject_coordinates.long.toFixed(5)}</dd>
        </div>
      )}
      {subject_elevation != null && (
        <div className="flex gap-2">
          <dt className="font-medium text-foreground w-20 shrink-0">Elevation</dt>
          <dd><Elevation meters={subject_elevation} /></dd>
        </div>
      )}
      {direction != null && (
        <div className="flex gap-2">
          <dt className="font-medium text-foreground w-20 shrink-0">Heading</dt>
          <dd>{direction}° {cardinalDirection(direction)}</dd>
        </div>
      )}
    </dl>
  )
}

export interface FigureViewProps {
  figure: Figure
  /** Count of navigable figures; arrows show only when there is more than one. */
  figureCount: number
  /**
   * Passed from the explorer (its single source of truth) rather than recomputed
   * here, so the layout and the map slot it animates into never disagree on the
   * first paint — when `useIsBelowWidth` is still undefined — of a cold load.
   */
  isMobile: boolean
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}

/**
 * Full-bleed figure view: a zoomable hero image plus the figure's metadata. The
 * shrunk map is *not* rendered here — the explorer animates the singleton map
 * into the slot this view leaves open (bottom of the metadata column on desktop,
 * above the sheet on mobile). Opening plays a shared-element expand of the hero
 * from its origin thumbnail and a fade-in of the metadata.
 */
export function FigureView({ figure, figureCount, isMobile, onClose, onNext, onPrev }: FigureViewProps) {
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(id)
  }, [])

  // Arrow-key navigation through neighboring figures.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') onPrev()
      else if (e.key === 'ArrowRight') onNext()
      else if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onNext, onPrev, onClose])

  const arrows = figureCount > 1 && (
    <>
      <PrevButton onClick={onPrev} className="absolute left-3 top-1/2 -translate-y-1/2 z-40 opacity-80 hover:opacity-100 transition-opacity" />
      <NextButton onClick={onNext} className="absolute right-3 top-1/2 -translate-y-1/2 z-40 opacity-80 hover:opacity-100 transition-opacity" />
    </>
  )

  const closeButton = (
    <button
      type="button"
      onClick={onClose}
      aria-label="Close figure"
      className="absolute left-4 top-4 z-40 flex h-9 w-9 items-center justify-center rounded-full bg-background/85 border shadow hover:bg-background"
    >
      <X className="h-5 w-5" />
    </button>
  )

  // Read title via a plain-string binding first: `figure.altText || figure.title`
  // makes TS narrow the figure union on `altText` being falsy, which collapses to
  // `never` since most figures' altText is a truthy literal.
  const title: string = figure.title

  // The hero fades/expands in; key on figure.id so swapping figures re-runs it.
  const hero = (
    <HeroImage key={figure.id} src={figure.imagePath} alt={figure.altText || title} />
  )

  if (isMobile) {
    return (
      <div className="absolute inset-0 z-20">
        {/* Full-bleed image. */}
        <div className="absolute inset-0 bg-black">
          {hero}
          {arrows}
        </div>
        {closeButton}
        {/* Bottom metadata sheet; the map floats above it (rendered by the explorer). */}
        <div
          className="absolute inset-x-0 bottom-0 z-20 overflow-y-auto rounded-t-2xl border-t bg-background px-4 pt-3 pb-2 shadow-[0_-4px_20px_rgba(0,0,0,0.15)] transition-all"
          style={{
            height: `${MOBILE_SHEET_HEIGHT_PX}px`,
            opacity: entered ? 1 : 0,
            transform: entered ? 'none' : 'translateY(12px)',
            transitionDuration: `${PINCH_MS}ms`,
            transitionTimingFunction: PINCH_EASING,
          }}
        >
          <div className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-foreground/20" />
          <h2 className="text-base font-bold leading-tight">{figure.title}</h2>
          <div className="mt-1">
            <PhotoMeta figure={figure} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute inset-0 z-20">
      {/* Hero on the left, up to the metadata column. */}
      <div className="absolute inset-y-0 left-0 bg-black" style={{ right: `${META_COL_WIDTH_PX}px` }}>
        {hero}
        {arrows}
      </div>
      {closeButton}
      {/* Right metadata column; its lower area is left for the map (drawn on top). */}
      <div
        className="absolute inset-y-0 right-0 overflow-y-auto border-l bg-background p-6 transition-all"
        style={{
          width: `${META_COL_WIDTH_PX}px`,
          opacity: entered ? 1 : 0,
          transform: entered ? 'none' : 'translateY(8px)',
          transitionDuration: `${PINCH_MS}ms`,
          transitionTimingFunction: PINCH_EASING,
        }}
      >
        <h2 className="text-2xl font-bold mb-4">{figure.title}</h2>
        {typeof figure.description === 'string' ? (
          <p className="mb-4 text-sm text-muted-foreground">{figure.description || 'No description available.'}</p>
        ) : (
          <div className="mb-4">{figure.description}</div>
        )}
        <div className="border-t pt-3">
          <PhotoMeta figure={figure} />
        </div>
      </div>
    </div>
  )
}

/** The zoomable hero image, expanding from its origin thumbnail rect (FLIP). */
function HeroImage({ src, alt }: { src: string, alt: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [flip, setFlip] = useState<{ transform: string, transition: string }>(() => ({
    transform: 'none',
    transition: 'none',
  }))

  // FLIP: place the hero at its origin rect with no transition, then release it
  // to its natural position on the next frame so it animates the expand. With no
  // origin (cold load) we fall back to a plain fade.
  useLayoutEffect(() => {
    const origin = takeFigureOrigin()
    const el = wrapperRef.current
    if (!origin || !el) {
      setFlip({ transform: 'none', transition: 'none' })
      return
    }
    const final = el.getBoundingClientRect()
    const inverted = invertTransform(origin, final)
    setFlip({ transform: inverted, transition: 'none' })
    const id = requestAnimationFrame(() => {
      setFlip({ transform: 'none', transition: `transform ${PINCH_MS}ms ${PINCH_EASING}` })
    })
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div ref={wrapperRef} className="absolute inset-0" style={{ transformOrigin: 'top left', ...flip }}>
      <ZoomableImage src={src} alt={alt} />
    </div>
  )
}

function invertTransform(origin: OriginRect, final: DOMRect): string {
  const scaleX = origin.width / final.width
  const scaleY = origin.height / final.height
  const translateX = origin.left - final.left
  const translateY = origin.top - final.top
  return `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`
}

function ZoomableImage({ src, alt }: { src: string, alt: string }) {
  const img = <img src={src} alt={alt} className="h-full w-full object-contain" />
  return (
    <TransformWrapper
      initialScale={1}
      minScale={1}
      maxScale={10}
      wheel={{ disabled: false }}
      panning={{ disabled: false }}
      doubleClick={{ disabled: false }}
      zoomAnimation={{ disabled: false, animationTime: 100, size: 0.5 }}
    >
      <div className="relative h-full w-full">
        <MyMiniMap element={img} />
        <Controls />
        <TransformComponent wrapperClass="!h-full !w-full" contentClass="!h-full !w-full items-center justify-center">
          {img}
        </TransformComponent>
      </div>
    </TransformWrapper>
  )
}

function MyMiniMap({ element }: { element: React.ReactNode }) {
  const [isZoomed, setIsZoomed] = useState(false)
  const isMobile = useIsBelowWidth(768)
  useTransformEffect(({ state }) => {
    setIsZoomed(state.scale > 1.1)
  })
  if (!isZoomed) {
    return null
  }
  return (
    <div className="absolute left-3 top-3 z-30 border border-white/30 shadow-lg">
      <MiniMap borderColor="red" width={isMobile ? 100 : 150}>
        {element}
      </MiniMap>
    </div>
  )
}

function Controls() {
  const { zoomIn, zoomOut, resetTransform } = useControls()
  return (
    <div className="absolute right-3 top-3 z-30 flex gap-2">
      <button type="button" onClick={() => zoomOut()} className="rounded bg-black/60 text-white p-1 hover:bg-black/80 hover:cursor-pointer" aria-label="Zoom out">
        <ZoomOut />
      </button>
      <button type="button" onClick={() => zoomIn()} className="rounded bg-black/60 text-white p-1 hover:bg-black/80 hover:cursor-pointer" aria-label="Zoom in">
        <ZoomIn />
      </button>
      <button type="button" onClick={() => resetTransform()} className="rounded bg-black/60 text-white p-1 hover:bg-black/80 hover:cursor-pointer" aria-label="Reset zoom">
        <Undo />
      </button>
    </div>
  )
}
