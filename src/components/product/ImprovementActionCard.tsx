import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export interface ImprovementActionCardProps {
  priority: 'High' | 'Medium' | 'Low';
  problem: string;
  recommendedAction: string;
  onTakeAction?: () => void;
}

export const ImprovementActionCard: React.FC<ImprovementActionCardProps> = ({
  priority,
  problem,
  recommendedAction,
  onTakeAction
}) => {
  const priorityVariant = priority === 'High' ? 'low' : priority === 'Medium' ? 'moderate' : 'info';

  return (
    <Card borderVariant="wine" hoverEffect className="space-y-4">
      <div className="flex items-center justify-between">
        <Badge variant={priorityVariant} size="sm">
          {priority} Priority Action
        </Badge>
        <span className="text-[11px] font-semibold text-rose-400">Signal Optimization</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-950/30 border border-rose-900/40 text-xs text-rose-200">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-white mb-0.5">Problem Identified:</span>
            {problem}
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-white mb-0.5">Recommended Action:</span>
            {recommendedAction}
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-1">
        <Button variant="wine-soft" size="sm" onClick={onTakeAction} icon={<ArrowRight className="w-3.5 h-3.5" />}>
          Execute Action Guide
        </Button>
      </div>
    </Card>
  );
};
