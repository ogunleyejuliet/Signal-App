'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Bot, 
  Share2, 
  Lightbulb, 
  ArrowLeft
} from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Tabs } from './ui/Tabs';
import { VisibilityGauge } from './ui/VisibilityGauge';
import { VisibilityResultCard } from './product/VisibilityResultCard';
import { ImprovementActionCard } from './product/ImprovementActionCard';
import { AiRecommendationStatus } from './product/AiRecommendationStatus';
import { currentAudit } from '../data/mockData';

export interface ReportViewProps {
  onRunAudit: () => void;
  onBackToDashboard: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({
  onRunAudit,
  onBackToDashboard
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabOptions = [
    { id: 'overview', label: 'Executive Summary' },
    { id: 'engines', label: 'AI Platform Matrix', count: 4 },
    { id: 'queries', label: 'Query Citations', count: currentAudit.queries.length },
    { id: 'tips', label: 'Action Checklist', count: currentAudit.tips.length }
  ];

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Report Header & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-rose-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToDashboard}
              className="text-xs text-rose-700 hover:text-rose-900 flex items-center gap-1 font-semibold cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Dashboard
            </button>
            <span className="text-slate-400">•</span>
            <Badge variant="neutral" size="sm">{currentAudit.date}</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            AI Visibility & Citation Audit Report
          </h1>
          <p className="text-xs text-slate-500">
            Target Profile: <span className="text-slate-800 font-medium">{currentAudit.targetProfile}</span> • Audit ID: <span className="font-mono text-rose-700">{currentAudit.id}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" icon={<Share2 className="w-4 h-4" />}>
            Share Report
          </Button>
          <Button variant="glow" size="sm" onClick={onRunAudit} icon={<Sparkles className="w-4 h-4" />}>
            Re-Run Audit
          </Button>
        </div>
      </div>

      {/* Score Summary Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card borderVariant="wine" className="flex flex-col items-center justify-center p-6 text-center space-y-3 lg:col-span-1">
          <VisibilityGauge
            score={currentAudit.overallScore}
            size={160}
            label="Signal Score"
            sublabel="78 / 100 Index"
          />
        </Card>

        {/* Engine Breakdown Row Cards */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {currentAudit.engineScores.map((engine) => (
            <Card key={engine.engine} borderVariant="wine" hoverEffect className="space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Bot className="w-4 h-4 text-rose-700" />
                    {engine.name}
                  </span>
                  <Badge variant={engine.status} size="sm">
                    {engine.score}%
                  </Badge>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  Rank: <strong className="text-slate-900">{engine.rankPosition}</strong>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>Citation Rate</span>
                  <span className="text-slate-900 font-mono">{engine.citationRate}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-rose-700 rounded-full"
                    style={{ width: `${engine.citationRate}%` }}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs
        options={tabOptions}
        activeId={activeTab}
        onChange={setActiveTab}
      />

      {/* Tab 1 & Tab: Query Citation Cards */}
      {(activeTab === 'overview' || activeTab === 'queries') && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Search className="w-4 h-4 text-rose-700" />
                Client Query Citation Audit Results
              </h3>
              <p className="text-xs text-slate-500">
                Simulated high-intent client search prompts across ChatGPT, Perplexity, Claude, and Gemini
              </p>
            </div>
            <Badge variant="brand">14 / 18 Cited</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentAudit.queries.map((q) => (
              <VisibilityResultCard
                key={q.id}
                query={q.queryText}
                aiProvider="ChatGPT-4o & Perplexity"
                snippet={q.snippet}
                status={q.cited ? 'Recommended' : 'Not found'}
                rank={q.rank}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: AI Engine Matrix Details */}
      {activeTab === 'engines' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentAudit.engineScores.map((eng) => (
            <Card key={eng.engine} borderVariant="wine" className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-rose-700" />
                  <h3 className="text-base font-bold text-slate-900">{eng.name}</h3>
                </div>
                <AiRecommendationStatus status={eng.status === 'optimal' ? 'Recommended' : 'Mentioned'} rankText={eng.rankPosition} />
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Recommendation Position:</span>
                  <span className="font-bold text-slate-900 font-mono">{eng.rankPosition}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Query Citation Rate:</span>
                  <span className="font-bold text-slate-900 font-mono">{eng.citationRate}%</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Primary Index Sources:</span>
                  <span className="text-slate-700 font-semibold">GitHub, Personal Site, Web Citations</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Tab 3: Action Checklist */}
      {(activeTab === 'tips' || activeTab === 'overview') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                Actionable AI Discoverability Optimization Checklist
              </h3>
              <p className="text-xs text-slate-500">
                Follow these recommendations to improve your Signal Visibility Score
              </p>
            </div>
            <Badge variant="moderate">2 Pending Fixes</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentAudit.tips.map((tip) => (
              <ImprovementActionCard
                key={tip.id}
                priority={tip.impact === 'High' ? 'High' : tip.impact === 'Medium' ? 'Medium' : 'Low'}
                problem={tip.title}
                recommendedAction={tip.description}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
