'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Radio, Sparkles, LayoutDashboard, FileText, Menu, X, ArrowRight, LogOut } from 'lucide-react';
import { Button } from './ui/Button';
import { useAuth } from './providers/AuthProvider';
import { signOut as signOutAction } from '@/lib/supabase/actions';

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
  const { user } = useAuth();

  const handleViewClick = (view: 'landing' | 'dashboard' | 'report') => {
    if (onNavigateView) {
      onNavigateView(view);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-rose-100 bg-white/90 backdrop-blur-lg shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link 
          href="/" 
          onClick={() => handleViewClick('landing')}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-rose-800 via-rose-900 to-rose-950 p-0.5 group-hover:scale-105 transition-transform border border-rose-700/50 shadow-md shadow-rose-900/20">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <Radio className="w-5 h-5 text-rose-700 animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-wider text-slate-900 flex items-center gap-1.5">
              SIGNAL <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-rose-50 text-rose-800 border border-rose-200">AI</span>
            </span>
            <span className="text-[10px] text-slate-500 tracking-tight font-semibold -mt-1">
              Freelancer Discoverability Intelligence
            </span>
          </div>
        </Link>

        {/* View Switcher / Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => handleViewClick('landing')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              currentView === 'landing'
                ? 'bg-rose-900 text-white border border-rose-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Landing Page
          </button>
          <button
            onClick={() => handleViewClick('dashboard')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              currentView === 'dashboard'
                ? 'bg-rose-900 text-white shadow-sm border border-rose-800'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Dashboard
          </button>
          <button
            onClick={() => handleViewClick('report')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              currentView === 'report'
                ? 'bg-rose-900 text-white shadow-sm border border-rose-800'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Sample Report
          </button>
        </nav>

        {/* Actions / CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <div
                title={user.email}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-sm"
              >
                <div className="w-6 h-6 rounded-full bg-rose-900 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-semibold text-slate-600 max-w-[140px] truncate">
                  {user.email}
                </span>
              </div>
              <form action={signOutAction}>
                <Button
                  variant="outline"
                  size="sm"
                  type="submit"
                  icon={<LogOut className="w-3.5 h-3.5" />}
                >
                  Sign out
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Log in
              </Link>
              <Link href="/signup">
                <Button variant="wine-soft" size="sm">
                  Sign up
                </Button>
              </Link>
            </>
          )}
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
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-rose-100 bg-white px-4 pt-3 pb-5 space-y-2">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider px-2">Navigation Views</div>
          <button
            onClick={() => handleViewClick('landing')}
            className={`w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-sm font-medium ${
              currentView === 'landing' ? 'bg-rose-900 text-white' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>Landing Page</span>
            <ArrowRight className="w-4 h-4 opacity-70" />
          </button>
          <button
            onClick={() => handleViewClick('dashboard')}
            className={`w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-sm font-medium ${
              currentView === 'dashboard' ? 'bg-rose-900 text-white' : 'text-slate-700 hover:bg-slate-100'
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
              currentView === 'report' ? 'bg-rose-900 text-white' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Detailed Audit Report
            </span>
            <ArrowRight className="w-4 h-4 opacity-70" />
          </button>

          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider px-2 pt-4">
            Account
          </div>
          {user ? (
            <>
              <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200">
                <div className="w-7 h-7 rounded-full bg-rose-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-slate-700 truncate">{user.email}</span>
              </div>
              <form action={signOutAction} className="pt-1">
                <Button variant="outline" size="sm" type="submit" className="w-full">
                  Sign out
                </Button>
              </form>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2 px-1">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full">
                  Log in
                </Button>
              </Link>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="glow" size="sm" className="w-full">
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
