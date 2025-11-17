import Figure from "@/app/components/Figure";
import ImgSharkfinWolverine from "@/public/img/sharkfin-wolverine-overview.jpg";
import { type GeoItem } from "@/lib/geo-item";
import { wolverineOverview } from "@/imageRegistry/imagesWithPaths";

export const geoItem = {
  id: "sharkfin-area",
  type: "Feature",
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [-149.1185924552675, 60.81643363758212, 0],
        [-149.10785565732772, 60.819252554580714, 0],
        [-149.09152104165872, 60.80864676710516, 0],
        [-149.07793945110234, 60.7993806085378, 0],
        [-149.0671108856588, 60.792126961428494, 0],
        [-149.06325665050093, 60.78885780570255, 0],
        [-149.05560935681987, 60.77972036816092, 0],
        [-149.05515051930092, 60.77398570942927, 0],
        [-149.05909652196272, 60.7696840420123, 0],
        [-149.06386843215813, 60.76614369524734, 0],
        [-149.07093452994758, 60.77111799528555, 0],
        [-149.07790886023326, 60.78196019056111, 0],
        [-149.10819209779487, 60.8036335868386, 0],
        [-149.11938773325343, 60.812809011278176, 0],
        [-149.1185924552675, 60.81643363758212, 0],
      ],
    ],
  },
  properties: {
    title: "Sharkfin Area",
    feature_type: "area",
    nicks_ates_ratings: [],
    children: [],
    images: [wolverineOverview],
  },
  proseJsx: (
    <>
      <p>
        Sharkfin and Wolverine are difficult to access, seldom visited areas. I
        won&apos;t bother writing about them much because I&apos;ve never been there, so I
        don&apos;t have much to add.
      </p>

      <Figure
        src={ImgSharkfinWolverine}
        caption={<>Sharkfin (close) and Wolverine (far) from near Eddies.</>}
      />
    </>
  ),
} as const satisfies GeoItem;
