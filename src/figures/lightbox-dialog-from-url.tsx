'use client'

import { type ReactNode } from 'react';
import { LightboxDialog } from '@/figures/lightbox-dialog';
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { type Figure } from '@/figures';

export interface LightboxDialogFromUrlParams {
  children: ReactNode;
  figures: Figure[];
}

export const LightboxDialogFromUrl = ({
  children,
  figures,
}: LightboxDialogFromUrlParams) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const figIdParam = searchParams.get('lightbox');
  const index = figures.findIndex(img => img.id === figIdParam);
  const isOpen = figIdParam !== null && index !== -1;

  const paramFromIndex = (figures: Figure[], idx: number) => figures[idx].id;

  const onIndexChange = (newIndex: number) => {
    console.log("Changing index in LightboxDialogContext to ", newIndex);
    const newParam = paramFromIndex(figures, newIndex);
    router.push(`?lightbox=${newParam}`);
  };

  const closeLightbox = () => {
    console.log("Closing LightboxDialog from context");
    router.push(window.location.pathname);
  }

  return (
    <>
      {children}
      {isOpen && figures && (
        <LightboxDialog
          figures={figures}
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

  const openLightbox = ({ figures, index }: { figures: Figure[], index: number }) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('lightbox', figures[index].id);
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  const closeLightbox = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete('lightbox');
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  return { openLightbox, closeLightbox };
}