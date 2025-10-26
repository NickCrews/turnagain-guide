import { type GeoItem } from "@/lib/geo-item";

export const geoItem = {
  id: "motorized-parking-lot",
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [-149.21316, 60.78755],
  },
  properties: {
    title: "Motorized Parking Lot",
    feature_type: "parking",
    thumbnail: "/img/seattle-ridge-overview.jpg",
    elevation: 279,
    nicks_ates_ratings: ["non-avalanche"],
    children: [],
    images: [],
  },
  proseJsx: (
    <>
      <p>
        This is the location of the only pit toilet in the area, as well as an
        emergency phone. There aren&apos;t any routes that start from here.
      </p>
    </>
  ),
} as const satisfies GeoItem;
