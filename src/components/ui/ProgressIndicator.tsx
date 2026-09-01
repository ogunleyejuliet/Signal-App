import React from 'react';

export interface ProgressIndicatorProps {
  value: number; // 0 to 100
  label?: string;
  showPercentage?: boolean;
  color?: 'brand' | 'emerald' | 'amber' | 'rose';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  value,
  label,
  showPercentage = true,
  color = 'brand',
  size = 'md',
  className = ''
}) => {
  const barColors = {
    brand: 'bg-gradient-to-r from-rose-900 via-rose-700 to-rose-500',
    emerald: 'bg-gradient-to-r from-emerald-700 to-emerald-400',
    amber: 'bg-gradient-to-r from-amber-700 to-amber-400',
    rose: 'bg-gradient-to-r from-rose-800 to-rose-500'
  };

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5'
  };

  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-xs">
          {label && <span className="font-semibold text-slate-300">{label}</span>}
          {showPercentage && <span className="font-mono font-bold text-slate-200">{clampedValue}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800/80 p-0.5 ${heightClasses[size]}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${barColors[color]}`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
};
