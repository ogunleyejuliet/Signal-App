'use client';

import React from 'react';
import { 
  Sparkles, 
  Search, 
  Calendar, 
  CheckCircle2, 
  ArrowRight,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Table } from './ui/Table';
import { VisibilityScoreCard } from './product/VisibilityScoreCard';
import { ProfessionalProfileSummary } from './product/ProfessionalProfileSummary';
import { RecommendationCard } from './product/RecommendationCard';
import { currentAudit, recentAuditsList, mockProfile } from '../data/mockData';
import { Audit } from '../types';

export interface DashboardViewProps {
  onRunAudit: () => void;
  onViewReport: (auditId?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onRunAudit,
  onViewReport
}) => {
  const auditColumns = [
    {
      header: 'Audit Name',
      accessor: (row: Audit) => (
        <div>
          <div className="font-bold text-white text-sm">{row.title}</div>
          <div className="text-[11px] text-slate-400">Target Role: {row.targetRole}</div>
        </div>
      )
    },
    {
      header: 'Execution Date',
      accessor: (row: Audit) => (
        <span className="text-xs font-mono text-slate-300">{row.date}</span>
      )
    },
    {
      header: 'Tested Queries',
      accessor: (row: Audit) => (
        <span className="text-xs text-slate-300">
          {row.queriesTestedCount} queries tested ({row.queriesCitedCount || 14} cited)
        </span>
      )
    },
    {
      header: 'Signal Index',
      accessor: (row: Audit) => (
        <span className="text-sm font-mono font-extrabold text-rose-300">
          {row.overallScore} / 100
        </span>
      )
    },
    {
      header: 'Action',
      accessor: (row: Audit) => (
        <Button
          variant="wine-soft"
          size="sm"
          onClick={() => onViewReport(row.id)}
        >
          View Report
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Top Welcome Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-rose-950/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Freelancer Signal Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Monitoring discoverability for <span className="text-rose-300 font-bold">{mockProfile.name}</span> ({mockProfile.title})
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
        {/* Metric Card 1: Visibility Score Card */}
        <VisibilityScoreCard
          score={currentAudit.overallScore}
          queriesTested={currentAudit.queriesTestedCount}
          queriesCited={currentAudit.queriesCitedCount}
          onRunAudit={onRunAudit}
        />

        {/* Metric Card 2: Latest Audit Overview */}
        <Card borderVariant="wine" className="lg:col-span-2 space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-rose-400" />
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
                      className="h-full bg-gradient-to-r from-rose-900 to-rose-500 rounded-full"
                      style={{ width: `${engine.score}%` }}
                    />
                  </div>
                  <span className="block text-[10px] text-slate-500 truncate font-semibold">{engine.rankPosition}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5 text-rose-400" />
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

      {/* Profile & Optimization Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ProfessionalProfileSummary profile={mockProfile} />

        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-400" />
              Top Actionable Optimization Recommendations
            </h3>
            <Badge variant="brand">2 High Priority</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentAudit.tips.slice(0, 2).map((tip) => (
              <RecommendationCard
                key={tip.id}
                priority={tip.impact === 'High' ? 'HIGH PRIORITY' : 'MEDIUM PRIORITY'}
                title={tip.title}
                description={tip.description}
                category={tip.category}
                completed={tip.completed}
                onApply={() => onViewReport(currentAudit.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Recent Audits Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Search className="w-4 h-4 text-rose-400" />
            Audit History & Benchmarks
          </h3>
          <Button variant="outline" size="sm" onClick={onRunAudit}>
            + Run Audit
          </Button>
        </div>

        <Table
          data={recentAuditsList}
          columns={auditColumns}
          keyExtractor={(row) => row.id}
        />
      </div>
    </div>
  );
};
