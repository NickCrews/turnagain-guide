import { GPXPoint } from "@/lib/gpx"

export interface GuideImage {
    imagePath: string
    title?: string,
    description?: string
    /** If not defined, will use title or description */
    altText?: string
    gpxPoint?: GPXPoint
}

export function getImageAltText(image: GuideImage) {
    if (image.altText) {
        return image.altText;
    }
    if (image.title) {
        return image.title;
    }
    if (image.description) {
        return image.description;
    }
    return undefined;
}
