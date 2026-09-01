import React from 'react';
import { Badge } from '../ui/Badge';
import { CheckCircle2, MessageSquare, AlertCircle, HelpCircle } from 'lucide-react';

export type AiStatusType = 'Recommended' | 'Mentioned' | 'Not found' | 'Could not check';

export interface AiRecommendationStatusProps {
  status: AiStatusType;
  engineName?: string;
  rankText?: string;
  size?: 'sm' | 'md';
}

export const AiRecommendationStatus: React.FC<AiRecommendationStatusProps> = ({
  status,
  engineName,
  rankText,
  size = 'md'
}) => {
  const statusConfig: Record<AiStatusType, { variant: 'optimal' | 'moderate' | 'low' | 'neutral'; icon: React.ReactNode }> = {
    'Recommended': {
      variant: 'optimal',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />
    },
    'Mentioned': {
      variant: 'moderate',
      icon: <MessageSquare className="w-3.5 h-3.5" />
    },
    'Not found': {
      variant: 'low',
      icon: <AlertCircle className="w-3.5 h-3.5" />
    },
    'Could not check': {
      variant: 'neutral',
      icon: <HelpCircle className="w-3.5 h-3.5" />
    }
  };

  const config = statusConfig[status] || statusConfig['Could not check'];

  return (
    <div className="inline-flex items-center gap-2">
      <Badge variant={config.variant} size={size} icon={config.icon}>
        {status}
      </Badge>
      {(rankText || engineName) && (
        <span className="text-xs font-semibold text-slate-400">
          {engineName && `${engineName}: `}{rankText}
        </span>
      )}
    </div>
  );
};
