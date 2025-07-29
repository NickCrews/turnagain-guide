import { type GeoItem } from "@/lib/geo-item";

export const geoItem: GeoItem = {
  id: "sunburst-parking-lot",
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [-149.23129, 60.76671],
  },
  properties: {
    title: "Sunburst Parking Lot",
    feature_type: "parking",
    thumbnail: "/img/sunburst-magnum-overview.jpg",
    nicks_ates_ratings: ["non-avalanche"],
    children: [],
    area: "sunburst-area",
    elevation: 275,
  },
  proseJsx: <>{/* Add content here */}</>,
};
