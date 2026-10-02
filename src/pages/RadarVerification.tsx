import React, { useEffect, useState } from 'react';
import { radarApi } from '../services/api';
import type { RadarComparisonResult, RadarConstraints, RadarPairInfo, PipelineStep } from '../types';
import { Panel, Button, StatusBadge, ProgressStepper, MetricCard } from '../components/ui/Shared';
import { RadarViewer } from '../components/radar/RadarViewer';
import { Upload, Layers, Play, Settings2, Image as ImageIcon } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { expectedPrecipRegions, actualPrecipRegionsPass, actualPrecipRegionsFail, radarPairs } from '../data/radarData';

export default function RadarVerification() {
  const [selectedPair, setSelectedPair] = useState<string>(radarPairs[0].id);
  const [constraints, setConstraints] = useState<RadarConstraints>({
    ignoreText: true,
    ignoreIcons: true,
    ignoreArcLines: true,
    ignoreWindowChrome: true,
    ignoreBorder: false,
    threshold: 90,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [steps, setSteps] = useState<PipelineStep[]>([]);
  const [result, setResult] = useState<RadarComparisonResult | null>(null);

  const { toast } = useToast();

  const handlePairChange = (id: string) => {
    setSelectedPair(id);
    setResult(null);
    setSteps([]);
  };

  const runVerification = async () => {
    setIsProcessing(true);
    setResult(null);
    setSteps([]);
    try {
      const res = await radarApi.comparePair(selectedPair, constraints, setSteps);
      setResult(res);
      toast(res.verdict === 'PASS' ? 'success' : 'error', `Radar pair verified: ${res.verdict}`);
    } catch (e) {
      toast('error', 'Comparison failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const currentPair = radarPairs.find(p => p.id === selectedPair);

  return (
    <div className="flex flex-col gap-6 max-w-[1400px]">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary mb-1">Radar Image Verification</h1>
        <p className="text-text-secondary text-sm">Determine whether two radar renderings are functionally equivalent.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Input & Constraints */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          <Panel title="Pair Selection">
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase">Select Pair</label>
                <select
                  className="w-full bg-bg-surface border border-border-base rounded px-3 py-2 text-sm text-text-primary focus:border-info focus:outline-none"
                  value={selectedPair}
                  onChange={(e) => handlePairChange(e.target.value)}
                  disabled={isProcessing}
                >
                  {radarPairs.map(p => (
                    <option key={p.id} value={p.id}>{p.id} — {p.name}</option>
                  ))}
                </select>
              </div>
              
              {currentPair && (
                <div className="flex flex-col gap-3 p-3 bg-bg-surface border border-border-base rounded">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-muted">Source Ref:</span>
                    <span className="font-mono">{currentPair.sourceReference}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-muted">Dimensions:</span>
                    <span className="font-mono">{currentPair.expectedDimensions.w}x{currentPair.expectedDimensions.h} px</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="border border-border-base rounded p-2 flex flex-col items-center justify-center text-text-muted gap-2 bg-bg-surface/50 h-24 hover:bg-bg-hover transition-colors cursor-pointer">
                  <Upload size={16} />
                  <span className="text-xs font-medium">Expected</span>
                </div>
                <div className="border border-border-base rounded p-2 flex flex-col items-center justify-center text-text-muted gap-2 bg-bg-surface/50 h-24 hover:bg-bg-hover transition-colors cursor-pointer">
                  <Upload size={16} />
                  <span className="text-xs font-medium">Actual</span>
                </div>
              </div>
              
              <Button variant="primary" onClick={runVerification} disabled={isProcessing}>
                <Layers size={16} /> Build Pair & Compare
              </Button>
            </div>
          </Panel>

          <Panel title={<div className="flex items-center gap-2"><Settings2 size={16}/> Comparison Constraints</div>}>
            <div className="flex flex-col gap-3">
              {(['ignoreText', 'ignoreIcons', 'ignoreArcLines', 'ignoreWindowChrome', 'ignoreBorder'] as const).map(key => (
                <label key={key} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="accent-info w-4 h-4 rounded border-border-base bg-bg-surface"
                    checked={constraints[key as keyof RadarConstraints] as boolean}
                    onChange={(e) => setConstraints({ ...constraints, [key]: e.target.checked })}
                    disabled={isProcessing}
                  />
                  <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </span>
                </label>
              ))}
              
              <div className="mt-4 pt-4 border-t border-border-base">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-text-primary">Similarity Threshold</span>
                  <span className="text-sm font-mono text-info">{constraints.threshold}%</span>
                </div>
                <input
                  type="range"
                  min="50" max="100" step="1"
                  value={constraints.threshold}
                  onChange={(e) => setConstraints({ ...constraints, threshold: Number(e.target.value) })}
                  className="w-full accent-info"
                  disabled={isProcessing}
                />
              </div>
            </div>
          </Panel>

          {steps.length > 0 && !result && (
            <Panel title="Analysis Pipeline">
              <ProgressStepper steps={steps} />
            </Panel>
          )}
        </div>

        {/* Right Column: Evidence & Results */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          {!result && !isProcessing && (
             <div className="h-full flex flex-col items-center justify-center text-text-muted border-2 border-dashed border-border-base rounded-lg p-12">
               <ImageIcon size={48} className="mb-4 opacity-20" />
               <p>Select an image pair and click Compare to view precipitation mapping.</p>
             </div>
          )}

          {isProcessing && (
            <div className="h-full flex flex-col items-center justify-center text-info p-12">
              <div className="w-16 h-16 relative">
                <div className="absolute inset-0 border-4 border-info/20 rounded-md"></div>
                <div className="absolute inset-0 border-4 border-info rounded-md border-t-transparent animate-spin"></div>
              </div>
              <p className="mt-4 font-mono animate-pulse">Running spatial analysis & alignment...</p>
            </div>
          )}

          {result && (
            <>
              {/* Score Panel */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`md:col-span-2 rounded-lg border p-5 flex flex-col justify-center ${
                  result.verdict === 'PASS' ? 'bg-pass-dim border-pass/30' : 'bg-fail-dim border-fail/30'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <h2 className={`text-2xl font-bold tracking-tight ${result.verdict === 'PASS' ? 'text-pass' : 'text-fail'}`}>
                      {result.verdict}
                    </h2>
                    <div className="text-right">
                       <span className="block text-[10px] text-text-muted uppercase tracking-wider mb-0.5">Similarity Score</span>
                       <span className="text-3xl font-bold font-mono">{result.similarity.toFixed(1)}%</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium mt-1">{result.reason}</p>
                  <p className="text-xs opacity-70 mt-2 font-mono">Threshold: {result.threshold}%</p>
                </div>
                
                <div className="bg-bg-elevated border border-border-base rounded-lg p-4 flex flex-col gap-2 justify-center">
                  <div className="flex justify-between text-xs"><span className="text-text-muted">Spatial Agreement</span><span className="font-mono">{result.scoreBreakdown.spatialAgreement}%</span></div>
                  <div className="flex justify-between text-xs"><span className="text-text-muted">Color Agreement</span><span className="font-mono">{result.scoreBreakdown.colorAgreement}%</span></div>
                  <div className="flex justify-between text-xs"><span className="text-text-muted">Boundary Agrmnt</span><span className="font-mono">{result.scoreBreakdown.boundaryAgreement}%</span></div>
                  <div className="flex justify-between text-xs"><span className="text-text-muted">Masked Similarity</span><span className="font-mono">{result.scoreBreakdown.maskedSimilarity}%</span></div>
                  <div className="flex justify-between text-xs"><span className="text-text-muted">Alignment Quality</span><span className="font-mono text-info">{result.scoreBreakdown.alignmentQuality}%</span></div>
                </div>
              </div>

              {/* Main Comparison Viewer */}
              <Panel>
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
                  {/* Radar Display */}
                  <div className="flex flex-col">
                    <RadarViewer 
                      expectedRegions={expectedPrecipRegions} 
                      actualRegions={result.verdict === 'FAIL' ? actualPrecipRegionsFail : actualPrecipRegionsPass}
                      differenceRegions={result.differenceRegions}
                    />
                  </div>
                  
                  {/* Right side metrics */}
                  <div className="flex flex-col gap-6">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">Alignment Quality</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <MetricCard label="Trans X" value={result.alignment.translationX} subvalue="px" />
                        <MetricCard label="Trans Y" value={result.alignment.translationY} subvalue="px" />
                        <MetricCard label="Rotation" value={result.alignment.rotationDeg} subvalue="°" />
                        <MetricCard label="Confidence" value={`${result.alignment.confidence}%`} />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">Precipitation Classes</h4>
                      <div className="flex flex-col gap-3">
                        {result.precipitationClasses.map(pc => (
                          <div key={pc.name} className="flex flex-col gap-1.5 p-3 rounded border border-border-base bg-bg-surface">
                             <div className="flex items-center gap-2">
                               <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pc.color }} />
                               <span className="text-sm font-semibold">{pc.name}</span>
                               <span className="ml-auto font-mono text-xs text-text-muted">F1: <span className={pc.f1Score < 0.9 ? 'text-fail' : 'text-pass'}>{pc.f1Score.toFixed(2)}</span></span>
                             </div>
                             <div className="flex justify-between text-[10px] text-text-muted font-mono mt-1">
                               <span>Exp: {pc.expectedAreaPx}px²</span>
                               <span>Act: {pc.actualAreaPx}px²</span>
                             </div>
                             <div className="w-full h-1 bg-bg-elevated rounded overflow-hidden">
                                <div className={`h-full ${pc.f1Score < 0.9 ? 'bg-fail' : 'bg-pass'}`} style={{ width: `${Math.max(0, Math.min(100, pc.f1Score * 100))}%` }} />
                             </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Panel>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
