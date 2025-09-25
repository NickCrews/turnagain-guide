import { type GeoItem } from "@/lib/geo-item";

export const geoItem = {
  id: "tincan-proper-peak",
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [-149.141816, 60.781914],
  },
  properties: {
    title: "Tincan Proper Peak",
    feature_type: "peak",
    thumbnail: "",
    nicks_ates_ratings: ["challenging"],
    children: [],
    area: "tincan-area",
    elevation: 1139,
    latitude: 60.781914,
    longitude: -149.141816,
  },
  proseJsx: <>{/* Add content here */}</>,
} as const satisfies GeoItem;
