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
  const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-900 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none";
  
  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5"
  };

  const variantStyles = {
    primary: "bg-rose-900 hover:bg-rose-800 text-white shadow-md shadow-rose-900/20 active:scale-[0.98] border border-rose-900",
    glow: "bg-gradient-to-r from-rose-900 via-rose-800 to-rose-700 text-white font-bold shadow-lg shadow-rose-900/25 hover:shadow-rose-900/40 hover:brightness-105 active:scale-[0.98] border border-rose-800",
    'wine-soft': "bg-rose-50 hover:bg-rose-100 text-rose-950 border border-rose-200 active:scale-[0.98] font-bold",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 active:scale-[0.98]",
    outline: "border border-rose-900 text-rose-900 hover:bg-rose-50 active:scale-[0.98]",
    ghost: "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
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
