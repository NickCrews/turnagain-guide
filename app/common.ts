import { useEffect, useState } from 'react';

/**
 * A React hook that returns a boolean indicating whether the window width is below a specified value.
 * The hook automatically updates when the window is resized.
 * 
 * Based on: https://dev.to/musselmanth/re-rendering-react-components-at-breakpoint-window-resizes-a-better-way-4343
 * 
 * @param innerWidth - The width threshold in pixels to check against
 * @returns {boolean | undefined} - A boolean indicating whether the window width is
 *   below the specified value, or undefined if the window object is not available.
 * 
 * @example
 * ```tsx
 * const isMobile = useIsBelowWidth(768);
 * ```
 */
export function useIsBelowWidth(innerWidth: number) {
  const [isBelowWidth, setIsBelowWidth] = useState((typeof window !== 'undefined') ? window.innerWidth <= innerWidth : undefined);

  useEffect(() => {
    const windowResizeHandler = () => {
      const matchMediaString = `(max-width: ${innerWidth}px)`;
      setIsBelowWidth(window.matchMedia(matchMediaString).matches);
    };

    window.addEventListener('resize', windowResizeHandler);
    return () => window.removeEventListener('resize', windowResizeHandler);
  }, [innerWidth]);

  return isBelowWidth;
};
  
export default useIsBelowWidth;