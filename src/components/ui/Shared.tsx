/* ─────────────────────────────────────────────────────────────────────────
   VeriDeck – Shared UI Components
   ───────────────────────────────────────────────────────────────────────── */
import React from 'react';
import type { Verdict } from '../../types';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

/* ── Badge ──────────────────────────────────────────────────────────── */
export function StatusBadge({ verdict, className = '' }: { verdict: Verdict; className?: string }) {
  const styles: Record<Verdict, string> = {
    PASS: 'bg-pass-dim text-pass border border-pass/30',
    FAIL: 'bg-fail-dim text-fail border border-fail/30',
    REVIEW: 'bg-warn-dim text-warn border border-warn/30',
  };

  const icons: Record<Verdict, React.ReactNode> = {
    PASS: <CheckCircle2 size={12} />,
    FAIL: <XCircle size={12} />,
    REVIEW: <AlertCircle size={12} />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold tracking-wide ${styles[verdict]} ${className}`}
    >
      {icons[verdict]}
      {verdict}
    </span>
  );
}

/* ── Panel / Card ───────────────────────────────────────────────────── */
export function Panel({
  title,
  children,
  className = '',
  action,
}: {
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className={`bg-bg-elevated border border-border-base rounded-md flex flex-col ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-base shrink-0">
          {title && <h3 className="text-sm font-semibold text-text-primary">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-4 flex-1 flex flex-col min-h-0">{children}</div>
    </div>
  );
}

/* ── Metric Card ────────────────────────────────────────────────────── */
export function MetricCard({
  label,
  value,
  subvalue,
  trend,
}: {
  label: string;
  value: React.ReactNode;
  subvalue?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}) {
  return (
    <div className="bg-bg-elevated border border-border-base rounded-md p-4 flex flex-col">
      <span className="text-xs text-text-secondary font-medium mb-1 uppercase tracking-wider">{label}</span>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold font-mono text-text-primary">{value}</span>
        {subvalue && (
          <span
            className={`text-xs font-medium ${
              trend === 'up' ? 'text-pass' : trend === 'down' ? 'text-fail' : 'text-text-muted'
            }`}
          >
            {subvalue}
          </span>
        )}
      </div>
    </div>
  );
}

/* ── Button ─────────────────────────────────────────────────────────── */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed rounded';

  const variants = {
    primary: 'bg-info hover:bg-info/90 text-white shadow-sm',
    secondary: 'bg-bg-surface hover:bg-bg-hover text-text-primary border border-border-light shadow-sm',
    outline: 'bg-transparent border border-border-focus text-info hover:bg-info/10',
    danger: 'bg-fail hover:bg-fail/90 text-white shadow-sm',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2',
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}

/* ── Progress Stepper ───────────────────────────────────────────────── */
import type { PipelineStep } from '../../types';
import { Loader2, Check } from 'lucide-react';

export function ProgressStepper({ steps }: { steps: PipelineStep[] }) {
  return (
    <div className="flex flex-col gap-3 py-2">
      {steps.map((step, idx) => (
        <div key={step.id} className="flex items-start gap-3">
          {/* Icon */}
          <div className="mt-0.5 shrink-0">
            {step.status === 'completed' && <Check size={16} className="text-pass" />}
            {step.status === 'processing' && <Loader2 size={16} className="text-info animate-spin" />}
            {step.status === 'waiting' && <div className="w-4 h-4 rounded-full border-2 border-border-base" />}
            {step.status === 'failed' && <XCircle size={16} className="text-fail" />}
          </div>

          {/* Text & line */}
          <div className="flex-1 pb-3 relative">
            {/* Connecting line */}
            {idx < steps.length - 1 && (
              <div
                className={`absolute left-[-19px] top-6 bottom-0 w-px ${
                  step.status === 'completed' ? 'bg-pass/30' : 'bg-border-base'
                }`}
              />
            )}
            <div className="flex items-center justify-between">
              <span
                className={`text-sm ${
                  step.status === 'completed' || step.status === 'processing'
                    ? 'text-text-primary font-medium'
                    : 'text-text-muted'
                }`}
              >
                {step.label}
              </span>
              {step.durationMs && (
                <span className="text-[11px] font-mono text-text-muted">{step.durationMs}ms</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
