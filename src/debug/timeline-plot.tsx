'use client';

import { useMemo, useState } from 'react';
import { type Figure } from '@/figures/index';
import { MetadataEditorSafe } from './metadata-editor-safe';

interface TimelinePlotProps {
  figures: Figure[];
  currentFigureId: string | null;
}

interface PlacedFigure {
  figure: Figure;
  date: Date;
  xPct: number;
}

/** Metadata completeness score 0–3 */
function metaScore(fig: Figure): number {
  let score = 0;
  if (fig.datetime) score++;
  if (fig.subject_coordinates) score++;
  if (fig.subject_elevation != null) score++;
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
export function TimelinePlot({ figures, currentFigureId }: TimelinePlotProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [editingFigure, setEditingFigure] = useState<Figure | null>(null);

  const { dated, undated, monthTicks } = useMemo(() => {
    const dated: PlacedFigure[] = [];
    const undated: Figure[] = [];

    for (const fig of figures) {
      if (fig.datetime) {
        const date = new Date(fig.datetime);
        if (!isNaN(date.getTime())) {
          dated.push({ figure: fig, date, xPct: 0 });
        } else {
          undated.push(fig);
        }
      } else {
        undated.push(fig);
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
  }, [figures]);

  const hoveredFigure = useMemo(() => {
    if (!hoveredId) return null;
    return figures.find(fig => fig.id === hoveredId) ?? null;
  }, [hoveredId, figures]);

  const SVG_H = 80;

  return (
    <div className="flex flex-col gap-2 h-full">
      {/* Dated figures — timeline */}
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

            {/* Figure dots */}
            {dated.map(({ figure, xPct }) => {
              const id = figure.id;
              const isCurrent = id === currentFigureId;
              const isHovered = id === hoveredId;
              const color = scoreColor(metaScore(figure));
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
                    onClick={() => setEditingFigure(figure)}
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
        <p className="text-sm text-muted-foreground italic">No figures with datetime metadata yet.</p>
      )}

      {/* Undated figures */}
      {undated.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground mb-1">
            {undated.length} figure{undated.length !== 1 ? 's' : ''} without dates — click to add metadata:
          </p>
          <div className="flex flex-wrap gap-1">
            {undated.map(fig => {
              const id = fig.id;
              return (
                <button
                  key={id}
                  className="text-xs px-2 py-0.5 rounded bg-muted hover:bg-muted/80 font-mono cursor-pointer border border-border"
                  style={{ borderColor: scoreColor(metaScore(fig)) }}
                  onClick={() => setEditingFigure(fig)}
                  title={fig.imagePath}
                >
                  {id}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Hover tooltip */}
      {hoveredFigure && (
        <div className="fixed bottom-4 right-4 z-[10001] bg-background border rounded-lg shadow-xl p-2 w-48 pointer-events-none">
          <img src={hoveredFigure.imagePath} alt={hoveredFigure.id} className="rounded w-full object-cover mb-1" />
          <p className="text-xs font-mono truncate">{hoveredFigure.id}</p>
          {hoveredFigure.datetime && (
            <p className="text-xs text-muted-foreground">{new Date(hoveredFigure.datetime).toLocaleDateString()}</p>
          )}
          <p className="text-xs text-muted-foreground">Click to edit metadata</p>
        </div>
      )}

      {editingFigure && (
        <MetadataEditorSafe key={editingFigure.id} figure={editingFigure} onClose={() => setEditingFigure(null)} />
      )}
    </div>
  );
}
