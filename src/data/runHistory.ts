/* ─────────────────────────────────────────────────────────────────────────
   VeriDeck – Run history & report mock data
   ───────────────────────────────────────────────────────────────────────── */
import type { VerificationRun, Report, CalibrationPoint, TimingTolerance } from '../types';

export const runHistory: VerificationRun[] = [
  { id: 'AV-0198', module: 'audio', testCase: 'TC-198 pullup Mode 1',          input: 'TC198_pullup_mode1.wav',   result: 'PASS',   score: null, timestamp: '2026-10-02T11:42:00Z' },
  { id: 'AV-0039', module: 'audio', testCase: 'TC-039 Flaps! Flaps!',          input: 'TC039_flaps_single.wav',   result: 'FAIL',   score: null, timestamp: '2026-10-02T11:38:00Z' },
  { id: 'AV-0221', module: 'audio', testCase: 'TC-221 siren windshear …',      input: 'TC221_siren_windshear.wav',result: 'REVIEW', score: null, timestamp: '2026-10-02T11:30:00Z' },
  { id: 'AV-0197', module: 'audio', testCase: 'TC-197 pullup',                 input: 'TC197_pullup.wav',         result: 'PASS',   score: null, timestamp: '2026-10-02T10:55:00Z' },
  { id: 'AV-0012', module: 'audio', testCase: 'TC-012 Avoid Terrain',          input: 'TC012_avoid_terrain.wav',  result: 'PASS',   score: null, timestamp: '2026-10-02T10:48:00Z' },
  { id: 'AV-0121', module: 'audio', testCase: 'TC-121 bank angle bank angle',  input: 'TC121_bank_angle.wav',     result: 'PASS',   score: null, timestamp: '2026-10-02T10:40:00Z' },
  { id: 'AV-0125', module: 'audio', testCase: 'TC-125 caution obstacle …',     input: 'TC125_caution_obs.wav',    result: 'PASS',   score: null, timestamp: '2026-10-02T10:32:00Z' },
  { id: 'AV-0179', module: 'audio', testCase: 'TC-179 obstacle ahead …',       input: 'TC179_obs_ahead.wav',      result: 'PASS',   score: null, timestamp: '2026-10-02T10:25:00Z' },
  { id: 'AV-0238', module: 'audio', testCase: 'TC-238 terrain ahead …',        input: 'TC238_terrain_ahead.wav',  result: 'PASS',   score: null, timestamp: '2026-10-02T10:18:00Z' },
  { id: 'AV-0266', module: 'audio', testCase: 'TC-266 warning! Terrain',       input: 'TC266_warning_terrain.wav',result: 'PASS',   score: null, timestamp: '2026-10-02T10:10:00Z' },
  { id: 'AV-0268', module: 'audio', testCase: 'TC-268 whoop whoop pullup',     input: 'TC268_whoop_pullup.wav',   result: 'PASS',   score: null, timestamp: '2026-10-02T10:02:00Z' },
  { id: 'RV-0001', module: 'radar', testCase: 'RP-001 Standard Precip 40 NM',  input: 'pair_RP001.png',           result: 'PASS',   score: 96.8, timestamp: '2026-10-02T09:50:00Z' },
  { id: 'RV-0002', module: 'radar', testCase: 'RP-002 Heavy Rain Cell 20 NM',  input: 'pair_RP002.png',           result: 'PASS',   score: 94.2, timestamp: '2026-10-02T09:42:00Z' },
  { id: 'RV-0003', module: 'radar', testCase: 'RP-003 Light Scatter 80 NM',    input: 'pair_RP003.png',           result: 'PASS',   score: 98.1, timestamp: '2026-10-02T09:35:00Z' },
  { id: 'RV-0004', module: 'radar', testCase: 'RP-004 Missing Red Region',     input: 'pair_RP004.png',           result: 'FAIL',   score: 61.8, timestamp: '2026-10-02T09:28:00Z' },
  // Pad to 25 audio + 20 radar as indicated in dashboard
  { id: 'AV-0300', module: 'audio', testCase: 'TC-197 pullup (re-run)',         input: 'TC197_pullup_r2.wav',      result: 'PASS',   score: null, timestamp: '2026-10-01T16:00:00Z' },
  { id: 'AV-0301', module: 'audio', testCase: 'TC-198 pullup Mode 1 (re-run)', input: 'TC198_pullup_r2.wav',      result: 'PASS',   score: null, timestamp: '2026-10-01T15:50:00Z' },
  { id: 'AV-0302', module: 'audio', testCase: 'TC-012 Avoid Terrain (re-run)', input: 'TC012_avoid_r2.wav',       result: 'PASS',   score: null, timestamp: '2026-10-01T15:40:00Z' },
  { id: 'AV-0303', module: 'audio', testCase: 'TC-121 bank angle (re-run)',    input: 'TC121_bank_r2.wav',        result: 'PASS',   score: null, timestamp: '2026-10-01T15:30:00Z' },
  { id: 'AV-0304', module: 'audio', testCase: 'TC-125 caution obstacle (r2)',  input: 'TC125_caution_r2.wav',     result: 'PASS',   score: null, timestamp: '2026-10-01T15:20:00Z' },
  { id: 'AV-0305', module: 'audio', testCase: 'TC-179 obstacle ahead (r2)',    input: 'TC179_obs_r2.wav',         result: 'PASS',   score: null, timestamp: '2026-10-01T15:10:00Z' },
  { id: 'AV-0306', module: 'audio', testCase: 'TC-238 terrain ahead (r2)',     input: 'TC238_terrain_r2.wav',     result: 'PASS',   score: null, timestamp: '2026-10-01T15:00:00Z' },
  { id: 'AV-0307', module: 'audio', testCase: 'TC-266 warning! Terrain (r2)',  input: 'TC266_warning_r2.wav',     result: 'PASS',   score: null, timestamp: '2026-10-01T14:50:00Z' },
  { id: 'AV-0308', module: 'audio', testCase: 'TC-268 whoop whoop (r2)',       input: 'TC268_whoop_r2.wav',       result: 'PASS',   score: null, timestamp: '2026-10-01T14:40:00Z' },
  { id: 'AV-0309', module: 'audio', testCase: 'TC-221 siren windshear (r2)',   input: 'TC221_siren_r2.wav',       result: 'PASS',   score: null, timestamp: '2026-10-01T14:30:00Z' },
  // More radar
  { id: 'RV-0005', module: 'radar', testCase: 'RP-001 Standard Precip (r2)',   input: 'pair_RP001_r2.png',        result: 'PASS',   score: 97.1, timestamp: '2026-10-01T14:20:00Z' },
  { id: 'RV-0006', module: 'radar', testCase: 'RP-002 Heavy Rain Cell (r2)',   input: 'pair_RP002_r2.png',        result: 'PASS',   score: 95.0, timestamp: '2026-10-01T14:10:00Z' },
  { id: 'RV-0007', module: 'radar', testCase: 'RP-003 Light Scatter (r2)',     input: 'pair_RP003_r2.png',        result: 'PASS',   score: 97.8, timestamp: '2026-10-01T14:00:00Z' },
  { id: 'RV-0008', module: 'radar', testCase: 'RP-001 Standard Precip (r3)',   input: 'pair_RP001_r3.png',        result: 'PASS',   score: 96.5, timestamp: '2026-10-01T13:50:00Z' },
  { id: 'RV-0009', module: 'radar', testCase: 'RP-002 Heavy Rain Cell (r3)',   input: 'pair_RP002_r3.png',        result: 'PASS',   score: 93.8, timestamp: '2026-10-01T13:40:00Z' },
  { id: 'RV-0010', module: 'radar', testCase: 'RP-003 Light Scatter (r3)',     input: 'pair_RP003_r3.png',        result: 'PASS',   score: 98.4, timestamp: '2026-10-01T13:30:00Z' },
  { id: 'RV-0011', module: 'radar', testCase: 'RP-001 Standard Precip (r4)',   input: 'pair_RP001_r4.png',        result: 'PASS',   score: 96.9, timestamp: '2026-10-01T13:20:00Z' },
  { id: 'RV-0012', module: 'radar', testCase: 'RP-002 Heavy Rain Cell (r4)',   input: 'pair_RP002_r4.png',        result: 'PASS',   score: 94.5, timestamp: '2026-10-01T13:10:00Z' },
  { id: 'RV-0013', module: 'radar', testCase: 'RP-003 Light Scatter (r4)',     input: 'pair_RP003_r4.png',        result: 'PASS',   score: 97.9, timestamp: '2026-10-01T13:00:00Z' },
  { id: 'RV-0014', module: 'radar', testCase: 'RP-001 Standard Precip (r5)',   input: 'pair_RP001_r5.png',        result: 'PASS',   score: 97.2, timestamp: '2026-10-01T12:50:00Z' },
  { id: 'RV-0015', module: 'radar', testCase: 'RP-002 Heavy Rain Cell (r5)',   input: 'pair_RP002_r5.png',        result: 'PASS',   score: 94.1, timestamp: '2026-10-01T12:40:00Z' },
  { id: 'RV-0016', module: 'radar', testCase: 'RP-004 Missing Red (r2)',       input: 'pair_RP004_r2.png',        result: 'FAIL',   score: 63.2, timestamp: '2026-10-01T12:30:00Z' },
  { id: 'RV-0017', module: 'radar', testCase: 'RP-003 Light Scatter (r5)',     input: 'pair_RP003_r5.png',        result: 'PASS',   score: 98.0, timestamp: '2026-10-01T12:20:00Z' },
  { id: 'RV-0018', module: 'radar', testCase: 'RP-001 Standard Precip (r6)',   input: 'pair_RP001_r6.png',        result: 'PASS',   score: 96.7, timestamp: '2026-10-01T12:10:00Z' },
  { id: 'RV-0019', module: 'radar', testCase: 'RP-002 Heavy Rain Cell (r6)',   input: 'pair_RP002_r6.png',        result: 'PASS',   score: 95.3, timestamp: '2026-10-01T12:00:00Z' },
  { id: 'RV-0020', module: 'radar', testCase: 'RP-003 Light Scatter (r6)',     input: 'pair_RP003_r6.png',        result: 'PASS',   score: 97.5, timestamp: '2026-10-01T11:50:00Z' },
];

