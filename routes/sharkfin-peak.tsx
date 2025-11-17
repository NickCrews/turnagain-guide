import RouteLink from "@/app/components/RouteLink";
import { wolverineOverview } from "@/imageRegistry/imagesWithPaths";
import { type GeoItem } from "@/lib/geo-item";

export const geoItem = {
  id: "sharksfin-peak",
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [-149.10128, 60.81000],
  },
  properties: {
    title: "Sharkfin Peak",
    feature_type: "peak",
    nicks_ates_ratings: ["challenging"],
    children: [],
    area: "sharkfin-area",
    elevation: 517,
    images: [wolverineOverview],
  },
  proseJsx: (
    <>
    <p>
      Sharksfin is the small, skinny, and long ridge to the North of Eddies.
      It isn&apos;t very popular because there is no easy trail to get there.
      The best way is to start at
      the <RouteLink routeID="eddies-parking-lot">Eddies Parking Lot</RouteLink> and
      start up the
      regular <RouteLink routeID="eddies-approach-and-uptrack">Eddies Uptrack</RouteLink> before
      at some point cutting left (North) over to Sharksfin.
    </p>
    <p>
      I haven&apos;t actually been there myself and I&apos;m not sure what the
      terrain and riding is like.
    </p>
    </>
  ),
} as const satisfies GeoItem;
