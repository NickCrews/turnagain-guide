#!/usr/bin/env node
// Generate all build-time assets into public/: the geojson/gpx route files and
// the on-map figure thumbnails.
//
// Run as part of `pnpm dev` and `pnpm build` (see package.json) so the assets
// exist in every environment — local dev, the CI sanity build, and the
// Cloudflare production build. Unlike instrumentation.ts's register(), a plain
// script is guaranteed to run during `next build` (register() does not run for
// `output: 'export'` builds). Generation is idempotent, so an up-to-date run is
// cheap.

import { writeFileSync } from 'fs';
import path from 'path';
import { allGeoItems } from '../src/routes';
import gpxFromGeojson from '../src/lib/gpx';
import geojsonFromGeoItems from '../src/lib/geojson';
import { generateAllThumbnails } from '../src/lib/thumbnails';

// Write the public geojson/gpx route files. This used to live in
// instrumentation.ts's register(), but that hook does not run during
// `next build` for `output: 'export'` static builds, so the files were never
// regenerated in production.
function generateGeoFiles(publicDir = 'public') {
  const geojson = geojsonFromGeoItems(allGeoItems);
  const gpx = gpxFromGeojson(geojson);
  const geojsonPath = path.join(publicDir, 'turnagain-pass.geojson');
  const gpxPath = path.join(publicDir, 'turnagain-pass.gpx');
  writeFileSync(geojsonPath, JSON.stringify(geojson, null, 4));
  writeFileSync(gpxPath, JSON.stringify(gpx, null, 4));
  console.log(`Wrote ${geojsonPath} and ${gpxPath}`);
}

async function main() {
  generateGeoFiles();
  await generateAllThumbnails();
}

main().catch((err) => {
  console.error('Failed to generate assets:', err);
  process.exit(1);
});
