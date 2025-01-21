import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "@/tailwind.config";
import { Config } from "tailwindcss/types/config";
import {useMemo, useEffect, useState, use} from "react";

export const config = resolveConfig(tailwindConfig as unknown as Config);

const breakpoints = config.theme.screens;
type BreakpointKey = keyof typeof breakpoints;
export function useBreakpoint<K extends BreakpointKey>(breakpointKey: K) {
  // breakpointValueText is something like "640px"
  const breakpointValueText = breakpoints[breakpointKey];
  const breakpointValueInt = Number(breakpointValueText.replace(/[^0-9]/g, ""));
  const isBelow = useIsBelowWidth(breakpointValueInt);
  const capitalizedKey = breakpointKey[0].toUpperCase() + breakpointKey.substring(1);

  const result = {
      [`text${capitalizedKey}`]: breakpointValueText,
      [`number${capitalizedKey}`]: breakpointValueInt,
      [`isBelow${capitalizedKey}`]: isBelow,
      [`isAbove${capitalizedKey}`]: isBelow === undefined ? undefined : !isBelow,
  } as (
    Record<`text${Capitalize<K>}`, string> &
    Record<`number${Capitalize<K>}`, number> &
    Record<`isBelow${Capitalize<K>}`, boolean | undefined> & 
    Record<`isAbove${Capitalize<K>}`, boolean | undefined>
  );
  return useMemo(() => result, [breakpointValueInt, isBelow]);
}

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
export function useIsBelowWidth(innerWidth: number) : boolean | undefined {
  const [isBelowWidth, setIsBelowWidth] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const windowResizeHandler = () => {
      setIsBelowWidth(window.innerWidth <= innerWidth);
    };
    windowResizeHandler();

    window.addEventListener('resize', windowResizeHandler);
    return () => window.removeEventListener('resize', windowResizeHandler);
  }, [innerWidth]);

  return isBelowWidth;
};