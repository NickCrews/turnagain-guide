import { lippsOverview } from "@/imageRegistry/imagesWithPaths";
import { type GeoItem } from "@/lib/geo-item";

export const geoItem = {
  id: "lipps-parking-lot",
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [-149.25315, 60.74884],
  },
  properties: {
    title: "Lipps Parking Lot",
    feature_type: "parking",
    area: "lipps-area",
    elevation: 237,
    nicks_ates_ratings: ["non-avalanche"],
    children: [],
    images: [lippsOverview],
  },
  proseJsx: <>
    <p>
      This is a pretty small pulloff on the West side of the highway.
      There is only room for maybe 5 cars.
      Depending on if the Johnson Pass lot is plowed or not (it wasn&apos;t
      the entirety of the 24/25 winter), this is also the parking
      lot for the snowmachiners going to Johnson Pass,
      who often park with their trailers.
      Try to park respectfully that leaves room for others,
      including vehicles with trailers.
    </p>
    <p>
      To get to Lipps, cross the road and turn left (South)
      and walk along the highway shoulder for 300 m until you can head left (East)
      up a drainage that provides a break in the trees.
      This can be filled with alders in early and late season.
      At this South end of the pass you are starting a few hundred feet lower
      than at the summit near tincan, so there can often be a large difference in
      snow conditions and alder coverage.
    </p>
  </>,
} as const satisfies GeoItem;
