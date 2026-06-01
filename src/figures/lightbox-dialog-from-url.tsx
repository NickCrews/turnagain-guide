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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const figIdParam = searchParams.get('lightbox');
  const index = figures.findIndex(img => img.id === figIdParam);
  const isOpen = figIdParam !== null && index !== -1;

  // Update only the `lightbox` param, preserving everything else (e.g. the map's
  // filter/selection params) so opening/arrowing/closing keeps the user's place.
  const withLightbox = (figureId: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (figureId === null) {
      params.delete('lightbox');
    } else {
      params.set('lightbox', figureId);
    }
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  };

  const onIndexChange = (newIndex: number) => {
    router.push(withLightbox(figures[newIndex].id), { scroll: false });
  };

  const closeLightbox = () => {
    router.push(withLightbox(null), { scroll: false });
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