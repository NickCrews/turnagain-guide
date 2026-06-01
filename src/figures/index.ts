import { RAW_FIGURE_PROSE_BY_ID, RawFigureProse } from "./registry";
import { FigureMetadata, getFigureMetadata } from "./metadata-types";

export type FigureID = keyof typeof RAW_FIGURE_PROSE_BY_ID;

type InflateFigure<ID extends FigureID, Raw extends RawFigureProse> = RawFigureProse & Raw & {
  id: ID,
  altText: InferAltText<Raw>,
} & Omit<FigureMetadata<ID>, 'id'>;

function inflateFigure<T extends FigureID, Raw extends RawFigureProse>(id: T, raw: Raw): InflateFigure<T, Raw> {
  const { id: ignoredId, ...metadata } = getFigureMetadata(id);
  void ignoredId;
  return {
    id,
    imagePath: raw.imagePath,
    title: raw.title,
    description: raw.description,
    altText: inferAltText(raw),
    ...metadata,
  } as InflateFigure<T, Raw>;
}

// need the conditional type so we get Figure<"a"> | Figure<"b"> instead of just Figure<"a" | "b">
export type Figure<ID extends FigureID = FigureID> = ID extends FigureID ? InflateFigure<ID, typeof RAW_FIGURE_PROSE_BY_ID[ID]> : never;

const _figuresById = {} as Record<FigureID, Figure>;
for (const id of Object.keys(RAW_FIGURE_PROSE_BY_ID) as FigureID[]) {
  const raw = RAW_FIGURE_PROSE_BY_ID[id];
  _figuresById[id] = inflateFigure(id, raw) as Figure;
}

export function getFigureById<ID extends FigureID>(id: ID): Figure<ID> {
  return _figuresById[id] as Figure<ID>;
}

export function getAllFigures(): Figure[] {
  return Object.values(_figuresById);
}


/** In order of preference: altText, title, description, undefined */
type InferAltText<T extends RawFigureProse> = T extends { altText: string } ? T["altText"] : T extends { title: string } ? T["title"] : T extends { description: string } ? T["description"] : undefined;
function inferAltText<T extends RawFigureProse>(raw: T): InferAltText<T> {
  if (raw.altText) {
    return raw.altText as InferAltText<T>
  }
  if (raw.title) {
    return raw.title as InferAltText<T>;
  }
  if (raw.description && typeof raw.description === "string") {
    return raw.description as InferAltText<T>;
  }
  return undefined as InferAltText<T>;
}

/**
 * All figures that have `subject_coordinates`, in registry order.
 *
 * This is the set placed on the map: figures without a subject location
 * (currently `goldpan-pano`) are omitted rather than shown in the wrong place.
 */
export function figuresWithCoordinates(): Figure[] {
  return getAllFigures().filter(f => f.subject_coordinates != null);
}

/**
 * The geolocated figures that neighbor `figureId` in the map lightbox: every
 * other figure that has subject coordinates, in registry order.
 *
 * This is the single seam for later refinement (e.g. ranking neighbors by
 * distance). For now it returns all-other-geolocated-figures; callers that need
 * the full navigable set (including the current figure) should use
 * {@link figuresWithCoordinates}.
 */
export function getNeighboringFigures(figureId: FigureID): Figure[] {
  return figuresWithCoordinates().filter(f => f.id !== figureId);
}

export async function relatedFigures(figure: Figure, maxRelated: number = 5): Promise<Figure[]> {
  const all = getAllFigures();
  // Placeholder for now.
  // Ideally this should rank by distance from the image's coordinates,
  // or by being in the same geoItem, etc.
  const relatedImages = Object.values(all).filter(img => img !== figure).slice(0, maxRelated);
  return relatedImages;
}