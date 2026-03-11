'use client';

import { useMemo, useState } from 'react';
import { type GuideImage } from '@/imageRegistry/images';
import { MetadataEditor } from './metadata-editor';

interface TimelinePlotProps {
  images: GuideImage[];
  currentImageId: string | null;
}

interface PlacedImage {
  image: GuideImage;
  date: Date;
  xPct: number;
}

/** Metadata completeness score 0–3 */
function metaScore(img: GuideImage): number {
  let score = 0;
  if (img.datetime) score++;
  if (img.coordinates) score++;
  if (img.elevation != null) score++;
  return score;
}

function scoreColor(score: number): string {
  if (score === 3) return '#22c55e'; // green
  if (score === 2) return '#eab308'; // yellow
  if (score === 1) return '#f97316'; // orange
  return '#6b7280'; // gray
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


/**
 * show the images on a timeline so I can verify that the dates taken are accurate, eg see that the photos on the same day are the right place, there are no photos in summer, etc. Highlight the current photo in this plot.
 */
export function TimelinePlot({ images, currentImageId }: TimelinePlotProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [editingImage, setEditingImage] = useState<GuideImage | null>(null);

  const { dated, undated, monthTicks } = useMemo(() => {
    const dated: PlacedImage[] = [];
    const undated: GuideImage[] = [];

    for (const img of images) {
      if (img.datetime) {
        const date = new Date(img.datetime);
        if (!isNaN(date.getTime())) {
          dated.push({ image: img, date, xPct: 0 });
        } else {
          undated.push(img);
        }
      } else {
        undated.push(img);
      }
    }

    if (dated.length === 0) {
      return { dated: [], undated, monthTicks: [] };
    }

    dated.sort((a, b) => a.date.getTime() - b.date.getTime());
    const minDate = dated[0]!.date;
    const maxDate = dated[dated.length - 1]!.date;
    const span = maxDate.getTime() - minDate.getTime() || 1;

    for (const p of dated) {
      p.xPct = ((p.date.getTime() - minDate.getTime()) / span) * 100;
    }

    // Month tick marks
    const monthTicks: { xPct: number; label: string }[] = [];
    const cursor = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
    while (cursor <= maxDate) {
      const xPct = ((cursor.getTime() - minDate.getTime()) / span) * 100;
      monthTicks.push({ xPct, label: MONTH_NAMES[cursor.getMonth()]! + ' ' + cursor.getFullYear() });
      cursor.setMonth(cursor.getMonth() + 1);
    }

    return { dated, undated, monthTicks };
  }, [images]);

  const hoveredImage = useMemo(() => {
    if (!hoveredId) return null;
    return images.find(img => img.id === hoveredId) ?? null;
  }, [hoveredId, images]);

  const SVG_H = 80;

  return (
    <div className="flex flex-col gap-2 h-full">
      {/* Dated images — timeline */}
      {dated.length > 0 ? (
        <div className="relative overflow-x-auto flex-1">
          <svg
            width="100%"
            height={SVG_H}
            className="min-w-[600px]"
            style={{ display: 'block' }}
          >
            {/* Axis line */}
            <line x1="2%" x2="98%" y1={SVG_H - 20} y2={SVG_H - 20} stroke="#374151" strokeWidth={1} />

            {/* Month ticks */}
            {monthTicks.map((tick, i) => (
              <g key={i}>
                <line
                  x1={`${2 + tick.xPct * 0.96}%`}
                  x2={`${2 + tick.xPct * 0.96}%`}
                  y1={SVG_H - 24}
                  y2={SVG_H - 16}
                  stroke="#6b7280"
                  strokeWidth={1}
                />
                <text
                  x={`${2 + tick.xPct * 0.96}%`}
                  y={SVG_H - 5}
                  fontSize={9}
                  fill="#9ca3af"
                  textAnchor="middle"
                >
                  {tick.label}
                </text>
              </g>
            ))}

            {/* Image dots */}
            {dated.map(({ image, xPct }) => {
              const id = image.id;
              const isCurrent = id === currentImageId;
              const isHovered = id === hoveredId;
              const color = scoreColor(metaScore(image));
              const cx = `${2 + xPct * 0.96}%`;
              const cy = SVG_H - 20;
              const r = isCurrent ? 10 : isHovered ? 8 : 6;
              return (
                <g key={id}>
                  {isCurrent && (
                    <circle cx={cx} cy={cy} r={r + 4} fill="none" stroke="#60a5fa" strokeWidth={2} opacity={0.5} />
                  )}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill={color}
                    stroke={isCurrent ? '#3b82f6' : isHovered ? '#fff' : 'transparent'}
                    strokeWidth={2}
                    style={{ cursor: 'pointer', transition: 'r 0.1s' }}
                    onMouseEnter={() => setHoveredId(id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => setEditingImage(image)}
                  />
                </g>
              );
            })}
          </svg>

          {/* Legend */}
          <div className="flex gap-3 text-xs text-muted-foreground px-1">
            {([3, 2, 1, 0] as const).map(score => (
              <span key={score} className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full inline-block" style={{ background: scoreColor(score) }} />
                {score === 3 ? 'Full metadata' : score === 2 ? 'Partial' : score === 1 ? 'Minimal' : 'No metadata'}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground italic">No images with datetime metadata yet.</p>
      )}

      {/* Undated images */}
      {undated.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground mb-1">
            {undated.length} image{undated.length !== 1 ? 's' : ''} without dates — click to add metadata:
          </p>
          <div className="flex flex-wrap gap-1">
            {undated.map(img => {
              const id = img.id;
              return (
                <button
                  key={id}
                  className="text-xs px-2 py-0.5 rounded bg-muted hover:bg-muted/80 font-mono cursor-pointer border border-border"
                  style={{ borderColor: scoreColor(metaScore(img)) }}
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

      {/* Hover tooltip */}
      {hoveredImage && (
        <div className="fixed bottom-4 right-4 z-[10001] bg-background border rounded-lg shadow-xl p-2 w-48 pointer-events-none">
          <img src={hoveredImage.imagePath} alt={hoveredImage.id} className="rounded w-full object-cover mb-1" />
          <p className="text-xs font-mono truncate">{hoveredImage.id}</p>
          {hoveredImage.datetime && (
            <p className="text-xs text-muted-foreground">{new Date(hoveredImage.datetime).toLocaleDateString()}</p>
          )}
          <p className="text-xs text-muted-foreground">Click to edit metadata</p>
        </div>
      )}

      {editingImage && (
        <MetadataEditor key={editingImage.id} image={editingImage} onClose={() => setEditingImage(null)} />
      )}
    </div>
  );
}
