import RouteLink from "@/app/components/RouteLink";
import { type GeoItem } from "@/lib/geo-item";

export const geoItem = {
  id: "magnum-front-face",
  type: "Feature",
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [
          -149.21443902123178,
          60.7556491450604,
          0.0
        ],
        [
          -149.208755860257,
          60.755802780817845,
          0.0
        ],
        [
          -149.2051168401863,
          60.75745980543607,
          0.0
        ],
        [
          -149.2068015717005,
          60.76283631567583,
          0.0
        ],
        [
          -149.20794720896112,
          60.763714020368894,
          0.0
        ],
        [
          -149.2127093833747,
          60.76451491161589,
          0.0
        ],
        [
          -149.21434918871526,
          60.76486598092535,
          0.0
        ],
        [
          -149.2158766786216,
          60.764492969656146,
          0.0
        ],
        [
          -149.21962801412656,
          60.76489889347599,
          0.0
        ],
        [
          -149.2223685107232,
          60.765447431014735,
          0.0
        ],
        [
          -149.22340181271846,
          60.76463559212431,
          0.0
        ],
        [
          -149.2251539334933,
          60.76266076307604,
          0.0
        ],
        [
          -149.22360397329362,
          60.75767926697645,
          0.0
        ],
        [
          -149.2176287921898,
          60.75576985343119,
          0.0
        ],
        [
          -149.21443902123178,
          60.7556491450604,
          0.0
        ]
      ]
    ]
  },
  properties: {
    title: "Magnum Front Face",
    feature_type: "descent",
    thumbnail: "/img/magnum-front-face.jpg",
    area: "magnum-area",
    nicks_ates_ratings: ["complex"],
    children: [],
    elevation_min: 304,
    elevation_max: 914,
  },
  proseJsx: (
    <>
      <p>
        Early and late season this is an alder-covered hellscape.
        But come mid-season, once the alders are down, there is a lot of fun to be had here.
        There are also plenty of steeps and rollovers that can get windloaded,
        and avalanches are moderately common.
      </p>
      <p>
        On the looker&apos;s left side of this face is a ridge that people often skin
        up to access <RouteLink routeID="magnum-peak">Magnum Peak</RouteLink> when
        departing from the <RouteLink routeID="sunburst-parking-lot">Sunburst Parking Lot</RouteLink>.
        Start up the normal sunburst skin track, and then cut right (South) across
        Taylor Creek once you level out into the Taylor Creek hanging valley.
        It often requires a touch of bootpacking at the top where
        it is steepest and often wind-board.
      </p>
      <p>
        The terrain on this ridge slowly gets steeper the higher you go.
        This is nice, because you can skin as high as you are comfortable with,
        and then drop off the West side (straight towards the parking lot)
        when you reach your limit.
      </p>
    </>
  ),
} as const satisfies GeoItem;
