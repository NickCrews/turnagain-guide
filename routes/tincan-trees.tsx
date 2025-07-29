import Figure from "@/app/components/Figure";
import ImgTincanOVerview from "@/public/img/tincan-overview.jpg";
import { type GeoItem } from "@/lib/geo-item";

export const geoItem: GeoItem = {
  id: "tincan-trees",
  type: "Feature",
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [-149.172244, 60.793454, 0],
        [-149.17563, 60.793329, 0],
        [-149.177416, 60.793748, 0],
        [-149.179921, 60.79308, 0],
        [-149.184677, 60.78973, 0],
        [-149.181104, 60.788756, 0],
        [-149.173357, 60.788224, 0],
        [-149.170133, 60.788915, 0],
        [-149.167257, 60.789809, 0],
        [-149.167118, 60.793284, 0],
        [-149.168092, 60.794314, 0],
        [-149.172244, 60.793454, 0],
      ],
    ],
  },
  properties: {
    title: "Tincan Trees",
    feature_type: "descent",
    thumbnail: "/img/tincan-overview.jpg",
    nicks_ates_ratings: ["simple", "challenging"],
    children: [],
    area: "tincan-area",
  },
  proseJsx: (
    <>
      <p>
        The meadows on the north side of the ridge are known as "Tincan Trees".
        The terrain is composed of many small lumps and rollovers, with a mix of
        open meadows and dense stands of trees, with tight passages connecting
        the meadows. There are many complex mini drainages and ridges, so if you
        are adventurous you can often find less-touched snow if you venture out
        of the obvious runs. The laps are fairly short, maybe 800 vertical feet,
        but the uptrack is easy so it doesn't feel totally stupid.
      </p>

      <p>
        If the weather is stormy, Tincan is one of the better options in
        Turnagain pass. This area has enough trees to provide visual contrast,
        where many other areas would be whiteout conditions.
      </p>

      <p>
        It is fairly easy to stay in low angle terrain, out of avalanche
        terrain, but if you are careless it also is very possible to ski over a
        small but steep and abrupt rollover and trigger a slide in high
        avalanche conditions, eg if you are skiing in the middle of a storm.
        These would be small, but with terrain traps, or if your partners aren't
        watching you, it could be serious. On many storm days I have seen small
        slides triggered in this zone.
      </p>

      <Figure
        src={ImgTincanOVerview}
        caption={<>The North side of Tincan in March of a decent snow year.</>}
      />
    </>
  ),
};
