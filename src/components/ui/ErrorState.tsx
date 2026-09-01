import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  message = "Failed to load audit results. Please try again.",
  onRetry
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center glass-panel rounded-2xl border border-rose-900/50 bg-rose-950/20 space-y-3">
      <div className="p-3 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400">
        <AlertCircle className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-white">{title}</h4>
        <p className="text-xs text-rose-200/80">{message}</p>
      </div>
      {onRetry && (
        <Button variant="wine-soft" size="sm" onClick={onRetry} icon={<RefreshCw className="w-3.5 h-3.5" />}>
          Retry Action
        </Button>
      )}
    </div>
  );
};
