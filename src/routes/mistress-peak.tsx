import RouteLink from "@/app/components/route-link";
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
    nicks_ates_ratings: ["complex"],
    children: [],
    area: "goldpan-area",
    elevation: 1216,
    images: [],
  },
  proseJsx: (
    <>
      <p>
        I don&apos;t know much about this. It&apos;s ridden either Northwest into
        the <RouteLink routeID="goldpan-area">Goldpan Cirque</RouteLink> or South into
        the Pastoral-Lipps valley.
      </p>
    </>
  ),
} as const satisfies GeoItem;
