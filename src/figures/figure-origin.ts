/**
 * The on-screen rect a figure is opening *from*, used to seed the hero image's
 * FLIP expand. Entry points (a DOM thumbnail, or a map billboard projected to
 * canvas coordinates via `cartesianToCanvasCoordinates`) stash a rect here right
 * before navigating; `FigureView` consumes it once on open.
 *
 * This is deliberately a tiny module-level handoff rather than URL/router state:
 * a screen rect is ephemeral view-glue that must not survive a reload (a cold
 * `/img/[id]` load has no origin, so the pinch simply doesn't play).
 */
export interface OriginRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

let pending: OriginRect | null = null;

export function setFigureOrigin(rect: OriginRect | null): void {
  pending = rect;
}

/** Read and clear the pending origin rect. Returns null when there is none. */
export function takeFigureOrigin(): OriginRect | null {
  const rect = pending;
  pending = null;
  return rect;
}

export function rectFromElement(el: Element): OriginRect {
  const { top, left, width, height } = el.getBoundingClientRect();
  return { top, left, width, height };
}
