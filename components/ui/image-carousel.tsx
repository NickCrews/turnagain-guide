import { useState } from "react";
import { cn } from "@/lib/utils";
import { Image, ImageWithTitleAndDescription } from "@/lib/image";

function leftArrow() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} className="size-8 stroke-black">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>

    )
}

function rightArrow() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} className="size-8 stroke-black">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
    )
}


export default function ImageCarousel(images: Image[]) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const rightClickOnCLick = (e: React.MouseEvent<HTMLElement>) => {
        // Event is manually handled to navigate to the route page, so we need to use stopPropagation instead
        // of preventDefault. preventDefault only stops default actions, so will do nothing to prevent the route
        // card from going to the route page after the left or right arrow is pressed.
        e.stopPropagation();
        if (selectedIndex + 1 < images.length){
            setSelectedIndex(selectedIndex + 1);
        }
        else {
            setSelectedIndex(0);
        }
    }

    const leftClickOnCLick = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        if (selectedIndex - 1 >= 0){
            setSelectedIndex(selectedIndex - 1);
        }
        else {
            setSelectedIndex(images.length - 1);
        }
    }

    const getNextImageOnRightIndex = () => {
        if (selectedIndex + 1 < images.length){
            return selectedIndex + 1;
        }
        else {
            return 0;
        }
    }

    const getNextImageOnLeftIndex = () => {
        if (selectedIndex - 1 >= 0){
            return selectedIndex -1;
        }
        else {
            return images.length - 1;
        }
    }



    const getImageWithClassesApplied = (image: Image, imageIndex: number) => {
        const baseClasses = "w-full h-48 rounded-lg shadow-md z-20 absolute top-1/2 left-1/2 transition duration-500 ease-in-out";
        const imagePath = image.imagePath;
        let imageAltText = "";
        if ((image as ImageWithTitleAndDescription).description) {
            imageAltText = (image as ImageWithTitleAndDescription).description
        }
        else if ((image as ImageWithTitleAndDescription).title) {
            imageAltText = (image as ImageWithTitleAndDescription).title;
        }
        if (imageIndex == selectedIndex) {
            return (
                <img
                    src={imagePath}
                    className={cn(baseClasses, "-translate-x-1/2 -translate-y-1/2")}
                    key={imageIndex}
                    alt={imageAltText}
                />
            );
        }
        else if (imageIndex == getNextImageOnRightIndex()) {
            return (
                <img
                    src={imagePath}
                    className={cn(baseClasses, "translate-x-3/2 -translate-y-1/2")}
                    key={imageIndex}
                    alt={imageAltText}
                />
            );
        }
        else if (imageIndex == getNextImageOnLeftIndex()) {
            return (
                <img
                    src={imagePath}
                    className={cn(baseClasses, "-translate-x-3/2 -translate-y-1/2")}
                    key={imageIndex}
                    alt={imageAltText}

                />
            );
        }
        else {
            return  (
                <img
                    src={imagePath}
                    className={cn(baseClasses, "hidden")}
                    key={imageIndex}
                    alt={imageAltText}
                />
            );
        }
    }

    return (
        <div className="relative h-48">
            <div className="absolute left-3 top-1/2 z-30" onClick={leftClickOnCLick}>
                {leftArrow() }
            </div>
            <div className="overflow-hidden">
                {images.map((image, index) => getImageWithClassesApplied(image, index))
                }
            </div>
            <div className="absolute right-3 top-1/2 z-30" onClick={rightClickOnCLick}>
                {rightArrow()}
            </div>
        </div>
    )
}