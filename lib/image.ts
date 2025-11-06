import { GPXPoint } from "@/lib/gpx"

export interface GuideImage {
    imagePath: string
}

export interface ImageWithGPX extends GuideImage {
    gpxPointOnMap: GPXPoint
}

export interface ImageWithTitleAndDescription extends GuideImage {
    title: string,
    description?: string
}

export interface ImageWithTitleDescriptionAndGPX extends ImageWithGPX, ImageWithTitleAndDescription {

}


export function getImageAltText(image: GuideImage) {
    let imageAltText = "";
    if ((image as ImageWithTitleAndDescription).description) {
        imageAltText = (image as ImageWithTitleAndDescription).description;
    }
    else if ((image as ImageWithTitleAndDescription).title) {
        imageAltText = (image as ImageWithTitleAndDescription).title;
    }
    return imageAltText;
}
