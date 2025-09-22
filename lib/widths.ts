import {useEffect, useState} from "react";

import defaultTheme from 'tailwindcss/defaultTheme'

type CssAbsoluteUnit = "cm" | "mm" | "in" | "px" | "pt" | "pc";
type CssRelativeUnit = "em" | "ex" | "ch" | "rem" | "vw" | "vh" | "vmin" | "vmax" | "%";
type CssLengthUnit = CssAbsoluteUnit | CssRelativeUnit;

type CssLength = `${number}${CssLengthUnit}`;

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
const breakpoints = defaultTheme.screens as Record<Breakpoint, CssLength>;

export function useBreakpoint<K extends Breakpoint>(breakpointKey: K) {
  const breakpointValueText = breakpoints[breakpointKey];
  const isBelow = useIsBelowWidth(breakpointValueText);
  const capitalizedKey = breakpointKey[0].toUpperCase() + breakpointKey.substring(1);

  return {
      [`text${capitalizedKey}`]: breakpointValueText,
      [`isBelow${capitalizedKey}`]: isBelow,
      [`isAbove${capitalizedKey}`]: isBelow === undefined ? undefined : !isBelow,
  } as (
    Record<`text${Capitalize<K>}`, string> &
    Record<`isBelow${Capitalize<K>}`, boolean | undefined> & 
    Record<`isAbove${Capitalize<K>}`, boolean | undefined>
  );
}

/**
 * A React hook that returns a boolean indicating whether the window width is below a specified value.
 * The hook automatically updates when the window is resized.
 * 
 * Based on: https://dev.to/musselmanth/re-rendering-react-components-at-breakpoint-window-resizes-a-better-way-4343
 * 
 * @param width - 
 *    The width threshold to check against. Can be a
 *    - number, eg pixels
 *    - string, eg "640px", "40rem"
 *    - tailwindcss breakpoint key, eg "sm", "md", "lg", "xl", "2xl"
 * @returns {boolean | undefined} - A boolean indicating whether the window width is
 *   below the specified value, or undefined if the window object is not available.
 * 
 * @example
 * ```tsx
 * const isMobile = useIsBelowWidth(768);
 * const isMobileRem = useIsBelowWidth("48rem");
 * ```
 */
export function useIsBelowWidth(width: number | CssLength | Breakpoint) : boolean | undefined {
  const [isBelowWidth, setIsBelowWidth] = useState<boolean | undefined>(undefined);
  // convert from tailwind breakpoint key to pixels
  if (typeof width === 'string' && breakpoints[width as Breakpoint]) {
    width = breakpoints[width as Breakpoint];
  }
  const widthString = typeof width === 'number' ? `${width}px` : width;

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${widthString})`);
    const handleChange = (event: MediaQueryListEvent) => {
      setIsBelowWidth(event.matches);
    };
    setIsBelowWidth(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [widthString]);

  return isBelowWidth;
};