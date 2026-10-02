import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { calibrationApi } from '../services/api';
import type { CalibrationPoint, TimingTolerance } from '../types';
import { Panel, MetricCard } from '../components/ui/Shared';
import { FlaskConical } from 'lucide-react';

export default function CalibrationLab() {
  const [curve, setCurve] = useState<CalibrationPoint[]>([]);
  const [tolerances, setTolerances] = useState<TimingTolerance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      calibrationApi.getCalibrationCurve(),
      calibrationApi.getTimingTolerances()
    ]).then(([c, t]) => {
      setCurve(c);
      setTolerances(t);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8 animate-pulse text-text-muted">Loading calibration data...</div>;

  return (
    <div className="flex flex-col gap-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary mb-1 flex items-center gap-2">
          <FlaskConical className="text-info" /> Calibration Lab
        </h1>
        <p className="text-text-secondary text-sm">Use tagged verification data to calibrate thresholds and tolerances.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Panel title="Radar Threshold Sweep (ROC-style)">
          <div className="h-80 w-full mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={curve} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2a3a" vertical={false} />
                <XAxis dataKey="threshold" stroke="#5a6577" tick={{ fill: '#8b95a5', fontSize: 12 }} />
                <YAxis stroke="#5a6577" tick={{ fill: '#8b95a5', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111720', borderColor: '#1e2a3a', borderRadius: '6px' }}
                  itemStyle={{ fontSize: '12px' }}
                  labelStyle={{ color: '#8b95a5', fontSize: '12px', marginBottom: '4px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" name="False Pass Rate (%)" dataKey="falsePassRate" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" name="False Fail Rate (%)" dataKey="falseFailRate" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-info/10 border border-info/30 rounded p-4 flex justify-between items-center mt-auto">
            <div>
              <div className="text-xs text-text-muted uppercase tracking-wide mb-1">Recommended Threshold</div>
              <div className="text-info font-medium text-sm">Intersection minimizes combined error rate.</div>
            </div>
            <div className="text-3xl font-mono font-bold text-info">90%</div>
          </div>
        </Panel>

        <div className="flex flex-col gap-6">
          <Panel title="Audio Timing Tolerances">
            <div className="flex flex-col gap-4">
              {tolerances.map((tol, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-bg-surface border border-border-base rounded">
                   <div className="text-sm font-medium">{tol.label}</div>
                   <div className="flex gap-4 font-mono text-xs text-text-muted">
                     <span>Nominal: {tol.nominalSec.toFixed(2)}s</span>
                     <span>Tol: ±{tol.toleranceSec.toFixed(2)}s</span>
                   </div>
                </div>
              ))}
              <div className="text-xs text-text-muted mt-2">
                * Proposed / configurable timing boundaries derived from nominal pilot response delays.
              </div>
            </div>
          </Panel>
          
          <div className="grid grid-cols-2 gap-4">
            <MetricCard label="Tagged Pairs" value={142} subvalue="Radar Demo Data" />
            <MetricCard label="Held-out Samples" value={38} subvalue="Audio Demo Data" />
          </div>
        </div>
      </div>
    </div>
  );
}
