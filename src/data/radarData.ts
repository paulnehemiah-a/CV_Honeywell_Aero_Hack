/* ─────────────────────────────────────────────────────────────────────────
   VeriDeck – Radar mock data
   All values are demonstration-only.
   ───────────────────────────────────────────────────────────────────────── */
import type {
  RadarPairInfo,
  RadarConstraints,
  RadarComparisonResult,
  DifferenceRegion,
} from '../types';

// ── Pair catalogue ─────────────────────────────────────────────────────
export const radarPairs: RadarPairInfo[] = [
  { id: 'RP-001', name: 'Standard Precip – 40 NM', sourceReference: 'REF-WXR-2100-A', expectedDimensions: { w: 512, h: 512 }, actualDimensions: { w: 512, h: 512 } },
  { id: 'RP-002', name: 'Heavy Rain Cell – 20 NM',  sourceReference: 'REF-WXR-2100-B', expectedDimensions: { w: 512, h: 512 }, actualDimensions: { w: 512, h: 512 } },
  { id: 'RP-003', name: 'Light Scatter – 80 NM',    sourceReference: 'REF-WXR-2100-C', expectedDimensions: { w: 512, h: 512 }, actualDimensions: { w: 512, h: 512 } },
  { id: 'RP-004', name: 'Missing Red Region – FAIL', sourceReference: 'REF-WXR-2100-D', expectedDimensions: { w: 512, h: 512 }, actualDimensions: { w: 512, h: 512 } },
];

export const defaultRadarConstraints: RadarConstraints = {
  ignoreText: true,
  ignoreIcons: true,
  ignoreArcLines: true,
  ignoreWindowChrome: true,
  ignoreBorder: false,
  threshold: 90,
};

// ── Difference regions for overlay demo ────────────────────────────────
const passRegions: DifferenceRegion[] = [
  { x: 80, y: 100, w: 160, h: 120, kind: 'matched' },
  { x: 260, y: 80,  w: 100, h: 90,  kind: 'matched' },
  { x: 140, y: 250, w: 120, h: 80,  kind: 'matched' },
  { x: 10,  y: 10,  w: 492, h: 20,  kind: 'ignored' },
  { x: 10,  y: 480, w: 492, h: 22,  kind: 'ignored' },
  { x: 370, y: 190, w: 40,  h: 30,  kind: 'expected_only' },
];

const failRegions: DifferenceRegion[] = [
  { x: 80, y: 100, w: 160, h: 120, kind: 'matched' },
  { x: 260, y: 80,  w: 100, h: 90,  kind: 'matched' },
  { x: 10,  y: 10,  w: 492, h: 20,  kind: 'ignored' },
  { x: 10,  y: 480, w: 492, h: 22,  kind: 'ignored' },
  { x: 320, y: 300, w: 120, h: 100, kind: 'expected_only' },
  { x: 100, y: 350, w: 60,  h: 50,  kind: 'actual_only' },
];

// ── Pre-built results ──────────────────────────────────────────────────
export const radarResultPass: RadarComparisonResult = {
  pairId: 'RP-001',
  verdict: 'PASS',
  similarity: 96.8,
  threshold: 90,
  reason: 'Functional equivalence confirmed — all precipitation classes match within tolerance.',
  alignment: { translationX: 1.2, translationY: -0.8, rotationDeg: 0.12, confidence: 98.2 },
  precipitationClasses: [
    { name: 'Green',   color: '#22c55e', expectedAreaPx: 12480, actualAreaPx: 12320, precision: 0.98, recall: 0.97, f1Score: 0.97 },
    { name: 'Yellow',  color: '#facc15', expectedAreaPx: 8230,  actualAreaPx: 8010,  precision: 0.96, recall: 0.94, f1Score: 0.95 },
    { name: 'Red',     color: '#ef4444', expectedAreaPx: 1520,  actualAreaPx: 1524,  precision: 0.99, recall: 0.99, f1Score: 0.99 },
    { name: 'Magenta', color: '#d946ef', expectedAreaPx: 320,   actualAreaPx: 310,   precision: 0.97, recall: 0.96, f1Score: 0.96 },
  ],
  scoreBreakdown: {
    spatialAgreement: 97.4,
    colorAgreement: 95.8,
    boundaryAgreement: 96.1,
    maskedSimilarity: 97.2,
    alignmentQuality: 98.5,
  },
  differenceRegions: passRegions,
};

