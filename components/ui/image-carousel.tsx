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
    const rightIndex = (selectedIndex + 1) % images.length;
    const leftIndex = (selectedIndex - 1 + images.length) % images.length;

    const { openLightbox } = useOpenLightboxFromParams();

    const rightClickOnClick = (e: React.MouseEvent) => {
        // Event is manually handled to navigate to the route page, so we need to use stopPropagation instead
        // of preventDefault. preventDefault only stops default actions, so will do nothing to prevent the route
        // card from going to the route page after the left or right arrow is pressed.
        e.stopPropagation();
        setSelectedIndex(rightIndex);
    };

    const leftClickOnClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedIndex(leftIndex);
    };

    const getImageWithClassesApplied = (
        image: GuideImage,
        imageIndex: number,
    ) => {
        const baseClasses =
            "w-full h-48 rounded-lg shadow-md z-20 absolute top-1/2 left-1/2 object-cover";
        const imagePath = image.imagePath;
        const imageAltText = getImageAltText(image);
        if (imageIndex == selectedIndex) {
            return (
                <img
                    src={imagePath}
                    className={cn(
                        baseClasses,
                        "-translate-x-1/2 -translate-y-1/2 transition duration-500 ease-in-out",
                    )}
                    key={imageIndex}
                    alt={imageAltText}
                    title={imageAltText}
                />
            );
        } else if (imageIndex == rightIndex) {
            return (
                <img
                    src={imagePath}
                    className={cn(
                        baseClasses,
                        "translate-x-31/20 -translate-y-1/2",
                    )}
                    key={imageIndex}
                    alt={imageAltText}
                    title={imageAltText}
                />
            );
        } else if (imageIndex == leftIndex) {
            return (
                <img
                    src={imagePath}
                    className={cn(
                        baseClasses,
                        "-translate-x-31/20 -translate-y-1/2",
                    )}
                    key={imageIndex}
                    alt={imageAltText}
                    title={imageAltText}
                />
            );
        } else {
            return (
                <img
                    src={imagePath}
                    className={cn(baseClasses, "hidden")}
                    key={imageIndex}
                    alt={imageAltText}
                />
            );
        }
    };

    function linkAndImage(image: GuideImage, index: number) {
        if (triggerLightbox) {
            return (
                <a
                    onClick={(e) => {
                        e.stopPropagation();
                        openLightbox({ images, index });
                    }}
                    key={index}
                    className="hover:cursor-pointer"
                >
                    {getImageWithClassesApplied(image, index)}
                </a>
            );
        } else {
            return getImageWithClassesApplied(image, index);
        }
    }

    return (
        <div className="relative h-48 group">
            {hasMultiple && NextButton({ onClick: rightClickOnClick, className: "right-3 absolute top-1/2 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200" })}
            <LightboxDialogFromUrl images={images}>
                <div className="overflow-hidden">
                    {images.map(linkAndImage)}
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

