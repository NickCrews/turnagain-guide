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
        // @ts-expect-error   I think this should work from typesscript's type narrowing documentation,
        // not really sure why this doesn't check. The type is string | undefined. 
        // undefined would evaluate to false and not hit the if statement.
        // even adding typeof(description) === "string" doesn't do it.
        imageAltText = (image as ImageWithTitleAndDescription).description; 
    }
    else if ((image as ImageWithTitleAndDescription).title) {
        imageAltText = (image as ImageWithTitleAndDescription).title;
    }
    return imageAltText;
}
