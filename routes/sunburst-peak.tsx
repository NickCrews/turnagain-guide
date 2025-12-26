import RouteLink from "@/app/components/route-link";
import Link from "@/components/ui/link";
import { type GeoItem } from "@/lib/geo-item";

export const geoItem = {
  id: "sunburst-peak",
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [-149.17848, 60.75819],
  },
  properties: {
    title: "Sunburst Peak",
    feature_type: "peak",
    nicks_ates_ratings: ["challenging"],
    children: [],
    area: "sunburst-area",
    elevation: 1156,
    images: [],
  },
  proseJsx: (
    <>
      <p>
        A friendly a popular peak with tons of long, steep-but-not-too-steep runs
        all along the South side.
      </p>
      <p>
        You can access this peak from the regular <RouteLink routeID="sunburst-parking-lot">Sunburst Parking Lot</RouteLink>
      </p>
      <p>
        CNFAIC maintains
        a <Link href="https://www.cnfaic.org/wx/wx_site.php?site=sunburst">
          weather station and webcam on the summit
        </Link>.
      </p>
    </>
  ),
} as const satisfies GeoItem;
