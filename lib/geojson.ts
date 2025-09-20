import { type GeoItem } from "./geo-item";
import {type FeatureCollection } from 'geojson';


export default function geoJSONFromGeoItems(geoItems: readonly GeoItem[]): FeatureCollection {
  const features = geoItems.map(geoItem => ({
    type: "Feature" as const,
    id: geoItem.id,
    properties: geoItem.properties,
    geometry: geoItem.geometry,
  }));
  const geojson: FeatureCollection = {
    type: "FeatureCollection",
    features,
  };
  console.log(`Generated GeoJSON with ${features.length} features.`);
  return geojson;
}