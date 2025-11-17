import RouteLink from "@/app/components/RouteLink";
import { sunburstAndMagnum } from "@/imageRegistry/imagesWithPaths";
import { type GeoItem } from "@/lib/geo-item";

export const geoItem = {
  id: "sunburst-south-face",
  type: "Feature",
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [
          -149.19660525126721,
          60.766802989218945,
          0.0
        ],
        [
          -149.20146305247152,
          60.764350093918694,
          0.0
        ],
        [
          -149.1938881760174,
          60.76051623150158,
          0.0
        ],
        [
          -149.19084175831287,
          60.75826395877195,
          0.0
        ],
        [
          -149.1870854290876,
          60.7533459502271,
          0.0
        ],
        [
          -149.17816573761073,
          60.753560492093925,
          0.0
        ],
        [
          -149.17720515545167,
          60.75491475451591,
          0.0
        ],
        [
          -149.17896164854244,
          60.75683207780153,
          0.0
        ],
        [
          -149.1792439944067,
          60.759094643799756,
          0.0
        ],
        [
          -149.18135727515647,
          60.760086710107714,
          0.0
        ],
        [
          -149.18349800111093,
          60.76256674163605,
          0.0
        ],
        [
          -149.18931638447447,
          60.76404126406601,
          0.0
        ],
        [
          -149.19660525126721,
          60.766802989218945,
          0.0
        ]
      ]
    ]
  },
  properties: {
    title: "Sunburst South Face",
    area: "sunburst-area",
    feature_type: "descent",
    nicks_ates_ratings: ["challenging", "complex"],
    children: [],
    elevation_min: 624,
    elevation_max: 1156,
    images: [sunburstAndMagnum],
  },
  proseJsx: <>
    <p>
      I think this might be one of the most type-1 fun faces in Turnagain.
      It&apos;s quite fast to lap this using
      the <RouteLink routeID="sunburst-ridge-uptrack">Sunburst Ridge Uptrack</RouteLink>.
    </p>
    <p>
      The whole thing is pretty skiable, which means you almost always are going to
      be able to find fresh tracks.
      There are many gentle gullys and ribs along the whole face.
      Depending on the wind and the sun aspect, some parts can be better than
      others on any given day. Pay attention to that as you skin up.
    </p>
    <p>
      This has moderate avalanche danger.
      It&apos;s easy to avoid any rock bands and sharp rollovers that would act as trigger points.
      But, the whole face is still fairly steep.
      Luckily, the popularity of the area means that you often will have some tests of stability from other people.
      Of course, this depends on the flavor of the avalanche hazard.
      For storm slabs and other surface instabilities, these tests runs
      are more meaningful, whereas for deep persistent slabs they are almost meaningless.
      The runout is fairly forgiving, but the huge size of the terrain means that
      if something does go, it can be huge.
      There have been fatalities here.
    </p>
    <p>
      You will probably be sharing this area with many other riders.
      It can be easy to accidentally ride down on top of someone else mid-slope,
      which is breaking the golden rule of only
      exposing one person to avalanche danger at a time.
    </p>
  </>,
} as const satisfies GeoItem;
