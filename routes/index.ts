import { geoItem as blueDiamondRoute } from './blue-diamond-route';
import { geoItem as centerRidgeParkingLot } from './center-ridge-parking-lot';
import { geoItem as cfr } from './cfr';
import { geoItem as coastalParkingLot } from './coastal-parking-lot';
import { geoItem as cornbiscuitArea } from './cornbiscuit-area';
import { geoItem as cornbiscuitPeak } from './cornbiscuit-peak';
import { geoItem as cornbiscuitParkingLot } from './cornbiscuit-parking-lot';
import { geoItem as cornbiscuitUptrack } from './cornbiscuit-uptrack';
import { geoItem as eddiesApproachAndUptrack } from './eddies-approach-and-uptrack';
import { geoItem as eddiesArea } from './eddies-area';
import { geoItem as eddiesFrontFace } from './eddies-front-face';
import { geoItem as eddiesNorthBowl } from './eddies-north-bowl';
import { geoItem as eddiesParkingLot } from './eddies-parking-lot';
import { geoItem as godsCountryParkingLot } from './gods-country-parking-lot';
import { geoItem as goldpanArea } from './goldpan-area';
import { geoItem as granddaddyCouloir } from './granddaddy-couloir';
import { geoItem as johnsonPassParkingLot } from './johnson-pass-parking-lot';
import { geoItem as kickstepPeak } from './kickstep-peak';
import { geoItem as lippsArea } from './lipps-area';
import { geoItem as lippsParkingLot } from './lipps-parking-lot';
import { geoItem as lippsPeak } from './lipps-peak';
import { geoItem as magnumArea } from './magnum-area';
import { geoItem as magnumFrontFace } from './magnum-front-face';
import { geoItem as magnumNortheastRidge } from './magnum-northeast-ridge';
import { geoItem as magnumPeak } from './magnum-peak';
import { geoItem as mistressPeak } from './mistress-peak';
import { geoItem as motorizedParkingLot } from './motorized-parking-lot';
import { geoItem as pastoralArea } from './pastoral-area';
import { geoItem as pastoralPeak } from './pastoral-peak';
import { geoItem as petesNorthArea } from './petes-north-area';
import { geoItem as petesSouthArea } from './petes-south-area';
import { geoItem as pmsBowlUptrack } from './pms-bowl-uptrack';
import { geoItem as seattleRidgeParkingLot } from './seattle-ridge-parking-lot';
import { geoItem as sharkfinArea } from './sharkfin-area';
import { geoItem as sunburstArea } from './sunburst-area';
import { geoItem as sunburstMeadowsUptrack } from './sunburst-meadows-uptrack';
import { geoItem as sunburstMeadowsUptrackEarly } from './sunburst-meadows-uptrack-early';
import { geoItem as sunburstParkingLot } from './sunburst-parking-lot';
import { geoItem as sunburstPeak } from './sunburst-peak';
import { geoItem as sunburstRidgeUptrack } from './sunburst-ridge-uptrack';
import { geoItem as sunburstSouthFace } from './sunburst-south-face';
import { geoItem as superbowl } from './superbowl';
import { geoItem as theLibraries } from './the-libraries';
import { geoItem as taylorCreek } from './taylor-creek';
import { geoItem as taylorPassToPastoralPeak } from './taylor-pass-to-pastoral-peak';
import { geoItem as tincanArea } from './tincan-area';
import { geoItem as tincanCommonBowl } from './tincan-common-bowl';
import { geoItem as tincanCommonPeak } from './tincan-common-peak';
import { geoItem as tincanHippieBowl } from './tincan-hippie-bowl';
import { geoItem as tincanMeadowToRidgeUptrack } from './tincan-meadow-to-ridge-uptrack';
import { geoItem as tincanOutTrack } from './tincan-out-track';
import { geoItem as tincanParkingLot } from './tincan-parking-lot';
import { geoItem as tincanProperPeak } from './tincan-proper-peak';
import { geoItem as tincanTrees } from './tincan-trees';
import { geoItem as tincanTreesUptrack } from './tincan-trees-uptrack';
import { geoItem as tincanUptrack } from './tincan-uptrack';
import { geoItem as toddsRun } from './todds-run';
import { geoItem as wolverineArea } from './wolverine-area';

// Add new exports here when creating new route files
export const allGeoItems = [
  blueDiamondRoute,
  centerRidgeParkingLot,
  cfr,
  coastalParkingLot,
  cornbiscuitArea,
  cornbiscuitPeak,
  cornbiscuitParkingLot,
  cornbiscuitUptrack,
  eddiesApproachAndUptrack,
  eddiesArea,
  eddiesFrontFace,
  eddiesNorthBowl,
  eddiesParkingLot,
  godsCountryParkingLot,
  goldpanArea,
  granddaddyCouloir,
  johnsonPassParkingLot,
  kickstepPeak,
  lippsArea,
  lippsParkingLot,
  lippsPeak,
  magnumArea,
  magnumFrontFace,
  magnumNortheastRidge,
  magnumPeak,
  mistressPeak,
  motorizedParkingLot,
  pastoralArea,
  pastoralPeak,
  petesNorthArea,
  petesSouthArea,
  pmsBowlUptrack,
  seattleRidgeParkingLot,
  sharkfinArea,
  sunburstArea,
  sunburstMeadowsUptrack,
  sunburstMeadowsUptrackEarly,
  sunburstParkingLot,
  sunburstPeak,
  sunburstRidgeUptrack,
  sunburstSouthFace,
  superbowl,
  taylorCreek,
  taylorPassToPastoralPeak,
  theLibraries,
  tincanArea,
  tincanCommonBowl,
  tincanCommonPeak,
  tincanHippieBowl,
  tincanMeadowToRidgeUptrack,
  tincanOutTrack,
  tincanParkingLot,
  tincanProperPeak,
  tincanTrees,
  tincanTreesUptrack,
  tincanUptrack,
  toddsRun,
  wolverineArea,
] as const;

export type ValidRouteId = typeof allGeoItems[number]["id"];
