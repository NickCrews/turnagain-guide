import { type GeoItem } from "@/lib/geo-item";

export const geoItem = {
  id: "gods-country-parking-lot",
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [-149.07706, 60.84053],
  },
  properties: {
    title: "God's Country Parking Lot",
    feature_type: "parking",
    thumbnail: "",
    nicks_ates_ratings: ["non-avalanche"],
    children: [],
    elevation: 44,
    images: [],
  },
  proseJsx: <>{/* Add content here */}</>,
} as const satisfies GeoItem;
