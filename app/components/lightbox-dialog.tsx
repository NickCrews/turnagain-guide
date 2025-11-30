'use client';

import { Lightbox } from "@/app/components/lightbox";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { type GuideImage } from "@/lib/image";
import { useHybridState } from "@/lib/hybrid-state";

export interface LightboxDialogProps {
  images: GuideImage[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (newIndex: number) => void;
}

export function LightboxDialog(
  {
    images,
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
        <DialogTitle className="sr-only">{images[index]!.title || images[index]!.id}</DialogTitle>
        <Lightbox images={images} index={index} onIndexChange={setIndex} />
      </DialogContent>
    </Dialog>
  );
}