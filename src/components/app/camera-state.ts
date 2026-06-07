import { Cartesian3, Matrix4, Transforms, type Viewer } from 'cesium';
import { type CameraFraming } from '@/figures/framing';
import { PINCH_MS } from '@/figures/figure-layout';

/**
 * A bookmark of the browse camera, captured before opening a figure so we can
 * fly back to exactly where the user was when they close it. Stored as plain
 * arrays (not Cesium objects) so it is trivial to clone, compare, and reason
 * about.
 */
export interface CameraState {
  position: [number, number, number];
  direction: [number, number, number];
  up: [number, number, number];
}

/**
 * The browse-camera bookmark, kept at module scope rather than in a component
 * ref so it survives remounts. Arrowing between map figures navigates between
 * `/img/[id]` pages, which remounts the explorer; a ref would reset and capture
 * the *figure* framing as the "browse" camera, so closing would fly to the wrong
 * place. The module-level singleton is captured once on the first open and held
 * until the figure is closed.
 */
let browseBookmark: CameraState | null = null;

export function getBrowseBookmark(): CameraState | null {
  return browseBookmark;
}

export function setBrowseBookmark(state: CameraState | null): void {
  browseBookmark = state;
}

const toTuple = (c: Cartesian3): [number, number, number] => [c.x, c.y, c.z];
const fromTuple = ([x, y, z]: [number, number, number]) => new Cartesian3(x, y, z);

/** Bookmark the viewer's current camera so {@link restoreCameraState} can return to it. */
export function captureCameraState(viewer: Viewer): CameraState {
  const { position, direction, up } = viewer.camera;
  return {
    position: toTuple(position),
    direction: toTuple(direction),
    up: toTuple(up),
  };
}

/** Return the camera to a previously {@link captureCameraState captured} bookmark. */
export function restoreCameraState(viewer: Viewer, state: CameraState, { animate }: { animate: boolean }): void {
  const destination = fromTuple(state.position);
  const orientation = { direction: fromTuple(state.direction), up: fromTuple(state.up) };
  if (animate) {
    viewer.camera.flyTo({ destination, orientation, duration: FLY_DURATION_SECONDS });
  } else {
    viewer.camera.setView({ destination, orientation });
  }
}

/** Fly (or jump) the camera to frame a figure's subject, per {@link CameraFraming}. */
export function flyToFraming(viewer: Viewer, framing: CameraFraming, { animate }: { animate: boolean }): void {
  const { target, cameraOffsetEnu, headingRadians, pitchRadians } = framing;
  const subject = Cartesian3.fromDegrees(target.longitude, target.latitude, target.height);
  const enuToFixed = Transforms.eastNorthUpToFixedFrame(subject);
  const offset = new Cartesian3(cameraOffsetEnu.east, cameraOffsetEnu.north, cameraOffsetEnu.up);
  const destination = Matrix4.multiplyByPoint(enuToFixed, offset, new Cartesian3());
  const orientation = { heading: headingRadians, pitch: pitchRadians, roll: 0 };
  if (animate) {
    viewer.camera.flyTo({ destination, orientation, duration: FLY_DURATION_SECONDS });
  } else {
    viewer.camera.setView({ destination, orientation });
  }
}

/**
 * Derived from the view-layer pinch duration so the camera and the map box are
 * guaranteed to move in concert. Cesium's `flyTo` takes seconds; `PINCH_MS` is
 * the CSS transition in milliseconds.
 */
const FLY_DURATION_SECONDS = PINCH_MS / 1000;
