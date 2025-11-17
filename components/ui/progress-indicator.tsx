import React from "react";
import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  total: number;
  current: number; // zero-based index
  className?: string;
}

// Caps dots at 5 so space usage stays stable.
export default function ProgressIndicator({ total, current, className }: ProgressIndicatorProps) {
  if (total <= 0) return null;
  const maxDots = 5;
  const dotsToShow = Math.min(maxDots, total);
  const activeDot = total <= maxDots ? current : Math.round(current * (maxDots - 1) / (total - 1));
  const label = `Image ${current + 1} of ${total}`;

  return (
    <div
      aria-label={label}
      className={cn(
        "flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm", 
        "shadow-md", 
        className
      )}
    >
      {Array.from({ length: dotsToShow }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-3 w-3 rounded-full transition", 
            i === activeDot ? "bg-white" : "bg-white/40"
          )}
        />
      ))}
    </div>
  );
}
