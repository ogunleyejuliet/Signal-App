import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error' | 'brand';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  children,
  onClose,
  className = ''
}) => {
  const alertStyles = {
    info: 'bg-sky-500/10 border-sky-500/30 text-sky-200',
    success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200',
    warning: 'bg-amber-500/10 border-amber-500/30 text-amber-200',
    error: 'bg-rose-500/10 border-rose-500/30 text-rose-200',
    brand: 'bg-rose-950/70 border-rose-800/60 text-rose-100 shadow-lg shadow-rose-950/30'
  };

  const icons = {
    info: <Info className="w-5 h-5 text-sky-400 shrink-0" />,
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    brand: <Info className="w-5 h-5 text-rose-400 shrink-0" />
  };

  return (
    <div className={`p-4 rounded-xl border flex items-start gap-3 relative ${alertStyles[type]} ${className}`}>
      {icons[type]}
      <div className="flex-1 min-w-0">
        {title && <h5 className="text-sm font-bold mb-0.5">{title}</h5>}
        <div className="text-xs leading-relaxed opacity-90">{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-100 p-1 rounded-lg hover:bg-slate-800/50 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
