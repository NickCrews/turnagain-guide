import { ImgViewer } from "./img-viewer";
import { loadGuideImages, relatedImages } from "@/lib/image";

export async function generateStaticParams() {
  const images = await loadGuideImages();
  return Object.keys(images).map(id => ({ id }));
}

export default async function ImgPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const p = await params;
  const allImages = await loadGuideImages();
  const thisImage = allImages[p.id];
  const images = [thisImage, ...await relatedImages(thisImage, 10)];
  return (
    <ImgViewer images={images} />
  );
}