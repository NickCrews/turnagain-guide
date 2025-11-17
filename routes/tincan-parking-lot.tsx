import Link from "@/components/ui/link";
import { tincanOverview } from "@/imageRegistry/images";
import { type GeoItem } from "@/lib/geo-item";

export const geoItem = {
  id: "tincan-parking-lot",
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [-149.198633, 60.795805],
  },
  properties: {
    title: "Tincan Parking Lot",
    feature_type: "parking",
    area: "tincan-area",
    elevation: 315,
    nicks_ates_ratings: ["non-avalanche"],
    children: [],
    images: [tincanOverview],
  },
  proseJsx: (
    <>
      <p>
        There is a pulloff on the East side of the highway, on the outside of a
        curve. It is one of the better-plowed parking lots in Turnagain pass,
        usually plowed either during or the day after a storm.
      </p>

      <p>
        This is a dangerous parking lot. In 2021,
        {/* Using Link for client-side navigation and prefetching */}
        <Link href="https://www.facebook.com/girdwoodfire/posts/pfbid02Cvg6hsHWwZrx4UuUmifkT5sgELemarYChwvnCgJ5v4qByyf5NLgD84THEgcJrVYWl">
          a semi truck pancaked three cars
        </Link>
        that were parked in the lot. I try to not linger in the parking lot for
        very long after I park, and put on my gear near the guardrail where I am
        at least marginally protected by the parked cars.
      </p>

      <p>
        Once you park, it&apos;s a chaotic scramble/slide down the embankment and
        across the meadow. On the far side of a meadow, CNFAIC usually has a
        beacon checker machine. Slide past it one at a time to verify that your
        beacon is working.
      </p>

      <p>
        If you want a break from downhill skiing, on a clear day it is fun to
        nordic ski North through these meadows. You go gradually uphill until
        you reach a crest where you are treated to a beautiful view down the
        length of the whole of Turnagain Pass, all the way down to Turnagain Arm
        1000 feet below. You better watch out though, or you might run into a
        roving band of retired ladies from Girdwood drinking gin and tonics and
        eating cake for someone&apos;s birthday.
      </p>

      <p>
        Very very rarely is the parking lot so full that there is no room. When
        this happens, choose a different zone, or continue South up the highway
        to the Center Ridge parking lot, and you can access the Tincan ridge
        from the slightly longer and lower quality &quot;Blue Diamond&quot; approach
        trail.
      </p>
    </>
  ),
} as const satisfies GeoItem;