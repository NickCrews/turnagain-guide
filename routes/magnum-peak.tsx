import RouteLink from "@/app/components/route-link";
import { magnumCenter, sunburstAndMagnum } from "@/imageRegistry/images";
import { type GeoItem } from "@/lib/geo-item";

export const geoItem = {
  id: "magnum-peak",
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [-149.20052, 60.75259],
  },
  properties: {
    title: "Magnum \"Peak\"",
    feature_type: "peak",
    nicks_ates_ratings: ["challenging"],
    children: [],
    area: "magnum-area",
    elevation: 1139,
    latitude: 60.781914,
    longitude: -149.141816,
    images: [magnumCenter, sunburstAndMagnum],
  },
  proseJsx: (
    <>
      <p>
        This isn&apos;t truly a peak, but is the logical high point for riding down.
      </p>
      <p>
        You can have a mellow ski back down the ridge to the top
        of <RouteLink routeID="pms-bowl-uptrack">PMS Bowl</RouteLink>,
        or drop Southwest onto the steeper Southwest Face.
      </p>
      <p>
        The skiing off the North side of the ridge is usually wind scoured and not good.
      </p>
    </>
  ),
} as const satisfies GeoItem;
