import RouteLink from "@/components/app/route-link";
import { type GeoItem } from "@/lib/geo-item";

export const geoItem = {
  id: "taylor-pass",
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [-149.18040, 60.74861],
  },
  properties: {
    title: "Taylor Pass",
    feature_type: "peak",
    nicks_ates_ratings: ["non-avalanche"],
    children: [],
    area: "sunburst-area",
    elevation: 1203,
    figures: [],
  },
  proseJsx: (
    <>
      <p>
        This is the pass between <RouteLink routeID="sunburst-peak">Sunburst Peak</RouteLink> and <RouteLink routeID="basketball-peak">Basketball Peak</RouteLink>.
        It can be very windy here, and the snow is almost always wind scoured, often down to the ground.
      </p>
      <p>
        From here it&apos;s an easy (but often wind-scoured) skin up the ridge to the top of <RouteLink routeID="sunburst-peak">Sunburst</RouteLink>.
        A common lap is to skin up partway and then drop left (Northwest) down into the Taylor Creek valley, and then skin back up to the pass.
      </p>
      <p>
        To get back to your car at the <RouteLink routeID="sunburst-parking-lot">Sunburst parking lot</RouteLink>, you can ski the
        whole way without needing to put on skins. I <em>think</em> snowboarders can do this too without needing to hike, but I haven&apos;t tried it myself.
        If you have the energy, and conditions permit, instead of skiing straight down the pass and only getting low angle snow,
        I would recommend skinning up Sunburst and then skiing back to your car from there for a much more fall line and steeper run.
      </p>
    </>
  ),
} as const satisfies GeoItem;