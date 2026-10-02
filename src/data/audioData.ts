/* ─────────────────────────────────────────────────────────────────────────
   VeriDeck – Audio mock data
   All values are demonstration-only and do not represent official specs.
   ───────────────────────────────────────────────────────────────────────── */
import type {
  AudioTestCase,
  AudioAnalysisResult,
  AudioSegment,
  AlignmentEntry,
  GapMeasurement,
  VerificationCheck,
} from '../types';

// ── Test-case catalogue ────────────────────────────────────────────────
export const audioTestCases: AudioTestCase[] = [
  {
    id: 197,
    expectedPhrase: 'pullup',
    voice: 'Male',
    pattern: 'Continuous',
    timingRequirements: [
      { description: '0.75 s between annunciations', expectedGapSec: 0.75, toleranceSec: 0.10 },
    ],
  },
  {
    id: 198,
    expectedPhrase: 'pullup Mode 1',
    voice: 'Male',
    pattern: 'Continuous',
    timingRequirements: [
      { description: '0.75 s between phrase components', expectedGapSec: 0.75, toleranceSec: 0.10 },
      { description: '0.75 s between annunciations', expectedGapSec: 0.75, toleranceSec: 0.10 },
    ],
  },
  {
    id: 12,
    expectedPhrase: 'Avoid Terrain',
    voice: 'Male',
    pattern: 'Continuous',
    timingRequirements: [
      { description: '0.75 s between annunciations', expectedGapSec: 0.75, toleranceSec: 0.10 },
    ],
  },
  {
    id: 39,
    expectedPhrase: 'Flaps! Flaps!',
    voice: 'Female',
    pattern: 'One-time',
    timingRequirements: [
      { description: '0.75 s between repeats', expectedGapSec: 0.75, toleranceSec: 0.10 },
    ],
  },
  {
    id: 221,
    expectedPhrase: 'siren windshear windshear windshear',
    voice: 'Male',
    pattern: 'One-time',
    timingRequirements: [
      { description: '0.4 s between words', expectedGapSec: 0.40, toleranceSec: 0.06 },
    ],
  },
  {
    id: 121,
    expectedPhrase: 'bank angle bank angle',
    voice: 'Male',
    pattern: 'One-time',
    timingRequirements: [
      { description: '0.75 s between repeats', expectedGapSec: 0.75, toleranceSec: 0.10 },
    ],
  },
  {
    id: 125,
    expectedPhrase: 'caution obstacle caution obstacle',
    voice: 'Male',
    pattern: 'One-time',
    timingRequirements: [
      { description: '0.75 s between repeats', expectedGapSec: 0.75, toleranceSec: 0.10 },
    ],
  },
  {
    id: 179,
    expectedPhrase: 'obstacle ahead obstacle ahead',
    voice: 'Male',
    pattern: 'One-time',
    timingRequirements: [
      { description: '0.75 s between repeats', expectedGapSec: 0.75, toleranceSec: 0.10 },
    ],
  },
  {
    id: 238,
    expectedPhrase: 'terrain ahead terrain ahead',
    voice: 'Male',
    pattern: 'One-time',
    timingRequirements: [
      { description: '0.75 s between repeats', expectedGapSec: 0.75, toleranceSec: 0.10 },
    ],
  },
  {
    id: 266,
    expectedPhrase: 'warning! Terrain',
    voice: 'Female',
    pattern: 'Continuous',
    timingRequirements: [
      { description: '0.75 s between annunciations', expectedGapSec: 0.75, toleranceSec: 0.10 },
    ],
  },
  {
    id: 268,
    expectedPhrase: 'whoop whoop pullup',
    voice: 'Female',
    pattern: 'Continuous',
    timingRequirements: [
      { description: '0.2 s between whoop whoop', expectedGapSec: 0.20, toleranceSec: 0.06 },
      { description: '0.75 s between annunciations', expectedGapSec: 0.75, toleranceSec: 0.10 },
    ],
  },
];

