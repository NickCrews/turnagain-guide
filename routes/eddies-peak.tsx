import RouteLink from "@/app/components/RouteLink";
import { eddiesOverview } from "@/imageRegistry/imagesWithPaths";
import { type GeoItem } from "@/lib/geo-item";

export const geoItem = {
  id: "eddies-peak",
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [-149.11658, 60.79682],
  },
  properties: {
    title: "Eddies Peak",
    feature_type: "peak",
    nicks_ates_ratings: ["complex"],
    children: [],
    area: "eddies-area",
    elevation: 902,
    images: [eddiesOverview],
  },
  proseJsx: (
    <>
    <p>
      The Eddies ridge is extrememly long and rises very gradually, so techinically
      there are parts of the ridge further back that are higher in elevation.
      However, this is the most prominent point on the ridge and what most people
      would consider the &quot;peak.&quot;
    </p>
    <p>
      To get here, continue up the <RouteLink routeID="eddies-approach-and-uptrack">Eddies Uptrack</RouteLink> and
      skin or boot up the final headwall.
    </p>
    <p>
      You can either ride back down the front face, or continue along the ridge if you
      want to access the endless spines along the south face of the Eddies ridgeline.
    </p>
    </>
  ),
} as const satisfies GeoItem;