// ── Dashboard aggregates ───────────────────────────────────────────────
export const dashboardStats = {
  audio: { total: 25, passed: 23, failed: 2, lowConfidence: 1 },
  radar: { total: 20, passed: 18, failed: 2, meanSimilarity: 94.8, threshold: 90 },
};

// ── Reports ────────────────────────────────────────────────────────────
export const reports: Report[] = [
  { id: 'RPT-001', module: 'audio', generatedAt: '2026-10-02T12:00:00Z', format: 'JSON',  status: 'ready', runIds: ['AV-0198', 'AV-0039'] },
  { id: 'RPT-002', module: 'audio', generatedAt: '2026-10-02T11:55:00Z', format: 'Excel', status: 'ready', runIds: ['AV-0197', 'AV-0012'] },
  { id: 'RPT-003', module: 'radar', generatedAt: '2026-10-02T10:30:00Z', format: 'JSON',  status: 'ready', runIds: ['RV-0001', 'RV-0004'] },
  { id: 'RPT-004', module: 'radar', generatedAt: '2026-10-02T10:15:00Z', format: 'HTML',  status: 'ready', runIds: ['RV-0002', 'RV-0003'] },
  { id: 'RPT-005', module: 'audio', generatedAt: '2026-10-01T16:10:00Z', format: 'JSON',  status: 'ready', runIds: ['AV-0300', 'AV-0301', 'AV-0302'] },
  { id: 'RPT-006', module: 'radar', generatedAt: '2026-10-01T14:30:00Z', format: 'Excel', status: 'ready', runIds: ['RV-0005', 'RV-0006', 'RV-0007'] },
];

