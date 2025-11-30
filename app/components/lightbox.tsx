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

import React, { useState, useRef, useEffect } from "react";
import { type GuideImage, getId, getImageAltText } from "@/lib/image";
import { NextButton, PrevButton } from "@/components/ui/image-carousel";
import { useHybridState } from "@/lib/hybrid-state";

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
          resetKey={index}
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
  resetKey: number | string;
}

const ZoomableImage: React.FC<ZoomableImageProps> = ({ src, alt, resetKey }) => {
  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setScale(1);
    setTranslateX(0);
    setTranslateY(0);
  }, [resetKey]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY / 500;
    setScale(prev => Math.min(Math.max(prev + delta, 1), 5));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const initTranslateX = translateX;
    const initTranslateY = translateY;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      setTranslateX(initTranslateX + moveEvent.clientX - startX);
      setTranslateY(initTranslateY + moveEvent.clientY - startY);
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="flex-1 flex items-center justify-center overflow-hidden" onWheel={handleWheel}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="max-w-full max-h-full cursor-move"
        style={{
          transform: `scale(${scale}) translate(${translateX / scale}px, ${translateY / scale}px)`,
          transition: 'transform 0.1s ease-out',
        }}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
};
