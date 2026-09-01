import React from 'react';

export interface StatusIndicatorProps {
  status: 'active' | 'optimal' | 'moderate' | 'low' | 'offline' | 'pending';
  pulse?: boolean;
  label?: string;
  size?: 'sm' | 'md';
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  pulse = true,
  label,
  size = 'md'
}) => {
  const statusColors = {
    active: 'bg-rose-500',
    optimal: 'bg-emerald-500',
    moderate: 'bg-amber-500',
    low: 'bg-rose-600',
    offline: 'bg-slate-500',
    pending: 'bg-sky-500'
  };

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5'
  };

  return (
    <span className="inline-flex items-center gap-2">
      <span className="relative flex items-center justify-center">
        {pulse && status !== 'offline' && (
          <span
            className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${statusColors[status]}`}
          />
        )}
        <span className={`relative inline-flex rounded-full ${sizeClasses[size]} ${statusColors[status]}`} />
      </span>
      {label && <span className="text-xs font-semibold text-slate-600">{label}</span>}
    </span>
  );
};
