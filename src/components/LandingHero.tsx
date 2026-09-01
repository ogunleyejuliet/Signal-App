'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  CheckCircle, 
  Bot, 
  TrendingUp, 
  Target, 
  Zap,
  ChevronRight
} from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';

export interface LandingHeroProps {
  onStartAudit: () => void;
  onViewDashboard: () => void;
  onViewReport: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartAudit,
  onViewDashboard,
  onViewReport
}) => {
  const [activeEngine, setActiveEngine] = useState<'chatgpt' | 'perplexity' | 'gemini' | 'claude'>('chatgpt');

  const engineExamples = {
    chatgpt: {
      name: "ChatGPT-4o",
      query: "Recommend top senior Next.js & AI developers for a fintech MVP build in Austin",
      response: "Here are top-recommended contract engineers based on public code artifacts, portfolio schema, and verified project outcomes:\n\n1. **Alex Vance** — Senior Full-Stack & AI Engineer (Austin, TX). Known for building high-performance Next.js App Router applications with OpenAI/LLM integrations.",
      cited: true,
      score: 84
    },
    perplexity: {
      name: "Perplexity AI",
      query: "Who is the best freelance React developer specializing in modern UI systems?",
      response: "According to indexed web sources and GitHub contributions, Alex Vance is cited across several developer roundups as a top freelance specialist in React 19, TypeScript, and Tailwind CSS design systems.",
      cited: true,
      score: 72
    },
    gemini: {
      name: "Google Gemini",
      query: "Find freelance full-stack engineers with proven vector search experience",
      response: "Top recommended developer match:\n- **Alex Vance** (Signal Visibility Score: 88/100). Expertise includes Next.js, Python, RAG architectures, and scalable frontend engines.",
      cited: true,
      score: 88
    },
    claude: {
      name: "Claude 3.5 Sonnet",
      query: "List contract developers with verified Next.js project case studies",
      response: "Indexed profiles include Alex Vance (cited in 3 web references). Recommend requesting updated Schema.org verified portfolio links for full project verification.",
      cited: false,
      score: 65
    }
  };

  return (
    <div className="space-y-20 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="relative text-center space-y-8 pt-6 pb-10">
        {/* Deep wine glow backdrop decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-200/50 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-rose-100/40 blur-3xl rounded-full pointer-events-none" />

        {/* Floating Signal Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border-rose-200 text-xs font-bold text-rose-800 mb-2">
          <Sparkles className="w-4 h-4 text-rose-700" />
          <span>AI Discoverability Platform for Freelancers</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
        </div>

        {/* Core Hero Headline */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-none">
            See how <span className="gradient-text-hero">AI sees you.</span>
          </h1>
          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Understand and optimize how clients discover your freelance profile in ChatGPT, Perplexity, Claude, and Gemini. Get cited, recommended, and hired.
          </p>
        </div>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Button
            variant="glow"
            size="lg"
            onClick={onStartAudit}
            icon={<Sparkles className="w-5 h-5" />}
            className="w-full sm:w-auto text-base px-8 py-3.5"
          >
            Start Free Audit Now
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={onViewDashboard}
            icon={<TrendingUp className="w-5 h-5 text-rose-700" />}
            className="w-full sm:w-auto text-base px-6 py-3.5"
          >
            Explore Dashboard Demo
          </Button>
        </div>

        {/* Social Proof highlights */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>Audit 4 major LLM engines</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>Track high-intent client queries</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>Actionable Schema & Portfolio fixes</span>
          </div>
        </div>
      </section>

      {/* Interactive AI Search Simulation Card */}
      <section className="space-y-4">
        <div className="text-center space-y-2">
          <Badge variant="brand">Live Search Simulator</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">How Clients Find Freelancers in AI Search</h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Clients no longer just search Google — they ask AI to recommend specific contract experts. Select an AI engine below to see what it returns.
          </p>
        </div>

        <div className="max-w-4xl mx-auto glass-panel rounded-2xl p-4 sm:p-6 border border-rose-200 shadow-xl">
          {/* Engine Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
            {(['chatgpt', 'perplexity', 'gemini', 'claude'] as const).map((engine) => (
              <button
                key={engine}
                onClick={() => setActiveEngine(engine)}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  activeEngine === engine
                    ? 'bg-rose-900 border-rose-700 text-white shadow-lg shadow-rose-900/20'
                    : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Bot className="w-4 h-4 text-rose-700" />
                <span className="capitalize">{engine}</span>
              </button>
            ))}
          </div>

          {/* AI Response Card */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2 text-xs font-mono text-rose-800">
                <Search className="w-3.5 h-3.5 text-rose-700" />
                <span>Prompt: &ldquo;{engineExamples[activeEngine].query}&rdquo;</span>
              </div>
              <Badge variant={engineExamples[activeEngine].cited ? 'optimal' : 'moderate'}>
                {engineExamples[activeEngine].cited ? 'Cited & Recommended' : 'Low Citation'}
              </Badge>
            </div>

            <div className="text-sm text-slate-700 font-mono whitespace-pre-wrap leading-relaxed">
              {engineExamples[activeEngine].response}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-xs">
              <span className="text-slate-500">Signal Index for this engine:</span>
              <span className="font-bold text-slate-900 font-mono">{engineExamples[activeEngine].score} / 100</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Breakdown Cards */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <Badge variant="neutral">Platform Features</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Why Modern Freelancers Need Signal</h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Traditional SEO focuses on Google keyword links. Signal optimizes your personal brand for LLM Knowledge Graphs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card borderVariant="wine" hoverEffect className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">1. Query Visibility Audits</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Run automated tests across 20+ realistic client hiring prompts like &ldquo;Top Next.js developer for fintech MVP&rdquo; to see if your profile gets cited.
            </p>
          </Card>

          <Card borderVariant="wine" hoverEffect className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">2. Multi-LLM Engine Matrix</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Understand how ChatGPT, Perplexity, Claude, and Gemini perceive your skillset differently based on their indexing training data.
            </p>
          </Card>

          <Card borderVariant="wine" hoverEffect className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">3. Actionable Schema Fixes</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Get clear JSON-LD schema snippets, GitHub readme optimizations, and portfolio markup recommendations to boost your discoverability score.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Box */}
      <section className="glass-panel rounded-2xl p-8 border border-rose-200 text-center space-y-6 bg-gradient-to-b from-rose-50 to-white">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">Ready to see how AI sees you?</h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            Take 60 seconds to run your first Signal visibility audit and get a complete score breakdown.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="glow"
            size="lg"
            onClick={onStartAudit}
            icon={<Sparkles className="w-5 h-5" />}
          >
            Run Your Free Audit
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={onViewReport}
            icon={<ChevronRight className="w-5 h-5" />}
          >
            View Sample Audit Report
          </Button>
        </div>
      </section>
    </div>
  );
};
