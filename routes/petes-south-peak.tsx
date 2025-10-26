import { type GeoItem } from "@/lib/geo-item";

export const geoItem = {
  id: "petes-south-peak",
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [-149.23409, 60.71989],
  },
  properties: {
    title: "Pete's South Peak",
    feature_type: "peak",
    thumbnail: "",
    nicks_ates_ratings: ["complex"],
    children: [],
    area: "petes-south-area",
    elevation: 1159,
    images: [],
  },
  proseJsx: (
    <>
    </>
  ),
} as const satisfies GeoItem;
