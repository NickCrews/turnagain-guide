import RouteLink from "@/app/components/route-link";
import { lippsNorth } from "@/imageRegistry/images";
import { type GeoItem } from "@/lib/geo-item";

export const geoItem = {
  id: "lipps-peak",
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [-149.19065, 60.72490],
  },
  properties: {
    title: "Lipps Peak",
    feature_type: "peak",
    nicks_ates_ratings: ["complex"],
    children: [],
    area: "lipps-area",
    elevation: 1318,
    images: [lippsNorth],
  },
  proseJsx: (
    <>
      The most coveted line from here is
      the <RouteLink routeID="granddaddy-couloir">Granddaddy Couloir</RouteLink>.
    </>
  ),
} as const satisfies GeoItem;