// ── Helpers ────────────────────────────────────────────────────────────
function generateWaveform(lengthSamples: number, segments: AudioSegment[]): number[] {
  const out: number[] = new Array(lengthSamples).fill(0);
  for (const seg of segments) {
    const s = Math.floor((seg.startSec / segments[segments.length - 1].endSec) * lengthSamples);
    const e = Math.floor((seg.endSec / segments[segments.length - 1].endSec) * lengthSamples);
    for (let i = s; i < e && i < lengthSamples; i++) {
      out[i] = seg.type === 'speech'
        ? 0.3 + Math.random() * 0.55
        : Math.random() * 0.04;
    }
  }
  return out;
}

function generateF0(length: number, mean: number, std: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < length; i++) {
    const noise = (Math.random() - 0.5) * 2 * std;
    out.push(Math.max(60, mean + noise + Math.sin(i / 8) * (std * 0.3)));
  }
  return out;
}

// ── Pre-built passing result for TC-198 ────────────────────────────────
const tc198Segments: AudioSegment[] = [
  { id: 's1', type: 'speech', startSec: 0.00, endSec: 0.56, durationSec: 0.56, token: 'pullup',  confidence: 0.98, status: 'PASS' },
  { id: 'g1', type: 'silence', startSec: 0.56, endSec: 1.31, durationSec: 0.75, expectedGapSec: 0.75, status: 'PASS' },
  { id: 's2', type: 'speech', startSec: 1.31, endSec: 1.82, durationSec: 0.51, token: 'Mode 1',  confidence: 0.95, status: 'PASS' },
  { id: 'g2', type: 'silence', startSec: 1.82, endSec: 2.57, durationSec: 0.75, expectedGapSec: 0.75, status: 'PASS' },
  { id: 's3', type: 'speech', startSec: 2.57, endSec: 3.13, durationSec: 0.56, token: 'pullup',  confidence: 0.97, status: 'PASS' },
  { id: 'g3', type: 'silence', startSec: 3.13, endSec: 3.88, durationSec: 0.75, expectedGapSec: 0.75, status: 'PASS' },
  { id: 's4', type: 'speech', startSec: 3.88, endSec: 4.40, durationSec: 0.52, token: 'Mode 1',  confidence: 0.94, status: 'PASS' },
];

const tc198Alignment: AlignmentEntry[] = [
  { position: 1, expected: 'pullup',  actual: 'pullup',  status: 'match', confidence: 0.98 },
  { position: 2, expected: 'Mode 1',  actual: 'Mode 1',  status: 'match', confidence: 0.95, timingSec: 0.75 },
  { position: 3, expected: 'pullup',  actual: 'pullup',  status: 'match', confidence: 0.97, timingSec: 0.75 },
  { position: 4, expected: 'Mode 1',  actual: 'Mode 1',  status: 'match', confidence: 0.94, timingSec: 0.75 },
];

const tc198Gaps: GapMeasurement[] = [
  { gapIndex: 1, expectedSec: 0.75, actualSec: 0.75, toleranceSec: 0.10, status: 'PASS' },
  { gapIndex: 2, expectedSec: 0.75, actualSec: 0.75, toleranceSec: 0.10, status: 'PASS' },
  { gapIndex: 3, expectedSec: 0.75, actualSec: 0.75, toleranceSec: 0.10, status: 'PASS' },
];

const tc198Checks: VerificationCheck[] = [
  { name: 'Phrase Match',     status: 'PASS', details: 'All expected tokens recognised.', confidence: 0.96 },
  { name: 'Word Order',       status: 'PASS', details: 'Token sequence matches specification.' },
  { name: 'Repetition',       status: 'PASS', details: 'Continuous repetition confirmed (≥2 cycles).' },
  { name: 'Gender',           status: 'PASS', details: 'Male voice detected (F0 mean 118 Hz).', confidence: 0.97 },
  { name: 'Timing',           status: 'PASS', details: 'All gaps within ±0.10 s tolerance.' },
  { name: 'Pattern',          status: 'PASS', details: 'Continuous pattern verified.' },
  { name: 'Silence Segments', status: 'PASS', details: 'All silence regions correctly placed.' },
];

