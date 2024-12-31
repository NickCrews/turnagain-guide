
import { promises as fs } from 'fs';
import type { Feature, Geometry } from 'geojson';

// This is an extension of the GeoJsonProperties interface.
export interface ItemProperties {
  title: string;
  description: string;
  [key: string]: any;
}

export interface Item extends Feature {
  id: string;
  geometry: Geometry;
  properties: ItemProperties;
}

export class ItemCollection {
    items: { [key: string]: Item };

    constructor(items: Item[]) {
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
        const items = JSON.parse(geojson).features as Item[];
        // ensure that the items have an id
        for (const item of items) {
            if (!item.id) {
                throw new Error("Item has no id");
            }
        }
        return new ItemCollection(items);
    }

    static async fromFile(filePath: string | null = null) {
        if (filePath === null) {
            filePath = process.cwd() + '/public/objects.geojson';
        }
        const geojson = await fs.readFile(filePath, 'utf8');
        return ItemCollection.fromGeoJson(geojson);
    }
}