'use client';

import React from 'react';
import { Lightbulb, Code, Sparkles } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

export interface OptimizationGuideViewProps {
  onRunAudit: () => void;
}

export const OptimizationGuideView: React.FC<OptimizationGuideViewProps> = ({ onRunAudit }) => {
  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-rose-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            AI Optimization Playbook
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Step-by-step guides to maximize your visibility score across AI platforms
          </p>
        </div>
        <Button variant="glow" onClick={onRunAudit} icon={<Sparkles className="w-4 h-4" />}>
          Re-Check Score
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card borderVariant="wine" className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700">
              <Code className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">1. Add Structured Schema (JSON-LD)</h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            AI web crawlers like Perplexity and ChatGPT search portfolio homepages for standard <code className="text-rose-700 font-mono bg-rose-50 px-1 py-0.5 rounded border border-rose-200">Person</code> and <code className="text-rose-700 font-mono bg-rose-50 px-1 py-0.5 rounded border border-rose-200">ProfessionalService</code> structured JSON metadata.
          </p>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono text-rose-800 overflow-x-auto">
            <pre>{`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Alex Vance",
  "jobTitle": "Senior Next.js Developer",
  "knowsAbout": ["Next.js", "React", "TypeScript", "AI Integrations"]
}
</script>`}</pre>
          </div>
        </Card>

        <Card borderVariant="wine" className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">2. GitHub Bio & Readme Keywords</h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Claude 3.5 Sonnet and ChatGPT regularly parse public GitHub profile markdown files. Make sure your GitHub Readme includes explicit availability and target client keywords.
          </p>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono text-emerald-700 overflow-x-auto">
            <pre>{`## Alex Vance — Senior Contract Developer
- 🚀 Specialized in Next.js 15 App Router & LLM systems
- 💼 Available for freelance & fractional engineering contracts
- 📍 Austin, TX (Remote)`}</pre>
          </div>
        </Card>
      </div>
    </div>
  );
};
