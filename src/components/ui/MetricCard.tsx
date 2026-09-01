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
    up: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    down: 'text-rose-700 bg-rose-50 border-rose-200',
    neutral: 'text-slate-500 bg-slate-100 border-slate-200'
  };

  return (
    <Card borderVariant={borderVariant} hoverEffect className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</span>
        {icon && (
          <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between">
        <span className="text-3xl font-extrabold tracking-tight text-slate-900">{value}</span>
        {change && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${trendColors[trend]}`}>
            {change}
          </span>
        )}
      </div>

      {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
    </Card>
  );
};
