'use client';

import React from 'react';
import {
  Sparkles,
  Search,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Clock,
  UserPlus,
} from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Table } from './ui/Table';
import { VisibilityScoreCard } from './product/VisibilityScoreCard';
import { ProfessionalProfileSummary } from './product/ProfessionalProfileSummary';
import { RecommendationCard } from './product/RecommendationCard';
import { currentAudit, recentAuditsList } from '../data/mockData';
import { Audit, FreelancerProfile } from '../types';
import type { ProfileWithLinks } from '@/lib/supabase/types';

export interface DashboardViewProps {
  profile: ProfileWithLinks | null;
  onRunAudit: () => void;
  onViewReport: (auditId?: string) => void;
  onEditProfile: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  onRunAudit,
  onViewReport,
  onEditProfile,
}) => {
  // Map DB profile to the FreelancerProfile shape the card expects
  const displayProfile: FreelancerProfile | null = profile
    ? {
        name: profile.name,
        title: profile.profession,
        location: profile.location,
        avatarUrl: '',
        bio: `${profile.specialization} · ${profile.services}`,
        primarySkills: profile.services.split(',').map((s) => s.trim()).filter(Boolean),
      }
    : null;

  const auditColumns = [
    {
      header: 'Audit Name',
      accessor: (row: Audit) => (
        <div>
          <div className="font-bold text-slate-900 text-sm">{row.title}</div>
          <div className="text-[11px] text-slate-500">Target Role: {row.targetRole}</div>
        </div>
      ),
    },
    {
      header: 'Execution Date',
      accessor: (row: Audit) => (
        <span className="text-xs font-mono text-slate-500">{row.date}</span>
      ),
    },
    {
      header: 'Tested Queries',
      accessor: (row: Audit) => (
        <span className="text-xs text-slate-500">
          {row.queriesTestedCount} queries tested ({row.queriesCitedCount || 14} cited)
        </span>
      ),
    },
    {
      header: 'Signal Index',
      accessor: (row: Audit) => (
        <span className="text-sm font-mono font-extrabold text-rose-700">
          {row.overallScore} / 100
        </span>
      ),
    },
    {
      header: 'Action',
      accessor: (row: Audit) => (
        <Button variant="wine-soft" size="sm" onClick={() => onViewReport(row.id)}>
          View Report
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Top Welcome Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-rose-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Freelancer Signal Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {displayProfile ? (
              <>
                Monitoring discoverability for{' '}
                <span className="text-rose-700 font-bold">{displayProfile.name}</span> (
                {displayProfile.title})
              </>
            ) : (
              <span className="text-amber-600 font-medium">
                Set up your profile to start monitoring.
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="glow" onClick={onRunAudit} icon={<Sparkles className="w-4 h-4" />}>
            Run New Audit
          </Button>
        </div>
      </div>

      {/* No-profile CTA */}
      {!displayProfile && (
        <Card borderVariant="wine" className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200">
              <UserPlus className="w-6 h-6 text-rose-700" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Complete your freelancer profile</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Add your profession, services, and professional links so Signal AI can run targeted audits.
              </p>
            </div>
          </div>
          <Button variant="glow" size="sm" onClick={onEditProfile}>
            Create Profile
          </Button>
        </Card>
      )}

      {/* Main Metric Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <VisibilityScoreCard
          score={currentAudit.overallScore}
          queriesTested={currentAudit.queriesTestedCount}
          queriesCited={currentAudit.queriesCitedCount}
          onRunAudit={onRunAudit}
        />

        <Card borderVariant="wine" className="lg:col-span-2 space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-rose-700" />
                <span className="text-xs font-mono uppercase text-slate-500 tracking-wider">
                  Latest Audit Overview
                </span>
              </div>
              <Badge variant="optimal" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
                {currentAudit.status}
              </Badge>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">{currentAudit.title}</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Target Profile: {currentAudit.targetProfile} • Executed {currentAudit.date}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {currentAudit.engineScores.map((engine) => (
                <div key={engine.engine} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                    <span>{engine.name}</span>
                    <span className="text-slate-900 font-mono">{engine.score}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-rose-900 to-rose-500 rounded-full"
                      style={{ width: `${engine.score}%` }}
                    />
                  </div>
                  <span className="block text-[10px] text-slate-400 truncate font-semibold">
                    {engine.rankPosition}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5 text-rose-700" />
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
        {displayProfile ? (
          <ProfessionalProfileSummary profile={displayProfile} onEditProfile={onEditProfile} />
        ) : (
          <Card borderVariant="wine" className="flex flex-col items-center justify-center text-center p-8 space-y-3">
            <div className="p-3 rounded-2xl bg-slate-100">
              <UserPlus className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-slate-600">No profile yet</p>
            <Button variant="wine-soft" size="sm" onClick={onEditProfile}>
              Create Profile
            </Button>
          </Card>
        )}

        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-700" />
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
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Search className="w-4 h-4 text-rose-700" />
            Audit History & Benchmarks
          </h3>
          <Button variant="outline" size="sm" onClick={onRunAudit}>
            + Run Audit
          </Button>
        </div>

        <Table data={recentAuditsList} columns={auditColumns} keyExtractor={(row) => row.id} />
      </div>
    </div>
  );
};