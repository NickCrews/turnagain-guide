'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import { figuresWithCoordinates, getAllFigures, type Figure, type FigureID } from '@/figures'

/**
 * The URL param that holds the open figure when viewing it *in the context of a
 * route* (`/routes/[id]?lightbox=...`). Kept as `lightbox` (the name the old
 * dialog used) so existing shared links keep working. The other entry point —
 * the map — opens figures as first-class pages at `/img/[id]` with no param.
 */
export const FIGURE_PARAM = 'lightbox'

/** Browse mode lives at the routes explorer; closing a figure page returns here. */
const EXPLORER_PATH = '/routes'

/** The first-class page for a single figure, reached by clicking a map polaroid. */
export function figurePageUrl(figureId: FigureID): string {
  return `/img/${figureId}`
}

/** The figure id encoded in an `/img/[id]` path, or null for any other path. */
export function figureIdFromPath(pathname: string): FigureID | null {
  const match = pathname.match(/^\/img\/([^/]+)\/?$/)
  return match ? (decodeURIComponent(match[1]!) as FigureID) : null
}

/**
 * Build a URL that sets (or clears, when `figureId` is null) the figure param
 * while preserving every other param, so opening/arrowing/closing a figure keeps
 * the user's map filters and route selection.
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
  /** The navigable sibling set: all geolocated figures (page) or the route's figures (route). */
  figures: Figure[]
  open: (id: FigureID) => void
  close: () => void
  next: () => void
  prev: () => void
}

/**
 * A figure can be viewed in one of two contexts, which differ in both their URL
 * shape and the set of figures you arrow through:
 *
 * - `page` — a first-class figure page at `/img/[id]`, reached by clicking a
 *   polaroid on the map. You aren't looking at it in the context of anything
 *   else, so the siblings are *all* geolocated figures and next/prev walk to
 *   `/img/[neighbor]`.
 * - `route` — a figure seen while reading a route, at `/routes/[id]?lightbox=...`.
 *   The siblings are just that route's figures, and next/prev stay on the route
 *   page, swapping the param.
 *
 * A bare `?lightbox=` with no selected route (an old shared link) falls back to
 * the param shape over all figures.
 */
type Context =
  | { navMode: 'page'; figures: Figure[] }
  | { navMode: 'param'; figures: Figure[] }

/**
 * Controller for figure mode over the figure registry + URL. The view layer
 * stays dumb: it reads `isOpen`/`figure` and calls `open`/`close`/`next`/`prev`.
 * Every transition goes through the router, so the browser back button closes
 * the figure (or returns to the previous figure page) for free.
 *
 * `initialFigureId` seeds figure mode for a `/img/[id]` page, whose id lives in
 * the path rather than a query param; `routeFigures` is the selected route's
 * figure set, used as the sibling list when viewing a figure in route context.
 */
export function useFigureMode(
  { initialFigureId, routeId, routeFigures }: {
    initialFigureId?: FigureID
    routeId?: string | null
    routeFigures?: Figure[] | null
  } = {},
): FigureMode {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const param = searchParams.get(FIGURE_PARAM) as FigureID | null
  // On a figure page the id lives in the `/img/[id]` path. We read it from the
  // live pathname (not the seeded `initialFigureId` prop) so it tracks the URL
  // when arrowing swaps it via `history.pushState` without a route transition.
  const pathFigureId = figureIdFromPath(pathname) ?? initialFigureId ?? null
  const figureId = pathFigureId ?? param ?? null
  const figure = findFigure(figureId)
  const allFigures = useMemo(() => figuresWithCoordinates(), [])

  // On the `/img/[id]` path => a first-class figure page. A param with a
  // selected route => the figure in that route's context. A bare param (old
  // shared link) => the param shape over all figures.
  const context: Context = useMemo(() => {
    if (pathFigureId) {
      return { navMode: 'page', figures: allFigures }
    }
    if (param !== null && routeId) {
      return { navMode: 'param', figures: routeFigures ?? [] }
    }
    return { navMode: 'param', figures: allFigures }
  }, [pathFigureId, param, routeId, routeFigures, allFigures])

  const navigate = (id: FigureID | null) => {
    if (context.navMode === 'page') {
      if (id === null) {
        // Close back to the browse explorer (there is no route context here).
        router.push(EXPLORER_PATH, { scroll: false })
      } else {
        // Arrow between figure pages by swapping the `/img/[id]` path in place.
        // `history.pushState` keeps the explorer + map mounted (no RSC refetch,
        // no Suspense flash, no viewer re-home), while Next still updates
        // `usePathname` so the URL stays first-class and back/forward work.
        window.history.pushState(null, '', figurePageUrl(id))
      }
    } else {
      router.push(figureParamUrl(searchParams, pathname, id), { scroll: false })
    }
  }

  return {
    figureId,
    figure,
    isOpen: figure != null,
    figures: context.figures,
    open: (id) => navigate(id),
    close: () => navigate(null),
    next: () => {
      const id = neighborFigureId(context.figures, figureId, 1)
      if (id) navigate(id)
    },
    prev: () => {
      const id = neighborFigureId(context.figures, figureId, -1)
      if (id) navigate(id)
    },
  }
}
