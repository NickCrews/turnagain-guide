import RouteLink from "@/app/components/route-link";
import { ReactElement } from "react";

export interface RawFigure {
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

export const RAW_FIGURES_BY_ID = {
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
  "granddaddy-far-aerial": {
    imagePath: "/img/granddaddy-far-aerial.jpg",
    title: "North side of Granddaddy Peak from the air",
    description: <>
      The North side of <RouteLink routeID="granddaddy-peak">Granddaddy Peak</RouteLink> from the air.
      The prominent line down the middle of the face is <RouteLink routeID="granddaddy-couloir">Granddaddy Couloir</RouteLink>.
      The wider chute to the right is <RouteLink routeID="going-home-chute">Going Home Chute</RouteLink>.
    </>
  },
  "granddaddy-couloir-from-top": {
    imagePath: "/img/granddaddy-couloir-from-top.jpg",
    title: "Granddaddy Couloir from the top",
    description: <>
      Looking down <RouteLink routeID="granddaddy-couloir">Granddaddy Couloir</RouteLink> from
      the top of <RouteLink routeID="granddaddy-peak">Granddaddy Peak</RouteLink>.
    </>
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
  "pastoral-s-face-from-col": {
    imagePath: "/img/pastoral-s-face-from-col.jpg",
    title: "South Face of Pastoral Peak from Bertha Creek Col",
    description: <>
      The South Face of <RouteLink routeID="pastoral-peak">Pastoral Peak</RouteLink> from the col between Pastoral and <RouteLink routeID="granddaddy-peak">Granddaddy Peak</RouteLink>. The line in the middle of the face is the most direct, but there are some good options that go out left or right to avoid the cliff bands.
    </>
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
} as const satisfies Record<string, RawFigure>;