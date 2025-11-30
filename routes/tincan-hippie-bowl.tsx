import { type GeoItem } from "@/lib/geo-item";
import RouteLink from "@/app/components/RouteLink";
import { librariesOverview } from "@/imageRegistry/images";

export const geoItem = {
  id: "tincan-hippie-bowl",
  type: "Feature",
  geometry: {
    type: "LineString",
    coordinates: [
      [-149.153957, 60.785388, 988.018477],
      [-149.154362, 60.785205, 971.500562],
      [-149.154768, 60.785021, 957.043836],
      [-149.155173, 60.784838, 946.591532],
      [-149.155578, 60.784654, 936.202244],
      [-149.155983, 60.784471, 931.984491],
      [-149.156389, 60.784287, 924.862186],
      [-149.156794, 60.784104, 904.99077],
      [-149.157127, 60.783953, 892.705282],
      [-149.157127, 60.783953, 892.705282],
      [-149.157549, 60.783779, 879.9636],
      [-149.157971, 60.783605, 863.41271],
      [-149.158393, 60.78343, 844.88795],
      [-149.158815, 60.783256, 820.131546],
      [-149.159238, 60.783082, 802.203295],
      [-149.15966, 60.782908, 779.825011],
      [-149.160082, 60.782734, 758.2144],
      [-149.160504, 60.78256, 738.806131],
      [-149.160926, 60.782385, 717.867848],
      [-149.161348, 60.782211, 693.2224],
      [-149.16177, 60.782037, 670.866698],
      [-149.162192, 60.781863, 651.6018],
      [-149.162614, 60.781689, 632.3148],
      [-149.163036, 60.781514, 619.661676],
      [-149.163458, 60.78134, 595.5528],
      [-149.16388, 60.781166, 578.601907],
      [-149.164302, 60.780992, 565.001357],
      [-149.164724, 60.780818, 553.31094],
      [-149.165146, 60.780643, 537.259459],
      [-149.165232, 60.780608, 533.813686],
    ],
  },
  properties: {
    title: "Tincan Hippie Bowl",
    feature_type: "descent",
    nicks_ates_ratings: ["challenging"],
    children: [],
    area: "tincan-area",
    elevation_max: 988.018477,
    elevation_min: 533.813686,
    distance: 810.7375124193462,
    latitude: 60.78295961753153,
    longitude: -149.15957789760694,
    total_descent: 454.204791,
    images: [librariesOverview],
  },
  proseJsx: (
    <>
      <p>
        This South facing bowl is slightly uphill of
        of <RouteLink routeID="tincan-common-bowl">Tincan Common Bowl</RouteLink>.
        It is less popular, and a nice alternative when Common Bowl is crowded.
      </p>

      <p>
        There is almost always a large cornice on the top of the bowl, with only
        a few places where you can sneak around it to enter the bowl. It also is
        more likely to be wind-loaded than Common Bowl, so be a little more
        confident in the avalanche conditions before you progress from Common
        Bowl to Hippie Bowl.
      </p>

      <p>
        You can either just lap the upper bowl, or you can continue over the
        gradual rollover all the way down to Center Ridge Valley. This lower
        section is a little more steep, and is composed of several large steep
        gullies with complex bumpy terrain. It can be quite playful, with
        chances to ski mini spines, but also makes it more likely to trigger
        something on a convexity, and the &quot;funneling&quot; action can make it more
        consequential. A very nice linkup for a stable day is to ski this run
        all the way to the bottom, and then scooch upvalley to find something
        in <RouteLink routeID="the-libraries">The Libraries</RouteLink>.
      </p>
    </>
  ),
} as const satisfies GeoItem;
