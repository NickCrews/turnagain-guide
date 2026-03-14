import { type GeoItem } from "@/lib/geo-item";

export const geoItem = {
  id: "petes-north-peak",
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [-149.22271, 60.72330],
    },
  properties: {
    title: "Pete's North Peak",
    feature_type: "peak",
    nicks_ates_ratings: ["complex"],
    children: [],
    area: "petes-north-area",
    elevation: 1206,
    images: [],
  },
  proseJsx: (
    <>
    </>
  ),
} as const satisfies GeoItem;
