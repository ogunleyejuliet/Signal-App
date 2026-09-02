'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '../Navbar';
import { Sidebar } from '../Sidebar';
import { ReportView } from '../ReportView';
import { AuditModal } from '../ui/AuditModal';
import type { ProfileWithLinks } from '@/lib/supabase/types';

interface ReportShellProps {
  profile?: ProfileWithLinks | null;
}

export const ReportShell: React.FC<ReportShellProps> = ({ profile }) => {
  const router = useRouter();
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans">
      <Navbar
        currentView="report"
        onNavigateView={(v) => {
          if (v === 'landing') router.push('/');
          if (v === 'dashboard') router.push('/dashboard');
        }}
        onOpenAuditModal={() => setIsAuditModalOpen(true)}
      />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <Sidebar
          activeTab="report"
          onSelectTab={(tab) => {
            if (tab === 'dashboard') router.push('/dashboard');
            if (tab === 'settings') router.push('/dashboard/profile');
          }}
          onRunAudit={() => setIsAuditModalOpen(true)}
          className="hidden md:flex shrink-0"
          profile={profile}
        />

        <main className="flex-1 min-w-0">
          <ReportView
            onRunAudit={() => setIsAuditModalOpen(true)}
            onBackToDashboard={() => router.push('/dashboard')}
          />
        </main>
      </div>

      <AuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        onComplete={() => setIsAuditModalOpen(false)}
      />
    </div>
  );
};