export const audioResult198: AudioAnalysisResult = {
  testCaseId: 198,
  verdict: 'PASS',
  summary: 'All mandatory checks satisfied.',
  checks: tc198Checks,
  segments: tc198Segments,
  alignment: tc198Alignment,
  gaps: tc198Gaps,
  gender: {
    expected: 'Male',
    detected: 'Male',
    confidence: 0.97,
    f0MeanHz: 118,
    f0StdHz: 14,
    status: 'PASS',
  },
  fileMetadata: {
    filename: 'TC198_pullup_mode1.wav',
    sampleRate: 44100,
    channels: 1,
    durationSec: 4.40,
    snrDb: 38.2,
    clipping: false,
  },
  f0Contour: generateF0(200, 118, 14),
  waveformSamples: generateWaveform(600, tc198Segments),
};

// ── Pre-built FAIL result for TC-39 (missing repetition) ───────────────
const tc39Segments: AudioSegment[] = [
  { id: 's1', type: 'speech', startSec: 0.00, endSec: 0.48, durationSec: 0.48, token: 'Flaps!', confidence: 0.96, status: 'PASS' },
  { id: 'g1', type: 'silence', startSec: 0.48, endSec: 1.60, durationSec: 1.12, expectedGapSec: 0.75, status: 'FAIL' },
];

const tc39Alignment: AlignmentEntry[] = [
  { position: 1, expected: 'Flaps!', actual: 'Flaps!', status: 'match', confidence: 0.96 },
  { position: 2, expected: 'Flaps!', actual: null,     status: 'deletion', confidence: 0 },
];

const tc39Gaps: GapMeasurement[] = [
  { gapIndex: 1, expectedSec: 0.75, actualSec: 1.12, toleranceSec: 0.10, status: 'FAIL' },
];

const tc39Checks: VerificationCheck[] = [
  { name: 'Phrase Match',     status: 'FAIL', details: 'Expected repeated token missing.', confidence: 0.96 },
  { name: 'Word Order',       status: 'PASS', details: 'First token matches.' },
  { name: 'Repetition',       status: 'FAIL', details: 'Expected 2 repetitions, detected 1.' },
  { name: 'Gender',           status: 'PASS', details: 'Female voice detected (F0 mean 212 Hz).', confidence: 0.94 },
  { name: 'Timing',           status: 'FAIL', details: 'Gap 1: actual 1.12 s > expected 0.75 s + tolerance.' },
  { name: 'Pattern',          status: 'PASS', details: 'One-time pattern (single shot).' },
  { name: 'Silence Segments', status: 'FAIL', details: 'Trailing silence exceeds expected gap.' },
];

export const audioResult39: AudioAnalysisResult = {
  testCaseId: 39,
  verdict: 'FAIL',
  summary: 'Expected repeated token missing.',
  checks: tc39Checks,
  segments: tc39Segments,
  alignment: tc39Alignment,
  gaps: tc39Gaps,
  gender: {
    expected: 'Female',
    detected: 'Female',
    confidence: 0.94,
    f0MeanHz: 212,
    f0StdHz: 22,
    status: 'PASS',
  },
  fileMetadata: {
    filename: 'TC039_flaps_single.wav',
    sampleRate: 44100,
    channels: 1,
    durationSec: 1.60,
    snrDb: 34.6,
    clipping: false,
  },
  f0Contour: generateF0(80, 212, 22),
  waveformSamples: generateWaveform(300, tc39Segments),
};

