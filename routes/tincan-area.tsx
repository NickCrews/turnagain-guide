import Figure from "@/app/components/figure";
import { type GeoItem } from "@/lib/geo-item";
import { tincanOverview } from "@/imageRegistry/images";

const images = [tincanOverview];

export const geoItem = {
  id: "tincan-area",
  type: "Feature",
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [-149.21838004242863, 60.77967527190236, 0],
        [-149.21898660182484, 60.782325927471874, 0],
        [-149.20021694532034, 60.79585785971523, 0],
        [-149.15994745641729, 60.80651282711548, 0],
        [-149.1522689605746, 60.80147712844402, 0],
        [-149.14373729852704, 60.797522925660076, 0],
        [-149.12872157332356, 60.79011268371431, 0],
        [-149.11711851293893, 60.78066005619729, 0],
        [-149.09882100616238, 60.76896259552896, 0],
        [-149.0812530080891, 60.76019606421187, 0],
        [-149.07041779728885, 60.75652851916428, 0],
        [-149.0834712402215, 60.74831669920525, 0],
        [-149.08475098952857, 60.74443932288045, 0],
        [-149.09140568592562, 60.73889344373336, 0],
        [-149.09498898398553, 60.73576564573179, 0],
        [-149.11094312136277, 60.738976890635826, 0],
        [-149.1268120127711, 60.750276098393044, 0],
        [-149.14144221459833, 60.75983265078216, 0],
        [-149.1594440215186, 60.765958252223214, 0],
        [-149.17309468079452, 60.77204102486877, 0],
        [-149.18000532705298, 60.773457395306764, 0],
        [-149.193485353088, 60.77404058847455, 0],
        [-149.20542205715262, 60.77554087860159, 0],
        [-149.2122473867906, 60.77554087860159, 0],
        [-149.21838004242863, 60.77967527190236, 0],
      ],
    ],
  },
  properties: {
    title: "Tincan Area",
    feature_type: "area",
    nicks_ates_ratings: [],
    children: [],
    images,
  },
  proseJsx: (
    <>
      <p>
        Tincan is the most popular area in Turnagain Pass, and one of the most
        popular areas in all of Alaska. There is a wide selection of terrain
        available, from low-angle trees to steep spines, all with zero approach.
      </p>

      <Figure
        image={tincanOverview}
        images={images}
      />
    </>
  ),
} as const satisfies GeoItem;
