'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { LoadingState } from '../ui/LoadingState';
import { EmptyState } from '../ui/EmptyState';
import { ErrorState } from '../ui/ErrorState';
import { loadHistory, loadComparison, type HistoryRow, type ComparisonResult } from '@/lib/report/report-actions';
import { FileText, History as HistoryIcon, ChevronUp, ChevronDown, Minus, ArrowRight } from 'lucide-react';

export interface HistoryViewProps {
  onRunAudit: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onRunAudit }) => {
  const [rows, setRows] = useState<HistoryRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [comparing, setComparing] = useState(false);

  useEffect(() => {
    loadHistory().then((res) => {
      setRows(res.rows);
      setError(res.error);
    });
  }, []);

  const selectAudit = async (id: string) => {
    setSelectedId(id);
    setComparing(true);
    setComparison(null);
    try {
      const res = await loadComparison(id);
      setComparison(res);
    } finally {
      setComparing(false);
    }
  };

  if (error && !rows) {
    return <ErrorState title="Audit history unavailable" message={error} />;
  }

  if (!rows) {
    return <LoadingState label="Loading audit history…" />;
  }

  const showComparison = selectedId && comparison;

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-rose-100">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <HistoryIcon className="w-6 h-6 text-rose-700" /> Audit History
          </h1>
          <p className="text-sm text-slate-500">
            Review past audits, open previous reports, and start a new audit.
          </p>
        </div>
        <Button variant="glow" size="sm" onClick={onRunAudit} icon={<ArrowRight className="w-4 h-4" />}>
          Run New Audit
        </Button>
      </div>

      {/* History list */}
      {rows.length === 0 ? (
        <EmptyState
          icon={<HistoryIcon className="w-10 h-10 text-rose-400" />}
          title="No audits yet"
          description="Run your first audit to see your AI visibility and history."
          actionText="Run New Audit"
          onAction={onRunAudit}
        />
      ) : (
        <Card borderVariant="subtle" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[11px] font-mono uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Visibility Score</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((row) => (
                  <HistoryRowView
                    key={row.id}
                    row={row}
                    selected={selectedId === row.id}
                    onSelect={() => selectAudit(row.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Comparison */}
      {comparing && <LoadingState label="Building comparison…" size="sm" />}
          {showComparison && !comparing && <Comparison data={comparison} />}
    </div>
  );
};

function HistoryRowView({
  row,
  selected,
  onSelect,
}: {
  row: HistoryRow;
  selected: boolean;
  onSelect: () => void;
}) {
  const statusVariant =
    row.status === 'completed' ? 'optimal' : row.status === 'failed' ? 'low' : 'moderate';

  return (
    <tr className={`hover:bg-rose-50/40 transition-colors ${selected ? 'bg-rose-50/60' : ''}`}>
      <td className="px-5 py-3 text-sm text-slate-700">
        {formatDate(row.createdAt)}
      </td>
      <td className="px-5 py-3">
        <Badge variant={statusVariant} size="sm">{row.status}</Badge>
      </td>
      <td className="px-5 py-3">
        {row.score !== null ? (
          <span className="text-sm font-mono font-extrabold text-rose-700">{row.score} <span className="text-slate-400 font-semibold text-xs">/ 100</span></span>
        ) : (
          <span className="text-xs text-slate-400">—</span>
        )}
      </td>
      <td className="px-5 py-3">
        <div className="flex items-center gap-2">
          {row.status === 'completed' ? (
            <>
              <Link href={`/report?id=${row.id}`}>
                <Button variant="wine-soft" size="sm" icon={<FileText className="w-3.5 h-3.5" />}>
                  Open Report
                </Button>
              </Link>
              <Button variant={selected ? 'primary' : 'outline'} size="sm" onClick={onSelect}>
                {selected ? 'Comparing' : 'Compare'}
              </Button>
            </>
          ) : (
            <span className="text-[11px] text-slate-400 italic">No report</span>
          )}
        </div>
      </td>
    </tr>
  );
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return String(iso);
  }
}

function Comparison({ data }: { data: ComparisonResult }) {
  if (data.error) {
    return <ErrorState title="Comparison unavailable" message={data.error} />;
  }

  if (!data.previous) {
    return (
      <Card borderVariant="subtle" className="p-6 text-center text-xs text-slate-500">
        No earlier completed audit found to compare against. Run another audit to enable comparisons.
      </Card>
    );
  }

  const currentScore = data.current?.score.overall ?? 0;
  const previousScore = data.previous.score.overall;
  const change = currentScore - previousScore;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <HistoryIcon className="w-4 h-4 text-rose-700" /> Audit Comparison
        </h2>
        <Badge variant={change >= 0 ? 'optimal' : 'low'} size="sm">
          {change >= 0 ? `+${change}` : change} overall
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ComparisonScoreCard label="Previous" score={previousScore} date={data.previous.createdAt} />
        <Card borderVariant="subtle" className="flex flex-col items-center justify-center p-6 text-center">
          <span className="text-[11px] font-mono uppercase text-slate-400">Score change</span>
          <ChangeValue change={change} />
        </Card>
        <ComparisonScoreCard label="Current" score={currentScore} date={data.current?.createdAt} />
      </div>

      <Card borderVariant="subtle" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[11px] font-mono uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3">Metric</th>
                <th className="px-5 py-3">Previous</th>
                <th className="px-5 py-3">Current</th>
                <th className="px-5 py-3">Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.rows.map((row) => {
                const prev = row.previous;
                const curr = row.current;
                const isNumeric = typeof prev === 'number' && typeof curr === 'number';
                return (
                  <tr key={row.label}>
                    <td className="px-5 py-3 text-sm text-slate-700">{row.label}</td>
                    <td className="px-5 py-3 text-sm font-mono text-slate-500">{prev ?? '—'}</td>
                    <td className="px-5 py-3 text-sm font-mono font-bold text-slate-900">{curr ?? '—'}</td>
                    <td className="px-5 py-3">
                      {isNumeric ? <ChangeValue change={(curr as number) - (prev as number)} /> : <span className="text-xs text-slate-400">—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function ComparisonScoreCard({ label, score, date }: { label: string; score: number; date?: string }) {
  return (
    <Card borderVariant="subtle" className="flex flex-col items-center justify-center p-6 text-center space-y-1">
      <span className="text-[11px] font-mono uppercase text-slate-400">{label}</span>
      <span className="text-3xl font-extrabold text-slate-900">{score}</span>
      <span className="text-[10px] text-slate-400">/ 100</span>
      {date && <span className="text-[10px] text-slate-500">{formatDate(date)}</span>}
    </Card>
  );
}

function ChangeValue({ change }: { change: number }) {
  if (change === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-sm font-bold text-slate-500">
        <Minus className="w-4 h-4" /> 0
      </span>
    );
  }
  if (change > 0) {
    return (
      <span className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700">
        <ChevronUp className="w-4 h-4" /> +{change}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-sm font-bold text-rose-700">
      <ChevronDown className="w-4 h-4" /> {change}
    </span>
  );
}