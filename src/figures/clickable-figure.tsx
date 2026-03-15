'use client'

import { type ReactNode } from "react";
import { type Figure } from "@/figures";
import { LightboxDialogFromUrl, useOpenLightboxFromParams } from "./lightbox-dialog-from-url";

interface ClickableFigureProps {
  figure: Figure;
  figures: Figure[];
  caption?: ReactNode;
}

export default function ClickableFigure({ figure, figures, caption }: ClickableFigureProps) {
  const alt = figure.altText || "Figure Image";
  const src = figure.imagePath;
  const captionText = caption || figure.description;
  const figcaption = captionText ? <figcaption className="prose text-center leading-6">{captionText}</figcaption> : null;

  const { openLightbox } = useOpenLightboxFromParams();

  return (
    <LightboxDialogFromUrl figures={figures}>
      <figure>
        <img
          alt={alt}
          src={src}
          className="hover:cursor-zoom-in rounded-lg shadow-md"
          onClick={(e) => {
            e.stopPropagation();
            const index = figures.findIndex(img => img === figure);
            openLightbox({ figures: figures, index });
          }}
        />
        {figcaption}
      </figure>
    </LightboxDialogFromUrl>
  );
}