// ── REVIEW result for TC-221 ───────────────────────────────────────────
const tc221Segments: AudioSegment[] = [
  { id: 's1', type: 'speech', startSec: 0.00, endSec: 0.90, durationSec: 0.90, token: 'siren', confidence: 0.72, status: 'REVIEW' },
  { id: 'g1', type: 'silence', startSec: 0.90, endSec: 1.30, durationSec: 0.40, expectedGapSec: 0.40, status: 'PASS' },
  { id: 's2', type: 'speech', startSec: 1.30, endSec: 1.98, durationSec: 0.68, token: 'windshear', confidence: 0.91, status: 'PASS' },
  { id: 'g2', type: 'silence', startSec: 1.98, endSec: 2.38, durationSec: 0.40, expectedGapSec: 0.40, status: 'PASS' },
  { id: 's3', type: 'speech', startSec: 2.38, endSec: 3.06, durationSec: 0.68, token: 'windshear', confidence: 0.93, status: 'PASS' },
  { id: 'g3', type: 'silence', startSec: 3.06, endSec: 3.46, durationSec: 0.40, expectedGapSec: 0.40, status: 'PASS' },
  { id: 's4', type: 'speech', startSec: 3.46, endSec: 4.14, durationSec: 0.68, token: 'windshear', confidence: 0.89, status: 'PASS' },
];

const tc221Checks: VerificationCheck[] = [
  { name: 'Phrase Match',     status: 'REVIEW', details: 'Siren token low confidence (0.72).', confidence: 0.72 },
  { name: 'Word Order',       status: 'PASS', details: 'Token sequence matches specification.' },
  { name: 'Repetition',       status: 'PASS', details: 'All repetitions present.' },
  { name: 'Gender',           status: 'PASS', details: 'Male voice detected (F0 mean 122 Hz).', confidence: 0.95 },
  { name: 'Timing',           status: 'PASS', details: 'All gaps within ±0.06 s tolerance.' },
  { name: 'Pattern',          status: 'PASS', details: 'One-time pattern verified.' },
  { name: 'Silence Segments', status: 'PASS', details: 'All silence regions correct.' },
];

export const audioResult221: AudioAnalysisResult = {
  testCaseId: 221,
  verdict: 'REVIEW',
  summary: 'Low confidence on siren token — manual review recommended.',
  checks: tc221Checks,
  segments: tc221Segments,
  alignment: [
    { position: 1, expected: 'siren',     actual: 'siren',     status: 'match', confidence: 0.72 },
    { position: 2, expected: 'windshear', actual: 'windshear', status: 'match', confidence: 0.91, timingSec: 0.40 },
    { position: 3, expected: 'windshear', actual: 'windshear', status: 'match', confidence: 0.93, timingSec: 0.40 },
    { position: 4, expected: 'windshear', actual: 'windshear', status: 'match', confidence: 0.89, timingSec: 0.40 },
  ],
  gaps: [
    { gapIndex: 1, expectedSec: 0.40, actualSec: 0.40, toleranceSec: 0.06, status: 'PASS' },
    { gapIndex: 2, expectedSec: 0.40, actualSec: 0.40, toleranceSec: 0.06, status: 'PASS' },
    { gapIndex: 3, expectedSec: 0.40, actualSec: 0.40, toleranceSec: 0.06, status: 'PASS' },
  ],
  gender: { expected: 'Male', detected: 'Male', confidence: 0.95, f0MeanHz: 122, f0StdHz: 16, status: 'PASS' },
  fileMetadata: { filename: 'TC221_siren_windshear.wav', sampleRate: 44100, channels: 1, durationSec: 4.14, snrDb: 29.8, clipping: false },
  f0Contour: generateF0(160, 122, 16),
  waveformSamples: generateWaveform(500, tc221Segments),
};

/** Map of pre-built results keyed by test-case ID. */
export const audioResultsMap: Record<number, AudioAnalysisResult> = {
  198: audioResult198,
  39: audioResult39,
  221: audioResult221,
};
