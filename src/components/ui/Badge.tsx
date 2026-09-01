import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'optimal' | 'moderate' | 'low' | 'info' | 'neutral';
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
    info: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
    neutral: "bg-slate-800 text-slate-300 border-slate-700"
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs font-medium gap-1",
    md: "px-2.5 py-1 text-xs font-semibold gap-1.5"
  };

  return (
    <span className={`inline-flex items-center rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {icon && <span>{icon}</span>}
      {children}
    </span>
  );
};
