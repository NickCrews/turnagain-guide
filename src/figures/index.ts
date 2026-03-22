import { RAW_FIGURE_PROSE_BY_ID, RawFigureProse } from "./registry";
import { MetadataByFigureID, getMetadataByFigureID } from "./metadata-types";

export type FigureID = keyof typeof RAW_FIGURE_PROSE_BY_ID;

type InflateFigure<ID extends FigureID, Raw extends RawFigureProse> = RawFigureProse & Raw & {
  id: ID,
  altText: InferAltText<Raw>,
} & MetadataByFigureID<ID>;
function inflateFigure<T extends FigureID, Raw extends RawFigureProse>(id: T, raw: Raw): InflateFigure<T, Raw> {
  const { id: ignoredId, ...metadata } = getMetadataByFigureID(id);
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

export type Figure<ID extends FigureID = FigureID> = InflateFigure<ID, typeof RAW_FIGURE_PROSE_BY_ID[ID]>;

const _figuresById: Record<FigureID, Figure> = Object.entries(RAW_FIGURE_PROSE_BY_ID).reduce((acc, [id, raw]) => {
  acc[id as FigureID] = inflateFigure(id as FigureID, raw);
  return acc;
}, {} as Record<FigureID, Figure>);

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

export async function relatedFigures(figure: Figure, maxRelated: number = 5): Promise<Figure[]> {
  const all = getAllFigures();
  // Placeholder for now.
  // Ideally this should rank by distance from the image's coordinates,
  // or by being in the same geoItem, etc.
  const relatedImages = Object.values(all).filter(img => img !== figure).slice(0, maxRelated);
  return relatedImages;
}