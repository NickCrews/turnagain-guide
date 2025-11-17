import { tincanOverview } from "@/imageRegistry/images";
import { type GeoItem } from "@/lib/geo-item";

export const geoItem = {
  id: "tincan-common-bowl",
  type: "Feature",
  geometry: {
    type: "LineString",
    coordinates: [
      [-149.1575, 60.786466, 958.7224],
      [-149.158052, 60.786477, 946.36308],
      [-149.158605, 60.786488, 923.112099],
      [-149.159157, 60.7865, 906.25056],
      [-149.159709, 60.786511, 898.211325],
      [-149.160262, 60.786522, 881.636819],
      [-149.160814, 60.786533, 860.210692],
      [-149.161366, 60.786544, 839.8672],
      [-149.161918, 60.786556, 829.713928],
      [-149.162471, 60.786567, 822.0792],
      [-149.163023, 60.786578, 817.46878],
      [-149.163078, 60.786579, 816.9136],
    ],
  },
  properties: {
    title: "Tincan Common Bowl",
    feature_type: "descent",
    area: "tincan-area",
    distance: 302.9814467472608,
    elevation_max: 958.7224,
    elevation_min: 816.9136,
    latitude: 60.78652255609131,
    longitude: -149.16028899891472,
    total_descent: 141.25361999999996,
    nicks_ates_ratings: ["challenging"],
    children: [],
    images: [tincanOverview],
  },
  proseJsx: (
    <>
      <p>
        This is the main, W facing bowl from the summit that faces straight at
        the parking lot. You can skin straight to the top on the main uptrack,
        and it is easy to do laps on this 600 foot run.
      </p>
    </>
  ),
} as const satisfies GeoItem;