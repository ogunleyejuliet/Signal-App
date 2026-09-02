import React from 'react';
import Link from 'next/link';
import { Radio } from 'lucide-react';

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans">
      <header className="border-b border-rose-100 bg-white/90 backdrop-blur-lg shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-rose-800 via-rose-900 to-rose-950 p-0.5 group-hover:scale-105 transition-transform border border-rose-700/50 shadow-md shadow-rose-900/20">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Radio className="w-5 h-5 text-rose-700 animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-wider text-slate-900 flex items-center gap-1.5">
                SIGNAL{' '}
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-rose-50 text-rose-800 border border-rose-200">
                  AI
                </span>
              </span>
              <span className="text-[10px] text-slate-500 tracking-tight font-semibold -mt-1">
                Freelancer Discoverability Intelligence
              </span>
            </div>
          </Link>
          <Link
            href="/"
            className="hidden sm:inline-flex text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            Back to home
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-rose-100 shadow-lg shadow-rose-900/5">
            {children}
          </div>
        </div>
      </main>

      <footer className="px-4 pb-6 text-center">
        <p className="text-[11px] text-slate-400">
          © {new Date().getFullYear()} Signal AI · Freelancer Discoverability Intelligence
        </p>
      </footer>
    </div>
  );
}