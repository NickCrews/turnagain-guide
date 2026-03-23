import { type FigureID } from "./index";

import _RAW_METADATA from "./metadata";
type RawMetadata = typeof _RAW_METADATA;
type RawFigureMetadataByID<ID extends FigureID> = Extract<RawMetadata[number], { id: ID }>;

/**
 * An ISO 8601 datetime string, e.g. "2024-03-15T10:30:00"
 */
type ISODateString = `${number}-${number}-${number}T${number}:${number}:${number}`;

/**
 * Machine-readable/writable metadata about a figure such as its coordinates, elevation, direction, and datetime.
 */
export interface FigureMetadataRaw {
  id: FigureID;
  /** The location of the SUBJECT of the photo (not the camera) */
  subject_coordinates?: {
    lat: number,
    long: number
  },
  /** The elevation of the SUBJECT of the photo (not the camera) */
  subject_elevation?: number,
  /** Direction in degrees, where 0 = North, 90 = East, etc. */
  direction?: number,
  /** When the photo was taken. In local time, eg "2024-03-15T10:30:00" */
  datetime?: ISODateString,
}

type CommonFigureMetadata = Omit<FigureMetadataRaw, 'id'>;

type SpecificFigureMetadata<ID extends FigureID> =
  [RawFigureMetadataByID<ID>] extends [never]
  ? {}
  : Omit<RawFigureMetadataByID<ID>, 'id'>;

export type FigureMetadata<ID extends FigureID = FigureID> = { id: ID } & CommonFigureMetadata & SpecificFigureMetadata<ID>;

export function getFigureMetadata<ID extends FigureID>(id: ID): FigureMetadata<ID> {
  const metadata = _RAW_METADATA.find((m): m is RawFigureMetadataByID<ID> => m.id === id);
  if (!metadata) {
    return { id } as FigureMetadata<ID>;
  }
  return metadata;
}