import { type GeoItem } from "@/lib/geo-item";

export const geoItem: GeoItem = {
  id: "coastal-parking-lot",
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [-149.05293, 60.84438],
  },
  properties: {
    title: "Coastal Parking Lot",
    feature_type: "parking",
    thumbnail: "",
    nicks_ates_ratings: ["non-avalanche"],
    children: [],
    area: "wolverine-area",
    elevation: 19,
  },
  proseJsx: <>{/* Add content here */}</>,
};
