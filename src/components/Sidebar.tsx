'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Bot, 
  CheckSquare, 
  Settings, 
  Sparkles, 
  Radio, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { mockProfile } from '../data/mockData';

interface SidebarProps {
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
    <aside className={`w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)] select-none ${className}`}>
      <div className="space-y-6">
        {/* Active Profile Info */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-white font-bold text-sm">
              AV
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-bold text-white truncate">{mockProfile.name}</span>
            <span className="text-[10px] text-slate-400 truncate">{mockProfile.title}</span>
          </div>
        </div>

        {/* Quick Audit Action Button */}
        <button
          onClick={onRunAudit}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition cursor-pointer"
        >
          <Sparkles className="w-4 h-4 animate-spin-slow" />
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
                    ? 'bg-indigo-600/15 border border-indigo-500/40 text-indigo-300 shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center gap-1">
                  {item.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-indigo-500/30 text-indigo-200' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className={`w-3.5 h-3.5 opacity-50 ${isActive ? 'text-indigo-400' : ''}`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Monitoring Status Badge Footer */}
      <div className="pt-4 border-t border-slate-900">
        <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-emerald-400">Continuous AI Watch</span>
            <span className="text-[10px] text-slate-400">4 LLM Engines Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
