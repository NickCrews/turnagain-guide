'use client';

import { useMemo, useState } from 'react';
import { type GuideImage } from '@/imageRegistry/images';
import { MetadataEditor } from './metadata-editor';

interface ElevationPlotProps {
  images: GuideImage[];
  currentImageId: string | null;
}

const PLOT_HEIGHT = 200; // px, the drawable area height
const FT_PER_METER = 3.28084;

function metersToFeet(m: number) {
  return Math.round(m * FT_PER_METER);
}

/**
 * show 1d plot of the images with the elevation, with each image shown in a thumbnail and when I hover an image it expands. This can help me verify the elevations are correct. Highlight the current photo in this plot.
 */
export function ElevationPlot({ images, currentImageId }: ElevationPlotProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [editingImage, setEditingImage] = useState<GuideImage | null>(null);

  const { withElevation, noElevation, minElev, maxElev, yTicks } = useMemo(() => {
    const withElevation = images.filter(img => img.elevation != null);
    const noElevation = images.filter(img => img.elevation == null);

    if (withElevation.length === 0) {
      return { withElevation: [], noElevation, minElev: 0, maxElev: 0, yTicks: [] };
    }

    const elevations = withElevation.map(img => img.elevation!);
    const minElev = Math.min(...elevations);
    const maxElev = Math.max(...elevations);

    // Nice round tick values in meters (every 200m or so)
    const tickStep = maxElev - minElev < 400 ? 100 : 200;
    const firstTick = Math.floor(minElev / tickStep) * tickStep;
    const yTicks: number[] = [];
    for (let t = firstTick; t <= maxElev + tickStep; t += tickStep) {
      yTicks.push(t);
    }

    return { withElevation, noElevation, minElev, maxElev, yTicks };
  }, [images]);

  // Convert elevation to Y position (higher elevation = lower Y = higher on screen)
  const elevToY = (elev: number): number => {
    const span = maxElev - minElev || 1;
    return PLOT_HEIGHT - ((elev - minElev) / span) * PLOT_HEIGHT;
  };

  // Sort by elevation for left-to-right ordering
  const sorted = useMemo(
    () => [...withElevation].sort((a, b) => a.elevation! - b.elevation!),
    [withElevation]
  );

  return (
    <div className="flex flex-col gap-2 h-full">
      {withElevation.length > 0 ? (
        <div className="flex gap-2 overflow-x-auto">
          {/* Y-axis labels */}
          <div
            className="relative flex-shrink-0 w-14 text-right"
            style={{ height: PLOT_HEIGHT }}
          >
            {yTicks.map(tick => (
              <div
                key={tick}
                className="absolute right-0 text-[10px] text-muted-foreground leading-none"
                style={{ top: elevToY(tick), transform: 'translateY(-50%)' }}
              >
                {metersToFeet(tick)}′
              </div>
            ))}
          </div>

          {/* Plot area */}
          <div className="relative flex-1 min-w-[400px]" style={{ height: PLOT_HEIGHT }}>
            {/* Horizontal grid lines */}
            {yTicks.map(tick => (
              <div
                key={tick}
                className="absolute left-0 right-0 border-t border-border/40"
                style={{ top: elevToY(tick) }}
              />
            ))}

            {/* Image dots, evenly spaced horizontally */}
            {sorted.map((img, i) => {
              const id = img.id;
              const isCurrent = id === currentImageId;
              const isHovered = id === hoveredId;
              const xPct = withElevation.length === 1 ? 50 : (i / (withElevation.length - 1)) * 100;
              const y = elevToY(img.elevation!);

              return (
                <div
                  key={id}
                  className="absolute"
                  style={{
                    left: `${xPct}%`,
                    top: y,
                    transform: 'translate(-50%, -50%)',
                    zIndex: isCurrent || isHovered ? 10 : 1,
                  }}
                >
                  {/* Expanded thumbnail on hover */}
                  {isHovered && (
                    <div
                      className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-32 z-20 pointer-events-none"
                      style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))' }}
                    >
                      <img
                        src={img.imagePath}
                        alt={id}
                        className="rounded w-full object-cover"
                      />
                      <p className="text-[10px] font-mono text-center mt-0.5 text-foreground bg-background/80 rounded px-1">
                        {metersToFeet(img.elevation!)}′ ({img.elevation}m)
                      </p>
                    </div>
                  )}

                  <button
                    className="rounded-full border-2 transition-all duration-100 cursor-pointer overflow-hidden"
                    style={{
                      width: isCurrent ? 28 : isHovered ? 24 : 16,
                      height: isCurrent ? 28 : isHovered ? 24 : 16,
                      borderColor: isCurrent ? '#3b82f6' : isHovered ? '#fff' : '#6b7280',
                      boxShadow: isCurrent ? '0 0 0 3px rgba(59,130,246,0.3)' : 'none',
                    }}
                    onMouseEnter={() => setHoveredId(id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => setEditingImage(img)}
                    title={`${id} — ${metersToFeet(img.elevation!)}ft`}
                  >
                    <img
                      src={img.imagePath}
                      alt={id}
                      className="w-full h-full object-cover"
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground italic">No images with elevation metadata yet.</p>
      )}

      {/* Images without elevation */}
      {noElevation.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground mb-1">
            {noElevation.length} image{noElevation.length !== 1 ? 's' : ''} without elevation — click to add:
          </p>
          <div className="flex flex-wrap gap-1">
            {noElevation.map(img => {
              const id = img.id;
              return (
                <button
                  key={id}
                  className="text-xs px-2 py-0.5 rounded bg-muted hover:bg-muted/80 font-mono cursor-pointer border border-border"
                  onClick={() => setEditingImage(img)}
                  title={img.imagePath}
                >
                  {id}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {editingImage && (
        <MetadataEditor key={editingImage.id} image={editingImage} onClose={() => setEditingImage(null)} />
      )}
    </div>
  );
}
