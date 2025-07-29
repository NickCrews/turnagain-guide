import { type GeoItem } from "@/lib/geo-item";

export const geoItem: GeoItem = {
  id: "lipps-parking-lot",
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [-149.25502, 60.74657],
  },
  properties: {
    title: "Lipps Parking Lot",
    feature_type: "parking",
    thumbnail: "/img/lipps-overview.jpg",
    area: "lipps-area",
    elevation: 237,
    nicks_ates_ratings: ["non-avalanche"],
    children: [],
  },
  proseJsx: <></>,
};
