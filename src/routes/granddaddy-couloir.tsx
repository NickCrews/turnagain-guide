import RouteLink from "@/components/app/route-link";
import { getFigureById } from "@/figures/index";
import { type GeoItem } from "@/lib/geo-item";

export const geoItem = {
  id: "granddaddy-couloir",
  type: "Feature",
  "geometry": {
    "type": "LineString",
    "coordinates": [
      [
        -149.190837,
        60.724873,
        1319.0,
        0.0
      ],
      [
        -149.191081,
        60.725115,
        1298.199951171875,
        0.0
      ],
      [
        -149.191265,
        60.725298,
        1286.0,
        0.0
      ],
      [
        -149.191265,
        60.725298,
        1286.0,
        0.0
      ],
      [
        -149.19125,
        60.725568,
        1264.0,
        0.0
      ],
      [
        -149.191236,
        60.725837,
        1242.0,
        0.0
      ],
      [
        -149.191221,
        60.726107,
        1216.4000244140625,
        0.0
      ],
      [
        -149.191216,
        60.726202,
        1208.800048828125,
        0.0
      ],
      [
        -149.191216,
        60.726202,
        1208.800048828125,
        0.0
      ],
      [
        -149.19118,
        60.726471,
        1186.4000244140625,
        0.0
      ],
      [
        -149.191143,
        60.72674,
        1157.800048828125,
        0.0
      ],
      [
        -149.191107,
        60.72701,
        1135.0,
        0.0
      ],
      [
        -149.191095,
        60.727095,
        1127.5999755859375,
        0.0
      ],
      [
        -149.191095,
        60.727095,
        1127.5999755859375,
        0.0
      ],
      [
        -149.191069,
        60.727364,
        1101.0,
        0.0
      ],
      [
        -149.191043,
        60.727634,
        1079.800048828125,
        0.0
      ],
      [
        -149.191017,
        60.727903,
        1059.0,
        0.0
      ],
      [
        -149.191005,
        60.728027,
        1048.800048828125,
        0.0
      ],
      [
        -149.191005,
        60.728027,
        1048.800048828125,
        0.0
      ],
      [
        -149.191049,
        60.728296,
        1026.199951171875,
        0.0
      ],
      [
        -149.191092,
        60.728565,
        1008.5999755859375,
        0.0
      ],
      [
        -149.191129,
        60.72879,
        994.5999755859375,
        0.0
      ],
      [
        -149.191129,
        60.72879,
        994.5999755859375,
        0.0
      ],
      [
        -149.191218,
        60.729056,
        976.5999755859375,
        0.0
      ],
      [
        -149.191307,
        60.729322,
        963.5999755859375,
        0.0
      ],
      [
        -149.191307,
        60.729322,
        963.5999755859375,
        0.0
      ],
      [
        -149.191206,
        60.729587,
        951.0,
        0.0
      ],
      [
        -149.191106,
        60.729853,
        938.7999877929688,
        0.0
      ],
      [
        -149.191005,
        60.730118,
        932.2000122070312,
        0.0
      ],
      [
        -149.190917,
        60.73035,
        927.5999755859375,
        0.0
      ]
    ]
  },
  properties: {
    title: "Granddaddy Couloir",
    feature_type: "descent",
    nicks_ates_ratings: ["complex"],
    children: [],
    area: "lipps-area",
    elevation_max: 1319,
    elevation_min: 928,
    distance: 618,
    figures: [getFigureById('granddaddy-far-aerial'), getFigureById('granddaddy-couloir-from-top'), getFigureById('granddaddy-distant')],
  },
  proseJsx: (
    <>
      <p>
        While you CAN boot it, a much easier way is to skin all the way up Bertha Creek
        to the col at the head of the valley, then turn right and skin right up the North ridge
        of <RouteLink routeID="granddaddy-peak">Granddaddy Peak</RouteLink>.
      </p>
      <p>
        The entrance is fairly straightforward, with no steep rollovers or trigger points.
        The runout at the bottom is a fairly large fan, so the consequences of an avalanche aren&apos;t extreme.
      </p>
      <p>
        The entire line is sort of an annoying double fall line: The first one or two people down
        will have great turns in the gut of the chute on the left side. But everyone
        after that, if they want fresh snow, will have awkward cross-the-fall-line
        turns as they stay on the right face of the chute.
      </p>
    </>
  ),
} as const satisfies GeoItem;
