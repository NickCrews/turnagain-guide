import RouteLink from "@/app/components/RouteLink";
import { type GeoItem } from "@/lib/geo-item";

export const geoItem = {
  id: "mistress-peak",
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [-149.18505, 60.73593],
  },
  properties: {
    title: "Mistress Peak",
    feature_type: "peak",
    // thumbnail: "/img/kickstep-from-road.jpg",
    nicks_ates_ratings: ["complex"],
    children: [],
    area: "goldpan-area",
    elevation: 1216,
  },
  proseJsx: (
    <>
    <p>
      I don't know much about this. It's ridden either Northwest into
      the <RouteLink routeID="goldpan-area">Goldpan Cirque</RouteLink> or South into
      the Pastoral-Lipps valley.
    </p>
    </>
  ),
} as const satisfies GeoItem;
