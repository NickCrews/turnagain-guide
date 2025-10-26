import { type GeoItem } from "@/lib/geo-item";

export const geoItem = {
  id: "wolverine-peak",
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [-149.06049, 60.78220],
  },
  properties: {
    title: "Wolverine Peak",
    feature_type: "peak",
    thumbnail: "",
    nicks_ates_ratings: ["extreme"],
    children: [],
    area: "wolverine-area",
    elevation: 1203,
    images: [],
  },
  proseJsx: (
    <>
    <p>
      This is a beautiful spined hulk that makes you say &quot;wow&quot; when you&apos;re standing
      at the top of Tincan Common, eating your cheese and crackers, looking back towards the arm.
      This is quite difficult to access, and has a lot of serious terrain.
    </p>
    <p>
      Sometimes this is referred to as &quot;Flying Cornice&quot;.
    </p>
    <p>
      I have never been up there and don&apos;t have good information about it yet.
    </p>
    </>
  ),
} as const satisfies GeoItem;