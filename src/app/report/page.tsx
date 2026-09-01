'use client';

import React, { useState } from 'react';
import { Navbar } from '../../components/Navbar';
import { Sidebar } from '../../components/Sidebar';
import { ReportView } from '../../components/ReportView';
import { AuditModal } from '../../components/ui/AuditModal';
import { useRouter } from 'next/navigation';

export default function ReportPage() {
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
          }}
          onRunAudit={() => setIsAuditModalOpen(true)}
          className="hidden md:flex shrink-0"
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
}
