import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glow' | 'wine-soft';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none";
  
  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5"
  };

  const variantStyles = {
    primary: "bg-rose-900 hover:bg-rose-800 text-white shadow-lg shadow-rose-950/50 active:scale-[0.98] border border-rose-700/40",
    glow: "bg-gradient-to-r from-rose-900 via-rose-800 to-rose-700 text-white font-bold shadow-lg shadow-rose-900/40 hover:shadow-rose-700/50 hover:brightness-110 active:scale-[0.98] border border-rose-600/50",
    'wine-soft': "bg-rose-950/60 hover:bg-rose-900/50 text-rose-200 border border-rose-800/40 active:scale-[0.98]",
    secondary: "bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-700/70 active:scale-[0.98]",
    outline: "border border-rose-800/60 hover:border-rose-600 text-rose-300 hover:bg-rose-950/40 active:scale-[0.98]",
    ghost: "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
  };

  return (
    <button
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="flex items-center shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
