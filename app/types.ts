import type { Feature, Geometry } from 'geojson';

// This is an extension of the GeoJsonProperties interface.
export interface ItemProperties {
  title: string;
  description: string;
  [key: string]: any;
}

export class Item implements Feature {
  id: string;
  type: "Feature" = "Feature";
  geometry: Geometry;
  properties: ItemProperties;

  constructor(id: string, geometry: any, properties: ItemProperties) {
    this.id = id;
    this.geometry = geometry;
    this.properties = properties;
  }
}
