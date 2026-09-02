'use client';

import React, { useState } from 'react';
import {
  X, Search, Sparkles, Loader2, ArrowRight,
  Globe, Code2, Wrench, Target,
} from 'lucide-react';
import { Button } from './Button';
import { Alert } from './Alert';
import { createAudit, type CreateAuditResult } from '@/lib/supabase/audit-actions';
import type { AuditWithQueries } from '@/lib/supabase/types';

export interface AuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (audit: AuditWithQueries) => void;
}

const QUERY_TYPE_ICONS: Record<string, React.ReactNode> = {
  local_discovery: <Globe className="w-3.5 h-3.5 text-blue-600" />,
  specialization: <Code2 className="w-3.5 h-3.5 text-purple-600" />,
  service: <Wrench className="w-3.5 h-3.5 text-amber-600" />,
  hiring_intent: <Target className="w-3.5 h-3.5 text-emerald-600" />,
};

const QUERY_TYPE_LABELS: Record<string, string> = {
  local_discovery: 'Local',
  specialization: 'Specialization',
  service: 'Service',
  hiring_intent: 'Hiring Intent',
};

export const AuditModal: React.FC<AuditModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [status, setStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle');
  const [result, setResult] = useState<AuditWithQueries | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async () => {
    setStatus('running');
    setError(null);
    setResult(null);

    const res: CreateAuditResult = await createAudit();

    if (res.error) {
      setStatus('error');
      setError(res.error);
      return;
    }

    if (res.audit) {
      setResult(res.audit);
      setStatus('done');
    }
  };

  const handleClose = () => {
    setStatus('idle');
    setResult(null);
    setError(null);
    onClose();
  };

  const handleDone = () => {
    if (result) onComplete?.(result);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl border border-rose-200 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700">
              <Sparkles className={`w-5 h-5 ${status === 'running' ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Visibility Audit</h3>
              <p className="text-xs text-slate-500">
                {status === 'idle' && 'Generate discovery queries from your profile'}
                {status === 'running' && 'Generating queries with AI…'}
                {status === 'done' && `${result?.queries_count ?? 0} queries generated`}
                {status === 'error' && 'Audit encountered an error'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={status === 'running'}
            className="text-slate-400 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* IDLE — start screen */}
          {status === 'idle' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                <span>
                  Signal will analyze your profile and generate <strong>8 professional discovery queries</strong> across
                  local, specialization, service, and hiring-intent categories.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="glow"
                  onClick={handleStart}
                  icon={<Search className="w-4 h-4" />}
                >
                  Start Audit
                </Button>
              </div>
            </div>
          )}

          {/* RUNNING */}
          {status === 'running' && (
            <div className="py-6 text-center space-y-4">
              <Loader2 className="w-10 h-10 text-rose-700 animate-spin mx-auto" />
              <div>
                <h4 className="text-sm font-bold text-slate-900">Generating discovery queries</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Analyzing your profile and creating targeted search queries…
                </p>
              </div>
            </div>
          )}

          {/* ERROR */}
          {status === 'error' && error && (
            <div className="space-y-4">
              <Alert type="error" title="Audit failed">
                {error}
              </Alert>
              <div className="flex items-center justify-end gap-3">
                <Button variant="ghost" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="glow" onClick={handleStart} icon={<Search className="w-4 h-4" />}>
                  Retry
                </Button>
              </div>
            </div>
          )}

          {/* DONE — show generated queries with visibility results */}
          {status === 'done' && result && (
            <div className="space-y-4">
              <Alert type="success" title={`${result.queries_count} queries checked`}>
                Your profile has been analyzed across AI providers. Review the results below.
              </Alert>

              <div className="space-y-2">
                {result.queries.map((q) => (
                  <div
                    key={q.id}
                    className={`p-3 rounded-xl border bg-white transition-colors ${
                      q.visibility_status === 'recommended'
                        ? 'border-emerald-300 bg-emerald-50/50'
                        : q.visibility_status === 'mentioned'
                        ? 'border-blue-300 bg-blue-50/50'
                        : q.visibility_status === 'not_found'
                        ? 'border-slate-200'
                        : 'border-amber-200 bg-amber-50/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        {QUERY_TYPE_ICONS[q.query_type] ?? <Search className="w-3.5 h-3.5 text-slate-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 leading-snug">
                          {q.query_text}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                            {QUERY_TYPE_LABELS[q.query_type] ?? q.query_type}
                          </span>
                          {q.visibility_status && (
                            <VisibilityBadge status={q.visibility_status} position={q.position} />
                          )}
                          {q.provider && (
                            <span className="text-[10px] text-slate-400 capitalize">{q.provider}</span>
                          )}
                        </div>
                        {q.other_professionals && q.other_professionals.length > 0 && (
                          <p className="text-[10px] text-slate-500 mt-1.5">
                            Others mentioned: {q.other_professionals.join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="ghost" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="glow" onClick={handleDone} icon={<ArrowRight className="w-4 h-4" />}>
                  View Dashboard
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------
// Visibility status badge
// ------------------------------------------------------------------

import type { VisibilityStatus } from '@/lib/supabase/types';

const VISUAL_CONFIG: Record<
  VisibilityStatus,
  { bg: string; text: string; label: string }
> = {
  recommended: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Recommended' },
  mentioned: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Mentioned' },
  not_found: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'Not found' },
  could_not_check: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Could not check' },
};

function VisibilityBadge({
  status,
  position,
}: {
  status: VisibilityStatus;
  position: number | null;
}) {
  const cfg = VISUAL_CONFIG[status] ?? VISUAL_CONFIG.not_found;
  const positionLabel = position !== null ? ` (#${position})` : '';

  return (
    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.text}`}>
      {cfg.label}
      {positionLabel}
    </span>
  );
}