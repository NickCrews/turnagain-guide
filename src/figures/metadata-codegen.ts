export interface EditableMetadataFields {
  lat: string;
  long: string;
  elevation: string;
  direction: string;
  datetime: string;
}

export interface FigureMetadataEntry {
  id: string;
  subject_coordinates?: {
    lat: number;
    long: number;
  };
  subject_elevation?: number;
  direction?: number;
  datetime?: string;
}

export interface ParseMetadataResult {
  metadata: FigureMetadataEntry;
  errors: string[];
}

function parseNumber(raw: string, label: string, errors: string[]): number | undefined {
  if (!raw.trim()) {
    return undefined;
  }
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) {
    errors.push(`${label} must be a number.`);
    return undefined;
  }
  return parsed;
}

export function parseEditableMetadata(id: string, fields: EditableMetadataFields): ParseMetadataResult {
  const errors: string[] = [];
  const lat = parseNumber(fields.lat, 'Latitude', errors);
  const long = parseNumber(fields.long, 'Longitude', errors);
  const subject_elevation = parseNumber(fields.elevation, 'Elevation', errors);
  const direction = parseNumber(fields.direction, 'Direction', errors);
  const datetime = fields.datetime.trim() || undefined;

  if ((fields.lat.trim() && !fields.long.trim()) || (!fields.lat.trim() && fields.long.trim())) {
    errors.push('Latitude and longitude must both be set or both be empty.');
  }

  const metadata: FigureMetadataEntry = {
    id,
    subject_coordinates: lat != null && long != null ? { lat, long } : undefined,
    subject_elevation,
    direction,
    datetime,
  };

  return { metadata, errors };
}

function hasMetadataFields(entry: FigureMetadataEntry): boolean {
  return Boolean(
    entry.subject_coordinates != null ||
    entry.subject_elevation != null ||
    entry.direction != null ||
    entry.datetime != null,
  );
}

export function upsertFigureMetadata(
  current: ReadonlyArray<FigureMetadataEntry>,
  next: FigureMetadataEntry,
): FigureMetadataEntry[] {
  const withoutCurrent = current.filter(entry => entry.id !== next.id);
  if (!hasMetadataFields(next)) {
    return withoutCurrent.sort((a, b) => a.id.localeCompare(b.id));
  }
  return [...withoutCurrent, next].sort((a, b) => a.id.localeCompare(b.id));
}

export function mergeFigureMetadataAdditive(
  current: ReadonlyArray<FigureMetadataEntry>,
  next: FigureMetadataEntry,
): FigureMetadataEntry[] {
  const existing = current.find(entry => entry.id === next.id);
  if (!existing) {
    return upsertFigureMetadata(current, next);
  }

  const merged: FigureMetadataEntry = {
    ...existing,
    subject_coordinates: next.subject_coordinates ?? existing.subject_coordinates,
    subject_elevation: next.subject_elevation ?? existing.subject_elevation,
    direction: next.direction ?? existing.direction,
    datetime: next.datetime ?? existing.datetime,
  };

  return upsertFigureMetadata(current, merged);
}

export function renderMetadataEntrySnippet(entry: FigureMetadataEntry): string {
  return JSON.stringify(entry, null, 2);
}

export function renderMetadataModule(metadata: ReadonlyArray<FigureMetadataEntry>): string {
  const serialized = JSON.stringify(metadata, null, 2);
  return `import { type FigureMetadataRaw } from './metadata-types';\n\nexport default ${serialized} as const satisfies Array<FigureMetadataRaw>;\n`;
}