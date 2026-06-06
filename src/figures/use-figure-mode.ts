'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import { figuresWithCoordinates, getAllFigures, type Figure, type FigureID } from '@/figures'

/**
 * The URL param that holds the open figure. Kept as `lightbox` (the name the old
 * dialog used) so existing shared links and every entry point keep working.
 */
export const FIGURE_PARAM = 'lightbox'

/** Browse mode lives at the routes explorer; the figure page converges back to it. */
const EXPLORER_PATH = '/routes'

/**
 * Build a URL that sets (or clears, when `figureId` is null) the figure param
 * while preserving every other param, so opening/arrowing/closing a figure keeps
 * the user's map filters and selection.
 */
export function figureParamUrl(searchParams: URLSearchParams, pathname: string, figureId: string | null): string {
  const params = new URLSearchParams(searchParams.toString())
  if (figureId === null) {
    params.delete(FIGURE_PARAM)
  } else {
    params.set(FIGURE_PARAM, figureId)
  }
  const query = params.toString()
  return query ? `${pathname}?${query}` : pathname
}

/**
 * The id `step` positions away from `currentId` within `figures`, wrapping at
 * both ends. When `currentId` is not in the set (e.g. a figure with no
 * coordinates) navigation starts from the first figure.
 */
export function neighborFigureId<T extends string>(figures: { id: T }[], currentId: T | null, step: number): T | null {
  if (figures.length === 0) {
    return null
  }
  const current = figures.findIndex(f => f.id === currentId)
  const base = current === -1 ? 0 : current + step
  const wrapped = ((base % figures.length) + figures.length) % figures.length
  return figures[wrapped]!.id
}

function findFigure(id: FigureID | null): Figure | null {
  if (!id) {
    return null
  }
  return getAllFigures().find(f => f.id === id) ?? null
}

export interface FigureMode {
  figureId: FigureID | null
  figure: Figure | null
  isOpen: boolean
  /** The navigable set (all geolocated figures, registry order). */
  figures: Figure[]
  open: (id: FigureID) => void
  close: () => void
  next: () => void
  prev: () => void
}

/**
 * Controller for figure mode over the figure registry + URL param. The view
 * layer stays dumb: it reads `isOpen`/`figure` and calls `open`/`close`/`next`/
 * `prev`. Opening/closing go through the router, so the browser back button
 * closes the figure for free.
 *
 * `initialFigureId` seeds figure mode for a cold `/img/[id]` load that has no
 * query param; any navigation from there converges on the routes explorer.
 */
export function useFigureMode({ initialFigureId }: { initialFigureId?: FigureID } = {}): FigureMode {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const param = searchParams.get(FIGURE_PARAM) as FigureID | null
  const figureId = param ?? initialFigureId ?? null
  const figure = findFigure(figureId)
  const figures = useMemo(() => figuresWithCoordinates(), [])

  // A cold figure page (seeded, no param) has no place to return to, so every
  // interaction targets the explorer; otherwise we stay on the current page.
  const base = param === null && initialFigureId ? EXPLORER_PATH : pathname
  const navigate = (id: FigureID | null) => router.push(figureParamUrl(searchParams, base, id), { scroll: false })

  return {
    figureId,
    figure,
    isOpen: figure != null,
    figures,
    open: (id) => navigate(id),
    close: () => navigate(null),
    next: () => {
      const id = neighborFigureId(figures, figureId, 1)
      if (id) navigate(id)
    },
    prev: () => {
      const id = neighborFigureId(figures, figureId, -1)
      if (id) navigate(id)
    },
  }
}
