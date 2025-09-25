import Figure from "@/app/components/Figure";
import ImgSeattleRidgeUptrack from "@/public/img/seattle-ridge-uptrack.jpg";
import { type GeoItem } from "@/lib/geo-item";

export const geoItem = {
  id: "seattle-ridge-parking-lot",
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [-149.18525, 60.80458],
  },
  properties: {
    title: "Seattle Ridge Parking Lot",
    feature_type: "parking",
    thumbnail: "/img/seattle-ridge-uptrack.jpg",
    elevation: 305,
    nicks_ates_ratings: ["non-avalanche"],
    children: [],
  },
  proseJsx: (
    <>
      <p>
        Sometimes plowed. If you want to go up Seattle Ridge, sometimes called
        &quot;sunnyside&quot;, this is the best parking lot for that. The entire West side
        of the Seward Highway is open to motorized vehicles, so you will be
        sharing the terrain with lots of snowmachines. During the middle of the
        season they will have ripped up a lot of the ridable snow. But early
        season, before the Forest Service opens the area to snowmachines, it can
        be a great place to find some sunny powder through the alder fields of
        Seattle Ridge.
      </p>

      <Figure
        src={ImgSeattleRidgeUptrack}
        caption={
          <>
            The common uptrack for Seattle Ridge. You can barely see the
            snowmachine tracks.
          </>
        }
      />
    </>
  ),
} as const satisfies GeoItem;
