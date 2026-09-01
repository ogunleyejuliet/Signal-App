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
    <aside className={`w-64 bg-white border-r border-rose-100 flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)] select-none ${className}`}>
      <div className="space-y-6">
        {/* Active Profile Info */}
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-rose-900 border border-rose-700 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-rose-900/20">
              AV
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-extrabold text-slate-900 truncate">{mockProfile.name}</span>
            <span className="text-[10px] text-slate-500 truncate font-medium">{mockProfile.title}</span>
          </div>
        </div>

        {/* Quick Audit Action Button */}
        <button
          onClick={onRunAudit}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-900 via-rose-800 to-rose-700 hover:brightness-110 text-white text-xs font-bold shadow-lg shadow-rose-900/30 transition cursor-pointer border border-rose-600/40"
        >
          <Sparkles className="w-4 h-4 animate-spin-slow text-rose-200" />
          <span>Run New AI Scan</span>
        </button>

        {/* Navigation Items */}
        <div className="space-y-1">
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-400">
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
                    ? 'bg-rose-900 border border-rose-800 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-rose-200' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center gap-1">
                  {item.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? 'bg-rose-700 text-rose-50' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className={`w-3.5 h-3.5 opacity-50 ${isActive ? 'text-rose-200' : ''}`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Monitoring Status Badge Footer */}
      <div className="pt-4 border-t border-slate-100">
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-rose-700 shrink-0" />
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-rose-900">Continuous AI Watch</span>
            <span className="text-[10px] text-slate-500">4 LLM Engines Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
