'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Radio, Sparkles, LayoutDashboard, FileText, Menu, X, ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';

export interface NavbarProps {
  currentView?: 'landing' | 'dashboard' | 'report';
  onNavigateView?: (view: 'landing' | 'dashboard' | 'report') => void;
  onOpenAuditModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView = 'landing',
  onNavigateView,
  onOpenAuditModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleViewClick = (view: 'landing' | 'dashboard' | 'report') => {
    if (onNavigateView) {
      onNavigateView(view);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-rose-950/60 bg-slate-950/85 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link 
          href="/" 
          onClick={() => handleViewClick('landing')}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-rose-700 via-rose-900 to-rose-950 p-0.5 shadow-lg shadow-rose-950/50 group-hover:scale-105 transition-transform border border-rose-700/50">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Radio className="w-5 h-5 text-rose-400 animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-wider text-white flex items-center gap-1.5">
              SIGNAL <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-rose-950/80 text-rose-300 border border-rose-800/60">AI</span>
            </span>
            <span className="text-[10px] text-slate-400 tracking-tight font-semibold -mt-1">
              Freelancer Discoverability Intelligence
            </span>
          </div>
        </Link>

        {/* View Switcher / Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => handleViewClick('landing')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              currentView === 'landing'
                ? 'bg-rose-950/80 text-rose-200 border border-rose-800/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Landing Page
          </button>
          <button
            onClick={() => handleViewClick('dashboard')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              currentView === 'dashboard'
                ? 'bg-rose-900 text-white shadow-sm shadow-rose-950/50 border border-rose-700/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Dashboard
          </button>
          <button
            onClick={() => handleViewClick('report')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              currentView === 'report'
                ? 'bg-rose-900 text-white shadow-sm shadow-rose-950/50 border border-rose-700/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Sample Report
          </button>
        </nav>

        {/* Actions / CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="glow"
            size="sm"
            onClick={onOpenAuditModal}
            icon={<Sparkles className="w-4 h-4" />}
          >
            Start Free Audit
          </Button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <Button
            variant="glow"
            size="sm"
            onClick={onOpenAuditModal}
            className="text-xs px-2.5 py-1"
          >
            Audit
          </Button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-rose-950 bg-slate-950 px-4 pt-3 pb-5 space-y-2">
          <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider px-2">Navigation Views</div>
          <button
            onClick={() => handleViewClick('landing')}
            className={`w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-sm font-medium ${
              currentView === 'landing' ? 'bg-rose-900 text-white' : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            <span>Landing Page</span>
            <ArrowRight className="w-4 h-4 opacity-70" />
          </button>
          <button
            onClick={() => handleViewClick('dashboard')}
            className={`w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-sm font-medium ${
              currentView === 'dashboard' ? 'bg-rose-900 text-white' : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            <span className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard Demo
            </span>
            <ArrowRight className="w-4 h-4 opacity-70" />
          </button>
          <button
            onClick={() => handleViewClick('report')}
            className={`w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-sm font-medium ${
              currentView === 'report' ? 'bg-rose-900 text-white' : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Detailed Audit Report
            </span>
            <ArrowRight className="w-4 h-4 opacity-70" />
          </button>
        </div>
      )}
    </header>
  );
};
