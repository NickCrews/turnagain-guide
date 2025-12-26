import Figure from "@/app/components/figure";
import { type GeoItem } from "@/lib/geo-item";
import { wolverineOverview } from "@/imageRegistry/images";

const images = [wolverineOverview];

export const geoItem = {
  id: "wolverine-area",
  type: "Feature",
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [-149.09395941840177, 60.81547760344458, 0],
        [-149.0899684072359, 60.808603362682305, 0],
        [-149.07192992856108, 60.79605324986531, 0],
        [-149.06258926413017, 60.78838745463409, 0],
        [-149.0587838880215, 60.78408876959995, 0],
        [-149.055615101399, 60.78010837022424, 0],
        [-149.04936202913078, 60.78188208075741, 0],
        [-149.04539048323073, 60.79608884606395, 0],
        [-149.0423794696797, 60.80342725531318, 0],
        [-149.038473373645, 60.81386395655801, 0],
        [-149.0484933591254, 60.82135805905392, 0],
        [-149.06111255367694, 60.82665341358543, 0],
        [-149.074953720061, 60.8273570729161, 0],
        [-149.08658709303393, 60.82234833712175, 0],
        [-149.09395941840177, 60.81547760344458, 0],
      ],
    ],
  },
  properties: {
    title: "Wolverine Area",
    feature_type: "area",
    nicks_ates_ratings: [],
    children: [],
    images,
  },
  proseJsx: (
    <>
      <p>
        Sharkfin and Wolverine are difficult to access, seldom visited areas. I
        won&apos;t bother writing about them much because I&apos;ve never been there, so I
        don&apos;t have much to add.
      </p>

      <Figure
        image={wolverineOverview}
        images={images}
      />
    </>
  ),
} as const satisfies GeoItem;
