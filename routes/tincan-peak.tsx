import RouteLink from "@/app/components/RouteLink";
import { type GeoItem } from "@/lib/geo-item";

export const geoItem = {
  id: "tincan-peak",
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [-149.09588, 60.73843],
  },
  properties: {
    title: "Tincan Peak",
    feature_type: "peak",
    thumbnail: "",
    nicks_ates_ratings: [],
    children: [],
    area: "tincan-area",
    elevation: 1328,
  },
  proseJsx: (
    <>
    <p>
      This is the huge mountain in the far back wall of the Tincan Creek/Center Ridge
      drainage. It's to the looker&#39;s right of Kickstep Peak,
      and not actually even connected with the Tincan ridge.
      This is not to confused with
      either <RouteLink routeID="tincan-common">Tincan Common</RouteLink> or <RouteLink routeID="tincan-proper">Tincan Proper</RouteLink>,
      which are much closer to road and along the Tincan ridge, and
      usually what people mean when they say "Tincan Peak".
    </p>
    </>
  ),
} as const satisfies GeoItem;