// ── Calibration ────────────────────────────────────────────────────────
export const calibrationCurve: CalibrationPoint[] = [
  { threshold: 50, falsePassRate: 28.0, falseFailRate: 0.5 },
  { threshold: 55, falsePassRate: 22.0, falseFailRate: 0.8 },
  { threshold: 60, falsePassRate: 17.0, falseFailRate: 1.2 },
  { threshold: 65, falsePassRate: 12.5, falseFailRate: 1.8 },
  { threshold: 70, falsePassRate: 8.0,  falseFailRate: 2.5 },
  { threshold: 75, falsePassRate: 5.0,  falseFailRate: 3.8 },
  { threshold: 80, falsePassRate: 3.2,  falseFailRate: 5.5 },
  { threshold: 85, falsePassRate: 1.8,  falseFailRate: 8.0 },
  { threshold: 90, falsePassRate: 0.6,  falseFailRate: 12.0 },
  { threshold: 95, falsePassRate: 0.1,  falseFailRate: 22.0 },
  { threshold: 100, falsePassRate: 0,    falseFailRate: 48.0 },
];

export const timingTolerances: TimingTolerance[] = [
  { nominalSec: 0.75, toleranceSec: 0.10, label: '0.75 s ± 0.10 s' },
  { nominalSec: 0.40, toleranceSec: 0.06, label: '0.40 s ± 0.06 s' },
  { nominalSec: 0.20, toleranceSec: 0.06, label: '0.20 s ± 0.06 s' },
];
