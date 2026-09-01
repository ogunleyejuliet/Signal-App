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
    optimal: "bg-emerald-50 text-emerald-800 border-emerald-200 font-bold",
    moderate: "bg-amber-50 text-amber-900 border-amber-200 font-bold",
    low: "bg-rose-50 text-rose-800 border-rose-200 font-bold",
    brand: "bg-rose-50 text-rose-950 border-rose-200/80 font-bold shadow-xs",
    info: "bg-sky-50 text-sky-800 border-sky-200 font-bold",
    neutral: "bg-slate-100 text-slate-700 border-slate-200"
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
