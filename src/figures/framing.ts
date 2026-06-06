import { type Figure } from '@/figures';

/**
 * A camera placement that frames a figure's subject, expressed in plain numbers
 * so it can be unit-tested without a running Cesium viewer.
 *
 * The view layer turns this into a `camera.flyTo` by building an east-north-up
 * frame at `target` and offsetting the camera by `cameraOffsetEnu` (see
 * `flyToFraming` in `camera-state.ts`). This is the single seam for tuning how a
 * figure is framed (distance, pitch); change the constants below to retune.
 */
export interface CameraFraming {
  /** The subject of the photo: where the camera looks. */
  target: { longitude: number, latitude: number, height: number };
  /** Camera position relative to the subject, in metres in the local east-north-up frame. */
  cameraOffsetEnu: { east: number, north: number, up: number };
  /** Compass heading the camera looks along, in radians (0 = north, clockwise). */
  headingRadians: number;
  /** Cesium pitch in radians; negative looks down at the subject. */
  pitchRadians: number;
  /** Distance from the camera to the subject, in metres. */
  rangeMeters: number;
}

const DEG_TO_RAD = Math.PI / 180;

/** Default standoff distance from the subject when the figure carries no hint of scale. */
const DEFAULT_RANGE_METERS = 1800;
/** How far below horizontal the framing camera tilts to look down onto the subject. */
const DEFAULT_PITCH_DEGREES = 18;

/**
 * Turn a figure's subject location + heading into a camera placement that frames
 * the subject, looking along the figure's `direction` (so the recreated view
 * matches what the photographer saw).
 *
 * Pure and viewer-free: returns plain numbers. Returns `null` for a figure with
 * no `subject_coordinates` (there is nothing to frame).
 */
export function framingFor(figure: Pick<Figure, 'subject_coordinates' | 'subject_elevation' | 'direction'>): CameraFraming | null {
  const coords = figure.subject_coordinates;
  if (!coords) {
    return null;
  }

  // `direction` is the compass heading the photographer faced. We place the
  // camera behind-and-above the subject and look back along that same heading.
  const headingRadians = (figure.direction ?? 0) * DEG_TO_RAD;
  const pitchDownRadians = DEFAULT_PITCH_DEGREES * DEG_TO_RAD;
  const rangeMeters = DEFAULT_RANGE_METERS;
  const height = figure.subject_elevation ?? 0;

  // View direction unit vector in east-north-up, tilted down by the pitch.
  const cosPitch = Math.cos(pitchDownRadians);
  const viewEast = Math.sin(headingRadians) * cosPitch;
  const viewNorth = Math.cos(headingRadians) * cosPitch;
  const viewDown = Math.sin(pitchDownRadians);

  // The camera sits `range` behind the subject along that view direction, which
  // puts it on the opposite side of the heading and above the subject.
  const cameraOffsetEnu = {
    east: -rangeMeters * viewEast,
    north: -rangeMeters * viewNorth,
    up: rangeMeters * viewDown,
  };

  return {
    target: { longitude: coords.long, latitude: coords.lat, height },
    cameraOffsetEnu,
    headingRadians,
    // Cesium's pitch is negative when looking down.
    pitchRadians: -pitchDownRadians,
    rangeMeters,
  };
}
