'use client';

import { Tooltip, TooltipTrigger, TooltipContent } from './tooltip';
import { Popover, PopoverTrigger, PopoverContent } from './popover';
import { TooltipContentProps, TooltipProps, TooltipTriggerProps } from '@radix-ui/react-tooltip';
import { PopoverContentProps, PopoverProps, PopoverTriggerProps } from '@radix-ui/react-popover';
import { useTouch } from './touch-context';
/**
 * A hybrid Tooltip/Popover component that uses Tooltip for mouse users and Popover for touch users.
 * 
 * From https://github.com/shadcn-ui/ui/issues/2402#issuecomment-1930895113
 * 
 * @param props Tooltip or Popover props
 * @returns A hybrid component that switches between Tooltip and Popover based on input method
 */
export const HybridTooltip = (props: TooltipProps & PopoverProps) => {
  const isTouch = useTouch();
  return isTouch ? <Popover {...props} /> : <Tooltip {...props} />;
};

export const HybridTooltipTrigger = (props: TooltipTriggerProps & PopoverTriggerProps) => {
  const isTouch = useTouch();
  return isTouch ? <PopoverTrigger {...props} /> : <TooltipTrigger {...props} />;
};

export const HybridTooltipContent = (props: TooltipContentProps & PopoverContentProps) => {
  const isTouch = useTouch();
  return isTouch ? <PopoverContent {...props} /> : <TooltipContent {...props} />;
};