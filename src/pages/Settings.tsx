import React from 'react';
import { Panel } from '../components/ui/Shared';

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary mb-1">Settings</h1>
        <p className="text-text-secondary text-sm">Application and module configurations.</p>
      </div>

      <div className="text-xs text-warn bg-warn-dim border border-warn/30 p-3 rounded mb-2">
        <strong>Note:</strong> Most settings are read-only in this demo environment.
      </div>

      <Panel title="Audio Settings">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SettingRow label="ASR Configuration" value="Local Whisper-based (Mock)" />
          <SettingRow label="Confidence Floor" value="0.85 (Proposed)" />
          <SettingRow label="Silence Detector" value="-40dB threshold" />
          <SettingRow label="Timing Tolerance" value="Calibrated (Lab)" />
        </div>
      </Panel>

      <Panel title="Radar Settings">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SettingRow label="Similarity Threshold" value="90% (Default)" />
          <SettingRow label="Mask Dilation" value="2px" />
          <SettingRow label="Boundary Tolerance" value="1.5px (Proposed)" />
          <SettingRow label="Palette Configuration" value="DO-360 standard" />
        </div>
      </Panel>

      <Panel title="Application">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SettingRow label="Offline Mode" value="Forced On (Demo)" />
          <SettingRow label="Evidence Retention" value="Session only" />
          <SettingRow label="Report Format" value="JSON / Excel" />
        </div>
      </Panel>
    </div>
  );
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 pb-3 border-b border-border-base last:border-0 last:pb-0">
      <span className="text-sm font-medium text-text-primary">{label}</span>
      <span className="text-sm text-text-muted">{value}</span>
    </div>
  );
}
