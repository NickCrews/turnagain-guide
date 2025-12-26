import Figure from "@/app/components/figure";
import { librariesLeftSide, librariesOverview, librariesRidge } from "@/imageRegistry/images";
import { type GeoItem } from "@/lib/geo-item";

const images = [librariesRidge, librariesLeftSide, librariesOverview];

export const geoItem = {
  id: "the-libraries",
  type: "Feature",
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [-149.145705, 60.783189, 0],
        [-149.157121, 60.77849, 0],
        [-149.132027, 60.77081, 0],
        [-149.116032, 60.760792, 0],
        [-149.104038, 60.757451, 0],
        [-149.098146, 60.755164, 0],
        [-149.094516, 60.755652, 0],
        [-149.099829, 60.759533, 0],
        [-149.105984, 60.762591, 0],
        [-149.11256, 60.764852, 0],
        [-149.117821, 60.766933, 0],
        [-149.120925, 60.770068, 0],
        [-149.125134, 60.772559, 0],
        [-149.12934, 60.774924, 0],
        [-149.136494, 60.778134, 0],
        [-149.141597, 60.781858, 0],
        [-149.145705, 60.783189, 0],
      ],
    ],
  },
  properties: {
    title: "The Libraries",
    feature_type: "descent",
    nicks_ates_ratings: ["complex", "extreme"],
    children: [],
    area: "tincan-area",
    images,
  },
  proseJsx: (
    <>
      <p>
        So you saw Cody Townsend in some ski movie and now you want to ski some
        spines, huh? These are probably the best and most easily accessible
        spines in Alaska, and maybe North America? This area is named because
        all the spine lines are stacked like books on a shelf.
      </p>

      <Figure
        image={librariesOverview}
        images={images}
      />

      <p>
        All of these require bootpacking, but some of them are possible to skin
        up 3/4 of the way. Most of them have great runouts on wide aprons, which
        makes the consequences of an avalanche much less severe. They are all
        South facing. In midwinter, the sun doesn&apos;t have a huge effect except on
        the warmest days. In the springtime though, you need to take the solar
        aspect into account, which usually means going early.
      </p>

      <p>
        In some places, it is possible to boot along the ridge to move between
        lines, but often it is not.
      </p>

      <Figure
        image={librariesLeftSide}
        images={images}
      />
    </>
  ),
} as const satisfies GeoItem;
