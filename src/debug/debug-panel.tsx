'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { useDebug } from '@/debug/debug-context';
import { useGeoItems } from '@/app/components/items-context';
import { type Figure } from '@/figures/index';
import { TimelinePlot } from './timeline-plot';
import { ElevationPlot } from './elevation-plot';

type Tab = 'timeline' | 'elevation';

function DebugPanelInner() {
  const { isDebug, turnOffDebug } = useDebug();
  const searchParams = useSearchParams();
  const items = useGeoItems();
  const [expanded, setExpanded] = useState(true);
  const [tab, setTab] = useState<Tab>('timeline');

  const currentFigureId = searchParams.get('lightbox');
  const lightboxOpen = currentFigureId !== null;

  // Collect all unique figures across all geo items
  const allFigures = useMemo<Figure[]>(() => {
    const seen = new Set<string>();
    const result: Figure[] = [];
    for (const item of items) {
      for (const img of item.properties.figures) {
        const id = img.id;
        if (!seen.has(id)) {
          seen.add(id);
          result.push(img);
        }
      }
    }
    return result;
  }, [items]);

  const metaStats = useMemo(() => {
    const withDate = allFigures.filter(img => img.datetime).length;
    const withCoords = allFigures.filter(img => img.coordinates).length;
    const withElevation = allFigures.filter(img => img.elevation != null).length;
    return { total: allFigures.length, withDate, withCoords, withElevation };
  }, [allFigures]);

  if (!isDebug) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[9999] bg-background/95 backdrop-blur border-t border-border shadow-2xl"
      style={{ fontFamily: 'monospace' }}
    >
      {/* Header bar — always visible */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-b border-border/50">
        <span className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">🐛 Debug</span>

        {/* Tab buttons */}
        <div className="flex gap-1 ml-2">
          {(['timeline', 'elevation'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setExpanded(true); }}
              className={`text-xs px-2 py-0.5 rounded capitalize cursor-pointer transition-colors ${tab === t && expanded
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="flex gap-3 ml-3 text-[11px] text-muted-foreground">
          <span title="Total figures">{metaStats.total} figs</span>
          <span title="With datetime" className={metaStats.withDate === metaStats.total ? 'text-green-400' : 'text-yellow-400'}>
            {metaStats.withDate}/{metaStats.total} dated
          </span>
          <span title="With coordinates" className={metaStats.withCoords === metaStats.total ? 'text-green-400' : 'text-yellow-400'}>
            {metaStats.withCoords}/{metaStats.total} coords
          </span>
          <span title="With elevation" className={metaStats.withElevation === metaStats.total ? 'text-green-400' : 'text-yellow-400'}>
            {metaStats.withElevation}/{metaStats.total} elev
          </span>
        </div>

        {/* Current figure indicator */}
        {currentFigureId && (
          <span className="text-[11px] text-blue-400 ml-2">
            ↑ <span className="font-mono">{currentFigureId}</span>
          </span>
        )}

        {!lightboxOpen && (
          <span className="text-[11px] text-muted-foreground italic ml-2">open a photo to highlight it</span>
        )}

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setExpanded(e => !e)}
            className="text-muted-foreground hover:text-foreground cursor-pointer p-0.5"
            title={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          <button
            onClick={turnOffDebug}
            className="text-muted-foreground hover:text-destructive cursor-pointer p-0.5"
            title="Turn off debug mode"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Panel body */}
      {expanded && (
        <div className="p-3 overflow-auto" style={{ maxHeight: '40vh' }}>
          {tab === 'timeline' && (
            <TimelinePlot figures={allFigures} currentFigureId={currentFigureId} />
          )}
          {tab === 'elevation' && (
            <ElevationPlot figures={allFigures} currentFigureId={currentFigureId} />
          )}
        </div>
      )}
    </div>
  );
}

// Wrap with Suspense boundary since useSearchParams() requires it
import { Suspense } from 'react';

export function DebugPanel() {
  return (
    <Suspense>
      <DebugPanelInner />
    </Suspense>
  );
}
