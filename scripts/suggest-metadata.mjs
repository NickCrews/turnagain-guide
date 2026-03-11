#!/usr/bin/env node
/**
 * suggest-metadata.mjs
 *
 * Reads EXIF data from JPEG image files and suggests metadata
 * (datetime, coordinates, elevation) to add to imageRegistry/images.tsx.
 *
 * Usage:
 *   node scripts/suggest-metadata.mjs public/img/*.jpg
 *   node scripts/suggest-metadata.mjs public/img/tincan-overview.jpg
 *
 * Requires exifr:
 *   pnpm add -D exifr
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, basename, extname } from 'path';

// ---------------------------------------------------------------------------
// Dependency check
// ---------------------------------------------------------------------------
let exifr;
try {
  exifr = await import('exifr');
} catch {
  console.error('❌  exifr not installed. Run: pnpm add -D exifr');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Convert decimal degrees to DMS string for display */
function toDMS(deg, posDir, negDir) {
  const d = Math.abs(deg);
  const degrees = Math.floor(d);
  const minutes = Math.floor((d - degrees) * 60);
  const seconds = ((d - degrees - minutes / 60) * 3600).toFixed(1);
  return `${degrees}°${minutes}′${seconds}″ ${deg >= 0 ? posDir : negDir}`;
}

/** Fetch elevation from Open-Meteo (free, no API key) */
async function fetchElevation(lat, lng) {
  const url = `https://api.open-meteo.com/v1/elevation?latitude=${lat.toFixed(6)}&longitude=${lng.toFixed(6)}`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.elevation?.[0] ?? null;
  } catch (err) {
    return null;
  }
}

/** Derive a camelCase variable name from the filename */
function toCamelCase(filename) {
  const stem = basename(filename, extname(filename));
  return stem
    .replace(/-([a-z])/g, (_, c) => c.toUpperCase())
    .replace(/^[A-Z]/, c => c.toLowerCase());
}

/** Format ISO 8601 datetime from EXIF Date object */
function formatDatetime(date) {
  if (!date) return null;
  const pad = n => String(n).padStart(2, '0');
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  );
}

/** Generate the TypeScript snippet */
function formatOutput(imagePath, { datetime, lat, lng, elevation }) {
  const varName = toCamelCase(basename(imagePath));
  const webPath = imagePath.replace(/^.*?public/, '').replace(/\\/g, '/');
  const fields = [];

  if (lat != null && lng != null) {
    fields.push(`  coordinates: { lat: ${lat.toFixed(6)}, long: ${lng.toFixed(6)} },`);
  }
  if (elevation != null) {
    fields.push(`  elevation: ${Math.round(elevation)},   // meters (~${Math.round(elevation * 3.28084)} ft)`);
  }
  if (datetime) {
    fields.push(`  datetime: "${datetime}",`);
  }

  if (fields.length === 0) {
    return `  // No EXIF metadata found for ${basename(imagePath)}`;
  }

  return [
    `// ── ${basename(imagePath)} ──`,
    `// Add/update in imageRegistry/images.tsx for export '${varName}':`,
    `export const ${varName} = {`,
    `  imagePath: "${webPath}",`,
    ...fields,
    `} as const satisfies GuideImage;`,
  ].join('\n');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const args = process.argv.slice(2).filter(a => !a.startsWith('--'));
const skipElevation = process.argv.includes('--no-elevation');

if (args.length === 0) {
  console.log('Usage: node scripts/suggest-metadata.mjs [--no-elevation] <image-file(s)>');
  process.exit(0);
}

const outputs = [];

for (const arg of args) {
  const filePath = resolve(arg);
  if (!existsSync(filePath)) {
    console.warn(`⚠️  File not found: ${filePath}`);
    continue;
  }

  process.stdout.write(`Reading ${basename(filePath)}… `);

  let exif;
  try {
    const buffer = readFileSync(filePath);
    exif = await exifr.default.parse(buffer, {
      gps: true,
      tiff: true,
      exif: true,
      ifd0: true,
    });
  } catch (err) {
    console.log(`❌ EXIF error: ${err.message}`);
    continue;
  }

  if (!exif) {
    console.log('no EXIF data found');
    outputs.push(`// ${basename(filePath)}: no EXIF data found`);
    continue;
  }

  const lat = exif.latitude ?? null;
  const lng = exif.longitude ?? null;
  const datetime = formatDatetime(exif.DateTimeOriginal ?? exif.DateTime ?? null);

  let elevation = null;
  if (lat != null && lng != null && !skipElevation) {
    process.stdout.write('fetching elevation… ');
    elevation = await fetchElevation(lat, lng);
  }

  // Human-readable summary
  const lines = [];
  if (datetime) lines.push(`  datetime:  ${datetime}`);
  if (lat != null && lng != null) {
    lines.push(`  GPS:       ${toDMS(lat, 'N', 'S')}, ${toDMS(lng, 'E', 'W')}`);
    lines.push(`             (${lat.toFixed(6)}, ${lng.toFixed(6)})`);
  }
  if (elevation != null) {
    lines.push(`  elevation: ${Math.round(elevation)}m / ${Math.round(elevation * 3.28084)}ft (from Open-Meteo)`);
  } else if (lat != null && !skipElevation) {
    lines.push(`  elevation: ⚠️  API call failed`);
  }
  if (lines.length === 0) lines.push('  (no relevant EXIF fields)');

  console.log('done');
  console.log(lines.join('\n'));

  outputs.push(formatOutput(filePath, { datetime, lat, lng, elevation }));
}

if (outputs.length > 0) {
  console.log('\n' + '─'.repeat(60));
  console.log('COPY THIS INTO imageRegistry/images.tsx:\n');
  console.log(outputs.join('\n\n'));
  console.log('─'.repeat(60));
}
