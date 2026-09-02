'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Lightbulb,
  ArrowLeft,
  Users,
  Brain,
  AlertTriangle,
  FileQuestion,
  ListChecks,
  RefreshCw,
} from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Tabs } from './ui/Tabs';
import { VisibilityGauge } from './ui/VisibilityGauge';
import { AiRecommendationStatus, type AiStatusType } from './product/AiRecommendationStatus';
import type { VisibilityReport, Priority, RecommendedAction, ReportGap } from '@/lib/report/types';

export interface ReportViewProps {
  report: VisibilityReport;
  onRunAudit: () => void;
  onOpenHistory?: () => void;
}

// ------------------------------------------------------------------
// Helpers to convert DB statuses to the badge type the UI expects
// ------------------------------------------------------------------

function toAiStatus(status: string | null): AiStatusType {
  if (status === 'recommended') return 'Recommended';
  if (status === 'mentioned') return 'Mentioned';
  if (status === 'not_found') return 'Not found';
  return 'Could not check';
}

const priorityVariant: Record<Priority, 'low' | 'moderate' | 'info'> = {
  High: 'low',
  Medium: 'moderate',
  Low: 'info',
};

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return String(iso);
  }
}

// ------------------------------------------------------------------
// Main view
// ------------------------------------------------------------------

export const ReportView: React.FC<ReportViewProps> = ({ report, onRunAudit, onOpenHistory }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabOptions = [
    { id: 'overview', label: 'Executive Summary' },
    { id: 'queries', label: 'AI Visibility Results', count: report.queryResults.length },
    { id: 'recommended', label: 'Who AI Recommended' },
    { id: 'gaps', label: 'Gaps & Missing Info' },
    { id: 'actions', label: 'Recommended Actions', count: report.recommendedActions.length },
  ];

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-rose-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenHistory}
              className="text-xs text-rose-700 hover:text-rose-900 flex items-center gap-1 font-semibold cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Audit History
            </button>
            <span className="text-slate-400">•</span>
            <Badge variant="neutral" size="sm">{formatDate(report.createdAt)}</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            AI Visibility Audit Report
          </h1>
          <p className="text-xs text-slate-500">
            Target Profile: <span className="text-slate-800 font-medium">{report.profile.name || '—'}</span> • Audit ID:{' '}
            <span className="font-mono text-rose-700">{report.auditId}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={onOpenHistory} icon={<RefreshCw className="w-4 h-4" />}>
            Compare Audits
          </Button>
          <Button variant="glow" size="sm" onClick={onRunAudit} icon={<Sparkles className="w-4 h-4" />}>
            Re-Run Audit
          </Button>
        </div>
      </div>

      {/* Overall Score + sub-scores */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card borderVariant="wine" className="flex flex-col items-center justify-center p-6 text-center space-y-3 lg:col-span-1">
          <VisibilityGauge
            score={report.score.overall}
            size={160}
            label="Overall Visibility Score"
            sublabel="Transparent 0-100 index"
          />
          <div className="text-[11px] text-slate-500 text-left w-full space-y-1">
            <ScoreBar label="Recommendation" value={report.score.recommendationVisibility} />
            <ScoreBar label="Mention" value={report.score.mentionVisibility} />
            <ScoreBar label="Query coverage" value={report.score.queryCoverage} />
            <ScoreBar label="Presence clarity" value={report.score.presenceClarity} />
          </div>
          <p className="text-[10px] text-slate-400 italic text-center">
            Score reflects what the audit observed, not a definitive judgement by any AI system.
          </p>
        </Card>

        {/* Counts */}
        <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <CountCard label="Recommended" value={report.counts.recommended} total={report.counts.total} tone="emerald" />
          <CountCard label="Mentioned" value={report.counts.mentioned} total={report.counts.total} tone="blue" />
          <CountCard label="Not found" value={report.counts.notFound} total={report.counts.total} tone="slate" />
          <CountCard label="Could not check" value={report.counts.couldNotCheck} total={report.counts.total} tone="amber" />
        </div>
      </div>

      {/* Tabs */}
      <Tabs options={tabOptions} activeId={activeTab} onChange={setActiveTab} />

      {/* Overview tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <EvidenceSummary report={report} />
        </div>
      )}

      {/* AI Visibility Results tab */}
      {activeTab === 'queries' && <QueryResults report={report} />}

      {/* Who AI recommended */}
      {activeTab === 'recommended' && <WhoRecommended report={report} />}

      {/* Gaps & missing info */}
      {activeTab === 'gaps' && <GapsAndMissing report={report} />}

      {/* Recommended actions */}
      {activeTab === 'actions' && <Actions report={report} />}
    </div>
  );
};

