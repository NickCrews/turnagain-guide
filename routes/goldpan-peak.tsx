import RouteLink from "@/app/components/RouteLink";
import { goldpan } from "@/imageRegistry/imagesWithPaths";
import { type GeoItem } from "@/lib/geo-item";

export const geoItem = {
  id: "goldpan-peak",
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [-149.18742, 60.74247],
  },
  properties: {
    title: "Goldpan Peak",
    feature_type: "peak",
    nicks_ates_ratings: ["complex"],
    children: [],
    area: "goldpan-area",
    elevation: 1233,
    images: [goldpan],
  },
  proseJsx: (
    <>
    <p>
      You usually get here
      via <RouteLink routeID="basketball-peak">Basketball Peak</RouteLink>.
    </p>
    </>
  ),
} as const satisfies GeoItem;
