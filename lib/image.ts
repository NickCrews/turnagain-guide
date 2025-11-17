import { GPXPoint } from "@/lib/gpx"
import { loadGeoItems } from "@/lib/geo-item";

export interface GuideImage {
    imagePath: string
    id?: string
    title?: string,
    description?: string
    /** If not defined, will use title or description */
    altText?: string
    gpxPoint?: GPXPoint
}

/** In order of preference: altText, title, description, undefined */
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

/** Either the id, or the part of the image path, eg "/img/foo.jpg" -> "foo" */
export function getId(image: GuideImage) {
    if (image.id) {
        return image.id;
    }
    const parts = image.imagePath.split("/");
    const filename = parts[parts.length - 1];
    return filename.split(".")[0];
}

export async function loadGuideImages(): Promise<Record<string, GuideImage>> {
    const items = await loadGeoItems();
    const imagesById: Record<string, GuideImage> = {};
    for (const item of items) {
        if (item.properties.images) {
            for (const img of item.properties.images) {
                imagesById[getId(img)] = {
                    imagePath: img.imagePath,
                    title: img.title,
                    description: img.description,
                    altText: img.altText,
                    gpxPoint: img.gpxPoint,
                };
            }
        }
    }
    return imagesById;
}

export async function relatedImages(image: GuideImage, maxRelated: number = 5): Promise<GuideImage[]> {
    const allImages = await loadGuideImages();
    // Placeholder for now.
    // Ideally this should rank by distance from the image's gpxPoint to other images' gpxPoints,
    // or by being in the same geoItem, etc.
    const relatedImages = Object.values(allImages).filter(img => img !== image).slice(0, maxRelated);
    return relatedImages;
}