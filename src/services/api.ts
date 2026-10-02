/* ─────────────────────────────────────────────────────────────────────────
   VeriDeck – Mock API service layer
   Every function returns local mock data.  The interface is designed so a
   real FastAPI backend can be swapped in later by changing only this file.
   ───────────────────────────────────────────────────────────────────────── */
import type {
  AudioTestCase,
  AudioAnalysisResult,
  RadarComparisonResult,
  RadarConstraints,
  VerificationRun,
  Report,
  CalibrationPoint,
  TimingTolerance,
  PipelineStep,
} from '../types';

import { audioTestCases, audioResultsMap, audioResult198 } from '../data/audioData';
import { radarPairs, radarResultsMap, defaultRadarConstraints } from '../data/radarData';
import {
  runHistory,
  reports,
  dashboardStats,
  calibrationCurve,
  timingTolerances,
} from '../data/runHistory';

// ── Utility: simulate async latency ────────────────────────────────────
const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// ═══════════════════════════════════════════════════════════════════════
//  Audio API
// ═══════════════════════════════════════════════════════════════════════
export const audioApi = {
  /** Get all available test cases. */
  async getTestCases(): Promise<AudioTestCase[]> {
    await delay(120);
    return audioTestCases;
  },

  /** Get a single test case by ID. */
  async getTestCase(id: number): Promise<AudioTestCase | undefined> {
    await delay(80);
    return audioTestCases.find((tc) => tc.id === id);
  },

  /**
   * Run analysis on an uploaded WAV.
   * Returns pipeline steps as a callback, then the final result.
   */
  async analyzeAudio(
    _file: File | null,
    testCaseId: number,
    onStep?: (steps: PipelineStep[]) => void,
  ): Promise<AudioAnalysisResult> {
    const stepDefs = [
      'Input validated',
      'Audio segmented',
      'Speech recognised',
      'Timing analysed',
      'Voice analysed',
      'Expected / Actual aligned',
      'Verification completed',
    ];
    const steps: PipelineStep[] = stepDefs.map((label, i) => ({
      id: `a${i}`,
      label,
      status: 'waiting' as const,
    }));

    for (let i = 0; i < steps.length; i++) {
      steps[i].status = 'processing';
      onStep?.([...steps]);
      await delay(400 + Math.random() * 300);
      steps[i].status = 'completed';
      steps[i].durationMs = 300 + Math.floor(Math.random() * 200);
      onStep?.([...steps]);
    }

    const result = audioResultsMap[testCaseId];
    if (result) return result;

    // Fallback: return the TC-198 result re-keyed
    return { ...audioResult198, testCaseId };
  },
};

// ═══════════════════════════════════════════════════════════════════════
//  Radar API
// ═══════════════════════════════════════════════════════════════════════
export const radarApi = {
  async getPairs() {
    await delay(100);
    return radarPairs;
  },

  async getDefaultConstraints(): Promise<RadarConstraints> {
    await delay(60);
    return { ...defaultRadarConstraints };
  },

  async comparePair(
    pairId: string,
    _constraints: RadarConstraints,
    onStep?: (steps: PipelineStep[]) => void,
  ): Promise<RadarComparisonResult> {
    const stepDefs = [
      'Pair mapping',
      'ROI detection',
      'Alignment',
      'Constraint masking',
      'Precipitation extraction',
      'Comparison',
      'Scoring',
      'Verdict',
    ];
    const steps: PipelineStep[] = stepDefs.map((label, i) => ({
      id: `r${i}`,
      label,
      status: 'waiting' as const,
    }));

    for (let i = 0; i < steps.length; i++) {
      steps[i].status = 'processing';
      onStep?.([...steps]);
      await delay(350 + Math.random() * 250);
      steps[i].status = 'completed';
      steps[i].durationMs = 250 + Math.floor(Math.random() * 200);
      onStep?.([...steps]);
    }

    return radarResultsMap[pairId] ?? radarResultsMap['RP-001']!;
  },
};

// ═══════════════════════════════════════════════════════════════════════
//  Report API
// ═══════════════════════════════════════════════════════════════════════
export const reportApi = {
  async getReports(): Promise<Report[]> {
    await delay(100);
    return reports;
  },

  async exportReport(reportId: string, format: 'JSON' | 'Excel' | 'HTML'): Promise<Blob> {
    await delay(600);
    const report = reports.find((r) => r.id === reportId);
    const payload = {
      reportId,
      format,
      generatedAt: new Date().toISOString(),
      note: 'VeriDeck demo export — mock data only.',
      runs: report?.runIds ?? [],
    };
    if (format === 'JSON') {
      return new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    }
    // For Excel / HTML we return a simple text blob as a placeholder
    const text = `VeriDeck Report ${reportId}\nFormat: ${format}\n${JSON.stringify(payload, null, 2)}`;
    return new Blob([text], { type: 'text/plain' });
  },
};

// ═══════════════════════════════════════════════════════════════════════
//  Calibration API
// ═══════════════════════════════════════════════════════════════════════
export const calibrationApi = {
  async getCalibrationCurve(): Promise<CalibrationPoint[]> {
    await delay(150);
    return calibrationCurve;
  },

  async getTimingTolerances(): Promise<TimingTolerance[]> {
    await delay(100);
    return timingTolerances;
  },
};

// ═══════════════════════════════════════════════════════════════════════
//  Run History API
// ═══════════════════════════════════════════════════════════════════════
export const runHistoryApi = {
  async getRuns(): Promise<VerificationRun[]> {
    await delay(120);
    return runHistory;
  },

  async getDashboardStats() {
    await delay(80);
    return dashboardStats;
  },
};
