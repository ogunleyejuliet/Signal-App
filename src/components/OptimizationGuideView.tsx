'use client';

import React from 'react';
import { Lightbulb, Code, CheckCircle2, ArrowUpRight, Sparkles } from 'lucide-react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { currentAudit } from '../data/mockData';

interface OptimizationGuideViewProps {
  onRunAudit: () => void;
}

export const OptimizationGuideView: React.FC<OptimizationGuideViewProps> = ({ onRunAudit }) => {
  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            AI Optimization Playbook
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Step-by-step guides to maximize your visibility score across AI platforms
          </p>
        </div>
        <Button variant="glow" onClick={onRunAudit} icon={<Sparkles className="w-4 h-4" />}>
          Re-Check Score
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Code className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">1. Add Structured Schema (JSON-LD)</h2>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            AI web crawlers like Perplexity and ChatGPT search portfolio homepages for standard <code className="text-indigo-300">Person</code> and <code className="text-indigo-300">ProfessionalService</code> structured JSON metadata.
          </p>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto">
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

        <Card className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">2. GitHub Bio & Readme Keywords</h2>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Claude 3.5 Sonnet and ChatGPT regularly parse public GitHub profile markdown files. Make sure your GitHub Readme includes explicit availability and target client keywords.
          </p>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300">
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
