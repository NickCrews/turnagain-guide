import { useEffect, useState } from 'react';


/**
 * A React hook that returns a boolean indicating whether the window width is below a specified value.
 * The hook automatically updates when the window is resized.
 * 
 * Based on: https://dev.to/musselmanth/re-rendering-react-components-at-breakpoint-window-resizes-a-better-way-4343
 * 
 * @param innerWidth - The width threshold in pixels to check against
 * @param initialValue - The initial value of the hook if window is not available, defaults to false.
 * @returns boolean - True if window width is less than or equal to the threshold, false otherwise
 * 
 * @example
 * ```tsx
 * const isMobile = useIsBelowWidth(768);
 * ```
 */
export function useIsBelowWidth(innerWidth: number, initialValue: boolean = false) {
  const [isBelowWidth, setIsBelowWidth] = useState((typeof window !== 'undefined') ? window.innerWidth <= innerWidth : initialValue);

  useEffect(() => {
    const windowResizeHandler = () => {
      const matchMediaString = `(max-width: ${innerWidth}px)`;
      setIsBelowWidth(window.matchMedia(matchMediaString).matches);
    };

    window.addEventListener('resize', windowResizeHandler);
    return () => window.removeEventListener('resize', windowResizeHandler);
  }, []);

  return isBelowWidth;
};
  
export default useIsBelowWidth;