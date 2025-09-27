import Link from "@/components/ui/link";
import { type GeoItem } from "@/lib/geo-item";

export const geoItem = {
  id: "kickstep-peak",
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [-149.09664, 60.75283],
  },
  properties: {
    title: "Kickstep Peak",
    feature_type: "peak",
    thumbnail: "/img/kickstep-from-road.jpg",
    // also include somewhere: /img/kickstep-from-bascketball.jpg
    nicks_ates_ratings: ["extreme"],
    children: [],
    area: "tincan-area",
    elevation: 1417,
  },
  proseJsx: (
    <>
    <p>
      A big beautiful, and serious peak that lurks at the back of the Tincan ridge.
      Approach up the Center Ridge Drainage.
    </p>
    <p>
      Great photos and trip reports can be found on <Link href="https://www.mikerecords.com/2015/01/kickstep-1252015.html">Mike Record&apos;s Blog</Link>.
    </p>
    </>
  ),
} as const satisfies GeoItem;
