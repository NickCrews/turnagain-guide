
import { type Feature, type Geometry } from 'geojson';
import { type ATES } from '@/lib/terrain-rating';

export type FeatureType = "area" | "parking" |"peak" | "ascent" | "descent";

export const FEATURE_TYPES: Set<FeatureType> = new Set(['area', 'parking', 'peak', 'ascent', 'descent']);

// This is an extension of the GeoJsonProperties interface.
export interface GeoItemProperties {
  title: string;
  description: string;
  feature_type: FeatureType;
  /* in meters */
  elevation?: number;
  /* in meters */
  elevation_min?: number;
  /* in meters */
  elevation_max?: number;
  /* in meters */
  distance?: number;
  /* in meters */
  total_ascent?: number;
  /* in meters */
  total_descent?: number;
  nicks_ates_ratings: ATES[];
  /* The relative url of an image to be used as a thumbnail, eg 'img/tincan-overview.jpg' */
  thumbnail?: string;
  /* the id of the other item that represents the area, eg 'tincan-area' */
  area: string | null
  [key: string]: any;
}

export interface GeoItem extends Feature {
  id: string;
  geometry: Geometry;
  properties: GeoItemProperties;
}

export function fromGeoJson(geojson: string) {
    const items = JSON.parse(geojson).features;
    // ensure that the items have an id
    for (const item of items) {
        if (!item.id) {
            throw new Error("Item has no id");
        }
        const rawAtes = item.properties['nicks_ates_ratings'];
        item.properties['nicks_ates_ratings'] = rawAtes ? rawAtes.split(',').map((r: string) => r.trim()) : [];
    }
    return items as GeoItem[];
}