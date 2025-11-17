import RouteLink from "@/app/components/RouteLink";
import { type GeoItem } from "@/lib/geo-item";
import { bootingBasketball } from "@/imageRegistry/images";

export const geoItem = {
  id: "basketball-peak",
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [-149.18783, 60.74450],
  },
  properties: {
    title: "Basketball Peak",
    feature_type: "peak",
    nicks_ates_ratings: ["complex"],
    children: [],
    area: "goldpan-area",
    elevation: 1243,
    images: [bootingBasketball],
  },
  proseJsx: (
    <>
    <p>
      You can get here two ways. One is to go 
      up <RouteLink routeID="taylor-creek">Taylor Creek</RouteLink> to
      Taylor Pass, then turn right (South) and boot of the broad, windscoured
      ridge to the summit. There can be some avalanche hazard depending on how
      the snow has been blown around, but it usually is OK.
    </p>
    <p>
      The other way is to go up the Cornbiscuit-Lipps valley
      then ascend left (North) into the <RouteLink routeID="goldpan-area">Goldpan Cirque</RouteLink> and
      then skin and then boot up to the col between Superbowl and Basketball, then boot
      up the ridge to the summit.
    </p>
    <p>
      The most common descent from here is to drop Southwest into Goldpan.
      There are many options here of various steepness and exposure.
      The crux is often getting to your line past cornice that develops along the
      Basketball-Goldpan ridgeline.
    </p>
    <p>
      It is possible to ski down the Northwest face, but this is
      usually windblown and bad skiing. Though this is the fastest way back to your car.
    </p>
    </>
  ),
} as const satisfies GeoItem;
