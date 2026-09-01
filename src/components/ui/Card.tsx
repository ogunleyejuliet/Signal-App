import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  borderVariant?: 'default' | 'wine' | 'subtle';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  borderVariant = 'default'
}) => {
  const borderStyles = {
    default: 'border-slate-800/80',
    wine: 'border-rose-900/40 shadow-rose-950/20',
    subtle: 'border-slate-800/40'
  };

  return (
    <div
      className={`glass-panel rounded-2xl p-5 border shadow-xl ${borderStyles[borderVariant]} ${
        hoverEffect ? 'glass-panel-hover' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
