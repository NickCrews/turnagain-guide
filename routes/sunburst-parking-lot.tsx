import RouteLink from "@/app/components/RouteLink";
import { type GeoItem } from "@/lib/geo-item";

export const geoItem = {
  id: "sunburst-parking-lot",
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [-149.23129, 60.76671],
  },
  properties: {
    title: "Sunburst Parking Lot",
    feature_type: "parking",
    thumbnail: "/img/sunburst-magnum-overview.jpg",
    nicks_ates_ratings: ["non-avalanche"],
    children: [],
    area: "sunburst-area",
    elevation: 275,
  },
  proseJsx: <>
    <p>
      A large pull-through parking lot on the East side of the highway.
      This has lots of room and you can almost always find a spot.
    </p>
    <p>
      During temperature inversions, this can be much colder than the
      higher terrain, so don&apos;t be discouraged by that!
    </p>
    <p>
      Start up <RouteLink routeID="sunburst-meadows-uptrack">Sunburst Meadows Uptrack</RouteLink> or,
      in early season conditions, <RouteLink routeID="sunburst-meadows-uptrack-early">the Early Season Variation</RouteLink>.
    </p>
  </>,
} as const satisfies GeoItem;
