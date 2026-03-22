import RouteLink from "@/components/app/route-link";
import { getFigureById } from "@/figures/index";
import { type GeoItem } from "@/lib/geo-item";

export const geoItem = {
  id: "granddaddy-peak",
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [-149.19065, 60.72490],
  },
  properties: {
    title: "Granddaddy Peak",
    feature_type: "peak",
    nicks_ates_ratings: ["complex"],
    children: [],
    area: "lipps-area",
    elevation: 1318,
    figures: [getFigureById('granddaddy-far-aerial')],
  },
  proseJsx: (
    <>
      <p>

        The most coveted line from here is
        the <RouteLink routeID="granddaddy-couloir">Granddaddy Couloir</RouteLink>,
        heading North into the Bertha Creek.
      </p>
      <p>
        The other popular descent is to head West into the Spokane Creek drainage
        via Tommy Moe.
      </p>
    </>
  ),
} as const satisfies GeoItem;
