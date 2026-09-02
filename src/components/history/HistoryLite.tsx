'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { LoadingState } from '../ui/LoadingState';
import { ChevronUp, ChevronDown, Minus, History as HistoryIcon } from 'lucide-react';
import { loadComparison, type ComparisonResult } from '@/lib/report/report-actions';

export interface HistoryLiteProps {
  currentAuditId: string;
}

/**
 * Compact comparison block shown below a report when an earlier completed
 * audit exists. Loads the previous vs current comparison from stored data.
 */
export const HistoryLite: React.FC<HistoryLiteProps> = ({ currentAuditId }) => {
  const [data, setData] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    loadComparison(currentAuditId)
      .then((res) => {
        if (active) setData(res);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [currentAuditId]);

  if (loading) return <LoadingState label="Loading comparison…" size="sm" />;

  if (!data || data.error) return null;
  if (!data.previous) return null;

  const rows = data.rows;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <Card borderVariant="wine" className="p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <HistoryIcon className="w-4 h-4 text-rose-700" /> vs Previous Audit
          </h3>
          <Link href="/history">
            <Button variant="outline" size="sm">View Full History</Button>
          </Link>
        </div>

        {data.previous && (
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <span>
              Previous score:{' '}
              <strong className="text-slate-900 font-mono">{data.previous.score.overall}</strong>
            </span>
            <ChevronRight />
            <span>
              Current score:{' '}
              <strong className="text-slate-900 font-mono">{data.current?.score.overall}</strong>
            </span>
            <ChangeBadge
              change={Math.round((data.current?.score.overall ?? 0) - data.previous.score.overall)}
            />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {rows.map((row) => {
            if (typeof row.previous === 'number' && typeof row.current === 'number') {
              return (
                <div key={row.label} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] font-mono uppercase text-slate-500">{row.label}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-mono text-slate-400">{row.previous}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                    <span className="text-sm font-mono font-bold text-slate-900">{row.current}</span>
                    <ChangeBadge change={row.current - row.previous} />
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
      </Card>
    </div>
  );
};

function ChevronRight({ className = '' }: { className?: string }) {
  return (
    <span aria-hidden>
      <svg className={`w-3.5 h-3.5 text-slate-400 ${className}`} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
      </svg>
    </span>
  );
}

function ChangeBadge({ change }: { change: number }) {
  if (change === 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-slate-500">
        <Minus className="w-3 h-3" /> no change
      </span>
    );
  }
  if (change > 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700">
        <ChevronUp className="w-3 h-3" /> +{change}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-rose-700">
      <ChevronDown className="w-3 h-3" /> {change}
    </span>
  );
}