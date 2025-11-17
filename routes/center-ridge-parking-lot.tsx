import RouteLink from "@/app/components/RouteLink";
import { type GeoItem } from "@/lib/geo-item";
import { blueDiamond } from "@/imageRegistry/images";

export const geoItem = {
  id: "center-ridge-parking-lot",
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [-149.215276, 60.782074],
  },
  properties: {
    title: "Center Ridge Parking Lot",
    feature_type: "parking",
    nicks_ates_ratings: ["non-avalanche"],
    children: [],
    area: "tincan-area",
    elevation: 280,
    images: [blueDiamond],
  },
  proseJsx: (
    <>
      <p>
        A large, off-highway parking lot. This is most often used if you are
        planning on descending from
        <RouteLink routeID="the-libraries">The Libraries</RouteLink>,
        <RouteLink routeID="tincan-hippie-bowl">Hippy Bowl</RouteLink>, or
        somewhere else up center ridge valley, because it&apos;s all down hill to
        here when skiing down center ridge valley. It&apos;s just a little bit harder
        to get back to
        <RouteLink routeID="tincan-parking-lot">Tincan Parking Lot</RouteLink>
        from center ridge valley, requiring a bit of sidestepping (if you are on
        skis and there is already a track), or a tiny skin if you are on a
        splitboard or the snow is deep.
      </p>

      <p>
        There are bathrooms here, but they are usually closed in winter. After a
        big storm, this is one of the later parking lots to get plowed. This is
        also a common parking lot for snowmachiners, who overflow here when
        their main parking lot across the highway is full.
      </p>
    </>
  ),
} as const satisfies GeoItem;
