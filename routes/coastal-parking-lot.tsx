import RouteLink from "@/app/components/route-link";
import { type GeoItem } from "@/lib/geo-item";

export const geoItem = {
  id: "coastal-parking-lot",
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [-149.05293, 60.84438],
  },
  properties: {
    title: "Coastal Parking Lot",
    feature_type: "parking",
    nicks_ates_ratings: ["non-avalanche"],
    children: [],
    area: "wolverine-area",
    elevation: 19,
    images: [],
  },
  proseJsx: <>
    <p>
      This is the parking lot at the bottom of Turnagain Pass next to Turnagain Arm,
      just before the highway starts climbing up into the pass.
      This is also known as the "Ingram Creek Parking Lot" since that is where
      Ingram Creek (the main creek in Turnagain Pass) meets the Arm.
    </p>
    <p>
      There are very large pullouts on either side of the highway here.
      This is a popular spot for snowmachiners to park so they can ride back along
      the flat swamps of Turnagain Arm towards Placer/Portage.
    </p>
    <p>
      I have heard that people use this to access <RouteLink routeID="wolverine-peak">
        Wolverine Peak
      </RouteLink> by connecting through meadows. I haven't done this myself yet, if
      you have better info, please let me know!
    </p>
  </>,
} as const satisfies GeoItem;
