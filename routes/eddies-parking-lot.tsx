import { type GeoItem } from "@/lib/geo-item";

export const geoItem: GeoItem = {
  id: "eddies-parking-lot",
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [-149.12499, 60.82543],
  },
  properties: {
    title: "Eddies Parking Lot",
    feature_type: "parking",
    thumbnail: "",
    nicks_ates_ratings: ["non-avalanche"],
    children: [],
    area: "eddies-area",
    elevation: 124,
  },
  proseJsx: <>{/* Add content here */}</>,
};
