import { figureThumbnailPath, THUMBNAIL_SIZE, THUMBNAIL_FRAME } from "@/figures/thumbnail-path";

/**
 * Build-time generation of the small, white-framed photo thumbnails that get
 * pinned to the 3D map. Runs as a plain build script (see
 * scripts/generate-assets.ts, which also produces the geojson/gpx at build).
 *
 * `sharp` and `fs` are imported dynamically so this module stays importable from
 * places that only want the pure path helpers, and so client bundles never pull
 * in the native image library.
 */

/**
 * Whether `outPath` is already up to date with respect to `srcPath`: it exists
 * and is at least as new as the source. Generation is idempotent so dev-server
 * restarts and rebuilds stay fast.
 */
function isUpToDate(srcPath: string, outPath: string, fs: typeof import("fs")): boolean {
  if (!fs.existsSync(outPath)) {
    return false;
  }
  return fs.statSync(outPath).mtimeMs >= fs.statSync(srcPath).mtimeMs;
}

/**
 * Generate a single square, white-framed, {@link THUMBNAIL_SIZE}px JPG thumbnail
 * from the image at `srcPath`, writing it to `outPath` (creating parent dirs).
 *
 * The photo is center-cropped to a square and surrounded by a thin white frame
 * for a "polaroid/pin" look. Returns `true` if it wrote the file, or `false` if
 * the existing output was already up to date (idempotent skip).
 */
export async function generateThumbnail(srcPath: string, outPath: string): Promise<boolean> {
  const fs = await import("fs");
  const path = await import("path");

  if (!fs.existsSync(srcPath)) {
    throw new Error(`Source image not found: ${srcPath}`);
  }
  if (isUpToDate(srcPath, outPath, fs)) {
    return false;
  }

  const sharp = (await import("sharp")).default;
  const inner = THUMBNAIL_SIZE - 2 * THUMBNAIL_FRAME;

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  await sharp(srcPath)
    .resize(inner, inner, { fit: "cover", position: "center" })
    .extend({
      top: THUMBNAIL_FRAME,
      bottom: THUMBNAIL_FRAME,
      left: THUMBNAIL_FRAME,
      right: THUMBNAIL_FRAME,
      background: "#ffffff",
    })
    .jpeg({ quality: 82 })
    .toFile(outPath);
  return true;
}

/**
 * Generate thumbnails for every figure that has a source image, under
 * `publicDir` (defaults to the Next.js `public/` directory). Iterates all
 * figures (cheap); the map only places the ones that have coordinates.
 */
export async function generateAllThumbnails(publicDir = "public"): Promise<void> {
  const path = await import("path");
  const { getAllFigures } = await import("@/figures");

  let generated = 0;
  let skipped = 0;
  let failed = 0;
  for (const figure of getAllFigures()) {
    const srcPath = path.join(publicDir, figure.imagePath);
    const outPath = path.join(publicDir, figureThumbnailPath(figure.id));
    try {
      if (await generateThumbnail(srcPath, outPath)) {
        generated++;
      } else {
        skipped++;
      }
    } catch (err) {
      failed++;
      console.warn(`Skipping thumbnail for ${figure.id}:`, (err as Error).message);
    }
  }
  console.log(
    `Thumbnails: generated ${generated}, skipped ${skipped} (up to date)` +
    (failed ? `, failed ${failed}` : ""),
  );
}
