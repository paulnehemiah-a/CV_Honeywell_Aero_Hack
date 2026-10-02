/* ─────────────────────────────────────────────────────────────────────────
   VeriDeck – Dashboard Page
   ───────────────────────────────────────────────────────────────────────── */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { runHistoryApi } from '../services/api';
import type { VerificationRun } from '../types';
import { Panel, MetricCard, StatusBadge, Button } from '../components/ui/Shared';
import { AudioLines, Radar, Plus, Activity } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [recentRuns, setRecentRuns] = useState<VerificationRun[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      runHistoryApi.getDashboardStats(),
      runHistoryApi.getRuns(),
    ]).then(([s, runs]) => {
      setStats(s);
      setRecentRuns(runs.slice(0, 10)); // Just top 10 for dashboard
      setLoading(false);
    });
  }, []);

  if (loading || !stats) {
    return <div className="p-8 text-text-muted animate-pulse">Loading dashboard telemetry...</div>;
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl">
      {/* Header section */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary mb-1 tracking-tight">System Overview</h1>
          <p className="text-text-secondary text-sm">Cockpit Audio & Weather-Radar Verification Workbench</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate('/calibration')}>
            <Activity size={16} /> Open Calibration Lab
          </Button>
        </div>
      </div>

      {/* Modules Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Part A */}
        <Panel
          title={
            <div className="flex items-center gap-2 text-info">
              <AudioLines size={18} />
              <span>Part A — Audio Verification</span>
            </div>
          }
          className="border-t-2 border-t-info/50"
          action={
            <Button size="sm" onClick={() => navigate('/audio')}>
              <Plus size={14} /> New Run
            </Button>
          }
        >
          <div className="grid grid-cols-2 gap-4 mb-4">
            <MetricCard label="Total Tests" value={stats.audio.total} />
            <MetricCard label="Passed" value={stats.audio.passed} trend="up" subvalue={`${Math.round((stats.audio.passed / stats.audio.total) * 100)}%`} />
            <MetricCard label="Failed" value={stats.audio.failed} trend="down" />
            <MetricCard label="Low Confidence" value={stats.audio.lowConfidence} />
          </div>
          <div className="mt-auto pt-4 border-t border-border-base">
            <p className="text-xs text-text-muted">Acoustic and NLP constraints enforcing RTCA DO-160/360 equivalents.</p>
          </div>
        </Panel>

        {/* Part B */}
        <Panel
          title={
            <div className="flex items-center gap-2 text-pass">
              <Radar size={18} />
              <span>Part B — Radar Image Verification</span>
            </div>
          }
          className="border-t-2 border-t-pass/50"
          action={
            <Button size="sm" onClick={() => navigate('/radar')}>
              <Plus size={14} /> New Run
            </Button>
          }
        >
          <div className="grid grid-cols-2 gap-4 mb-4">
            <MetricCard label="Total Pairs" value={stats.radar.total} />
            <MetricCard label="Mean Similarity" value={`${stats.radar.meanSimilarity}%`} trend="up" subvalue={`Thresh: ${stats.radar.threshold}%`} />
            <MetricCard label="Passed" value={stats.radar.passed} />
            <MetricCard label="Failed" value={stats.radar.failed} trend="down" />
          </div>
          <div className="mt-auto pt-4 border-t border-border-base">
            <p className="text-xs text-text-muted">Visual functional equivalence verification of precipitation rendering.</p>
          </div>
        </Panel>
      </div>

      {/* Recent Runs Table */}
      <Panel title="Recent Verification Runs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="text-text-muted border-b border-border-base">
                <th className="pb-2 font-medium">Run ID</th>
                <th className="pb-2 font-medium">Module</th>
                <th className="pb-2 font-medium">Test / Pair</th>
                <th className="pb-2 font-medium">Result</th>
                <th className="pb-2 font-medium">Score</th>
                <th className="pb-2 font-medium">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-base">
              {recentRuns.map((run) => (
                <tr key={run.id} className="hover:bg-bg-hover/50 cursor-pointer transition-colors" onClick={() => navigate('/runs')}>
                  <td className="py-2.5 font-mono text-text-secondary">{run.id}</td>
                  <td className="py-2.5">
                    {run.module === 'audio' ? (
                      <span className="flex items-center gap-1.5 text-info text-xs"><AudioLines size={14}/> Audio</span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-pass text-xs"><Radar size={14}/> Radar</span>
                    )}
                  </td>
                  <td className="py-2.5 font-medium truncate max-w-[200px]" title={run.testCase}>{run.testCase}</td>
                  <td className="py-2.5"><StatusBadge verdict={run.result} /></td>
                  <td className="py-2.5 font-mono text-text-secondary">{run.score ? `${run.score.toFixed(1)}%` : '—'}</td>
                  <td className="py-2.5 text-text-muted font-mono text-xs">{new Date(run.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
