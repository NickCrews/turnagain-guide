import { type GeoItem } from "@/lib/geo-item";
import RouteLink from "@/app/components/RouteLink";

export const geoItem = {
  id: "superbowl",
  type: "Feature",
  geometry: {
    type: "LineString",
    coordinates: [
      [
        -149.193328,
        60.746503,
        1159.0,
        0.0
      ],
      [
        -149.19388,
        60.74651,
        1143.199951171875,
        0.0
      ],
      [
        -149.194432,
        60.746516,
        1121.800048828125,
        0.0
      ],
      [
        -149.194984,
        60.746523,
        1102.0,
        0.0
      ],
      [
        -149.195536,
        60.74653,
        1082.4000244140625,
        0.0
      ],
      [
        -149.196088,
        60.746537,
        1061.0,
        0.0
      ],
      [
        -149.19664,
        60.746543,
        1047.800048828125,
        0.0
      ],
      [
        -149.196691,
        60.746544,
        1045.800048828125,
        0.0
      ],
      [
        -149.196691,
        60.746544,
        1045.800048828125,
        0.0
      ],
      [
        -149.197219,
        60.746623,
        1033.199951171875,
        0.0
      ],
      [
        -149.197747,
        60.746702,
        1019.0,
        0.0
      ],
      [
        -149.198275,
        60.746781,
        1003.5999755859375,
        0.0
      ],
      [
        -149.198802,
        60.74686,
        985.7999877929688,
        0.0
      ],
      [
        -149.198981,
        60.746887,
        980.7999877929688,
        0.0
      ],
      [
        -149.198981,
        60.746887,
        980.7999877929688,
        0.0
      ],
      [
        -149.199481,
        60.747001,
        968.0,
        0.0
      ],
      [
        -149.199981,
        60.747115,
        953.4000244140625,
        0.0
      ],
      [
        -149.200482,
        60.747229,
        939.0,
        0.0
      ],
      [
        -149.200982,
        60.747344,
        925.4000244140625,
        0.0
      ],
      [
        -149.20101,
        60.74735,
        925.4000244140625,
        0.0
      ],
      [
        -149.20101,
        60.74735,
        925.4000244140625,
        0.0
      ],
      [
        -149.201431,
        60.747525,
        914.4000244140625,
        0.0
      ],
      [
        -149.201851,
        60.747699,
        905.0,
        0.0
      ],
      [
        -149.202272,
        60.747874,
        897.0,
        0.0
      ],
      [
        -149.202693,
        60.748049,
        890.4000244140625,
        0.0
      ],
      [
        -149.202953,
        60.748157,
        887.0,
        0.0
      ],
      [
        -149.202953,
        60.748157,
        887.0,
        0.0
      ],
      [
        -149.203375,
        60.748331,
        881.2000122070312,
        0.0
      ],
      [
        -149.203796,
        60.748505,
        874.7999877929688,
        0.0
      ],
      [
        -149.204218,
        60.748679,
        867.4000244140625,
        0.0
      ],
      [
        -149.204372,
        60.748743,
        866.0,
        0.0
      ],
      [
        -149.204372,
        60.748743,
        866.0,
        0.0
      ],
      [
        -149.204802,
        60.748913,
        858.7999877929688,
        0.0
      ],
      [
        -149.205231,
        60.749082,
        850.7999877929688,
        0.0
      ],
      [
        -149.205661,
        60.749252,
        842.2000122070312,
        0.0
      ],
      [
        -149.20573,
        60.749279,
        840.4000244140625,
        0.0
      ],
      [
        -149.20573,
        60.749279,
        840.4000244140625,
        0.0
      ],
      [
        -149.206281,
        60.749296,
        828.5999755859375,
        0.0
      ],
      [
        -149.206832,
        60.749313,
        818.0,
        0.0
      ],
      [
        -149.207383,
        60.74933,
        805.4000244140625,
        0.0
      ],
      [
        -149.207934,
        60.749347,
        794.4000244140625,
        0.0
      ],
      [
        -149.208293,
        60.749358,
        786.5999755859375,
        0.0
      ]
    ]
  },
  properties: {
    title: "Super Bowl",
    feature_type: "descent",
    thumbnail: "/img/superbowl-from-cornbiscuit.jpg",
    nicks_ates_ratings: ["complex"],
    children: [],
    area: "cornbiscuit-area",
    elevation_min: 787,
    elevation_max: 1159,
    distance: 908.5127762655005,
    total_descent: 367.20001220703125,
    latitude: 60.74769225814426,
    longitude: -149.20086496948142,
    images: [],
  },
  proseJsx: (
    <>
      <p>
        This is commonly used as a final run of the day when exiting from
        the <RouteLink routeID="goldpan-area">Goldpan Area</RouteLink> back to the
        parking lot.
      </p>
      <p>
        The entry is a little steep, but it isn&apos;t usually too wind-loaded,
        there aren&apos;t any significant rollovers to act as trigger points,
        and the runout is a forgiving wide apron.
        Usually if I have been comfortable skiing in Goldpan,
        I am comfortable skiing Superbowl.
      </p>
      <p>
        From the bottom, you can get easily get back to the
        <RouteLink routeID="cornbiscuit-parking-lot">Cornbiscuit Parking Lot</RouteLink> or the
        by sidehilling left along the flank of Cornbiscuit until you rejoin
        the <RouteLink routeID="cornbiscuit-uptrack">Cornbiscuit Uptrack</RouteLink>.
      </p>
      <p>
        It also is possible to get back to
        the <RouteLink routeID="sunburst-parking-lot">Sunburst Parking Lot</RouteLink>
        if that is where you parked, although this is a bit more of a pain.
        You should sidehill right along the flank of Magnum
        until you reach the <RouteLink routeID="magnum-front-face">Magnum Front Face</RouteLink>,
        where you can descend to the car.
        This requires some significant sidestepping on skis or a short skin.
      </p>
    </>
  ),
} as const satisfies GeoItem;
