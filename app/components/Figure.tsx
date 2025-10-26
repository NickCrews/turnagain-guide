'use client'

import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { StaticImageData } from "next/image";
import { ReactNode } from "react";

interface FigureProps {
  src: string | StaticImageData;
  alt?: string;
  caption?: string | ReactNode;
  [key: string]: any;
}

export default function Figure(props: FigureProps) {
  const { caption, alt, src, ...rest } = props;
  if (!("width" in rest)){
    rest["width"] = 500;
  }
  if (!("height" in rest)){
    rest["height"] = 500;
  }
  // This isn't accessible, but this site is for skiers...
  const realAlt = alt || "If this alt text is needed for you, please let me know at nicholas.b.crews@gmail.com!";
  const figcaption = <figcaption className="prose text-center leading-6">{caption}</figcaption>
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <figure>
          <Image
            alt={realAlt}
            src={src}
            {...rest}
            className="hover:cursor-zoom-in"
          />
          {caption && figcaption}
        </figure>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 border-none">
        <DialogHeader className="bg-background">
          <VisuallyHidden>
            <DialogTitle>Photos</DialogTitle>
          </VisuallyHidden>
        </DialogHeader>
        <figure className="relative flex flex-col items-center h-full">
          <Image
            alt={realAlt}
            src={src}
            {...rest}
            className="max-w-full max-h-[80vh] object-contain hover:cursor-default"
          />
          {caption && figcaption}
        </figure>
      </DialogContent>
    </Dialog>
  );
}
