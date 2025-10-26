import { GPXPoint } from "@/lib/gpx"

export interface Image {
    imagePath: string
}

export interface ImageWithGPX extends Image {
    gpxPointOnMap: GPXPoint
}

export interface ImageWithTitleAndDescription extends Image {
    title: string,
    description?: string
}

export interface ImageWithTitleDescriptionAndGPX extends ImageWithGPX, ImageWithTitleAndDescription {

}