'use client';

import { Lightbox } from "@/figures/lightbox";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { type Figure } from "@/figures";
import { useHybridState } from "@/lib/hybrid-state";

export interface LightboxDialogProps {
  figures: Figure[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (newIndex: number) => void;
}

export function LightboxDialog(
  {
    figures,
    open: controlledOpen,
    defaultOpen,
    onOpenChange,
    index: controlledIndex,
    defaultIndex,
    onIndexChange,
  }: LightboxDialogProps
) {
  const [index, setIndex] = useHybridState<number>(
    controlledIndex,
    defaultIndex ?? 0,
    onIndexChange
  );
  const [open, setOpen] = useHybridState<boolean>(
    controlledOpen,
    defaultOpen ?? true,
    onOpenChange
  );
  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogOverlay className="bg-green" />
      <DialogContent className="max-w-10xl p-0 overflow-y-auto max-h-[90vh]">
        <DialogTitle className="sr-only">{figures[index]!.title || figures[index]!.id}</DialogTitle>
        <Lightbox figures={figures} index={index} onIndexChange={setIndex} />
      </DialogContent>
    </Dialog>
  );
}