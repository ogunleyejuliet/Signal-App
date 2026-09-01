'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Bot, 
  CheckSquare, 
  Settings, 
  Sparkles, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { mockProfile } from '../data/mockData';

export interface SidebarProps {
  activeTab: 'dashboard' | 'report' | 'engines' | 'tips' | 'settings';
  onSelectTab: (tab: 'dashboard' | 'report' | 'engines' | 'tips' | 'settings') => void;
  onRunAudit: () => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onRunAudit,
  className = ''
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'report', label: 'Latest Audit Report', icon: FileText, badge: 'New' },
    { id: 'engines', label: 'AI Engine Breakdown', icon: Bot, badge: '4 AI' },
    { id: 'tips', label: 'Optimization Guide', icon: CheckSquare, badge: '2 Action' },
    { id: 'settings', label: 'Profile Settings', icon: Settings, badge: null },
  ] as const;

  return (
    <aside className={`w-64 bg-slate-950 border-r border-rose-950/40 flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)] select-none ${className}`}>
      <div className="space-y-6">
        {/* Active Profile Info */}
        <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-rose-900/60 border border-rose-700/50 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-rose-950">
              AV
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-extrabold text-white truncate">{mockProfile.name}</span>
            <span className="text-[10px] text-slate-400 truncate font-medium">{mockProfile.title}</span>
          </div>
        </div>

        {/* Quick Audit Action Button */}
        <button
          onClick={onRunAudit}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-900 via-rose-800 to-rose-700 hover:brightness-110 text-white text-xs font-bold shadow-lg shadow-rose-950/60 transition cursor-pointer border border-rose-600/40"
        >
          <Sparkles className="w-4 h-4 animate-spin-slow text-rose-300" />
          <span>Run New AI Scan</span>
        </button>

        {/* Navigation Items */}
        <div className="space-y-1">
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-500">
            Dashboard Menu
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-rose-950/70 border border-rose-800/60 text-rose-200 shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-rose-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center gap-1">
                  {item.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? 'bg-rose-900/60 text-rose-200 border border-rose-700/40' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className={`w-3.5 h-3.5 opacity-50 ${isActive ? 'text-rose-400' : ''}`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Monitoring Status Badge Footer */}
      <div className="pt-4 border-t border-slate-900">
        <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-900/40 flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0" />
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-rose-300">Continuous AI Watch</span>
            <span className="text-[10px] text-slate-400">4 LLM Engines Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
