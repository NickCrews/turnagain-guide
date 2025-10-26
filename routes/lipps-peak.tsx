import RouteLink from "@/app/components/RouteLink";
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
    thumbnail: "/img/lipps-north-side.jpg",
    nicks_ates_ratings: ["complex"],
    children: [],
    area: "lipps-area",
    elevation: 1318,
    images: [],
  },
  proseJsx: (
    <>
    The most coveted line from here is
    the <RouteLink routeID="granddaddy-couloir">Granddaddy Couloir</RouteLink>.
    </>
  ),
} as const satisfies GeoItem;
