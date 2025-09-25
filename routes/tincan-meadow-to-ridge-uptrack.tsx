import { type GeoItem } from "@/lib/geo-item";
import RouteLink from "@/app/components/RouteLink";

export const geoItem = {
  id: "tincan-meadow-to-ridge-uptrack",
  type: "Feature",
  geometry: {
    type: "LineString",
    coordinates: [
      [-149.180055, 60.793271, 448.471938],
      [-149.18043, 60.793073, 455.169784],
      [-149.180805, 60.792875, 452.6069],
      [-149.18118, 60.792676, 452.870733],
      [-149.181555, 60.792478, 456],
      [-149.181667, 60.792419, 455.9981],
      [-149.181667, 60.792419, 455.9981],
      [-149.181706, 60.79215, 455.089728],
      [-149.181744, 60.791894, 456.449455],
      [-149.181744, 60.791894, 456.449455],
      [-149.182126, 60.791699, 467.148884],
      [-149.182508, 60.791504, 478.918057],
      [-149.18289, 60.791309, 482.390171],
      [-149.183272, 60.791114, 481.757185],
      [-149.183654, 60.790919, 485.485183],
      [-149.183778, 60.790855, 487.329138],
      [-149.183778, 60.790855, 487.329138],
      [-149.184092, 60.790633, 495.555483],
      [-149.184406, 60.790411, 504.438023],
      [-149.18472, 60.790189, 510.6232],
      [-149.185034, 60.789967, 512.707836],
      [-149.185313, 60.789769, 507.946553],
    ],
  },
  properties: {
    title: "Tincan Meadow to Ridge Uptrack",
    feature_type: "ascent",
    thumbnail: "/img/tincan-overview.jpg",
    nicks_ates_ratings: ["simple"],
    children: [],
    area: "tincan-area",
    elevation_max: 512.707836,
    elevation_min: 448.471938,
    distance: 493.94458674679794,
    latitude: 60.79154314295677,
    longitude: -149.18265845134732,
  },
  proseJsx: (
    <>
      <p>
        If you ski the Western part of{" "}
        <RouteLink routeID="tincan-trees">Tincan Trees</RouteLink>, you end up
        downhill of the{" "}
        <RouteLink routeID="tincan-trees-uptrack">
          Tincan Trees Uptrack
        </RouteLink>
        , so if you want to get back uphill, this is the easiest way to do it.
        This drops you off back on the main{" "}
        <RouteLink routeID="tincan-uptrack">Tincan Uptrack</RouteLink> after a
        few hundred vertical feet through a tight meadow through dense woods. On
        the highest avy danger storm days, there is one tight gully that you may
        need to skin around, but 98% of the time there is nothing to worry
        about.
      </p>
    </>
  ),
} as const satisfies GeoItem;
