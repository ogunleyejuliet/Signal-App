'use client';

import React, { useState, useEffect } from 'react';
import { X, Search, Sparkles, CheckCircle2, Loader2, Bot, ArrowRight } from 'lucide-react';
import { Button } from './Button';

export interface AuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

const auditSteps = [
  { id: 1, label: "Scanning public portfolio & structured schema...", engine: "Perplexity AI" },
  { id: 2, label: "Evaluating ranking in high-intent freelancer queries...", engine: "ChatGPT-4o" },
  { id: 3, label: "Analyzing GitHub & professional citations...", engine: "Claude 3.5 Sonnet" },
  { id: 4, label: "Testing Gemini Knowledge Graph recommendations...", engine: "Google Gemini" },
  { id: 5, label: "Calculating Signal Visibility Index Score...", engine: "Signal AI Indexer" }
];

export const AuditModal: React.FC<AuditModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [profileName, setProfileName] = useState("Alex Vance");
  const [profileRole, setProfileRole] = useState("Senior Next.js & React Developer");
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < auditSteps.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            setTimeout(() => {
              setIsRunning(false);
              if (onComplete) onComplete();
            }, 1000);
            return prev;
          }
        });
      }, 1200);

      return () => clearInterval(interval);
    }
  }, [isRunning, onComplete]);

  if (!isOpen) return null;

  const handleStartAudit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRunning(true);
    setCurrentStep(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl border border-rose-900/40 shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Run Signal AI Visibility Audit</h3>
              <p className="text-xs text-slate-400">Simulate how top AI search engines index your profile</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isRunning}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isRunning ? (
          <form onSubmit={handleStartAudit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Freelancer Name / Brand
              </label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                required
                placeholder="e.g. Alex Vance"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Target Role & Expertise
              </label>
              <input
                type="text"
                value={profileRole}
                onChange={(e) => setProfileRole(e.target.value)}
                required
                placeholder="e.g. Senior Next.js Developer"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition"
              />
            </div>

            <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-900/40 text-xs text-rose-200/90 flex items-start gap-2.5">
              <Bot className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>
                Signal will test high-intent client queries across <strong>ChatGPT-4o</strong>, <strong>Perplexity AI</strong>, <strong>Claude 3.5</strong>, and <strong>Gemini</strong>.
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="glow" icon={<Search className="w-4 h-4" />}>
                Start Live Scan
              </Button>
            </div>
          </form>
        ) : (
          <div className="py-6 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-full bg-rose-950/60 border border-rose-800/60 text-rose-400 mb-1">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
              <h4 className="text-base font-bold text-white">Analyzing AI Visibility for {profileName}</h4>
              <p className="text-xs text-slate-400">{profileRole}</p>
            </div>

            {/* Step list */}
            <div className="space-y-3 px-2">
              {auditSteps.map((step, idx) => {
                const isDone = idx < currentStep;
                const isCurrent = idx === currentStep;

                return (
                  <div
                    key={step.id}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs transition-all duration-300 ${
                      isDone
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : isCurrent
                        ? 'bg-rose-950/60 border-rose-700/60 text-rose-200 shadow-md shadow-rose-950/30'
                        : 'bg-slate-900/40 border-slate-800 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : isCurrent ? (
                        <Loader2 className="w-4 h-4 text-rose-400 animate-spin shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                      )}
                      <span>{step.label}</span>
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {step.engine}
                    </span>
                  </div>
                );
              })}
            </div>

            {currentStep === auditSteps.length - 1 && (
              <div className="pt-2 text-center text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1.5 animate-bounce">
                <span>Audit Complete! Preparing Report...</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
