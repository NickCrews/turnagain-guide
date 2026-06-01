import { type FigureID } from "./index";

/**
 * Pure helpers describing where on-map figure thumbnails live and how big they are.
 *
 * This module has NO dependencies (no React, no sharp, no fs) so it can be shared
 * by both the client-side map layer and the build-time generator without either
 * pulling in the other's baggage. Both sides derive the path from the figure id
 * here, so they can't drift.
 */

/** Total side length (px) of the generated square thumbnail, including its frame. */
export const THUMBNAIL_SIZE = 128;

/** Width (px) of the white "polaroid" frame baked around each thumbnail. */
export const THUMBNAIL_FRAME = 8;

/**
 * The public URL path for a figure's on-map thumbnail, e.g.
 * `figureThumbnailPath("blue-diamond")` -> `/img/thumbnails/blue-diamond.jpg`.
 *
 * Mirrors the existing `/img/<id>.jpg` convention for full-resolution images.
 */
export function figureThumbnailPath(id: FigureID): string {
  return `/img/thumbnails/${id}.jpg`;
}
