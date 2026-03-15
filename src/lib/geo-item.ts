
import { type Feature, type Geometry } from 'geojson';
import { type ATES } from '@/lib/terrain-rating';
import { Figure } from '@/figures';
import { allGeoItems } from '@/routes';

const _featureTypes = ["area", "parking", "peak", "ascent", "descent"] as const;
export type FeatureType = typeof _featureTypes[number];
export const FEATURE_TYPES = new Set(_featureTypes);

const AREA_IDS = [
  "cornbiscuit-area",
  "goldpan-area",
  "tincan-area",
  "wolverine-area",
  "eddies-area",
  "lipps-area",
  "petes-north-area",
  "magnum-area",
  "pastoral-area",
  "petes-south-area",
  "sharkfin-area",
  "sunburst-area",
] as const;
export type AreaId = typeof AREA_IDS[number];

// export type AreaId<TGeoItem extends { id: string; properties: { feature_type: FeatureType } }> =
//   Extract<TGeoItem, { properties: { feature_type: 'area' } }>['id'];

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
  latitude?: number;
  longitude?: number;
  /* in meters */
  distance?: number;
  /* in meters */
  total_ascent?: number;
  /* in meters */
  total_descent?: number;
  nicks_ates_ratings: ATES[];
  /* the id of the other item that represents the area, eg 'tincan-area' */
  area?: AreaId;
  /** 
   * The ids of the items that are children of this item.
   * This is only going to be filled in for areas.
   * For "leaf" items, this will be an empty array.
   */
  children: string[];
  /** The first figure will be interpreted as the thumbnail */
  figures: Figure[];
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
export function addChildrenField(items: readonly GeoItem[]) {
  const parentToChildrenMap = new Map();
  items.forEach(obj => {
    parentToChildrenMap.set(obj.id, []);
  });
  items.forEach(item => {
    if (item.properties.area) {
      const area = parentToChildrenMap.get(item.properties.area);
      if (!area) {
        throw new Error(`Area ${item.properties.area} is not a valid parent`);
      }
      area.push(item.id);
    }
  });
  const result = items.map(obj => {
    return {
      ...obj,
      properties: {
        ...obj.properties,
        children: parentToChildrenMap.get(obj.id),
      },
    };
  });
  // order by number of images, descending
  // result.sort((a, b) => b.properties.images.length - a.properties.images.length);
  return result;
}

export async function loadGeoItems() {
  const withChildren = addChildrenField(allGeoItems);
  console.log("Loaded " + withChildren.length + " geoitems");
  return withChildren;
}