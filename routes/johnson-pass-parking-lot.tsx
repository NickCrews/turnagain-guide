import { type GeoItem } from "@/lib/geo-item";

export const geoItem = {
  id: "johnson-pass-parking-lot",
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [-149.27462, 60.72823],
  },
  properties: {
    title: "Johnson Pass Parking Lot",
    feature_type: "parking",
    thumbnail: "",
    nicks_ates_ratings: ["non-avalanche"],
    children: [],
    area: "petes-north-area",
    elevation: 203,
  },
  proseJsx: <>{/* Add content here */}</>,
} as const satisfies GeoItem;
