import { useState } from "react";
import { cn } from "@/lib/utils";
import { getImageAltText, GuideImage } from "@/lib/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProgressIndicator from "./progress-indicator";
import { LightboxDialogFromUrl, useOpenLightboxFromParams } from "@/app/components/lightbox-dialog-from-url";

export interface ImageCarouselProps {
    images: GuideImage[];
    triggerLightbox: boolean;
}

export default function ImageCarousel({ images, triggerLightbox }: ImageCarouselProps) {
    const hasMultiple = images.length > 1;
    const [selectedIndex, setSelectedIndex] = useState(0);

    const { openLightbox } = useOpenLightboxFromParams();

    const rightClickOnClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const leftClickOnClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    return (
        <div className="relative h-56 group">
            {hasMultiple && NextButton({ onClick: rightClickOnClick, className: "right-3 absolute top-1/2 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200" })}
            <LightboxDialogFromUrl images={images}>
                {/* This acts as a "Frame", a little window through which you can see the "Track" of images.*/}
                <div className="overflow-hidden rounded-lg shadow-md h-full">
                    {/* The track of images, all stacked left to right, and then the entire
                      thing is moved left/right to show the current image. */}
                    <div
                        className="flex h-full transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${selectedIndex * 100}%)` }}
                    >
                        {images.map((image, index) => {
                            const imagePath = image.imagePath;
                            const imageAltText = getImageAltText(image);
                            if (triggerLightbox) {
                                return (
                                    <a
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openLightbox({ images, index });
                                        }}
                                        key={index}
                                        className="w-full h-full flex-shrink-0 hover:cursor-pointer"
                                    >
                                        <img
                                            src={imagePath}
                                            alt={imageAltText}
                                            title={imageAltText}
                                            className="w-full h-full object-cover"
                                        />
                                    </a>
                                );
                            } else {
                                return (
                                    <img
                                        key={index}
                                        src={imagePath}
                                        alt={imageAltText}
                                        title={imageAltText}
                                        className="w-full h-full flex-shrink-0 object-cover"
                                    />
                                );
                            }
                        })}
                    </div>
                </div>
            </LightboxDialogFromUrl>
            {hasMultiple && PrevButton({ onClick: leftClickOnClick, className: "left-3 absolute top-1/2 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200" })}
            {hasMultiple && <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-40">
                <ProgressIndicator total={images.length} current={selectedIndex} />
            </div>
            }
        </div>
    );
}

export function NextButton({ onClick, className }: { onClick: (e: React.MouseEvent) => void, className?: string }) {
    return (
        <button
            className={cn(
                "h-12 w-12 rounded-lg bg-black/30 shadow-lg backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-black/50 transition",
                className
            )}
            onClick={onClick}
        >
            <ChevronRight size={48} className="text-white" />
        </button>
    );
}

export function PrevButton({ onClick, className }: { onClick: (e: React.MouseEvent) => void, className?: string }) {
    return (
        <button
            className={cn(
                "h-12 w-12 rounded-lg bg-black/30 shadow-lg backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-black/50 transition",
                className
            )}
            onClick={onClick}
        >
            <ChevronLeft size={48} className="text-white" />
        </button>
    );
}

