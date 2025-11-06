import { type GeoItem } from "@/lib/geo-item";
import RouteLink from "@/app/components/RouteLink";

export const geoItem = {
  id: "eddies-parking-lot",
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [-149.12499, 60.82543],
  },
  properties: {
    title: "Eddies Parking Lot",
    feature_type: "parking",
    nicks_ates_ratings: ["non-avalanche"],
    children: [],
    area: "eddies-area",
    elevation: 124,
    images: [],
  },
  proseJsx: <>
    <p>
      Park here to access
      <RouteLink routeID="eddies-area">Eddie&apos;s Area</RouteLink>
      via the
      <RouteLink routeID="eddies-approach-and-uptrack">skin track</RouteLink>.
    </p>
    <p>
      This is a large pullout on the East side of the highway.
      After a storm, it isn&apos;t a high priority for DOT, and often receives a
      marginal plowing job for the first ~24 hours after a storm.
      Usually enough just for cars to parrallel pull off the highway, but not
      really enough for parking. If you encounter this, you can usually
      nose your car into the unplowed snow, maybe requiring a bit of shoveling
      depending on the amount of snow and your car.
    </p>
  </>,
} as const satisfies GeoItem;
