'use client';

/**
 * A fullscreen component for displaying {@link Figure}, eg an image with metadata.
 * 
 * - On large screens, looks like a facebook photo fullscreen view,
 *   with the image on the left and title/description/other info on the right.
 * - On small screens, the image is on top and the other info is below.
 * - Supports stable zooming and panning of the image, so the user can zoom in
 *   to see details. When they have no interaction, it stays where they left off.
 * 
 * This does not handle the URL state or routing, this is a fully controlled component.
 * The parent component should handle opening and closing the fullscreen view,
 * and passing the appropriate figure and info to display. 
 */

import React from "react";
import { TransformWrapper, TransformComponent, MiniMap, useControls, useTransformEffect } from "react-zoom-pan-pinch";
import { type Figure } from "@/figures/index";
import { NextButton, PrevButton } from "@/figures/image-carousel";
import { useHybridState } from "@/lib/hybrid-state";
import { Undo, ZoomIn, ZoomOut } from "lucide-react";
import { useIsBelowWidth } from "@/lib/widths";
import { Elevation } from "../app/components/units";

function cardinalDirection(degrees: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(degrees / 45) % 8]!;
}

/** eg Jan 20, 2024, 11:15 AM */
function formatDatetime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    year: "numeric", month: "short", day: "numeric",
    hour: "numeric", minute: "2-digit",
  });
}

function PhotoMeta({ figure }: { figure: Figure }) {
  const { datetime, coordinates, elevation, direction } = figure;
  if (!datetime && !coordinates && elevation == null && direction == null) return null;
  return (
    <dl className="mt-4 text-sm space-y-1 text-muted-foreground border-t pt-3">
      {datetime && (
        <div className="flex gap-2">
          <dt className="font-medium text-foreground w-20 shrink-0">Date</dt>
          <dd>{formatDatetime(datetime)}</dd>
        </div>
      )}
      {coordinates && (
        <div className="flex gap-2">
          <dt className="font-medium text-foreground w-20 shrink-0">Location</dt>
          <dd>{coordinates.lat.toFixed(5)}, {coordinates.long.toFixed(5)}</dd>
        </div>
      )}
      {elevation != null && (
        <div className="flex gap-2">
          <dt className="font-medium text-foreground w-20 shrink-0">Elevation</dt>
          <dd><Elevation meters={elevation} /></dd>
        </div>
      )}
      {direction != null && (
        <div className="flex gap-2">
          <dt className="font-medium text-foreground w-20 shrink-0">Heading</dt>
          <dd>{direction}° {cardinalDirection(direction)}</dd>
        </div>
      )}
    </dl>
  );
}

export interface LightboxProps {
  figures: Figure[];
  index?: number;
  defaultIndex?: number;
  onIndexChange: (newIndex: number) => void;
}

export function Lightbox({
  figures,
  index: controlledIndex,
  defaultIndex,
  onIndexChange
}: LightboxProps) {
  const [index, setIndex] = useHybridState<number>(
    controlledIndex,
    defaultIndex ?? 0,
    onIndexChange
  );
  const figure = figures[index];
  const onNext = () => {
    setIndex((index + 1) % figures.length);
  }
  const onPrev = () => {
    setIndex((index - 1 + figures.length) % figures.length);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="relative flex-1 md:flex-none md:w-[calc(100%-24rem)]">
        {figures.length > 1 && <PrevButton onClick={onPrev} className="absolute left-3  top-1/2 -translate-y-1/2 z-30 opacity-80 hover:opacity-100 transition-opacity duration-200" />}
        {figures.length > 1 && <NextButton onClick={onNext} className="absolute right-3 top-1/2 -translate-y-1/2 z-30 opacity-80 hover:opacity-100 transition-opacity duration-200" />}
        <ZoomableImage
          src={figure.imagePath}
          alt={figure.altText || "Lightbox Image"}
        />
      </div>
      <div className="w-full md:w-96 p-6 overflow-y-auto flex-shrink-0">
        <h2 className="text-2xl font-bold mb-4">{figure.title || figure.id.replace("-", " ")}</h2>
        <p className="mb-4">{figure.description || "No description available."}</p>
        <PhotoMeta figure={figure} />
      </div>
    </div>
  );
};

interface ZoomableImageProps {
  src: string;
  alt: string;
}

const ZoomableImage: React.FC<ZoomableImageProps> = ({ src, alt }) => {
  const img = <img
    src={src}
    alt={alt}
  />

  return (
    <TransformWrapper
      initialScale={1}
      minScale={1}
      maxScale={10}
      wheel={{ disabled: false }}
      panning={{ disabled: false }}
      doubleClick={{ disabled: false }}
      zoomAnimation={{ disabled: false, animationTime: 100, size: 0.5 }}
    >
      <div className="relative">
        <MyMiniMap element={img} />
        <Controls />
        <TransformComponent>
          {img}
        </TransformComponent>
      </div>
    </TransformWrapper>
  );
};

const MyMiniMap: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const [isZoomed, setIsZoomed] = React.useState(false);
  const isMobile = useIsBelowWidth(768);
  useTransformEffect(({ state }) => {
    if (state.scale > 1.1) {
      setIsZoomed(true);
    } else {
      setIsZoomed(false);
    }
  });

  if (!isZoomed) {
    return null;
  }

  return (
    <div className="absolute left-3 top-3 z-30 border border-white/30 shadow-lg">
      <MiniMap borderColor="red" width={isMobile ? 100 : 150}>
        {element}
      </MiniMap>
    </div>
  );
}


const Controls: React.FC = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  return (
    <div className="absolute right-3 top-3 z-30 flex gap-2">
      <button
        type="button"
        onClick={() => zoomOut()}
        className="rounded bg-black/60 text-white p-1 hover:bg-black/80 hover:cursor-pointer"
        aria-label="Zoom out"
      >
        <ZoomOut />
      </button>
      <button
        type="button"
        onClick={() => zoomIn()}
        className="rounded bg-black/60 text-white p-1 hover:bg-black/80 hover:cursor-pointer"
        aria-label="Zoom in"
      >
        <ZoomIn />
      </button>
      <button
        type="button"
        onClick={() => resetTransform()}
        className="rounded bg-black/60 text-white p-1 hover:bg-black/80 hover:cursor-pointer"
        aria-label="Reset zoom"
      >
        <Undo />
      </button>
    </div>
  );
};