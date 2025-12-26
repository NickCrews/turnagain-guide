import Figure from "@/app/components/figure";
import Link from "@/components/ui/link";
import RouteLink from "@/app/components/route-link";
import { type GeoItem } from "@/lib/geo-item";
import { eddiesOverview } from "@/imageRegistry/images";

const images = [eddiesOverview];

export const geoItem = {
  id: "eddies-front-face",
  type: "Feature",
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [-149.12837887856318, 60.80028884850819, 0],
        [-149.1289275957329, 60.803862371421786, 0],
        [-149.1295860563366, 60.805615527085365, 0],
        [-149.1323570780439, 60.806016999605276, 0],
        [-149.1334270765249, 60.806391702748215, 0],
        [-149.13452451086437, 60.806619198945185, 0],
        [-149.13776194216607, 60.8045850579058, 0],
        [-149.13869476135454, 60.803166435685455, 0],
        [-149.13773450630762, 60.80154698820698, 0],
        [-149.13735040428872, 60.80051638807285, 0],
        [-149.1336739992514, 60.800342387374684, 0],
        [-149.12837887856318, 60.80028884850819, 0],
      ],
    ],
  },
  properties: {
    title: "Eddie's Front Face",
    feature_type: "descent",
    area: "eddies-area",
    nicks_ates_ratings: ["challenging"],
    children: [],
    images,
  },
  proseJsx: (
    <>
      <p>
        The <RouteLink routeID="eddies-approach-and-uptrack">skin track</RouteLink> goes up the looker&apos;s left side of the face, skirting
        right next to and sometimes weaving into the trees. This provides a
      </p>

      <p>
        When skiing back down, the lowest angles are on the lookers left side,
        near the skin track. You can get down here without exposing yourself to
        avalanche terrain, and this is a great place to go on a high danger day.
      </p>

      <p>
        The steeper lines are on the lookers right side. They aren&apos;t super large
        or connected, but the individual rollovers can be steep, and{" "}
        <Link href="https://www.cnfaic.org/observations/#/view/observations/04c54368-a34b-4ffd-a230-4294de7bf6d1">
          can have significant avalanches
        </Link>
        .
      </p>

      <Figure
        image={eddiesOverview}
        images={images}
      />
    </>
  ),
} as const satisfies GeoItem;