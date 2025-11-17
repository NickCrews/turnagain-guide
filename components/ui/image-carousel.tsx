import { useState } from "react";
import { cn } from "@/lib/utils";
import { getImageAltText, GuideImage } from "@/lib/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageCarousel(images: GuideImage[]) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const rightIndex = (selectedIndex + 1) % images.length;
    const leftIndex = (selectedIndex - 1 + images.length) % images.length;

    const rightClickOnClick = (e: React.MouseEvent<HTMLElement>) => {
        // Event is manually handled to navigate to the route page, so we need to use stopPropagation instead
        // of preventDefault. preventDefault only stops default actions, so will do nothing to prevent the route
        // card from going to the route page after the left or right arrow is pressed.
        e.stopPropagation();
        setSelectedIndex(rightIndex);
    };

    const leftClickOnClick = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        setSelectedIndex(leftIndex);
    };

    const getImageWithClassesApplied = (
        image: GuideImage,
        imageIndex: number,
    ) => {
        const baseClasses =
            "w-full h-48 rounded-lg shadow-md z-20 absolute top-1/2 left-1/2";
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

    const arrowClassBase =
        "absolute top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-lg bg-black/30 shadow-lg backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-black/50 transition opacity-0 group-hover:opacity-100 transition-opacity duration-200";

    return (
        <div className="relative h-48 group">
            <button
                className={cn(arrowClassBase, "left-3")}
                onClick={leftClickOnClick}
            >
                <ChevronLeft size={48} className="text-white" />
            </button>
            <div className="overflow-hidden">
                {images.map((image, index) =>
                    getImageWithClassesApplied(image, index)
                )}
            </div>
            <button
                className={cn(arrowClassBase, "right-3")}
                onClick={rightClickOnClick}
            >
                <ChevronRight size={48} className="text-white" />
            </button>
        </div>
    );
}
