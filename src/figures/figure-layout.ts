import { type CSSProperties } from 'react'

/**
 * Geometry shared between {@link FigureView} (which reserves the slots) and the
 * explorer (which animates the singleton map's wrapper into the map slot). Keep
 * these in lockstep so the photo and the map tile the screen without gaps.
 */

/** Right-hand metadata column on desktop (Tailwind w-96). */
export const META_COL_WIDTH_PX = 384
/** Bottom metadata sheet on mobile (title + EXIF). */
export const MOBILE_SHEET_HEIGHT_PX = 140

const MARGIN_PX = 16
const DESKTOP_MAP_HEIGHT_PX = 240
const MOBILE_MAP_HEIGHT_PX = 172

/**
 * Shared easing/duration so the map box, hero image, and metadata move in
 * concert. The camera fly derives its duration from this too (see
 * `FLY_DURATION_SECONDS` in `camera-state.ts`).
 */
export const PINCH_MS = 550
export const PINCH_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)'

/**
 * Absolute rect for the map's wrapper. Browse mode is fullscreen; figure mode is
 * the small framed slot (bottom of the metadata column on desktop, above the
 * sheet on mobile). Uses explicit top/left/width/height — never inset/auto — so
 * it interpolates (the wireframe's load-bearing bug fix).
 */
export function mapWrapperStyle(isOpen: boolean, isMobile: boolean): CSSProperties {
  if (!isOpen) {
    return { top: 0, left: 0, width: '100%', height: '100%' }
  }
  if (isMobile) {
    const bottom = MOBILE_SHEET_HEIGHT_PX + MARGIN_PX
    return {
      top: `calc(100% - ${bottom + MOBILE_MAP_HEIGHT_PX}px)`,
      left: `${MARGIN_PX}px`,
      width: `calc(100% - ${MARGIN_PX * 2}px)`,
      height: `${MOBILE_MAP_HEIGHT_PX}px`,
    }
  }
  const width = META_COL_WIDTH_PX - MARGIN_PX * 2
  return {
    top: `calc(100% - ${DESKTOP_MAP_HEIGHT_PX + MARGIN_PX}px)`,
    left: `calc(100% - ${width + MARGIN_PX}px)`,
    width: `${width}px`,
    height: `${DESKTOP_MAP_HEIGHT_PX}px`,
  }
}
