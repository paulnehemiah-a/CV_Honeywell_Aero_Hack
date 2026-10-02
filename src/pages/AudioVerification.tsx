import React, { useState } from 'react';
import { audioApi } from '../services/api';
import type { AudioAnalysisResult, PipelineStep, AudioTestCase } from '../types';
import { Panel, Button, StatusBadge, ProgressStepper, MetricCard } from '../components/ui/Shared';
import { WaveformViewer } from '../components/audio/WaveformViewer';
import { Upload, Mic, Play, FileAudio, AudioLines } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { audioTestCases } from '../data/audioData';

export default function AudioVerification() {
  const [selectedTestCase, setSelectedTestCase] = useState<number>(198);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [steps, setSteps] = useState<PipelineStep[]>([]);
  const [result, setResult] = useState<AudioAnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'Waveform' | 'Alignment' | 'Timing' | 'Gender' | 'Checks'>('Checks');

  const { toast } = useToast();

  const tc = audioTestCases.find((t) => t.id === selectedTestCase);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setSteps([]);
      toast('info', `File loaded: ${e.target.files[0].name}`);
    }
  };

  const runVerification = async () => {
    if (!file && !result) {
      toast('warning', 'Please upload a WAV file or record audio first.');
      return;
    }
    setIsProcessing(true);
    setResult(null);
    setSteps([]);
    try {
      const res = await audioApi.analyzeAudio(file, selectedTestCase, setSteps);
      setResult(res);
      setActiveTab('Checks');
      toast(res.verdict === 'PASS' ? 'success' : res.verdict === 'FAIL' ? 'error' : 'warning', `Verification completed: ${res.verdict}`);
    } catch (e) {
      toast('error', 'Analysis failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1400px]">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary mb-1">Audio Verification</h1>
        <p className="text-text-secondary text-sm">Verify cockpit voice annunciations against the expected phrase specification.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Input & Spec */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          <Panel title="Input Specification">
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase">Select Test Case</label>
                <select
                  className="w-full bg-bg-surface border border-border-base rounded px-3 py-2 text-sm text-text-primary focus:border-info focus:outline-none"
                  value={selectedTestCase}
                  onChange={(e) => {
                    setSelectedTestCase(Number(e.target.value));
                    setResult(null);
                    setSteps([]);
                  }}
                  disabled={isProcessing}
                >
                  {audioTestCases.map((t) => (
                    <option key={t.id} value={t.id}>
                      TC-{t.id}: {t.expectedPhrase}
                    </option>
                  ))}
                </select>
              </div>

              {tc && (
                <div className="bg-bg-surface p-3 rounded border border-border-base text-sm flex flex-col gap-2">
                  <div>
                    <span className="text-text-muted text-xs block mb-0.5">Expected Phrase</span>
                    <span className="font-mono font-medium text-info">"{tc.expectedPhrase}"</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div>
                      <span className="text-text-muted text-xs block">Voice</span>
                      <span>{tc.voice}</span>
                    </div>
                    <div>
                      <span className="text-text-muted text-xs block">Pattern</span>
                      <span>{tc.pattern}</span>
                    </div>
                  </div>
                  <div className="mt-1">
                    <span className="text-text-muted text-xs block mb-0.5">Timing Requirements</span>
                    <ul className="list-disc list-inside text-xs text-text-secondary space-y-0.5">
                      {tc.timingRequirements.map((r, i) => (
                        <li key={i}>{r.description}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </Panel>

          <Panel title="WAV Input">
            <div className="flex flex-col gap-4">
              <div className="border-2 border-dashed border-border-light rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-bg-hover transition-colors">
                <input type="file" id="wav-upload" accept=".wav" className="hidden" onChange={handleUpload} disabled={isProcessing} />
                <label htmlFor="wav-upload" className="cursor-pointer flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-bg-surface flex items-center justify-center text-info">
                    <Upload size={18} />
                  </div>
                  <span className="text-sm font-medium text-text-primary">Drag & Drop WAV or Click to Browse</span>
                  <span className="text-xs text-text-muted">44.1kHz / 16-bit PCM recommended</span>
                </label>
              </div>

              <div className="flex gap-2">
                <Button variant="secondary" className="flex-1" disabled={isProcessing}>
                  <Mic size={16} /> Record
                </Button>
                <Button variant="primary" className="flex-1" onClick={runVerification} disabled={isProcessing}>
                  <Play size={16} /> Analyze & Verify
                </Button>
              </div>

              {file && (
                <div className="flex items-center gap-3 p-3 bg-bg-surface rounded border border-border-base">
                  <FileAudio size={20} className="text-info shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{file.name}</div>
                    <div className="text-xs text-text-muted font-mono">
                      {(file.size / 1024).toFixed(1)} KB • Local file
                    </div>
                  </div>
                </div>
              )}
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
              <AudioLines size={48} className="mb-4 opacity-20" />
              <p>Upload a WAV file and click Analyze to view verification evidence.</p>
            </div>
          )}

          {isProcessing && (
            <div className="h-full flex flex-col items-center justify-center text-info p-12">
              <div className="w-16 h-16 relative">
                <div className="absolute inset-0 border-4 border-info/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-info rounded-full border-t-transparent animate-spin"></div>
              </div>
              <p className="mt-4 font-mono animate-pulse">Running verification suite...</p>
            </div>
          )}

          {result && (
            <>
              {/* Result Banner */}
              <div className={`rounded-lg border p-5 flex items-center justify-between ${
                result.verdict === 'PASS' ? 'bg-pass-dim border-pass/30' :
                result.verdict === 'FAIL' ? 'bg-fail-dim border-fail/30' :
                'bg-warn-dim border-warn/30'
              }`}>
                <div>
                  <h2 className={`text-2xl font-bold tracking-tight mb-1 ${
                    result.verdict === 'PASS' ? 'text-pass' :
                    result.verdict === 'FAIL' ? 'text-fail' : 'text-warn'
                  }`}>
                    {result.verdict}
                  </h2>
                  <p className="text-text-primary text-sm font-medium">{result.summary}</p>
                </div>
                <div className="text-right">
                  <span className="block text-xs text-text-muted mb-1 font-mono uppercase">Confidence</span>
                  <span className="text-xl font-bold font-mono">98.2%</span>
                </div>
              </div>

              {/* Evidence Tabs */}
              <Panel
                className="flex-1"
                action={
                  <div className="flex bg-bg-surface p-1 rounded-md border border-border-base">
                    {(['Checks', 'Waveform', 'Alignment', 'Timing', 'Gender'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${
                          activeTab === tab ? 'bg-bg-elevated text-text-primary shadow-sm' : 'text-text-muted hover:text-text-primary'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                }
              >
                <div className="mt-2 flex-1">
                  {/* CHECKS TAB */}
                  {activeTab === 'Checks' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {result.checks.map(c => (
                        <div key={c.name} className="flex gap-3 p-3 bg-bg-surface rounded border border-border-base">
                          <div className="mt-0.5"><StatusBadge verdict={c.status} /></div>
                          <div>
                            <div className="text-sm font-semibold">{c.name}</div>
                            <div className="text-xs text-text-muted mt-0.5 leading-relaxed">{c.details}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* WAVEFORM TAB */}
                  {activeTab === 'Waveform' && (
                    <div className="flex flex-col gap-4">
                      <WaveformViewer
                        samples={result.waveformSamples}
                        segments={result.segments}
                        duration={result.fileMetadata.durationSec}
                      />
                      <div className="grid grid-cols-4 gap-4 mt-2">
                        <MetricCard label="Duration" value={`${result.fileMetadata.durationSec.toFixed(2)}s`} />
                        <MetricCard label="Sample Rate" value={result.fileMetadata.sampleRate} subvalue="Hz" />
                        <MetricCard label="SNR" value={result.fileMetadata.snrDb} subvalue="dB" />
                        <MetricCard label="Clipping" value={result.fileMetadata.clipping ? 'Yes' : 'No'} trend={result.fileMetadata.clipping ? 'down' : 'neutral'} />
                      </div>
                    </div>
                  )}

                  {/* ALIGNMENT TAB */}
                  {activeTab === 'Alignment' && (
                    <div className="overflow-x-auto rounded border border-border-base">
                      <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-bg-surface text-text-muted">
                          <tr>
                            <th className="px-4 py-2 font-medium">Pos</th>
                            <th className="px-4 py-2 font-medium">Expected</th>
                            <th className="px-4 py-2 font-medium">Actual</th>
                            <th className="px-4 py-2 font-medium">Status</th>
                            <th className="px-4 py-2 font-medium">Conf</th>
                            <th className="px-4 py-2 font-medium">Gap</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border-base">
                          {result.alignment.map((a, i) => (
                            <tr key={i} className={a.status === 'match' ? '' : 'bg-fail/5'}>
                              <td className="px-4 py-2.5 font-mono text-text-muted">{a.position}</td>
                              <td className="px-4 py-2.5 font-mono text-info">"{a.expected}"</td>
                              <td className="px-4 py-2.5 font-mono">{a.actual ? `"${a.actual}"` : <span className="text-text-muted">—</span>}</td>
                              <td className="px-4 py-2.5">
                                <span className={`text-[11px] font-bold uppercase ${a.status === 'match' ? 'text-pass' : 'text-fail'}`}>{a.status}</span>
                              </td>
                              <td className="px-4 py-2.5 font-mono text-text-muted">{a.confidence.toFixed(2)}</td>
                              <td className="px-4 py-2.5 font-mono text-text-muted">{a.timingSec ? `${a.timingSec.toFixed(2)}s` : '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* TIMING TAB */}
                  {activeTab === 'Timing' && (
                    <div className="flex flex-col gap-4">
                      {result.gaps.map(g => (
                        <div key={g.gapIndex} className="bg-bg-surface p-4 rounded border border-border-base flex items-center gap-6">
                          <div className="shrink-0 w-16 text-center">
                            <span className="block text-[10px] text-text-muted uppercase mb-1">Gap {g.gapIndex}</span>
                            <StatusBadge verdict={g.status} />
                          </div>
                          <div className="flex-1 relative h-6 bg-bg-elevated rounded border border-border-light overflow-hidden">
                            {/* Expected marker */}
                            <div className="absolute top-0 bottom-0 w-0.5 bg-info z-10" style={{ left: '50%' }}></div>
                            <div className="absolute top-0 bottom-0 bg-info/10 z-0" style={{ left: '40%', width: '20%' }}></div>
                            {/* Actual bar */}
                            <div className={`absolute top-1.5 bottom-1.5 left-0 rounded-r ${g.status === 'PASS' ? 'bg-pass' : 'bg-fail'}`} style={{ width: `${(g.actualSec / (g.expectedSec * 2)) * 100}%` }}></div>
                          </div>
                          <div className="shrink-0 w-32 grid grid-cols-2 gap-x-2 text-xs font-mono">
                            <span className="text-text-muted">Exp:</span><span>{g.expectedSec}s</span>
                            <span className="text-text-muted">Act:</span><span className={g.status === 'PASS' ? 'text-pass' : 'text-fail'}>{g.actualSec}s</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* GENDER TAB */}
                  {activeTab === 'Gender' && (
                    <div className="grid grid-cols-2 gap-6">
                      <div className="flex flex-col gap-4">
                        <MetricCard label="Expected Voice" value={result.gender.expected} />
                        <MetricCard label="Detected Voice" value={result.gender.detected} trend={result.gender.status === 'PASS' ? 'up' : 'down'} subvalue={`${(result.gender.confidence * 100).toFixed(1)}% conf`} />
                        <div className="p-3 bg-bg-surface border border-border-base rounded text-sm text-text-secondary mt-2">
                          Fundamental frequency (F0) analysis indicates a mean pitch of {result.gender.f0MeanHz}Hz, consistent with {result.gender.detected} adult vocal characteristics.
                        </div>
                      </div>
                      <div className="bg-bg-surface border border-border-base rounded p-4 flex flex-col">
                        <span className="text-xs text-text-muted uppercase mb-4">F0 Contour (Pitch Tracking)</span>
                        <div className="flex-1 flex items-end gap-[1px]">
                          {result.f0Contour.map((val, i) => (
                            <div key={i} className="flex-1 bg-info/80 rounded-t" style={{ height: `${(val / 300) * 100}%`, minHeight: '1px' }} />
                          ))}
                        </div>
                        <div className="flex justify-between mt-2 text-[10px] text-text-muted font-mono border-t border-border-base pt-1">
                          <span>0s</span>
                          <span>Mean: {result.gender.f0MeanHz}Hz</span>
                          <span>{result.fileMetadata.durationSec.toFixed(1)}s</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Panel>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
