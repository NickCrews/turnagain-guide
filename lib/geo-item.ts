
import { type Feature, type Geometry } from 'geojson';
import { type ATES } from '@/lib/terrain-rating';
import { allGeoItems } from '@/routes';

export type FeatureType = "area" | "parking" |"peak" | "ascent" | "descent";

export const FEATURE_TYPES: Set<FeatureType> = new Set(['area', 'parking', 'peak', 'ascent', 'descent']);

// This is an extension of the GeoJsonProperties interface.
export interface GeoItemProperties {
  title: string;
  description?: string;
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
  area?: string;
  /** 
   * The ids of the items that are children of this item.
   * This is only going to be filled in for areas.
   * For "leaf" items, this will be an empty array.
   */
  children: string[];
  [key: string]: any;
}

export interface GeoItem extends Feature {
  id: string;
  geometry: Geometry;
  properties: GeoItemProperties;
  /** The prose/article that describes the item, with text, pictures, etc. */
  proseJsx: React.JSX.Element;
}

// For all areas, add a children field that contains the ids of the children items.
// The original data representation is pointers of child->parent,
// where the child item stores the area, so we need to reverse it.
export function addChildrenField(items: GeoItem[]) {
  const parentToChildrenMap = new Map();
  items.forEach(obj => {
      parentToChildrenMap.set(obj.id, []);
  });

  // Populate the map with child IDs
  items.forEach(item => {
    console.log("Processing item", item.id, item.properties.area);
    console.log(parentToChildrenMap);
      if (item.properties.area) {
        const area = parentToChildrenMap.get(item.properties.area);
        if (!area) {
          throw new Error(`Area ${item.properties.area} is not a valid parent`);
        }
        area.push(item.id);
      }
  });

  // Add the children field to each object
  return items.map(obj => {
      return {
          ...obj,
          properties: {
              ...obj.properties,
              children: parentToChildrenMap.get(obj.id),
          },
      };
  });
}

export async function loadGeoItems() {
  const withChildren = addChildrenField(allGeoItems);
  console.log("Loaded " + withChildren.length + " geoitems");
  return withChildren;
}