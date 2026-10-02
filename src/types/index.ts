/* ─────────────────────────────────────────────────────────────────────────
   VeriDeck – Shared TypeScript definitions
   ───────────────────────────────────────────────────────────────────────── */

// ── Verdicts ───────────────────────────────────────────────────────────
export type Verdict = 'PASS' | 'FAIL' | 'REVIEW';

export type StepStatus = 'completed' | 'processing' | 'waiting' | 'failed';

// ── Pipeline ───────────────────────────────────────────────────────────
export interface PipelineStep {
  id: string;
  label: string;
  status: StepStatus;
  durationMs?: number;
}

// ── Audio ──────────────────────────────────────────────────────────────
export interface TimingRequirement {
  description: string;
  expectedGapSec: number;
  toleranceSec: number;
}

export interface AudioTestCase {
  id: number;
  expectedPhrase: string;
  voice: 'Male' | 'Female';
  pattern: 'Continuous' | 'One-time';
  timingRequirements: TimingRequirement[];
}

export interface AudioFileMetadata {
  filename: string;
  sampleRate: number;
  channels: number;
  durationSec: number;
  snrDb: number;
  clipping: boolean;
}

export interface AudioSegment {
  id: string;
  type: 'speech' | 'silence';
  startSec: number;
  endSec: number;
  durationSec: number;
  token?: string;
  confidence?: number;
  expectedGapSec?: number;
  status: Verdict;
}

export interface AlignmentEntry {
  position: number;
  expected: string;
  actual: string | null;
  status: 'match' | 'substitution' | 'insertion' | 'deletion';
  confidence: number;
  timingSec?: number;
}

export interface GapMeasurement {
  gapIndex: number;
  expectedSec: number;
  actualSec: number;
  toleranceSec: number;
  status: Verdict;
}

export interface GenderAnalysis {
  expected: 'Male' | 'Female';
  detected: 'Male' | 'Female';
  confidence: number;
  f0MeanHz: number;
  f0StdHz: number;
  status: Verdict;
}

export interface VerificationCheck {
  name: string;
  status: Verdict;
  details: string;
  confidence?: number;
}

export interface AudioAnalysisResult {
  testCaseId: number;
  verdict: Verdict;
  summary: string;
  checks: VerificationCheck[];
  segments: AudioSegment[];
  alignment: AlignmentEntry[];
  gaps: GapMeasurement[];
  gender: GenderAnalysis;
  fileMetadata: AudioFileMetadata;
  /** Synthetic F0 contour points for the mini-chart */
  f0Contour: number[];
  /** Synthetic waveform amplitude samples (0-1) for rendering */
  waveformSamples: number[];
}

// ── Radar ──────────────────────────────────────────────────────────────
export interface RadarPairInfo {
  id: string;
  name: string;
  sourceReference: string;
  expectedDimensions: { w: number; h: number };
  actualDimensions: { w: number; h: number };
}

export interface RadarConstraints {
  ignoreText: boolean;
  ignoreIcons: boolean;
  ignoreArcLines: boolean;
  ignoreWindowChrome: boolean;
  ignoreBorder: boolean;
  threshold: number;
}

export interface RadarAlignmentData {
  translationX: number;
  translationY: number;
  rotationDeg: number;
  confidence: number;
}

export interface PrecipitationClass {
  name: string;
  color: string;
  expectedAreaPx: number;
  actualAreaPx: number;
  precision: number;
  recall: number;
  f1Score: number;
}

export interface RadarScoreBreakdown {
  spatialAgreement: number;
  colorAgreement: number;
  boundaryAgreement: number;
  maskedSimilarity: number;
  alignmentQuality: number;
}

/** Regions for the difference overlay canvas */
export interface DifferenceRegion {
  x: number;
  y: number;
  w: number;
  h: number;
  kind: 'matched' | 'expected_only' | 'actual_only' | 'ignored';
}

export interface RadarComparisonResult {
  pairId: string;
  verdict: Verdict;
  similarity: number;
  threshold: number;
  reason: string;
  alignment: RadarAlignmentData;
  precipitationClasses: PrecipitationClass[];
  scoreBreakdown: RadarScoreBreakdown;
  differenceRegions: DifferenceRegion[];
}

// ── Run history ────────────────────────────────────────────────────────
export interface VerificationRun {
  id: string;
  module: 'audio' | 'radar';
  testCase: string;
  input: string;
  result: Verdict;
  score: number | null;
  timestamp: string;
}

// ── Reports ────────────────────────────────────────────────────────────
export interface Report {
  id: string;
  module: 'audio' | 'radar';
  generatedAt: string;
  format: 'JSON' | 'Excel' | 'HTML';
  status: 'ready' | 'generating' | 'failed';
  runIds: string[];
}

// ── Calibration ────────────────────────────────────────────────────────
export interface CalibrationPoint {
  threshold: number;
  falsePassRate: number;
  falseFailRate: number;
}

export interface TimingTolerance {
  nominalSec: number;
  toleranceSec: number;
  label: string;
}
