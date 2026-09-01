import React from 'react';
import { Card } from '../ui/Card';
import { VisibilityGauge } from '../ui/VisibilityGauge';
import { Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';

export interface VisibilityScoreCardProps {
  score: number;
  queriesTested?: number;
  queriesCited?: number;
  onRunAudit?: () => void;
  className?: string;
}

export const VisibilityScoreCard: React.FC<VisibilityScoreCardProps> = ({
  score,
  queriesTested = 18,
  queriesCited = 14,
  onRunAudit,
  className = ''
}) => {
  const citationRate = Math.round((queriesCited / queriesTested) * 100);

  return (
    <Card borderVariant="wine" hoverEffect className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 tracking-wide">AI Visibility Score</h3>
        </div>
        <span className="text-[11px] font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
          Live Index
        </span>
      </div>

      <div className="py-2">
        <VisibilityGauge
          score={score}
          size={170}
          label="Overall AI Index"
          sublabel={`${queriesCited} of ${queriesTested} queries cited`}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/80">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Citation Rate</span>
          <span className="text-lg font-extrabold text-emerald-700 flex items-center justify-center gap-1 mt-0.5">
            <TrendingUp className="w-4 h-4" />
            {citationRate}%
          </span>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Active Protection</span>
          <span className="text-lg font-extrabold text-rose-700 flex items-center justify-center gap-1 mt-0.5">
            <ShieldCheck className="w-4 h-4 text-rose-700" />
            4 Engines
          </span>
        </div>
      </div>
    </Card>
  );
};
