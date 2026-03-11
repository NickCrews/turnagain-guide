import RouteLink from "@/app/components/route-link";
// import { loadGeoItems } from "@/lib/geo-item";
// import { GuideImage } from "@/lib/image";
import { ReactElement } from "react";

interface RawGuideImage {
  imagePath: string
  title?: string,
  description?: string | ReactElement
  /** If not defined, will use title or description */
  altText?: string
  coordinates?: {
    lat: number,
    long: number
  },
  elevation?: number,
  /** Direction in degrees, where 0 = North, 90 = East, etc. */
  direction?: number,
  /** ISO 8601 datetime string, e.g. "2024-03-15T10:30:00" */
  datetime?: string,
}

// export const blueDiamond = {
//   imagePath: "/img/blue-diamond.jpg",
// } as const satisfies RawGuideImage;
// export const bootingBasketball = {
//   imagePath: "/img/booting-basketball.jpg",
// } as const satisfies RawGuideImage;
// export const cornbiscuitNorth = {
//   imagePath: "/img/cornbiscuit-north-side.jpg",
// } as const satisfies RawGuideImage;
// export const eddiesOverview = {
//   imagePath: "/img/eddies-overview.jpg",
//   description: "The front face of Eddies in March of a decent snow year."
// } as const satisfies RawGuideImage;
// export const eddiesSpinesAndTodds = {
//   imagePath: "/img/eddies-spines-and-todds.jpg",
// } as const satisfies RawGuideImage;
// export const goldpan = {
//   imagePath: "/img/goldpan-pano.jpg",
// } as const satisfies RawGuideImage;
// export const grandaddy = {
//   imagePath: "/img/granddaddy-distant.jpg",
// } as const satisfies RawGuideImage;
// export const kickstepFromBasketball = {
//   imagePath: "/img/kickstep-from-basketball.jpg",
// } as const satisfies RawGuideImage;
// export const kickstepFromRoad = {
//   imagePath: "/img/kickstep-from-road.jpg",
// } as const satisfies RawGuideImage;
// export const librariesLeftSide = {
//   imagePath: "/img/libraries-early.jpg",
//   description: "Looking up some of the first (Westmost) lines in The Libraries from the bottom."
// } as const satisfies RawGuideImage;
// export const librariesOverview = {
//   imagePath: "/img/libraries-overview.jpg",
//   description: <>
//     Looking Northeast at the Libraries, which are the ridge on the skyline. They extend from
//     <RouteLink routeID="tincan-proper" >Tincan Proper</RouteLink>, the highest point on the left,
//     over to <RouteLink routeID="kickstep-peak">Kickstep Peak</RouteLink> in the top right of the photo.
//     The low, treed ridge in the middle of the photo is Center Ridge. The flank of
//     <RouteLink routeID="sunburst-peak">Sunburst</RouteLink> goes off the right edge of the photo.
//   </>
// } as const satisfies RawGuideImage;
// export const librariesRidge = {
//   imagePath: "/img/libraries-ridge.jpg",
//   description: <>
//     Looking East down the ridge of The Libraries from the top of
//     <RouteLink routeID="tincan-proper">
//       Tincan Proper.
//     </RouteLink>{" "}
//     In the background is Kickstep Peak. This is from early January, this
//     becomes more plastered later in the season.
//   </>,
//   altText: "Looking East down the ridge of The Libraries from the top of Tincan Proper."
// } as const satisfies RawGuideImage;
// export const lippsNorth = {
//   imagePath: "/img/lipps-north-side.jpg",
// } as const satisfies RawGuideImage;
// export const lippsOverview = {
//   imagePath: "/img/lipps-overview.jpg",
// } as const satisfies RawGuideImage;
// export const magnumAndCornbisbuit = {
//   imagePath: "/img/magnum-cornbiscuit-overview.jpg",
// } as const satisfies RawGuideImage;
// export const magnumFrontFace = {
//   imagePath: "/img/magnum-front-face.jpg",
// } as const satisfies RawGuideImage;
// export const magnumCenter = {
//   imagePath: "/img/magnum-high-center.jpg",
// } as const satisfies RawGuideImage;
// export const pmsBowlFromCornbiscuit = {
//   imagePath: "/img/pms-bowl-from-cornbiscuit.jpg",
// } as const satisfies RawGuideImage;
// export const pmsBowlSunset = {
//   imagePath: "/img/pms-bowl-sunset.jpg",
// } as const satisfies RawGuideImage;
// export const seattleRidge = {
//   imagePath: "/img/seattle-ridge-overview.jpg",
// } as const satisfies RawGuideImage;
// export const seattleRidgeUptrack = {
//   imagePath: "/img/seattle-ridge-uptrack.jpg",
//   description: "The common uptrack for Seattle Ridge. You can barely see the snowmachine tracks.",
// } as const satisfies RawGuideImage;
// export const wolverineOverview = {
//   imagePath: "/img/sharkfin-wolverine-overview.jpg",
//   description: "Sharkfin (close) and Wolverine (far) from near Eddies.",
// } as const satisfies RawGuideImage;
// export const sunburstApproachGully = {
//   imagePath: "/img/sunburst-approach-gully.jpg",
// } as const satisfies RawGuideImage;
// export const sunburstAndMagnum = {
//   imagePath: "/img/sunburst-magnum-overview.jpg",
//   title: "Sunburst and Magnum",
//   description: "Sunburst on the left side and Magnum on the Right, with the Taylor Creek valley in between.",
// } as const satisfies RawGuideImage;
// export const superbowlFromCornbiscuit = {
//   imagePath: "/img/superbowl-from-cornbiscuit.jpg",
// } as const satisfies RawGuideImage;
// export const taylorPass = {
//   imagePath: "/img/taylor-pass-from-magnum.jpg",
// } as const satisfies RawGuideImage;
// export const tincanOverview = {
//   imagePath: "/img/tincan-overview.jpg",
//   description: "The North side of Tincan in March of a decent snow year."
// } as const satisfies RawGuideImage;

