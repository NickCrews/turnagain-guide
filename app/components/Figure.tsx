'use client'

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface FigureProps {
  src: string;
  alt?: string;
  caption?: string;
  [key: string]: any;
}

export default function Figure(props: FigureProps) {
  const { caption, alt, src, ...rest } = props;
  // This isn't accessible, but this site is for skiers...
  const realAlt = alt || "If this alt text is needed for you, please let me know at nicholas.b.crews@gmail.com!";
  const figcaption = <figcaption className="prose text-center">{caption}</figcaption>
  
  const [isOpen, setIsOpen] = useState(false);
  const closeLightbox = useCallback(() => {
    setIsOpen(false)
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLightbox()
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, closeLightbox])

  return <>
    <figure>
      <Image
        alt={realAlt}
        src={src}
        {...rest}
        onClick={() => setIsOpen(true)}
        className="hover:cursor-zoom-in"
      />
      {caption && figcaption}
    </figure>
    {isOpen && createPortal(
      <div className="fixed inset-0 z-50 bg-black bg-opacity-75 hover:cursor-zoom-out" onClick={closeLightbox}>
        <div className="fixed inset-4 lg:inset-16">
          <figure className="relative h-full w-full flex flex-col items-center justify-center">
            <button
              className="absolute top-0 left-0 text-black text-3xl bg-white bg-opacity-80 p-2 rounded hover:bg-opacity-100"
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              &times;
            </button>
            <Image
              alt={realAlt}
              src={src}
              {...rest}
              onClick={(e) => e.stopPropagation()}
              className="max-w-full max-h-full object-contain hover:cursor-default"
            />
            {caption && figcaption}
          </figure>
        </div>
      </div>,
      document.body
    )}
  </>
}