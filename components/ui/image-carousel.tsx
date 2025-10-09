import { useState } from "react";
import { cn } from "@/lib/utils";

function leftArrow() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} className="size-8 stroke-gray-800 opacity-90">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>

    )
}

function rightArrow() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} className="size-8 stroke-gray-800 opacity-90">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
    )
}


export function imageCarousel(images: Array<string>) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const rightClickOnCLick = () => {
        console.log(selectedIndex);
        if (selectedIndex + 1 < images.length){
            setSelectedIndex(selectedIndex + 1);
        }
        else {
            setSelectedIndex(0);
        }
    }

    const leftClickOnCLick = () => {
        console.log(selectedIndex);
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



    const getImageWithClassesApplied = (imagePath: string, imageIndex: number) => {
        const baseClasses = "w-full h-48 rounded-lg shadow-md z-20 absolute top-1/2 left-1/2 transition duration-500 ease-in-out";
        if (imageIndex == selectedIndex) {
            console.log("returning selected index!")
            return (
                <img
                    src={imagePath}
                    className={cn(baseClasses, "-translate-x-1/2 -translate-y-1/2")}
                    key={imageIndex}
                />
            );
        }
        else if (imageIndex == getNextImageOnRightIndex()) {
            console.log("returning next image")
            return (
                <img
                    src={imagePath}
                    className={cn(baseClasses, "translate-x-10/1 -translate-y-1/2")}
                    key={imageIndex}
                />
            );
        }
        else if (imageIndex == getNextImageOnLeftIndex()) {
            console.log("returning previous image")
            return (
                <img
                    src={imagePath}
                    className={cn(baseClasses, "-translate-x-10/1 -translate-y-1/2")}
                    key={imageIndex}
                />
            );
        }
        else {
            console.log("returning other image")
            return  (
                <img
                    src={imagePath}
                    className={cn(baseClasses, "hidden")}
                    key={imageIndex}
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
                {images.map(getImageWithClassesApplied)}
            </div>
            <div className="absolute right-3 top-1/2 z-30" onClick={rightClickOnCLick}>
                {rightArrow()}
            </div>
        </div>
    )
}