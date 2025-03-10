
import { promises as fs } from 'fs';
import { type Feature, type Geometry } from 'geojson';
import { type ATES } from '@/lib/terrain-rating';

export type FeatureType = "parking" |"peak" | "ascent" | "descent";

export const FEATURE_TYPES: Set<FeatureType> = new Set(['parking', 'peak', 'ascent', 'descent']);

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
  [key: string]: any;
}

export interface GeoItem extends Feature {
  id: string;
  geometry: Geometry;
  properties: GeoItemProperties;
}

export class GeoItemCollection {
    items: { [key: string]: GeoItem };

    constructor(items: GeoItem[]) {
        this.items = Object.fromEntries(items.map(item => [item.id, item]));
    }

    getItem(id: string) {
        return this.items[id];
    }

    getItems() {
        return Object.values(this.items);
    }

    getItemIds() {
        return Object.keys(this.items);
    }

    static async fromGeoJson(geojson: string) {
        const items = JSON.parse(geojson).features;
        // ensure that the items have an id
        for (const item of items) {
            if (!item.id) {
                throw new Error("Item has no id");
            }
            item.properties['nicks_ates_ratings'] = item.properties['nicks_ates_ratings'].split(",")
        }
        return new GeoItemCollection(items as GeoItem[]);
    }

    static async fromFile(filePath: string | null = null) {
        if (filePath === null) {
            filePath = process.cwd() + '/public/turnagain-pass.geojson';
        }
        const geojson = await fs.readFile(filePath, 'utf8');
        return GeoItemCollection.fromGeoJson(geojson);
    }
}