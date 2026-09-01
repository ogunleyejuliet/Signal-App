import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ArrowRight, Sparkles } from 'lucide-react';

export interface RecommendationCardProps {
  priority?: 'HIGH PRIORITY' | 'MEDIUM PRIORITY' | 'LOW PRIORITY';
  title: string;
  description: string;
  category?: string;
  completed?: boolean;
  onApply?: () => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  priority = 'HIGH PRIORITY',
  title,
  description,
  category = 'Schema',
  completed = false,
  onApply
}) => {
  const priorityVariant = 
    priority === 'HIGH PRIORITY' ? 'low' : 
    priority === 'MEDIUM PRIORITY' ? 'moderate' : 'info';

  return (
    <Card borderVariant="wine" hoverEffect className="space-y-4">
      <div className="flex items-center justify-between">
        <Badge variant={priorityVariant} size="sm">
          {priority}
        </Badge>
        {category && (
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-500">
            {category}
          </span>
        )}
      </div>

      <div className="space-y-1.5">
        <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-rose-700 shrink-0" />
          {title}
        </h4>
        <p className="text-xs text-slate-600 leading-relaxed">{description}</p>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
        <span className="text-[11px] text-slate-500 font-medium">
          {completed ? '✓ Optimization Applied' : 'Impact: Expected +15% AI discoverability'}
        </span>
        <Button
          variant={completed ? 'secondary' : 'wine-soft'}
          size="sm"
          onClick={onApply}
          icon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          {completed ? 'View Details' : 'Apply Optimization'}
        </Button>
      </div>
    </Card>
  );
};
