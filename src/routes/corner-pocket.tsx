import { type GeoItem } from "@/lib/geo-item";
import RouteLink from "@/app/components/route-link";
import { getFigureById } from "@/figures/index";

export const geoItem = {
  id: "corner-pocket",
  type: "Feature",
  "geometry": {
    "type": "LineString",
    "coordinates": [
      [
        -149.203532,
        60.744622,
        1081.6000000000004,
        0.0
      ],
      [
        -149.202875,
        60.746072,
        955.2000000000007,
        0.0
      ],
      [
        -149.203169,
        60.747113,
        897.6000000000004,
        0.0
      ],
      [
        -149.204098,
        60.748186,
        874.8000000000011,
        0.0
      ],
    ]
  },
  properties: {
    title: "Corner Pocket",
    feature_type: "descent",
    nicks_ates_ratings: ["complex"],
    children: [],
    area: "cornbiscuit-area",
    elevation_max: 1081,
    elevation_min: 874,
    distance: 412,
    figures: [
      getFigureById('cornbiscuit-north-side'),
    ],
  },
  proseJsx: (
    <>
      <p>
        An alternative descent a little bit looker&apos;s right of <RouteLink routeID="superbowl">Superbowl</RouteLink>.
      </p>
    </>
  ),
} as const satisfies GeoItem;
