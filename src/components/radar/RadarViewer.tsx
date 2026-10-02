import React, { useEffect, useRef, useState } from 'react';
import type { DifferenceRegion } from '../../types';
import { expectedPrecipRegions, actualPrecipRegionsPass, actualPrecipRegionsFail, PrecipRegionDraw } from '../../data/radarData';

interface RadarViewerProps {
  expectedRegions: PrecipRegionDraw[];
  actualRegions: PrecipRegionDraw[];
  differenceRegions: DifferenceRegion[];
}

export function RadarViewer({ expectedRegions, actualRegions, differenceRegions }: RadarViewerProps) {
  const [view, setView] = useState<'EXPECTED' | 'DIFFERENCE' | 'ACTUAL' | 'SWIPE'>('DIFFERENCE');
  const [swipePos, setSwipePos] = useState(50); // 0 to 100
  const containerRef = useRef<HTMLDivElement>(null);
  const expCanvas = useRef<HTMLCanvasElement>(null);
  const actCanvas = useRef<HTMLCanvasElement>(null);
  const diffCanvas = useRef<HTMLCanvasElement>(null);

  // Draw simulated radar images
  useEffect(() => {
    const drawRadar = (canvas: HTMLCanvasElement | null, regions: PrecipRegionDraw[]) => {
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = canvas.width = 512;
      const h = canvas.height = 512;

      // Base black background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, w, h);

      // Range rings & crosshairs (simulated radar display chrome)
      ctx.strokeStyle = '#1e3a8a'; // faint blue
      ctx.lineWidth = 1;
      for (let r = 1; r <= 4; r++) {
        ctx.beginPath();
        ctx.arc(w/2, h, (w/2) * (r/4), 0, Math.PI, true);
        ctx.stroke();
      }
      ctx.beginPath(); ctx.moveTo(w/2, h); ctx.lineTo(10, 10); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w/2, h); ctx.lineTo(w-10, 10); ctx.stroke();

      // Draw precipitation regions
      regions.forEach(r => {
        ctx.save();
        ctx.translate(r.cx * w, r.cy * h);
        ctx.rotate((r.rotation * Math.PI) / 180);
        ctx.beginPath();
        ctx.ellipse(0, 0, r.rx * w, r.ry * h, 0, 0, Math.PI * 2);
        ctx.fillStyle = r.color;
        // Simulating pixelation/blockiness of old radar via shadow/blur trick is complex, so we'll just draw ellipses.
        // Actually, let's make it pixelated by drawing rects over the ellipse bounds
        ctx.fill();
        ctx.restore();
      });

      // Simulating some text
      ctx.fillStyle = '#3b82f6';
      ctx.font = '14px monospace';
      ctx.fillText('RNG: 40NM', 10, 20);
      ctx.fillText('TILT: +2.0°', 10, 40);
    };

    drawRadar(expCanvas.current, expectedRegions);
    drawRadar(actCanvas.current, actualRegions);
  }, [expectedRegions, actualRegions]);

  // Draw Difference Overlay
  useEffect(() => {
    const canvas = diffCanvas.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width = 512;
    const h = canvas.height = 512;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.fillRect(0, 0, w, h);

    differenceRegions.forEach(dr => {
      if (dr.kind === 'matched') {
        ctx.fillStyle = 'rgba(34, 197, 94, 0.4)'; // pass green
        ctx.strokeStyle = '#22c55e';
      } else if (dr.kind === 'expected_only') {
        ctx.fillStyle = 'rgba(168, 85, 247, 0.4)'; // purple
        ctx.strokeStyle = '#a855f7';
      } else if (dr.kind === 'actual_only') {
        ctx.fillStyle = 'rgba(59, 130, 246, 0.4)'; // blue
        ctx.strokeStyle = '#3b82f6';
      } else if (dr.kind === 'ignored') {
        ctx.fillStyle = 'rgba(100, 116, 139, 0.4)'; // gray
        ctx.strokeStyle = '#64748b';
      }
      ctx.beginPath();
      ctx.rect(dr.x, dr.y, dr.w, dr.h);
      ctx.fill();
      ctx.stroke();

      // Hatching for ignored
      if (dr.kind === 'ignored') {
        ctx.save();
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.beginPath();
        for (let i = 0; i < dr.w + dr.h; i += 10) {
          ctx.moveTo(dr.x + i, dr.y);
          ctx.lineTo(dr.x, dr.y + i);
        }
        ctx.stroke();
        ctx.restore();
      }
    });

  }, [differenceRegions]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (view !== 'ACTUAL' || !containerRef.current) return; // Swipe only works in 'ACTUAL' if we want, or we can add a specific 'SWIPE' view.
    // Actually, let's just implement swipe as a slider overlay over ACTUAL and EXPECTED.
  };

  return (
    <div className="flex flex-col gap-4">
      {/* View Selector */}
      <div className="flex bg-bg-surface p-1 rounded-md border border-border-base self-start">
        {(['EXPECTED', 'DIFFERENCE', 'ACTUAL', 'SWIPE'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setView(tab as any)}
            className={`px-4 py-1.5 text-xs font-semibold rounded-sm transition-colors ${
              view === tab ? 'bg-bg-elevated text-text-primary shadow-sm' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Viewer Frame */}
      <div
        ref={containerRef}
        className="relative w-full max-w-[512px] aspect-square rounded-lg border border-border-light overflow-hidden bg-black mx-auto shadow-inner"
        style={{ imageRendering: 'pixelated' }}
        onMouseMove={(e) => {
          if (view === 'SWIPE' && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
            setSwipePos(x);
          }
        }}
      >
        <canvas ref={expCanvas} className={`absolute inset-0 w-full h-full ${view === 'EXPECTED' || view === 'DIFFERENCE' || view === 'SWIPE' ? 'opacity-100' : 'opacity-0'}`} />
        
        {view === 'SWIPE' && (
          <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 0 0 ${swipePos}%)` }}>
             <canvas ref={actCanvas} className="w-full h-full" />
          </div>
        )}
        
        {view === 'ACTUAL' && (
           <canvas ref={actCanvas} className="absolute inset-0 w-full h-full" />
        )}

        {view === 'DIFFERENCE' && (
           <canvas ref={diffCanvas} className="absolute inset-0 w-full h-full opacity-90 mix-blend-screen" />
        )}

        {/* Swipe Divider */}
        {view === 'SWIPE' && (
          <div className="absolute top-0 bottom-0 w-[2px] bg-white cursor-ew-resize flex items-center justify-center z-10" style={{ left: `${swipePos}%`, transform: 'translateX(-50%)' }}>
            <div className="w-6 h-6 rounded-full bg-white border border-border-base shadow flex items-center justify-center">
              <div className="w-3 h-0.5 bg-black/50" />
            </div>
          </div>
        )}
      </div>

      {/* Legend for Difference View */}
      {view === 'DIFFERENCE' && (
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-text-secondary mt-2">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-pass/40 border border-pass" /> MATCHED</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-purple-500/40 border border-purple-500" /> EXPECTED ONLY</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-blue-500/40 border border-blue-500" /> ACTUAL ONLY</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-slate-500/40 border border-slate-500" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.2) 2px, rgba(255,255,255,0.2) 4px)'}} /> IGNORED</div>
        </div>
      )}
    </div>
  );
}
