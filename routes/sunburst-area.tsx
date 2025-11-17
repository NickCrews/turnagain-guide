import RouteLink from "@/app/components/RouteLink";
import { sunburstAndMagnum } from "@/imageRegistry/imagesWithPaths";
import { type GeoItem } from "@/lib/geo-item";

export const geoItem = {
  id: "sunburst-area",
  type: "Feature",
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [-149.23154812066895, 60.766624268989744, 0],
        [-149.22628414483881, 60.76576013710931, 0],
        [-149.22035664264365, 60.765544100500335, 0],
        [-149.21389831935625, 60.76539287400817, 0],
        [-149.20376848351498, 60.76375094047347, 0],
        [-149.19571769695128, 60.760056282630586, 0],
        [-149.18856367190176, 60.752909383251165, 0],
        [-149.18785591019096, 60.75098953644439, 0],
        [-149.18020323944643, 60.748114807049234, 0],
        [-149.17794725005947, 60.75022935290855, 0],
        [-149.17564702532692, 60.75461670519809, 0],
        [-149.17701831314824, 60.75867933382585, 0],
        [-149.18051288533792, 60.76222290884235, 0],
        [-149.1855556857131, 60.76395133995575, 0],
        [-149.19523111095012, 60.767229147450166, 0],
        [-149.19810639186568, 60.7692813286242, 0],
        [-149.1994809409758, 60.77131188508872, 0],
        [-149.20416986062276, 60.77072868389561, 0],
        [-149.20951904534627, 60.76884930139758, 0],
        [-149.21832182845714, 60.76846047191643, 0],
        [-149.2299998924836, 60.768611683941685, 0],
        [-149.23154812066895, 60.766624268989744, 0],
      ],
    ],
  },
  properties: {
    title: "Sunburst Area",
    feature_type: "area",
    nicks_ates_ratings: [],
    children: [],
    images: [sunburstAndMagnum],
  },
  proseJsx: <>
    <p>
      Sunburst is one of the most popular areas in Turnagain, and for good reason:
      Short approach, huge expanses of long and consistent lines all along the
      South face of Sunburst, and reasonably safe terrain.
    </p>
    <p>
      If you are trying to keep it chill, the lower alder meadows all along the base
      of Sunburst (and <RouteLink routeID="magnum-area">Magnum</RouteLink>,
      <RouteLink routeID="cornbiscuit-area">Cornbiscuit</RouteLink>, and <RouteLink routeID="lipps-area">Lipps</RouteLink>) provide
      some 500 vertical foot
      party laps.
    </p>
  </>,
} as const satisfies GeoItem;
