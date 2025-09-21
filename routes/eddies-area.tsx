import RouteLink from "@/app/components/RouteLink";
import Figure from "@/app/components/Figure";
import ImgEddiesOverview from "@/public/img/eddies-overview.jpg";
import { type GeoItem } from "@/lib/geo-item";

export const geoItem: GeoItem = {
  id: "eddies-area",
  type: "Feature",
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [-149.12426630087165, 60.825812557062505, 0],
        [-149.1215726944693, 60.82064468219366, 0],
        [-149.12357117663868, 60.8138235038802, 0],
        [-149.1066275234627, 60.80089740896702, 0],
        [-149.093159491451, 60.79199444039622, 0],
        [-149.0794409024492, 60.78395699845322, 0],
        [-149.07309789382433, 60.77818849894908, 0],
        [-149.0643219503844, 60.76656351537943, 0],
        [-149.06562530832107, 60.75934881503366, 0],
        [-149.07005672530553, 60.756632271995045, 0],
        [-149.08230828990978, 60.760876769393576, 0],
        [-149.12358124883983, 60.785653463933215, 0],
        [-149.13122761540126, 60.7915054231498, 0],
        [-149.14982218863037, 60.801298701974815, 0],
        [-149.15633897831344, 60.80600349806684, 0],
        [-149.1357459229148, 60.82210477318077, 0],
        [-149.12426630087165, 60.825812557062505, 0],
      ],
    ],
  },
  properties: {
    title: "Eddie's Area",
    feature_type: "area",
    thumbnail: "/img/eddies-overview.jpg",
    nicks_ates_ratings: [],
    children: [],
  },
  proseJsx: (
    <>
      <p>
        Eddies is an area with many low angle options, some steeper runs, and if
        you keep going back the ridge, some ski movie spines. The downsides of
        eddies are the 40 minute approach through the woods, and the slightly
        lower elevation. If it weren&apos;t for these two downsides, I bet this would
        be just as popular of an area as{" "}
        <RouteLink routeID="tincan-area">Tincan</RouteLink>.
      </p>

      <Figure
        src={ImgEddiesOverview}
        caption={<>The front face of Eddies in March of a decent snow year.</>}
      />
    </>
  ),
};
