#!/usr/bin/env node

import { existsSync, readFileSync } from 'fs';
import { writeFile } from 'fs/promises';
import { basename, extname, resolve } from 'path';
import {
  type FigureMetadataEntry,
  mergeFigureMetadataAdditive,
  renderMetadataEntrySnippet,
  renderMetadataModule,
} from '../src/figures/metadata-codegen';
import currentMetadata from '../src/figures/metadata';

interface ParsedExif {
  latitude?: number;
  longitude?: number;
  DateTimeOriginal?: Date;
  DateTime?: Date;
}

interface ImageSuggestion {
  filePath: string;
  metadata: FigureMetadataEntry;
  summaryLines: string[];
}

interface ExifrModule {
  default: {
    parse: (buffer: Buffer, options: Record<string, boolean>) => Promise<ParsedExif | null>;
  };
}

let exifr: ExifrModule;
try {
  exifr = await import('exifr') as ExifrModule;
} catch {
  console.error('exifr not installed. Run: pnpm add -D exifr');
  process.exit(1);
}

function toDMS(deg: number, posDir: string, negDir: string): string {
  const d = Math.abs(deg);
  const degrees = Math.floor(d);
  const minutes = Math.floor((d - degrees) * 60);
  const seconds = ((d - degrees - minutes / 60) * 3600).toFixed(1);
  return `${degrees}°${minutes}′${seconds}″ ${deg >= 0 ? posDir : negDir}`;
}

async function fetchElevation(lat: number, lng: number): Promise<number | null> {
  const url = `https://api.open-meteo.com/v1/elevation?latitude=${lat.toFixed(6)}&longitude=${lng.toFixed(6)}`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json() as { elevation?: number[] };
    return data.elevation?.[0] ?? null;
  } catch {
    return null;
  }
}

function formatDatetime(date: Date | null | undefined): string | undefined {
  if (!date) {
    return undefined;
  }
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  );
}

function inferFigureId(imagePath: string): string {
  return basename(imagePath, extname(imagePath));
}

function parseCliArgs(argv: string[]): {
  imageArgs: string[];
  skipElevation: boolean;
  write: boolean;
} {
  const skipElevation = argv.includes('--no-elevation');
  const write = argv.includes('--write');
  const imageArgs = argv.filter(arg => !arg.startsWith('--'));
  return { imageArgs, skipElevation, write };
}

function usage(): string {
  return [
    'Usage: pnpm suggest-metadata [--no-elevation] [--write] <image-file(s)>',
    'Example:',
    '  pnpm suggest-metadata public/img/booting-basketball.jpg --write',
  ].join('\n');
}

async function suggestForImage(filePath: string, skipElevation: boolean): Promise<ImageSuggestion | null> {
  if (!existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return null;
  }

  process.stdout.write(`Reading ${basename(filePath)}... `);
  let exif: ParsedExif | null;
  try {
    const buffer = readFileSync(filePath);
    exif = await exifr.default.parse(buffer, {
      gps: true,
      tiff: true,
      exif: true,
      ifd0: true,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(`EXIF error: ${message}`);
    return null;
  }

  if (!exif) {
    console.log('no EXIF data found');
    return {
      filePath,
      metadata: { id: inferFigureId(filePath) },
      summaryLines: ['  (no relevant EXIF fields)'],
    };
  }

  const lat = exif.latitude ?? null;
  const long = exif.longitude ?? null;
  const datetime = formatDatetime(exif.DateTimeOriginal ?? exif.DateTime);

  let elevation: number | null = null;
  if (lat != null && long != null && !skipElevation) {
    process.stdout.write('fetching elevation... ');
    elevation = await fetchElevation(lat, long);
  }

  const summaryLines: string[] = [];
  if (datetime) {
    summaryLines.push(`  datetime:  ${datetime}`);
  }
  if (lat != null && long != null) {
    summaryLines.push(`  GPS:       ${toDMS(lat, 'N', 'S')}, ${toDMS(long, 'E', 'W')}`);
    summaryLines.push(`             (${lat.toFixed(6)}, ${long.toFixed(6)})`);
  }
  if (elevation != null) {
    summaryLines.push(`  elevation: ${Math.round(elevation)}m / ${Math.round(elevation * 3.28084)}ft (from Open-Meteo)`);
  } else if (lat != null && !skipElevation) {
    summaryLines.push('  elevation: API call failed');
  }
  if (summaryLines.length === 0) {
    summaryLines.push('  (no relevant EXIF fields)');
  }

  console.log('done');
  console.log(summaryLines.join('\n'));

  return {
    filePath,
    metadata: {
      id: inferFigureId(filePath),
      subject_coordinates: lat != null && long != null ? { lat, long } : undefined,
      subject_elevation: elevation != null ? Math.round(elevation) : undefined,
      datetime,
    },
    summaryLines,
  };
}

async function main() {
  const { imageArgs, skipElevation, write } = parseCliArgs(process.argv.slice(2));

  if (imageArgs.length === 0) {
    console.log(usage());
    return;
  }

  const suggestions: ImageSuggestion[] = [];

  for (const arg of imageArgs) {
    const filePath = resolve(arg);
    const suggestion = await suggestForImage(filePath, skipElevation);
    if (suggestion) {
      suggestions.push(suggestion);
    }
  }

  if (suggestions.length === 0) {
    return;
  }

  let nextMetadata = [...currentMetadata] as FigureMetadataEntry[];
  for (const suggestion of suggestions) {
    nextMetadata = mergeFigureMetadataAdditive(nextMetadata, suggestion.metadata);
  }

  console.log(`\n${'-'.repeat(60)}`);
  console.log('Suggested entries:');
  for (const suggestion of suggestions) {
    console.log(`\n// ${basename(suggestion.filePath)} (id: ${suggestion.metadata.id})`);
    console.log(renderMetadataEntrySnippet(suggestion.metadata));
  }

  if (write) {
    const targetFile = resolve('src/figures/metadata.ts');
    await writeFile(targetFile, renderMetadataModule(nextMetadata), 'utf8');
    console.log(`\nWrote ${targetFile}`);
  } else {
    console.log('\nRun again with --write to update src/figures/metadata.ts directly.');
  }
  console.log('-'.repeat(60));
}

await main();