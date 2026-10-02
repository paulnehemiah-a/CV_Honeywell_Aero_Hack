import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import type { AudioSegment } from '../../types';
import { StatusBadge } from '../ui/Shared';

export function WaveformViewer({
  samples,
  segments,
  duration,
}: {
  samples: number[];
  segments: AudioSegment[];
  duration: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredSeg, setHoveredSeg] = useState<AudioSegment | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Render a fake waveform using a canvas to give a highly customised look
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High DPI canvas
    const dpr = window.devicePixelRatio || 1;
    const rect = containerRef.current.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    ctx.clearRect(0, 0, w, h);

    // Draw baseline
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.strokeStyle = '#1e2a3a'; // border-base
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw samples
    const barWidth = w / samples.length;
    ctx.fillStyle = '#3b82f6'; // info

    samples.forEach((val, i) => {
      const barH = val * (h - 20);
      const x = i * barWidth;
      const y = (h - barH) / 2;
      ctx.fillRect(x, y, Math.max(1, barWidth - 0.5), barH);
    });
  }, [samples]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const time = (x / rect.width) * duration;

    const seg = segments.find((s) => time >= s.startSec && time <= s.endSec);
    setHoveredSeg(seg || null);
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className="relative w-full h-32 rounded bg-bg-surface border border-border-base overflow-hidden" ref={containerRef} onMouseMove={handleMouseMove} onMouseLeave={() => setHoveredSeg(null)}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-crosshair" style={{ width: '100%', height: '100%' }} />

      {/* Segment overlays */}
      {segments.map((seg) => {
        const left = (seg.startSec / duration) * 100;
        const width = (seg.durationSec / duration) * 100;
        return (
          <div
            key={seg.id}
            className={`absolute top-0 bottom-0 border-l border-r pointer-events-none transition-colors
              ${seg.type === 'silence' ? 'bg-warn/5 border-warn/20' : 'bg-transparent border-transparent'}
              ${hoveredSeg?.id === seg.id ? 'bg-info/10 border-info/30' : ''}`}
            style={{ left: `${left}%`, width: `${width}%` }}
          />
        );
      })}

      {/* Tooltip */}
      {hoveredSeg && (
        <div
          className="fixed z-50 bg-bg-elevated border border-border-light rounded shadow-lg shadow-black/50 p-3 text-xs pointer-events-none"
          style={{ top: mousePos.y + 15, left: mousePos.x + 15 }}
        >
          <div className="font-semibold mb-1 pb-1 border-b border-border-base flex items-center justify-between gap-4">
            <span className="uppercase text-text-muted">{hoveredSeg.type}</span>
            <StatusBadge verdict={hoveredSeg.status} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono mt-2">
            <span className="text-text-muted">Start:</span>
            <span>{hoveredSeg.startSec.toFixed(2)} s</span>
            <span className="text-text-muted">End:</span>
            <span>{hoveredSeg.endSec.toFixed(2)} s</span>
            <span className="text-text-muted">Duration:</span>
            <span>{hoveredSeg.durationSec.toFixed(2)} s</span>
            {hoveredSeg.expectedGapSec && (
              <>
                <span className="text-text-muted">Expected:</span>
                <span>{hoveredSeg.expectedGapSec.toFixed(2)} s</span>
              </>
            )}
            {hoveredSeg.token && (
              <>
                <span className="text-text-muted">Token:</span>
                <span className="text-info">"{hoveredSeg.token}"</span>
                <span className="text-text-muted">Conf:</span>
                <span>{hoveredSeg.confidence?.toFixed(2)}</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
