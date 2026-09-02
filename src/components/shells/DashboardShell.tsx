'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '../Navbar';
import { Sidebar } from '../Sidebar';
import { DashboardView } from '../DashboardView';
import { AuditModal } from '../ui/AuditModal';

export const DashboardShell: React.FC = () => {
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
          }}
          onRunAudit={() => setIsAuditModalOpen(true)}
          className="hidden md:flex shrink-0"
        />

        <main className="flex-1 min-w-0">
          <DashboardView
            onRunAudit={() => setIsAuditModalOpen(true)}
            onViewReport={() => router.push('/report')}
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