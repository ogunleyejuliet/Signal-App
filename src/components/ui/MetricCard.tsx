import React from 'react';
import { Card } from './Card';

export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  subtitle?: string;
  icon?: React.ReactNode;
  borderVariant?: 'default' | 'wine' | 'subtle';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  trend = 'neutral',
  subtitle,
  icon,
  borderVariant = 'wine'
}) => {
  const trendColors = {
    up: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    down: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    neutral: 'text-slate-400 bg-slate-800 border-slate-700'
  };

  return (
    <Card borderVariant={borderVariant} hoverEffect className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</span>
        {icon && (
          <div className="p-2 rounded-xl bg-rose-950/60 border border-rose-800/40 text-rose-300">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between">
        <span className="text-3xl font-extrabold tracking-tight text-white">{value}</span>
        {change && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${trendColors[trend]}`}>
            {change}
          </span>
        )}
      </div>

      {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
    </Card>
  );
};
