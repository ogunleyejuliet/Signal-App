'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Bot, 
  TrendingUp, 
  Calendar, 
  ExternalLink,
  Code,
  Share2,
  Download,
  AlertTriangle,
  Lightbulb,
  ArrowLeft
} from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Tabs } from './ui/Tabs';
import { VisibilityGauge } from './ui/VisibilityGauge';
import { currentAudit, mockProfile } from '../data/mockData';

interface ReportViewProps {
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToDashboard}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Dashboard
            </button>
            <span className="text-slate-600">•</span>
            <Badge variant="neutral" size="sm">{currentAudit.date}</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            AI Visibility & Citation Audit Report
          </h1>
          <p className="text-xs text-slate-400">
            Target Profile: <span className="text-slate-200 font-medium">{currentAudit.targetProfile}</span> • Audit ID: <span className="font-mono text-indigo-400">{currentAudit.id}</span>
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
        <Card className="flex flex-col items-center justify-center p-6 text-center space-y-3 lg:col-span-1">
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
            <Card key={engine.engine} hoverEffect className="space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Bot className="w-4 h-4 text-cyan-400" />
                    {engine.name}
                  </span>
                  <Badge variant={engine.status} size="sm">
                    {engine.score}%
                  </Badge>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Rank: <strong className="text-white">{engine.rankPosition}</strong>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Citation Rate</span>
                  <span className="text-white font-mono">{engine.citationRate}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
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

      {/* Tab 1: Executive Overview */}
      {(activeTab === 'overview' || activeTab === 'queries') && (
        <div className="space-y-6">
          {/* Query Visibility Analysis Table */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Search className="w-4 h-4 text-indigo-400" />
                  Client Query Citation Audit
                </h3>
                <p className="text-xs text-slate-400">
                  Simulated high-intent client search prompts across ChatGPT, Perplexity, Claude, and Gemini
                </p>
              </div>
              <Badge variant="info">14/18 Cited</Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono tracking-wider">
                    <th className="py-3 px-3">Tested Client Query Prompt</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Rank</th>
                    <th className="py-3 px-3">AI Citation Quote / Snippet</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {currentAudit.queries.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-900/50 transition">
                      <td className="py-3.5 px-3 font-medium text-white max-w-xs">
                        "{q.queryText}"
                      </td>
                      <td className="py-3.5 px-3 text-slate-400 font-mono text-[11px]">
                        {q.category}
                      </td>
                      <td className="py-3.5 px-3">
                        {q.cited ? (
                          <Badge variant="optimal" icon={<CheckCircle2 className="w-3 h-3" />}>
                            Cited
                          </Badge>
                        ) : (
                          <Badge variant="low" icon={<XCircle className="w-3 h-3" />}>
                            Missed
                          </Badge>
                        )}
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-white">
                        {q.cited ? `#${q.rank}` : 'N/A'}
                      </td>
                      <td className="py-3.5 px-3 text-slate-300 italic max-w-md text-[11px] leading-relaxed">
                        "{q.snippet}"
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 2: AI Engine Matrix Details */}
      {activeTab === 'engines' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentAudit.engineScores.map((eng) => (
            <Card key={eng.engine} className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-base font-bold text-white">{eng.name}</h3>
                </div>
                <Badge variant={eng.status}>{eng.score} / 100</Badge>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Recommendation Position:</span>
                  <span className="font-bold text-white font-mono">{eng.rankPosition}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Query Citation Rate:</span>
                  <span className="font-bold text-white font-mono">{eng.citationRate}%</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Primary Data Source:</span>
                  <span className="text-slate-300">GitHub, Personal Site, Web Roundups</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Tab 3: Action Checklist */}
      {(activeTab === 'tips' || activeTab === 'overview') && (
        <Card className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                Actionable AI Discoverability Optimization Checklist
              </h3>
              <p className="text-xs text-slate-400">
                Follow these recommendations to improve your Signal Visibility Score
              </p>
            </div>
            <Badge variant="moderate">2 Pending Fixes</Badge>
          </div>

          <div className="space-y-3">
            {currentAudit.tips.map((tip) => (
              <div
                key={tip.id}
                className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg mt-0.5 ${tip.completed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                    {tip.completed ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{tip.title}</h4>
                      <Badge variant={tip.impact === 'High' ? 'low' : 'moderate'} size="sm">
                        {tip.impact} Impact
                      </Badge>
                      <Badge variant="neutral" size="sm">{tip.category}</Badge>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {tip.description}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {tip.completed ? (
                    <span className="text-xs text-emerald-400 font-semibold px-3 py-1.5 rounded-lg bg-emerald-500/10">
                      Applied
                    </span>
                  ) : (
                    <Button variant="outline" size="sm" icon={<Code className="w-3.5 h-3.5" />}>
                      View Code Snippet
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
