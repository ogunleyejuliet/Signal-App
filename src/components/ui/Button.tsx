import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glow';
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
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";
  
  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5"
  };

  const variantStyles = {
    primary: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 active:scale-[0.98]",
    glow: "bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-500 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-cyan-500/40 hover:brightness-110 active:scale-[0.98]",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 active:scale-[0.98]",
    outline: "border border-indigo-500/30 hover:border-indigo-500/70 text-indigo-300 hover:bg-indigo-500/10 active:scale-[0.98]",
    ghost: "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      {children}
    </button>
  );
};
