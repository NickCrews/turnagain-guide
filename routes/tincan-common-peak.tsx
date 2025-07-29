import RouteLink from "@/app/components/RouteLink";
import { type GeoItem } from "@/lib/geo-item";

export const geoItem: GeoItem = {
  id: "tincan-common-peak",
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [-149.157061, 60.786418],
  },
  properties: {
    title: "Tincan Common Peak",
    feature_type: "peak",
    thumbnail: "",
    nicks_ates_ratings: ["simple"],
    children: [],
    area: "tincan-area",
    elevation: 964,
    latitude: 60.786418,
    longitude: -149.157061,
  },
  proseJsx: (
    <>
      <p>
        This is the turnaround point for most people when ascending the
        <RouteLink routeID="tincan-uptrack">Tincan Uptrack</RouteLink>.
      </p>

      <p>
        To reach the real summit,{" "}
        <RouteLink routeID="tincan-proper-peak">Tincan Proper Peak</RouteLink>,
        you need to bootpack along the sometimes-knifeedge ridge for another
        15-25 minutes.
      </p>
    </>
  ),
};
