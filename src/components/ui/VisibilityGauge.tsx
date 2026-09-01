import React from 'react';

export interface VisibilityGaugeProps {
  score: number;
  size?: number;
  label?: string;
  sublabel?: string;
}

export const VisibilityGauge: React.FC<VisibilityGaugeProps> = ({
  score,
  size = 180,
  label = "Visibility Score",
  sublabel = "High Discoverability"
}) => {
  // SVG Arc calculations
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let scoreColor = "#881337"; // Wine Rose / Primary
  if (score >= 75) scoreColor = "#059669"; // Emerald
  else if (score >= 50) scoreColor = "#d97706"; // Amber
  else scoreColor = "#be123c"; // Deep Wine Crimson

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* Soft glowing aura */}
        <div 
          className="absolute inset-0 rounded-full blur-xl opacity-20 animate-pulse"
          style={{ backgroundColor: scoreColor }}
        />

        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={scoreColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-extrabold tracking-tight text-slate-900">
            {score}
          </span>
          <span className="text-xs uppercase font-bold tracking-widest text-slate-500 mt-0.5">
            / 100
          </span>
        </div>
      </div>

      {label && (
        <div className="mt-3 text-center">
          <p className="text-sm font-bold text-slate-900">{label}</p>
          {sublabel && <p className="text-xs text-slate-500 mt-0.5">{sublabel}</p>}
        </div>
      )}
    </div>
  );
};
