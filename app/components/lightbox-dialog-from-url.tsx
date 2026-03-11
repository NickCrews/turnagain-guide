'use client'

import { type ReactNode } from 'react';
import { LightboxDialog } from '@/app/components/lightbox-dialog';
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { GuideImage } from '@/imageRegistry/images';

export interface LightboxDialogFromUrlParams {
  children: ReactNode;
  images: GuideImage[];
}

export const LightboxDialogFromUrl = ({
  children,
  images,
}: LightboxDialogFromUrlParams) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const imgIdParam = searchParams.get('lightbox');
  const index = images.findIndex(img => img.id === imgIdParam);
  const isOpen = imgIdParam !== null && index !== -1;

  const paramFromIndex = (images: GuideImage[], idx: number) => images[idx].id;

  const onIndexChange = (newIndex: number) => {
    console.log("Changing index in LightboxDialogContext to ", newIndex);
    const newParam = paramFromIndex(images, newIndex);
    router.push(`?lightbox=${newParam}`);
  };

  const closeLightbox = () => {
    console.log("Closing LightboxDialog from context");
    router.push(window.location.pathname);
  }

  return (
    <>
      {children}
      {isOpen && images && (
        <LightboxDialog
          images={images}
          index={index}
          open={isOpen}
          onOpenChange={(open) => {
            if (!open) {
              closeLightbox();
            }
          }}
          onIndexChange={onIndexChange}
        />
      )}
    </>
  );
}

export function useOpenLightboxFromParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const openLightbox = ({ images, index }: { images: GuideImage[], index: number }) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('lightbox', images[index].id);
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  const closeLightbox = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete('lightbox');
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  return { openLightbox, closeLightbox };
}