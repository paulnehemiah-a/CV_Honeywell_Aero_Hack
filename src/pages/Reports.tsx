import React, { useEffect, useState } from 'react';
import { reportApi } from '../services/api';
import type { Report } from '../types';
import { Panel, Button, StatusBadge } from '../components/ui/Shared';
import { FileBarChart, Download, FileJson, FileSpreadsheet, FileText } from 'lucide-react';
import { useToast } from '../hooks/useToast';

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [exportingId, setExportingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    reportApi.getReports().then(r => {
      setReports(r);
      setLoading(false);
    });
  }, []);

  const handleExport = async (reportId: string, format: 'JSON' | 'Excel' | 'HTML') => {
    setExportingId(reportId);
    try {
      const blob = await reportApi.exportReport(reportId, format);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `VeriDeck_Report_${reportId}.${format.toLowerCase() === 'excel' ? 'xlsx' : format.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast('success', `Exported ${reportId} as ${format}`);
    } catch (e) {
      toast('error', 'Export failed');
    } finally {
      setExportingId(null);
    }
  };

  if (loading) return <div className="p-8 animate-pulse text-text-muted">Loading reports...</div>;

  const FormatIcon = ({ format }: { format: string }) => {
    if (format === 'JSON') return <FileJson size={16} className="text-warn" />;
    if (format === 'Excel') return <FileSpreadsheet size={16} className="text-pass" />;
    return <FileText size={16} className="text-info" />;
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary mb-1">Reports</h1>
        <p className="text-text-secondary text-sm">Generated verification bundles and compliance reports.</p>
      </div>

      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-text-muted border-b border-border-base bg-bg-surface">
                <th className="px-4 py-3 font-medium">Report ID</th>
                <th className="px-4 py-3 font-medium">Module</th>
                <th className="px-4 py-3 font-medium">Generated At</th>
                <th className="px-4 py-3 font-medium">Included Runs</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-base">
              {reports.map(report => (
                <tr key={report.id} className="hover:bg-bg-hover transition-colors">
                  <td className="px-4 py-4 font-mono font-bold text-text-primary">
                    <div className="flex items-center gap-2">
                      <FileBarChart size={16} className="text-text-muted" />
                      {report.id}
                    </div>
                  </td>
                  <td className="px-4 py-4 uppercase text-xs tracking-wider">{report.module}</td>
                  <td className="px-4 py-4 font-mono text-text-muted">{new Date(report.generatedAt).toLocaleString()}</td>
                  <td className="px-4 py-4 font-mono text-xs">{report.runIds.length} runs</td>
                  <td className="px-4 py-4 flex justify-end gap-2">
                    <Button
                      variant="outline" size="sm"
                      onClick={() => handleExport(report.id, 'JSON')}
                      disabled={exportingId === report.id}
                    >
                      <FormatIcon format="JSON" /> JSON
                    </Button>
                    <Button
                      variant="outline" size="sm"
                      onClick={() => handleExport(report.id, 'Excel')}
                      disabled={exportingId === report.id}
                    >
                      <FormatIcon format="Excel" /> Excel
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
