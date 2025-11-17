import { magnumAndCornbisbuit } from "@/imageRegistry/imagesWithPaths";
import { type GeoItem } from "@/lib/geo-item";

export const geoItem = {
  id: "cornbiscuit-area",
  type: "Feature",
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [-149.2435352641622, 60.75614568431928, 0],
        [-149.2314113337968, 60.75623751171082, 0],
        [-149.20495485009235, 60.74863790590297, 0],
        [-149.19527450259122, 60.74602010224183, 0],
        [-149.19997370040738, 60.744320711878885, 0],
        [-149.1996447565602, 60.740485270503626, 0],
        [-149.20321614690042, 60.736993931420585, 0],
        [-149.20589468965554, 60.736327777540424, 0],
        [-149.2222478980555, 60.743241322624584, 0],
        [-149.23465378028985, 60.747420883394454, 0],
        [-149.23869509041162, 60.750130417663286, 0],
        [-149.24569689515766, 60.75488303102722, 0],
        [-149.2435352641622, 60.75614568431928, 0],
      ],
    ],
  },
  properties: {
    title: "Cornbiscuit Area",
    feature_type: "area",
    nicks_ates_ratings: [],
    children: [],
    images: [magnumAndCornbisbuit],
  },
  proseJsx: <>{/* Add content here */}</>,
} as const satisfies GeoItem;
