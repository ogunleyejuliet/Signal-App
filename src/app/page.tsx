'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '../components/Navbar';
import { LandingHero } from '../components/LandingHero';
import { AuditModal } from '../components/ui/AuditModal';

export default function Home() {
  const router = useRouter();
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  const handleNavigateView = (view: 'landing' | 'dashboard' | 'report') => {
    if (view === 'dashboard') router.push('/dashboard');
    if (view === 'report') router.push('/report');
    // 'landing' stays here
  };

  const handleStartAudit = () => setIsAuditModalOpen(true);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans">
      <Navbar
        currentView="landing"
        onNavigateView={handleNavigateView}
        onOpenAuditModal={handleStartAudit}
      />

      <main className="flex-1">
        <LandingHero
          onStartAudit={handleStartAudit}
          onViewDashboard={() => router.push('/dashboard')}
          onViewReport={() => router.push('/report')}
        />
      </main>

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
}