// ------------------------------------------------------------------
// Score bar (sub-score)
// ------------------------------------------------------------------

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color = value >= 75 ? '#059669' : value >= 50 ? '#d97706' : '#be123c';
  return (
    <div>
      <div className="flex justify-between text-[10px] font-semibold text-slate-600 mb-0.5">
        <span className="capitalize">{label}</span>
        <span className="font-mono">{Math.round(value)}</span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Count card
// ------------------------------------------------------------------

function CountCard({ label, value, total, tone }: { label: string; value: number; total: number; tone: 'emerald' | 'blue' | 'slate' | 'amber' }) {
  const tones: Record<string, string> = {
    emerald: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    blue: 'text-blue-700 bg-blue-50 border-blue-200',
    slate: 'text-slate-600 bg-slate-50 border-slate-200',
    amber: 'text-amber-700 bg-amber-50 border-amber-200',
  };
  return (
    <Card borderVariant="subtle" className={`p-4 space-y-1 ${tones[tone]}`}>
      <div className="text-2xl font-extrabold text-slate-900">
        {value}<span className="text-sm font-semibold text-slate-400">/{total}</span>
      </div>
      <div className="text-xs font-bold text-slate-700">{label} queries</div>
    </Card>
  );
}

// ------------------------------------------------------------------
// Overview / evidence summary
// ------------------------------------------------------------------

function EvidenceSummary({ report }: { report: VisibilityReport }) {
  return (
    <div className="space-y-6">
      <Card borderVariant="subtle" className="space-y-3 p-6">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Brain className="w-4 h-4 text-rose-700" /> What AI Knows About You
        </h3>
        {report.whatAiKnowsAboutYou.length === 0 ? (
          <p className="text-xs text-slate-500">
            No verifiable facts were captured at audit time. This profile may not be well indexed.
          </p>
        ) : (
          <ul className="space-y-1.5">
            {report.whatAiKnowsAboutYou.map((fact, i) => (
              <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                <span className="text-rose-600 mt-0.5">•</span>
                {fact}
              </li>
            ))}
          </ul>
        )}
        <p className="text-[10px] text-slate-400 italic">
          Based on evidence captured from provider responses, not a claim about how any AI system reasons.
        </p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card borderVariant="subtle" className="p-6 space-y-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-rose-700" /> Other Professionals Mentioned
          </h3>
          {report.aiRecommended.length === 0 ? (
            <p className="text-xs text-slate-500">No other professional names were captured from the responses.</p>
          ) : (
            <ul className="space-y-1.5">
              {report.aiRecommended.map((r) => (
                <li key={r.name} className="text-xs text-slate-600 flex justify-between">
                  <span>{r.name}</span>
                  <span className="text-slate-400">{r.mentionCount}×</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card borderVariant="subtle" className="p-6 space-y-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ListChecks className="w-4 h-4 text-rose-700" /> At a glance
          </h3>
          <ul className="space-y-1.5 text-xs text-slate-600">
            <li>{report.counts.total} high-intent queries tested</li>
            <li>{report.counts.recommended} recommended, {report.counts.mentioned} mentioned</li>
            <li>{report.counts.notFound} not found, {report.counts.couldNotCheck} could not check</li>
            <li>{report.recommendedActions.length} recommended action(s) derived from this audit</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Query results tab
// ------------------------------------------------------------------

function QueryResults({ report }: { report: VisibilityReport }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Search className="w-4 h-4 text-rose-700" /> AI Visibility Results
          </h3>
          <p className="text-xs text-slate-500">How {report.profile.name || 'this profile'} appeared in each tested query.</p>
        </div>
        <Badge variant="brand">{report.counts.recommended + report.counts.mentioned} / {report.counts.total} visible</Badge>
      </div>

      {report.queryResults.length === 0 ? (
        <Card borderVariant="subtle" className="p-6 text-center text-xs text-slate-500">
          No query results are available for this audit.
        </Card>
      ) : (
        <div className="space-y-2">
          {report.queryResults.map((q) => (
            <Card key={q.id} borderVariant="subtle" className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900 leading-snug">&quot;{q.query_text}&quot;</p>
                <AiRecommendationStatus
                  status={toAiStatus(q.visibility_status)}
                  rankText={q.position ? `#${q.position}` : undefined}
                  size="sm"
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="neutral" size="sm">{q.query_type}</Badge>
                {q.provider && <span className="text-[10px] text-slate-400 capitalize">{q.provider}</span>}
              </div>
              {q.ai_response && (
                <details className="text-[11px] text-slate-500">
                  <summary className="cursor-pointer text-rose-700 hover:text-rose-900 font-semibold">
                    View provider response evidence
                  </summary>
                  <p className="mt-2 text-slate-600 italic bg-slate-50 p-3 rounded-lg border border-slate-200">
                    &quot;{q.ai_response.length > 500 ? q.ai_response.slice(0, 500) + '…' : q.ai_response}&quot;
                  </p>
                </details>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------------
// Who AI recommended tab
// ------------------------------------------------------------------

function WhoRecommended({ report }: { report: VisibilityReport }) {
  return (
    <div className="space-y-4">
      <Card borderVariant="subtle" className="p-6 space-y-3">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-4 h-4 text-rose-700" /> Who was mentioned in the responses
        </h3>
        <p className="text-xs text-slate-500">
          Names captured from provider responses. This reflects what the responses contained, not why any system chose them.
        </p>
        {report.aiRecommended.length === 0 ? (
          <p className="text-xs text-slate-500">No other professional names were captured.</p>
        ) : (
          <div className="space-y-2">
            {report.aiRecommended.map((r) => (
              <div key={r.name} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-sm font-semibold text-slate-800">{r.name}</span>
                <Badge variant="neutral" size="sm">Mentioned {r.mentionCount}×</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

// ------------------------------------------------------------------
// Gaps & missing info tab
// ------------------------------------------------------------------

function GapsAndMissing({ report }: { report: VisibilityReport }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-amber-500" /> Potential Visibility Gaps
        </h3>
        {report.gaps.length === 0 ? (
          <Card borderVariant="subtle" className="p-6 text-center text-xs text-slate-500">
            No obvious visibility gaps were identified from this audit.
          </Card>
        ) : (
          <div className="space-y-3">
            {report.gaps.map((g: ReportGap) => (
              <Card key={g.id} borderVariant="subtle" className="p-4 space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <Badge variant={priorityVariant[g.priority]} size="sm">{g.priority} potential gap</Badge>
                  <span className="text-[10px] font-mono uppercase text-slate-400">{g.area}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{g.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{g.description}</p>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
          <FileQuestion className="w-4 h-4 text-slate-500" /> Missing Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {report.missingInformation.map((m) => (
            <Card key={m.id} borderVariant="subtle" className="p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-slate-900">{m.label}</span>
                <Badge variant={m.present ? 'optimal' : 'low'} size="sm">{m.present ? 'Present' : 'Missing'}</Badge>
              </div>
              {!m.present && <p className="text-xs text-slate-500 leading-relaxed">{m.suggestion}</p>}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Recommended actions tab
// ------------------------------------------------------------------

function Actions({ report }: { report: VisibilityReport }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" /> Recommended Actions
          </h3>
          <p className="text-xs text-slate-500">
            Derived from this audit&apos;s evidence to help improve visibility.
          </p>
        </div>
        <Badge variant="moderate">{report.recommendedActions.filter((a) => a.priority === 'High').length} High priority</Badge>
      </div>

      {report.recommendedActions.length === 0 ? (
        <Card borderVariant="subtle" className="p-6 text-center text-xs text-slate-500">
          No recommended actions were derived from this audit.
        </Card>
      ) : (
        <div className="space-y-3">
          {report.recommendedActions.map((a: RecommendedAction) => (
            <Card key={a.id} borderVariant="wine" className="p-4 space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <Badge variant={priorityVariant[a.priority]} size="sm">
                  {a.priority} Priority
                </Badge>
                <span className={`text-[10px] font-mono uppercase ${a.priority === 'High' ? 'text-rose-700' : a.priority === 'Medium' ? 'text-amber-600' : 'text-slate-400'}`}>
                  {a.improvementArea}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">{a.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{a.explanation}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}