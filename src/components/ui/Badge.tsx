import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'optimal' | 'moderate' | 'low' | 'info' | 'brand' | 'neutral';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  icon,
  className = ''
}) => {
  const variantStyles = {
    optimal: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    moderate: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    low: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    brand: "bg-rose-950/60 text-rose-300 border-rose-800/60 shadow-sm shadow-rose-950/40",
    info: "bg-sky-500/10 text-sky-400 border-sky-500/30",
    neutral: "bg-slate-800/80 text-slate-300 border-slate-700/60"
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px] font-medium gap-1",
    md: "px-2.5 py-1 text-xs font-semibold gap-1.5"
  };

  return (
    <span className={`inline-flex items-center rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
