import RouteLink from "@/components/app/route-link";
import { getFigureById } from "@/figures/index";
import { type GeoItem } from "@/lib/geo-item";

export const geoItem = {
  id: "lipps-peak",
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [-149.22459, 60.73704],
  },
  properties: {
    title: "Lipps Peak",
    feature_type: "peak",
    nicks_ates_ratings: ["complex"],
    children: [],
    area: "lipps-area",
    elevation: 1021,
    figures: [
      getFigureById('lipps-north-aerial'),
      getFigureById('lipps-north-side'),
      getFigureById('lipps-se'),
    ],
  },
  proseJsx: (
    <>
      Get here by coming up the <RouteLink routeID="lipps-uptrack">Lipps Uptrack</RouteLink>.
    </>
  ),
} as const satisfies GeoItem;
