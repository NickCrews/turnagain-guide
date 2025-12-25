'use client';

/**
 * A fullscreen figure component for displaying images with captions.
 * 
 * - On large screens, looks like a facebook photo fullscreen view,
 *   with the image on the left and title/description/other info on the right.
 * - On small screens, the image is on top and the other info is below.
 * - Supports stable zooming and panning of the image, so the user can zoom in
 *   to see details. When they have no interaction, it stays where they left off.
 * 
 * This does not handle the URL state or routing, this is a fully controlled component.
 * The parent component should handle opening and closing the fullscreen view,
 * and passing the appropriate image and info to display. 
 */

import React from "react";
import { TransformWrapper, TransformComponent, MiniMap, useControls, useTransformEffect } from "react-zoom-pan-pinch";
import { type GuideImage, getId, getImageAltText } from "@/lib/image";
import { NextButton, PrevButton } from "@/components/ui/image-carousel";
import { useHybridState } from "@/lib/hybrid-state";
import { Undo, ZoomIn, ZoomOut } from "lucide-react";
import { useIsBelowWidth } from "@/lib/widths";

export interface LightboxProps {
  images: GuideImage[];
  index?: number;
  defaultIndex?: number;
  onIndexChange: (newIndex: number) => void;
}

export function Lightbox({
  images,
  index: controlledIndex,
  defaultIndex,
  onIndexChange
}: LightboxProps) {
  const [index, setIndex] = useHybridState<number>(
    controlledIndex,
    defaultIndex ?? 0,
    onIndexChange
  );
  const image = images[index];
  const onNext = () => {
    setIndex((index + 1) % images.length);
  }
  const onPrev = () => {
    setIndex((index - 1 + images.length) % images.length);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="relative">
        {images.length > 1 && <PrevButton onClick={onPrev} className="absolute left-3  top-1/2 -translate-y-1/2 z-30 opacity-80 hover:opacity-100 transition-opacity duration-200" />}
        {images.length > 1 && <NextButton onClick={onNext} className="absolute right-3 top-1/2 -translate-y-1/2 z-30 opacity-80 hover:opacity-100 transition-opacity duration-200" />}
        <ZoomableImage
          src={image.imagePath}
          alt={getImageAltText(image) || "Lightbox Image"}
        />
      </div>
      <div className="md:w-1/3 p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">{image.title || getId(image).replace("-", " ")}</h2>
        <p className="mb-4">{image.description || "No description available."}</p>
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