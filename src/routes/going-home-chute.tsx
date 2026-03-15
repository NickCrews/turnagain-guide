import RouteLink from "@/app/components/route-link";
import { getFigureById } from "@/figures/index";
import { type GeoItem } from "@/lib/geo-item";

export const geoItem = {
  id: "going-home-chute",
  type: "Feature",
  "geometry": {
    "type": "LineString",
    "coordinates": [
      [
        -149.203364,
        60.729501,
        1101.800000000001,
        0.0
      ],
      [
        -149.201321,
        60.733596,
        784.0,
        0.0
      ]
    ]
  },
  properties: {
    title: "Going Home Chute",
    feature_type: "descent",
    nicks_ates_ratings: ["complex"],
    children: [],
    area: "lipps-area",
    elevation_max: 1319,
    elevation_min: 928,
    distance: 618,
    figures: [getFigureById('granddaddy-far-aerial')],
  },
  proseJsx: (
    <>
      <p>
        I don't know what most people actually call this chute. I just invented the name
        &quot;Going Home Chute&quot;. If you know the real name please tell me and I will change it.
      </p>
      <p>
        A wide, long, shady, decently steep chute on the North side of the Lipps ridge.
        You can either skin straight up it, or it is a common descent
        for people coming from the Spokane Creek drainage,
        on the far (South) side of the Lipps ridge.
      </p>
      <p>
        When we skied it middle of the season there were some sharky rocks at the top that
        we hit with our skis a bit, but after that it is just a long hero run.
      </p>
    </>
  ),
} as const satisfies GeoItem;
