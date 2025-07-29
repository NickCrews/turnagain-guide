# MDX to TSX Migration Scripts

This directory contains scripts for migrating MDX route files to TypeScript TSX files with type-safe GeoItem structures.

## Scripts

### `convert-mdx-to-tsx.mjs`
Main conversion script that transforms MDX files in `app/routes/pages/` to TSX files in `routes/`.

- Parses YAML frontmatter from MDX files
- Converts MDX content to JSX in the `proseJsx` property  
- Extracts geometry, metadata, and ATES ratings
- Creates properly typed GeoItem exports
- Updates `routes/index.ts` with new imports and exports
- Skips files that already exist as TSX

### `fix-geometries.ts`
Fixes geometry parsing issues from the initial conversion.

- Extracts GeoJSON geometry from MDX frontmatter `geojson: >-` blocks
- Replaces any existing geometry (null or malformed) in TSX files
- Processes all TSX files regardless of current geometry state
- Properly handles multiline YAML geometry definitions

### `fix-nicks-ates-ratings.ts`  
Fixes ATES ratings that weren't properly parsed during initial conversion.

- Extracts `nicks_ates_ratings` arrays from MDX frontmatter
- Replaces empty arrays in TSX files with actual rating values
- Handles single and multiple ratings (e.g., `["simple", "challenging"]`)
- Only processes files with empty rating arrays

## Usage

Run scripts in order after placing MDX files in `app/routes/pages/`:

1. `node convert-mdx-to-tsx.mjs` - Initial conversion
2. `npx tsx fix-geometries.ts` - Fix geometry parsing  
3. `npx tsx fix-nicks-ates-ratings.ts` - Fix ATES ratings

The result is type-safe TSX files with complete GeoItem data exported from `routes/index.ts`.
