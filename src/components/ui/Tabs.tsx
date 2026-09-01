import React from 'react';

export interface TabOption {
  id: string;
  label: string;
  count?: number;
}

export interface TabsProps {
  options: TabOption[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ options, activeId, onChange, className = '' }) => {
  return (
    <div className={`flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-xl max-w-full overflow-x-auto ${className}`}>
      {options.map((option) => {
        const isActive = option.id === activeId;
        return (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              isActive
                ? 'bg-rose-900 text-white shadow-sm border border-rose-900'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            {option.label}
            {option.count !== undefined && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? 'bg-rose-800 text-rose-50' : 'bg-slate-200 text-slate-700 font-bold'
                }`}
              >
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
