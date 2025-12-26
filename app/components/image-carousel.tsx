import { useRef, useState } from "react";
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
    const dragStartX = useRef<number | null>(null);
    const didSwipeRef = useRef(false);
    const swipeThreshold = 40;
    const [dragOffset, setDragOffset] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const isDraggingRef = useRef(false);
    const activePointerId = useRef<number | null>(null);

    const { openLightbox } = useOpenLightboxFromParams();

    const overscrollLimit = 32;

    const clampOffset = (index: number, delta: number) => {
        if (!hasMultiple) return 0;
        if (index === 0 && delta > 0) return Math.min(delta, overscrollLimit);
        if (index === images.length - 1 && delta < 0) return Math.max(delta, -overscrollLimit);
        return delta;
    };

    const goNext = (wrap = true) => setSelectedIndex((prevIndex) => wrap ? (prevIndex + 1) % images.length : Math.min(prevIndex + 1, images.length - 1));
    const goPrev = (wrap = true) => setSelectedIndex((prevIndex) => wrap ? (prevIndex - 1 + images.length) % images.length : Math.max(prevIndex - 1, 0));

    const rightClickOnClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        goNext();
    };

    const leftClickOnClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        goPrev();
    };

    const resetDrag = () => {
        dragStartX.current = null;
        isDraggingRef.current = false;
        setIsDragging(false);
        activePointerId.current = null;
        setDragOffset(0);
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        if (!hasMultiple) return;
        dragStartX.current = e.clientX;
        activePointerId.current = e.pointerId;
        isDraggingRef.current = true;
        setIsDragging(true);
        didSwipeRef.current = false;
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDraggingRef.current || activePointerId.current !== e.pointerId) return;
        if (dragStartX.current === null) return;
        setDragOffset(clampOffset(selectedIndex, e.clientX - dragStartX.current));
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (!isDraggingRef.current || activePointerId.current !== e.pointerId) return;
        if (dragStartX.current === null) {
            resetDrag();
            return;
        }
        const rawDelta = e.clientX - dragStartX.current;
        const clampedDelta = clampOffset(selectedIndex, rawDelta);
        const blockedDirection = (selectedIndex === 0 && rawDelta > 0) || (selectedIndex === images.length - 1 && rawDelta < 0);
        if (!blockedDirection && Math.abs(rawDelta) > swipeThreshold) {
            didSwipeRef.current = true;
            if (rawDelta < 0) {
                goNext(false);
            } else {
                goPrev(false);
            }
        }
        if (blockedDirection) setDragOffset(clampedDelta);
        resetDrag();
    };

    const handlePointerCancel = (e: React.PointerEvent) => {
        if (activePointerId.current !== e.pointerId) return;
        resetDrag();
    };

    return (
        <div className="relative h-56 group">
            {hasMultiple && NextButton({ onClick: rightClickOnClick, className: "right-3 absolute top-1/2 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200" })}
            <LightboxDialogFromUrl images={images}>
                {/* This acts as a "Frame", a little window through which you can see the "Track" of images.*/}
                <div
                    className="overflow-hidden rounded-lg shadow-md h-full"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerCancel}
                    style={{ touchAction: "pan-y" }}
                >
                    {/* The track of images, all stacked left to right, and then the entire
                      thing is moved left/right to show the current image. */}
                    <div
                        className={cn("flex h-full transition-transform duration-500 ease-in-out", isDragging && "transition-none")}
                        style={{ transform: `translateX(calc(-${selectedIndex * 100}% + ${dragOffset}px))` }}
                    >
                        {images.map((image, index) => {
                            const imagePath = image.imagePath;
                            const imageAltText = getImageAltText(image);
                            if (triggerLightbox) {
                                return (
                                    <a
                                        onClick={(e) => {
                                            if (didSwipeRef.current) {
                                                didSwipeRef.current = false;
                                                return;
                                            }
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

