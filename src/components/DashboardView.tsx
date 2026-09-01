'use client';

import React from 'react';
import { 
  Sparkles, 
  Search, 
  Calendar, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  Bot,
  ExternalLink,
  ShieldAlert,
  Clock
} from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { VisibilityGauge } from './ui/VisibilityGauge';
import { currentAudit, recentAuditsList, mockProfile } from '../data/mockData';

interface DashboardViewProps {
  onRunAudit: () => void;
  onViewReport: (auditId?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onRunAudit,
  onViewReport
}) => {
  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Top Welcome Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Freelancer Signal Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Monitoring discoverability for <span className="text-indigo-400 font-semibold">{mockProfile.name}</span> ({mockProfile.title})
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="glow"
            onClick={onRunAudit}
            icon={<Sparkles className="w-4 h-4" />}
          >
            Run New Audit
          </Button>
        </div>
      </div>

      {/* Main Metric Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Metric Card 1: Visibility Score Gauge */}
        <Card className="flex flex-col items-center justify-center p-6 text-center space-y-4">
          <VisibilityGauge
            score={currentAudit.overallScore}
            size={170}
            label="Overall Signal Score"
            sublabel="Strong AI Discoverability"
          />
          <div className="w-full pt-4 border-t border-slate-800 flex items-center justify-around text-xs">
            <div className="text-center">
              <span className="block font-bold text-emerald-400 text-sm">+14%</span>
              <span className="text-slate-500">Vs last month</span>
            </div>
            <div className="h-6 w-[1px] bg-slate-800" />
            <div className="text-center">
              <span className="block font-bold text-white text-sm">14 / 18</span>
              <span className="text-slate-500">Queries cited</span>
            </div>
          </div>
        </Card>

        {/* Metric Card 2: Latest Audit Card (REQUIRED ITEM) */}
        <Card className="lg:col-span-2 space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                  Latest Audit Overview
                </span>
              </div>
              <Badge variant="optimal" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
                {currentAudit.status}
              </Badge>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">{currentAudit.title}</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Target Profile: {currentAudit.targetProfile} • Executed {currentAudit.date}
              </p>
            </div>

            {/* AI Engine Scores Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {currentAudit.engineScores.map((engine) => (
                <div key={engine.engine} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                    <span>{engine.name}</span>
                    <span className="text-white font-mono">{engine.score}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
                      style={{ width: `${engine.score}%` }}
                    />
                  </div>
                  <span className="block text-[10px] text-slate-500 truncate">{engine.rankPosition}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>Next scheduled audit: In 7 days</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewReport(currentAudit.id)}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              View Full Detailed Report
            </Button>
          </div>
        </Card>
      </div>

      {/* Recent Audits Table & Quick Actions Section (REQUIRED ITEM) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Audits List (Col Span 2) */}
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-cyan-400" />
              Recent Audits History
            </h3>
            <Button variant="ghost" size="sm" onClick={onRunAudit}>
              + Run Audit
            </Button>
          </div>

          <div className="space-y-3">
            {recentAuditsList.map((audit) => (
              <div
                key={audit.id}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{audit.title}</h4>
                    <Badge variant="neutral" size="sm">{audit.date}</Badge>
                  </div>
                  <p className="text-xs text-slate-400">
                    Role: {audit.targetRole} • {audit.queriesTestedCount} queries tested ({audit.queriesCitedCount || 14} cited)
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-sm font-mono font-extrabold text-white">{audit.overallScore} / 100</span>
                    <span className="block text-[10px] text-slate-500">Signal Score</span>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onViewReport(audit.id)}
                  >
                    View Report
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Actionable Optimization Tips Card */}
        <Card className="space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Quick Optimization Fixes
              </h3>
              <Badge variant="moderate">2 High Impact</Badge>
            </div>

            <div className="space-y-3 text-xs">
              {currentAudit.tips.map((tip) => (
                <div key={tip.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200">{tip.title}</span>
                    <Badge variant={tip.impact === 'High' ? 'low' : 'moderate'} size="sm">
                      {tip.impact}
                    </Badge>
                  </div>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    {tip.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewReport(currentAudit.id)}
            className="w-full mt-2"
          >
            Open All Recommendations
          </Button>
        </Card>
      </div>
    </div>
  );
};
