import React from 'react';
import { Card } from '../ui/Card';
import { AiRecommendationStatus, AiStatusType } from './AiRecommendationStatus';
import { Bot, ExternalLink } from 'lucide-react';

export interface VisibilityResultCardProps {
  query: string;
  aiProvider: string;
  snippet: string;
  status: AiStatusType;
  rank?: number | string;
}

export const VisibilityResultCard: React.FC<VisibilityResultCardProps> = ({
  query,
  aiProvider,
  snippet,
  status,
  rank
}) => {
  return (
    <Card borderVariant="subtle" hoverEffect className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-rose-400">
            <Bot className="w-4 h-4" />
          </div>
          <span className="text-xs font-mono font-bold text-slate-300">{aiProvider}</span>
        </div>
        <AiRecommendationStatus status={status} rankText={rank ? `#${rank}` : undefined} size="sm" />
      </div>

      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-xs text-rose-200">
        &quot;{query}&quot;
      </div>

      <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
        &ldquo;{snippet}&rdquo;
      </p>

      <div className="flex items-center justify-end">
        <button className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 inline-flex items-center gap-1 cursor-pointer">
          <span>View Source Citation</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </Card>
  );
};
