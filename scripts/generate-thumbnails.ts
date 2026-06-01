#!/usr/bin/env node
// Generate the on-map figure thumbnails into public/img/thumbnails/.
//
// Run as part of `pnpm dev` and `pnpm build` (see package.json) so the
// thumbnails exist in every environment — local dev, the CI sanity build, and
// the Cloudflare production build. Unlike instrumentation.ts, a plain script is
// guaranteed to run during `next build` (instrumentation's register() does not
// run for `output: 'export'` builds). Generation is idempotent, so an
// up-to-date run is cheap.

import { generateAllThumbnails } from '../src/lib/thumbnails';

generateAllThumbnails().catch((err) => {
  console.error('Failed to generate thumbnails:', err);
  process.exit(1);
});
