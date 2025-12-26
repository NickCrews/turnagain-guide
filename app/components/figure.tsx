'use client'

import { type ReactNode } from "react";
import { type GuideImage, getImageAltText } from "@/lib/image";
import { LightboxDialogFromUrl, useOpenLightboxFromParams } from "./lightbox-dialog-from-url";

interface FigureProps {
  image: GuideImage;
  images: GuideImage[];
  caption?: ReactNode;
}

export default function Figure({ image, images, caption }: FigureProps) {
  const alt = getImageAltText(image) || "Figure Image";
  const src = image.imagePath;
  const captionText = caption || image.description;
  const figcaption = captionText ? <figcaption className="prose text-center leading-6">{captionText}</figcaption> : null;

  const { openLightbox } = useOpenLightboxFromParams();

  return (
    <LightboxDialogFromUrl images={images}>
      <figure>
        <img
          alt={alt}
          src={src}
          className="hover:cursor-zoom-in rounded-lg shadow-md"
          onClick={(e) => {
            e.stopPropagation();
            const index = images.findIndex(img => img === image);
            openLightbox({ images, index });
          }}
        />
        {figcaption}
      </figure>
    </LightboxDialogFromUrl>
  );
}
