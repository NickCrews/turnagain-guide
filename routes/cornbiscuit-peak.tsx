import RouteLink from "@/app/components/RouteLink";
import { type GeoItem } from "@/lib/geo-item";

export const geoItem = {
  id: "cornbiscuit-peak",
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [-149.20048, 60.74447],
  },
  properties: {
    title: "Cornbiscuit Peak",
    feature_type: "peak",
    thumbnail: "/img/cornbiscuit-north-side.jpg",
    nicks_ates_ratings: ["complex"],
    children: [],
    area: "cornbiscuit-area",
    elevation: 1120,
  },
  proseJsx: (
    <>
    <p>
      You can access this two ways. The easier, safer, and much more straightforward way
      is to approach up the Cornbisuit-Lipps valley on South side of Cornbiscuit,
      then ascend left (North) into the <RouteLink routeID="goldpan-area">Goldpan Cirque</RouteLink> and
      then continue curving left (West) up to the col between Cornbiscuit and Superbowl.
    </p>
    <p>
      The other way, by going up the <RouteLink routeID="cornbiscuit-uptrack">Cornbiscuit Uptrack</RouteLink> and
      then booting along the ridge, is more convoluted and hardly ever done, but I hear
      of it being possible. Not sure how exposed or dangerous it is.
    </p>
    </>
  ),
} as const satisfies GeoItem;
