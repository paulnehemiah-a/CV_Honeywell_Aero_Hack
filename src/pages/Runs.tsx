import React, { useEffect, useState } from 'react';
import { runHistoryApi } from '../services/api';
import type { VerificationRun } from '../types';
import { Panel, StatusBadge, Button } from '../components/ui/Shared';
import { AudioLines, Radar, Filter, Download } from 'lucide-react';

export default function RunsPage() {
  const [runs, setRuns] = useState<VerificationRun[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    runHistoryApi.getRuns().then(r => {
      setRuns(r);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8 animate-pulse text-text-muted">Loading history...</div>;

  return (
    <div className="flex flex-col gap-6 max-w-7xl">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary mb-1">Test Runs</h1>
          <p className="text-text-secondary text-sm">Historical execution logs and verification evidence.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm"><Filter size={14}/> Filter</Button>
          <Button variant="outline" size="sm"><Download size={14}/> Export CSV</Button>
        </div>
      </div>

      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="text-text-muted border-b border-border-base bg-bg-surface">
                <th className="px-4 py-3 font-medium rounded-tl">Run ID</th>
                <th className="px-4 py-3 font-medium">Module</th>
                <th className="px-4 py-3 font-medium">Test Case / Pair</th>
                <th className="px-4 py-3 font-medium">Input File</th>
                <th className="px-4 py-3 font-medium">Result</th>
                <th className="px-4 py-3 font-medium">Score</th>
                <th className="px-4 py-3 font-medium rounded-tr">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-base">
              {runs.map(run => (
                <tr key={run.id} className="hover:bg-bg-hover transition-colors cursor-pointer">
                  <td className="px-4 py-3 font-mono text-text-secondary">{run.id}</td>
                  <td className="px-4 py-3">
                    {run.module === 'audio' ? (
                      <span className="flex items-center gap-1.5 text-info"><AudioLines size={14}/> Audio</span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-pass"><Radar size={14}/> Radar</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-text-primary">{run.testCase}</td>
                  <td className="px-4 py-3 font-mono text-text-muted">{run.input}</td>
                  <td className="px-4 py-3"><StatusBadge verdict={run.result} /></td>
                  <td className="px-4 py-3 font-mono">{run.score ? `${run.score.toFixed(1)}%` : '—'}</td>
                  <td className="px-4 py-3 text-text-muted font-mono text-xs">{new Date(run.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
