import React from 'react';
import { Loader2 } from 'lucide-react';

export interface LoadingStateProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  label = "Loading Signal AI intelligence...",
  size = 'md'
}) => {
  const loaderSizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-3">
      <div className="p-3 rounded-full bg-rose-950/60 border border-rose-800/50 text-rose-400">
        <Loader2 className={`${loaderSizes[size]} animate-spin`} />
      </div>
      {label && <p className="text-xs font-semibold text-slate-300 animate-pulse">{label}</p>}
    </div>
  );
};
