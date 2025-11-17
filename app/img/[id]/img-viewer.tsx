'use client';

import { Lightbox } from "@/app/components/lightbox";
import { type GuideImage, getId } from "@/lib/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function ImgViewer(
  { images }: { images: GuideImage[] }
) {
  const [index, setIndex] = useState(0);
  const router = useRouter();
  const handleSetIndex = (newIndex: number) => {
    setIndex(newIndex);
    const newImage = images[newIndex];
    const newId = getId(newImage);
    router.push(`/img/${newId}`, { scroll: false });
  };
  return (
    <div className="mx-2">
      <Lightbox images={images} index={index} setIndex={handleSetIndex} />
    </div>
  );
}