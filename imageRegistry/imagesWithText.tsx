import { sunburstAndMagnum } from "./imagesWithPaths";
import { type ImageWithTitleAndDescription } from "@/lib/image";

export const sunburstMagnumImageText = {
    title: "Sunburst and Magnum",
    description: "Sunburst on the left side and Magnum on the Right.",
    ...sunburstAndMagnum,
} as const satisfies ImageWithTitleAndDescription;