const RAW_IMAGES_BY_ID = {
  "blue-diamond": {
    imagePath: "/img/blue-diamond.jpg",
  }, "booting-basketball": {
    imagePath: "/img/booting-basketball.jpg",
  },
  "cornbiscuit-north-side": {
    imagePath: "/img/cornbiscuit-north-side.jpg",
  },
  "eddies-overview": {
    imagePath: "/img/eddies-overview.jpg",
    description: "The front face of Eddies in March of a decent snow year."
  },
  "eddies-spines-and-todds": {
    imagePath: "/img/eddies-spines-and-todds.jpg",
  },
  "goldpan-pano": {
    imagePath: "/img/goldpan-pano.jpg",
  },
  "granddaddy-distant": {
    imagePath: "/img/granddaddy-distant.jpg",
  },
  "kickstep-from-basketball": {
    imagePath: "/img/kickstep-from-basketball.jpg",
  },
  "kickstep-from-road": {
    imagePath: "/img/kickstep-from-road.jpg",
  },
  "libraries-early": {
    imagePath: "/img/libraries-early.jpg",
    description: "Looking up some of the first (Westmost) lines in The Libraries from the bottom."
  },
  "libraries-overview": {
    imagePath: "/img/libraries-overview.jpg",
    description: <>
      Looking Northeast at the Libraries, which are the ridge on the skyline. They extend from
      <RouteLink routeID="tincan-proper" >Tincan Proper</RouteLink>, the highest point on the left,
      over to <RouteLink routeID="kickstep-peak">Kickstep Peak</RouteLink> in the top right of the photo.
      The low, treed ridge in the middle of the photo is Center Ridge. The flank of
      <RouteLink routeID="sunburst-peak">Sunburst</RouteLink> goes off the right edge of the photo.
    </>
  },
  "libraries-ridge": {
    imagePath: "/img/libraries-ridge.jpg",
    description: <>
      Looking East down the ridge of The Libraries from the top of
      <RouteLink routeID="tincan-proper">
        Tincan Proper.
      </RouteLink>{" "}
      In the background is Kickstep Peak. This is from early January, this
      becomes more plastered later in the season.
    </>,
    altText: "Looking East down the ridge of The Libraries from the top of Tincan Proper."
  },
  "lipps-north-side": {
    imagePath: "/img/lipps-north-side.jpg",
  },
  "lipps-overview": {
    imagePath: "/img/lipps-overview.jpg",
  },
  "magnum-and-cornbiscuit": {
    imagePath: "/img/magnum-cornbiscuit-overview.jpg",
  },
  "magnum-front-face": {
    imagePath: "/img/magnum-front-face.jpg",
  },
  "magnum-high-center": {
    imagePath: "/img/magnum-high-center.jpg",
  },
  "pms-bowl-from-cornbiscuit": {
    imagePath: "/img/pms-bowl-from-cornbiscuit.jpg",
  },
  "pms-bowl-sunset": {
    imagePath: "/img/pms-bowl-sunset.jpg",
  },
  "seattle-ridge-overview": {
    imagePath: "/img/seattle-ridge-overview.jpg",
  },
  "seattle-ridge-uptrack": {
    imagePath: "/img/seattle-ridge-uptrack.jpg",
    description: "The common uptrack for Seattle Ridge. You can barely see the snowmachine tracks.",
  }, "sharkfin-wolverine-overview": {
    imagePath: "/img/sharkfin-wolverine-overview.jpg",
    description: "Sharkfin (close) and Wolverine (far) from near Eddies.",
  }, "sunburst-approach-gully": {
    imagePath: "/img/sunburst-approach-gully.jpg",
  }, "sunburst-magnum-overview": {
    imagePath: "/img/sunburst-magnum-overview.jpg",
    title: "Sunburst and Magnum",
    description: "Sunburst on the left side and Magnum on the Right, with the Taylor Creek valley in between.",
  },
  "superbowl-from-cornbiscuit": {
    imagePath: "/img/superbowl-from-cornbiscuit.jpg",
  },
  "taylor-pass-from-magnum": {
    imagePath: "/img/taylor-pass-from-magnum.jpg",
  },
  "tincan-overview": {
    imagePath: "/img/tincan-overview.jpg",
    description: "The North side of Tincan in March of a decent snow year."
  },
} as const satisfies Record<string, RawGuideImage>;

