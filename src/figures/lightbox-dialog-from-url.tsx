'use client'

import { type ReactNode } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { type Figure } from '@/figures';
import { figureParamUrl } from '@/figures/use-figure-mode';

export interface LightboxDialogFromUrlParams {
  children: ReactNode;
  figures: Figure[];
}

/**
 * Historically this wrapped its children in a fullscreen lightbox dialog driven
 * by the `lightbox` URL param. Figure mode (a mode of the routes explorer) now
 * renders the open figure instead, so this is just a passthrough kept so the
 * existing entry points (map, carousel, clickable figure) don't have to change
 * their JSX shape.
 */
export const LightboxDialogFromUrl = ({ children }: LightboxDialogFromUrlParams) => {
  return <>{children}</>;
}

/** Opens figure mode by setting the figure param, preserving the user's place. */
export function useOpenLightboxFromParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const openLightbox = ({ figures, index }: { figures: Figure[], index: number }) => {
    router.push(figureParamUrl(searchParams, pathname, figures[index].id), { scroll: false });
  };

  const closeLightbox = () => {
    router.push(figureParamUrl(searchParams, pathname, null), { scroll: false });
  };

  return { openLightbox, closeLightbox };
}
