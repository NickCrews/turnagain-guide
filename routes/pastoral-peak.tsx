import RouteLink from "@/app/components/RouteLink";
import { type GeoItem } from "@/lib/geo-item";

export const geoItem = {
  id: "pastoral-peak",
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [-149.17236, 60.73304],
  },
  properties: {
    title: "Pastoral Peak",
    feature_type: "peak",
    thumbnail: "",
    nicks_ates_ratings: ["complex"],
    children: [],
    area: "pastoral-area",
    elevation: 1417,
    images: [],
  },
  proseJsx: (
    <>
    <p>
      This is one of the highest peaks in the area, and a great viewpoint.
      It&apos;s a long tour, and the ratio of effort to skiing isn&apos;t as good
      as some alternatives, but the views and the adventure make it worth it.
    </p>
    <p>
      The most common approach is to park at
      the <RouteLink routeID="sunburst-parking-lot">Sunburst Parking Lot</RouteLink> and
      tour up the Taylor Creek drainage up to Taylor Pass, then continue
      along the <RouteLink routeID="taylor-pass-to-pastoral-peak">north bowl
      and up to the peak</RouteLink>.
    </p>
    </>
  ),
} as const satisfies GeoItem;