export type ImageID = keyof typeof RAW_IMAGES_BY_ID;

// export interface GuideImage {
//   imagePath: string
//   id?: string
//   title?: string,
//   description?: string | ReactElement
//   /** If not defined, will use title or description */
//   altText?: string
//   coordinates?: {
//     lat: number,
//     long: number
//   },
//   elevation?: number,
//   /** Direction in degrees, where 0 = North, 90 = East, etc. */
//   direction?: number,
//   /** ISO 8601 datetime string, e.g. "2024-03-15T10:30:00" */
//   datetime?: string,
// }

type InflateGuideImage<ID extends ImageID, Raw extends RawGuideImage> = RawGuideImage & Raw & {
  id: ID,
  altText: InferAltText<Raw>,
  // title?: string,
  // description?: string | ReactElement
  // /** If not defined, will use title or description */
  // coordinates?: {
  //   lat: number,
  //   long: number
  // },
  // elevation?: number,
  // /** Direction in degrees, where 0 = North, 90 = East, etc. */
  // direction?: number,
  // /** ISO 8601 datetime string, e.g. "2024-03-15T10:30:00" */
  // datetime?: string,

}
function inflateGuideImage<T extends ImageID, Raw extends RawGuideImage>(id: T, raw: Raw): InflateGuideImage<T, Raw> {
  return {
    id,
    imagePath: raw.imagePath,
    title: raw.title,
    description: raw.description,
    altText: inferAltText(raw),
    coordinates: raw.coordinates,
    elevation: raw.elevation,
    direction: raw.direction,
    datetime: raw.datetime,
  } as InflateGuideImage<T, Raw>;
}

export type GuideImage<ID extends ImageID = ImageID> = InflateGuideImage<ID, typeof RAW_IMAGES_BY_ID[ID]>;

const _imagesById: Record<ImageID, GuideImage> = Object.entries(RAW_IMAGES_BY_ID).reduce((acc, [id, raw]) => {
  acc[id as ImageID] = inflateGuideImage(id as ImageID, raw);
  return acc;
}, {} as Record<ImageID, GuideImage>);

export function getGuideImageById<ID extends ImageID>(id: ID): GuideImage<ID> {
  return _imagesById[id] as GuideImage<ID>;
}

export function getAllGuideImages(): GuideImage[] {
  return Object.values(_imagesById);
}


/** In order of preference: altText, title, description, undefined */
type InferAltText<T extends RawGuideImage> = T extends { altText: string } ? T["altText"] : T extends { title: string } ? T["title"] : T extends { description: string } ? T["description"] : undefined;
function inferAltText<T extends RawGuideImage>(raw: T): InferAltText<T> {
  if (raw.altText) {
    return raw.altText as InferAltText<T>
  }
  if (raw.title) {
    return raw.title as InferAltText<T>;
  }
  if (raw.description && typeof raw.description === "string") {
    return raw.description as InferAltText<T>;
  }
  return undefined as InferAltText<T>;
}

export async function relatedImages(image: GuideImage, maxRelated: number = 5): Promise<GuideImage[]> {
  const allImages = getAllGuideImages();
  // Placeholder for now.
  // Ideally this should rank by distance from the image's coordinates,
  // or by being in the same geoItem, etc.
  const relatedImages = Object.values(allImages).filter(img => img !== image).slice(0, maxRelated);
  return relatedImages;
}