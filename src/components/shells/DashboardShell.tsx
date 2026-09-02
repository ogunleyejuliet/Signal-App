'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '../Navbar';
import { Sidebar } from '../Sidebar';
import { DashboardView } from '../DashboardView';
import { AuditModal } from '../ui/AuditModal';
import type { ProfileWithLinks } from '@/lib/supabase/types';

interface DashboardShellProps {
  profile: ProfileWithLinks | null;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({ profile }) => {
  const router = useRouter();
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans">
      <Navbar
        currentView="dashboard"
        onNavigateView={(v) => {
          if (v === 'landing') router.push('/');
          if (v === 'report') router.push('/report');
        }}
        onOpenAuditModal={() => setIsAuditModalOpen(true)}
      />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <Sidebar
          activeTab="dashboard"
          onSelectTab={(tab) => {
            if (tab === 'report') router.push('/report');
            if (tab === 'settings') router.push('/dashboard/profile');
          }}
          onRunAudit={() => setIsAuditModalOpen(true)}
          className="hidden md:flex shrink-0"
          profile={profile}
        />

        <main className="flex-1 min-w-0">
          <DashboardView
            profile={profile}
            onRunAudit={() => setIsAuditModalOpen(true)}
            onViewReport={() => router.push('/report')}
            onEditProfile={() => router.push('/dashboard/profile')}
          />
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