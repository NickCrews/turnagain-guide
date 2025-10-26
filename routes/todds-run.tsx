import { type GeoItem } from "@/lib/geo-item";
import Link from "@/components/ui/link";

export const geoItem = {
  id: "todds-run",
  type: "Feature",
  geometry: {
    type: "LineString",
    coordinates: [
      [-149.146328, 60.783448, 1094.038228],
      [-149.146434, 60.783713, 1087.312337],
      [-149.146541, 60.783978, 1067.48473],
      [-149.146647, 60.784242, 1043.472802],
      [-149.146753, 60.784507, 1023.890392],
      [-149.14686, 60.784772, 999.255616],
      [-149.146966, 60.785037, 964.502864],
      [-149.147072, 60.785301, 946.008433],
      [-149.147179, 60.785566, 930.436],
      [-149.147285, 60.785831, 916.817289],
      [-149.147391, 60.786096, 902.657267],
      [-149.147498, 60.78636, 887.477632],
      [-149.147502, 60.786371, 886.972273],
      [-149.147502, 60.786371, 886.972273],
      [-149.147736, 60.786615, 862.595005],
      [-149.14797, 60.78686, 840.298944],
      [-149.148204, 60.787104, 825.602959],
      [-149.148438, 60.787349, 811.305658],
      [-149.148673, 60.787593, 796.368813],
      [-149.148907, 60.787837, 775.956698],
      [-149.149141, 60.788082, 766.149196],
      [-149.149375, 60.788326, 754.9942],
      [-149.149609, 60.788571, 741.9556],
      [-149.149616, 60.788578, 741.5776],
    ],
  },
  properties: {
    title: "Todd's Run",
    feature_type: "descent",
    thumbnail: "/img/eddies-spines-and-todds.jpg",
    nicks_ates_ratings: ["complex"],
    children: [],
    area: "tincan-area",
    elevation_max: 1094.038228,
    elevation_min: 741.5776,
    distance: 602.1098380632068,
    latitude: 60.78617260777243,
    longitude: -149.14772455265611,
    total_descent: 351.5772689999999,
    images: [],
  },
  proseJsx: (
    <>
      <p>
        This is the obvious, huge, steep NW facing bowl on the North side of
        Tincan ridge that you see as drive up the pass from Anchorage. It is
        named after
        <Link href="https://www.akmountain.com/2021/04/13/tincan-peak-north-ridge/">
          Todd Frankiewicz, who died in an avalanche on December 6th, 1988
        </Link>
        . It often avalanches naturally, and has a steep and committing entrance
        that makes it hard to enter safely. When it is safe though, it is an
        excellent steep run. You get here by skinning the main uptrack to the
        top, and then booting back along the ridge until you get to the dropin.
      </p>
    </>
  ),
} as const satisfies GeoItem;
