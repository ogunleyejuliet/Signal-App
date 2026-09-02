'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '../Navbar';
import { Sidebar } from '../Sidebar';
import { ReportView } from '../ReportView';
import { AuditModal } from '../ui/AuditModal';
import { EmptyState } from '../ui/EmptyState';
import { ErrorState } from '../ui/ErrorState';
import { ConfigNotice } from '../ui/ConfigNotice';
import { HistoryLite } from '../history/HistoryLite';
import type { ProfileWithLinks } from '@/lib/supabase/types';
import type { VisibilityReport } from '@/lib/report/types';
import { FileQuestion, ClipboardX } from 'lucide-react';

interface ReportShellProps {
  profile?: ProfileWithLinks | null;
  report?: VisibilityReport | null;
  error?: string | null;
  notFound?: boolean;
  supabaseConfigured?: boolean;
}

export const ReportShell: React.FC<ReportShellProps> = ({
  profile,
  report,
  error = null,
  notFound = false,
  supabaseConfigured = true,
}) => {
  const router = useRouter();
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans">
      <Navbar
        currentView="report"
        onNavigateView={(v) => {
          if (v === 'landing') router.push('/');
          if (v === 'dashboard') router.push('/dashboard');
          if (v === 'report') router.push('/report');
        }}
        onOpenAuditModal={() => setIsAuditModalOpen(true)}
      />

      <ConfigNotice enabled={supabaseConfigured} />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <Sidebar
          activeTab="report"
          onSelectTab={(tab) => {
            if (tab === 'dashboard') router.push('/dashboard');
            if (tab === 'report') router.push('/report');
            if (tab === 'history') router.push('/history');
            if (tab === 'settings') router.push('/dashboard/profile');
          }}
          onRunAudit={() => setIsAuditModalOpen(true)}
          className="hidden md:flex shrink-0"
          profile={profile}
        />

        <main className="flex-1 min-w-0">
          {error && !report && (
            <ErrorState
              title="Report unavailable"
              message={error}
              onRetry={() => router.refresh()}
            />
          )}

          {notFound && !report && !error && (
            <EmptyState
              icon={<FileQuestion className="w-10 h-10 text-rose-400" />}
              title="No audit found"
              description="This audit could not be found, or it belongs to another account. Run an audit to generate a report."
              actionText="Open Dashboard"
              onAction={() => router.push('/dashboard')}
            />
          )}

          {report ? (
            <>
              <ReportView report={report} onRunAudit={() => setIsAuditModalOpen(true)} />
              <HistoryLite currentAuditId={report.auditId} />
            </>
          ) : (
            !error &&
            !notFound && (
              <EmptyState
                icon={<ClipboardX className="w-10 h-10 text-rose-400" />}
                title="No completed audit yet"
                description="You don't have a completed audit with a report yet. Run a new audit to see your AI visibility."
                actionText="Run New Audit"
                onAction={() => setIsAuditModalOpen(true)}
              />
            )
          )}
        </main>
      </div>

      <AuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        onComplete={() => {
          setIsAuditModalOpen(false);
          router.push('/report');
        }}
      />
    </div>
  );
};