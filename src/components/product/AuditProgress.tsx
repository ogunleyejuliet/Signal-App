import React from 'react';
import { Check, Circle, Loader2 } from 'lucide-react';
import { Card } from '../ui/Card';

export interface AuditStepItem {
  id: string;
  label: string;
  status: 'completed' | 'current' | 'upcoming';
}

export interface AuditProgressProps {
  steps?: AuditStepItem[];
  className?: string;
}

const defaultSteps: AuditStepItem[] = [
  { id: '1', label: 'Profile analysis', status: 'completed' },
  { id: '2', label: 'Source analysis', status: 'completed' },
  { id: '3', label: 'Query generation', status: 'completed' },
  { id: '4', label: 'Visibility check', status: 'current' },
  { id: '5', label: 'Report generation', status: 'upcoming' }
];

export const AuditProgress: React.FC<AuditProgressProps> = ({
  steps = defaultSteps,
  className = ''
}) => {
  return (
    <Card borderVariant="wine" className={`p-4 space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-rose-300">Live Audit Progress</h4>
        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-rose-950/60 border border-rose-800/40 text-rose-400">
          Signal Scanner
        </span>
      </div>

      <div className="space-y-2.5">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all ${
              step.status === 'completed'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : step.status === 'current'
                ? 'bg-rose-950/60 border-rose-700/60 text-rose-200 shadow-md shadow-rose-950/30'
                : 'bg-slate-900/40 border-slate-800 text-slate-500'
            }`}
          >
            <span className="font-semibold">{step.label}</span>
            <div>
              {step.status === 'completed' && (
                <span className="inline-flex items-center gap-1 font-bold text-emerald-400">
                  <Check className="w-4 h-4" />
                </span>
              )}
              {step.status === 'current' && (
                <span className="inline-flex items-center gap-1 font-bold text-rose-400 animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  ●
                </span>
              )}
              {step.status === 'upcoming' && (
                <span className="inline-flex items-center gap-1 text-slate-600">
                  <Circle className="w-3.5 h-3.5" />
                  ○
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
