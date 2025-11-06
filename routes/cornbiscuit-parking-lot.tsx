import { type GeoItem } from "@/lib/geo-item";
import RouteLink from "@/app/components/RouteLink";
import { magnumAndCornbisbuit } from "@/imageRegistry/imagesWithPaths";

export const geoItem = {
  id: "cornbiscuit-parking-lot",
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [-149.24318, 60.75612],
  },
  properties: {
    title: "Cornbiscuit Parking Lot",
    feature_type: "parking",
    thumbnail: magnumAndCornbisbuit,
    nicks_ates_ratings: ["non-avalanche"],
    children: [],
    area: "cornbiscuit-area",
    elevation: 275,
    images: [],
  },
  proseJsx: (
    <>
      <p>
        Serves as parking for Magnum, Cornbiscuit, Goldpan. Once parked, head
        down the embankment, then turn left (North) and follow the meadow until
        a creek enters through a slot in the bluff, and you are on the
        <RouteLink routeID="pms-bowl-uptrack">PMS Bowl Uptrack</RouteLink>
        uptrack.
      </p>
    </>
  ),
} as const satisfies GeoItem;