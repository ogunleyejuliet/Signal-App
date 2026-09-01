'use client';

import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { LandingHero } from '../components/LandingHero';
import { DashboardView } from '../components/DashboardView';
import { ReportView } from '../components/ReportView';
import { OptimizationGuideView } from '../components/OptimizationGuideView';
import { AuditModal } from '../components/ui/AuditModal';

export default function Home() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'report'>('landing');
  const [dashboardTab, setDashboardTab] = useState<'dashboard' | 'report' | 'engines' | 'tips' | 'settings'>('dashboard');
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  const handleStartAudit = () => {
    setIsAuditModalOpen(true);
  };

  const handleAuditComplete = () => {
    setIsAuditModalOpen(false);
    setCurrentView('dashboard');
    setDashboardTab('report');
  };

  const handleNavigateView = (view: 'landing' | 'dashboard' | 'report') => {
    setCurrentView(view);
    if (view === 'dashboard') {
      setDashboardTab('dashboard');
    }
  };

  const handleSelectDashboardTab = (tab: 'dashboard' | 'report' | 'engines' | 'tips' | 'settings') => {
    setDashboardTab(tab);
    if (tab === 'report') {
      setCurrentView('report');
    } else {
      setCurrentView('dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans">
      {/* Top Header Navbar */}
      <Navbar
        currentView={currentView}
        onNavigateView={handleNavigateView}
        onOpenAuditModal={handleStartAudit}
      />

      {/* Main Content Area */}
      {currentView === 'landing' ? (
        <main className="flex-1">
          <LandingHero
            onStartAudit={handleStartAudit}
            onViewDashboard={() => handleNavigateView('dashboard')}
            onViewReport={() => handleNavigateView('report')}
          />
        </main>
      ) : (
        <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
          {/* Dashboard Sidebar Navigation */}
          <Sidebar
            activeTab={dashboardTab}
            onSelectTab={handleSelectDashboardTab}
            onRunAudit={handleStartAudit}
            className="hidden md:flex shrink-0"
          />

          {/* Main Dashboard / Report View Pane */}
          <main className="flex-1 min-w-0">
            {currentView === 'dashboard' && dashboardTab === 'dashboard' && (
              <DashboardView
                onRunAudit={handleStartAudit}
                onViewReport={() => {
                  setCurrentView('report');
                  setDashboardTab('report');
                }}
              />
            )}

            {(currentView === 'report' || dashboardTab === 'report' || dashboardTab === 'engines') && (
              <ReportView
                onRunAudit={handleStartAudit}
                onBackToDashboard={() => {
                  setCurrentView('dashboard');
                  setDashboardTab('dashboard');
                }}
              />
            )}

            {dashboardTab === 'tips' && (
              <OptimizationGuideView onRunAudit={handleStartAudit} />
            )}

            {dashboardTab === 'settings' && (
              <div className="p-8 space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">Profile & AI Index Settings</h2>
                <p className="text-sm text-slate-500">
                  Configure your primary portfolio URLs, GitHub repositories, and search keywords for future automated audits.
                </p>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
                  Settings placeholder mode. Connect custom domain / webhooks in production.
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      {/* Interactive Live Audit Modal */}
      <AuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        onComplete={handleAuditComplete}
      />

      {/* Modern Light SaaS Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">SIGNAL AI</span>
            <span className="text-slate-400">— Freelancer AI Discoverability Engine</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>ChatGPT-4o</span>
            <span>•</span>
            <span>Perplexity</span>
            <span>•</span>
            <span>Claude 3.5</span>
            <span>•</span>
            <span>Gemini 1.5</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