export const radarResultFail: RadarComparisonResult = {
  pairId: 'RP-004',
  verdict: 'FAIL',
  similarity: 61.8,
  threshold: 90,
  reason: 'Significant actual-vs-reference precipitation mismatch detected in lower-right region.',
  alignment: { translationX: 0.4, translationY: -0.2, rotationDeg: 0.04, confidence: 97.8 },
  precipitationClasses: [
    { name: 'Green',   color: '#22c55e', expectedAreaPx: 11200, actualAreaPx: 10800, precision: 0.94, recall: 0.91, f1Score: 0.92 },
    { name: 'Yellow',  color: '#facc15', expectedAreaPx: 6500,  actualAreaPx: 4200,  precision: 0.88, recall: 0.57, f1Score: 0.69 },
    { name: 'Red',     color: '#ef4444', expectedAreaPx: 2800,  actualAreaPx: 420,   precision: 0.90, recall: 0.14, f1Score: 0.24 },
    { name: 'Magenta', color: '#d946ef', expectedAreaPx: 640,   actualAreaPx: 0,     precision: 0,    recall: 0,    f1Score: 0 },
  ],
  scoreBreakdown: {
    spatialAgreement: 68.2,
    colorAgreement: 52.4,
    boundaryAgreement: 61.0,
    maskedSimilarity: 65.8,
    alignmentQuality: 97.8,
  },
  differenceRegions: failRegions,
};

export const radarResultsMap: Record<string, RadarComparisonResult> = {
  'RP-001': radarResultPass,
  'RP-002': { ...radarResultPass, pairId: 'RP-002', similarity: 94.2, scoreBreakdown: { ...radarResultPass.scoreBreakdown, colorAgreement: 93.1 } },
  'RP-003': { ...radarResultPass, pairId: 'RP-003', similarity: 98.1, scoreBreakdown: { ...radarResultPass.scoreBreakdown, spatialAgreement: 99.0 } },
  'RP-004': radarResultFail,
};

// ── Radar-display drawing helpers (used by RadarCanvas) ────────────────
export interface PrecipRegionDraw {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  rotation: number;
  color: string;
}

/** Expected-image precipitation blobs (normalised 0-1 coordinates). */
export const expectedPrecipRegions: PrecipRegionDraw[] = [
  { cx: 0.55, cy: 0.40, rx: 0.18, ry: 0.12, rotation: 15, color: '#22c55e' },
  { cx: 0.58, cy: 0.42, rx: 0.10, ry: 0.07, rotation: 10, color: '#facc15' },
  { cx: 0.60, cy: 0.44, rx: 0.04, ry: 0.03, rotation: 5,  color: '#ef4444' },
  { cx: 0.35, cy: 0.60, rx: 0.12, ry: 0.08, rotation: -20, color: '#22c55e' },
  { cx: 0.37, cy: 0.62, rx: 0.06, ry: 0.04, rotation: -15, color: '#facc15' },
  { cx: 0.70, cy: 0.65, rx: 0.08, ry: 0.10, rotation: 30,  color: '#22c55e' },
  { cx: 0.72, cy: 0.67, rx: 0.04, ry: 0.05, rotation: 25,  color: '#ef4444' },
];

/** Actual-image precipitation blobs for PASS pair (slightly shifted). */
export const actualPrecipRegionsPass: PrecipRegionDraw[] = [
  { cx: 0.56, cy: 0.41, rx: 0.17, ry: 0.12, rotation: 14, color: '#22c55e' },
  { cx: 0.59, cy: 0.43, rx: 0.09, ry: 0.07, rotation: 11, color: '#facc15' },
  { cx: 0.61, cy: 0.44, rx: 0.04, ry: 0.03, rotation: 6,  color: '#ef4444' },
  { cx: 0.36, cy: 0.61, rx: 0.11, ry: 0.08, rotation: -18, color: '#22c55e' },
  { cx: 0.37, cy: 0.63, rx: 0.06, ry: 0.04, rotation: -14, color: '#facc15' },
  { cx: 0.71, cy: 0.66, rx: 0.08, ry: 0.09, rotation: 28,  color: '#22c55e' },
  { cx: 0.72, cy: 0.68, rx: 0.04, ry: 0.04, rotation: 24,  color: '#ef4444' },
];

/** Actual-image blobs for FAIL pair (red region missing). */
export const actualPrecipRegionsFail: PrecipRegionDraw[] = [
  { cx: 0.56, cy: 0.41, rx: 0.17, ry: 0.12, rotation: 14, color: '#22c55e' },
  { cx: 0.59, cy: 0.43, rx: 0.09, ry: 0.07, rotation: 11, color: '#facc15' },
  // Red region near top-right MISSING
  { cx: 0.36, cy: 0.61, rx: 0.11, ry: 0.08, rotation: -18, color: '#22c55e' },
  // Lower-right green only, no inner layers
];
