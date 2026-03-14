import RouteLink from "@/app/components/route-link";
import { type GeoItem } from "@/lib/geo-item";

export const geoItem = {
  id: "tincan-common",
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [-149.157061, 60.786418],
  },
  properties: {
    title: "Tincan Common",
    feature_type: "peak",
    nicks_ates_ratings: ["simple"],
    children: [],
    area: "tincan-area",
    elevation: 964,
    latitude: 60.786418,
    longitude: -149.157061,
    images: [],
  },
  proseJsx: (
    <>
      <p>
        This is the turnaround point for most people when ascending
        the <RouteLink routeID="tincan-uptrack">Tincan Uptrack</RouteLink>.
      </p>

      <p>
        To reach the real summit of this
        ridge, <RouteLink routeID="tincan-proper">Tincan Proper</RouteLink>,
        you need to bootpack along the sometimes-knifeedge ridge for another
        15-25 minutes.
      </p>
    </>
  ),
} as const satisfies GeoItem;
