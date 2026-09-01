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
    default: 'border-slate-200/90 shadow-sm bg-white',
    wine: 'border-rose-200/90 shadow-sm bg-white',
    subtle: 'border-slate-200/70 bg-white'
  };

  return (
    <div
      className={`glass-panel rounded-2xl p-5 border ${borderStyles[borderVariant]} ${
        hoverEffect ? 'glass-panel-hover' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
