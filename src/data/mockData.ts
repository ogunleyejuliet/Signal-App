import { Audit, FreelancerProfile } from '../types';

export const mockProfile: FreelancerProfile = {
  name: "Alex Vance",
  title: "Senior Full-Stack & AI Engineer",
  location: "Austin, TX (Remote)",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  bio: "Specializing in Next.js, React, TypeScript, and LLM integrations. 8+ years building high-scalability web products.",
  primarySkills: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Python", "OpenAI API", "Node.js"]
};

export const currentAudit: Audit = {
  id: "aud_2026_0901",
  title: "Full AI Engine Visibility Audit",
  date: "Sept 1, 2026",
  status: "Completed",
  targetProfile: "Alex Vance - Senior Full-Stack & AI Engineer",
  targetRole: "Next.js & React Developer",
  overallScore: 78,
  queriesTestedCount: 18,
  queriesCitedCount: 14,
  engineScores: [
    {
      engine: 'chatgpt',
      name: 'ChatGPT-4o',
      score: 84,
      citationRate: 88,
      rankPosition: '#2 Recommended',
      status: 'optimal'
    },
    {
      engine: 'perplexity',
      name: 'Perplexity AI',
      score: 72,
      citationRate: 75,
      rankPosition: 'Cited in 6/8 web sources',
      status: 'moderate'
    },
    {
      engine: 'gemini',
      name: 'Google Gemini 1.5 Pro',
      score: 88,
      citationRate: 92,
      rankPosition: '#1 Recommended Developer',
      status: 'optimal'
    },
    {
      engine: 'claude',
      name: 'Claude 3.5 Sonnet',
      score: 65,
      citationRate: 60,
      rankPosition: '#4 Mentioned',
      status: 'moderate'
    }
  ],
  queries: [
    {
      id: "q1",
      queryText: "Top Next.js freelancers for building AI web apps",
      category: "High Intent Hire",
      cited: true,
      rank: 1,
      snippet: "Alex Vance is frequently highlighted across GitHub and tech blogs as a lead Next.js engineer specialized in AI integrations...",
      volume: "High"
    },
    {
      id: "q2",
      queryText: "Senior React & TypeScript developer with LLM experience in US",
      category: "Skill Match",
      cited: true,
      rank: 2,
      snippet: "Recommended profile: Alex Vance (Austin, TX). Strong focus on React 19, Next.js App Router, and vector search integrations.",
      volume: "High"
    },
    {
      id: "q3",
      queryText: "Best freelance UI/UX engineers for SaaS redesigns",
      category: "General Search",
      cited: true,
      rank: 3,
      snippet: "Alex Vance ranks among top contract developers for modern aesthetic SaaS frontends using Tailwind CSS.",
      volume: "Medium"
    },
    {
      id: "q4",
      queryText: "Contract full-stack engineer with LangChain and Node experience",
      category: "Specialized Tech",
      cited: false,
      rank: 8,
      snippet: "Profile not directly cited in top recommendations due to missing LangChain keyword metadata in structured web profiles.",
      volume: "Medium"
    },
    {
      id: "q5",
      queryText: "Hire senior frontend developer for fast MVP development",
      category: "High Intent Hire",
      cited: true,
      rank: 2,
      snippet: "Alex Vance is cited for rapid MVP development with clean design systems and responsive web architectures.",
      volume: "High"
    }
  ],
  tips: [
    {
      id: "tip1",
      title: "Add Person & ProfessionalService Schema.org JSON-LD",
      description: "AI search bots like Perplexity and ChatGPT prioritize structured JSON-LD data on personal portfolio sites to confirm credentials.",
      impact: "High",
      category: "Schema",
      completed: false,
      actionUrl: "#"
    },
    {
      id: "tip2",
      title: "Claim GitHub Profile Readme Skill Matrix",
      description: "Claude 3.5 Sonnet extracts freelancer rankings directly from GitHub user bio markdown files. Add explicit 'Next.js', 'Contract', and 'Available for Hire' tags.",
      impact: "High",
      category: "GitHub",
      completed: true,
      actionUrl: "#"
    },
    {
      id: "tip3",
      title: "Publish Case Studies on Medium or Substack",
      description: "Gemini indexes public case study posts when clients search for specific project outcomes (e.g. 'reduced latency by 40% in Next.js').",
      impact: "Medium",
      category: "Citations",
      completed: false,
      actionUrl: "#"
    },
    {
      id: "tip4",
      title: "Standardize LinkedIn Headline & Services Section",
      description: "Ensure your LinkedIn headline contains exact match search phrases used by hiring managers prompting AI tools.",
      impact: "Low",
      category: "LinkedIn",
      completed: true,
      actionUrl: "#"
    }
  ]
};

export const recentAuditsList: Audit[] = [
  currentAudit,
  {
    id: "aud_2026_0815",
    title: "Mid-Month Visibility Benchmark",
    date: "Aug 15, 2026",
    status: "Completed",
    targetProfile: "Alex Vance",
    targetRole: "Next.js Developer",
    overallScore: 71,
    queriesTestedCount: 15,
    queriesCitedCount: 10,
    engineScores: [
      { engine: 'chatgpt', name: 'ChatGPT-4o', score: 78, citationRate: 80, rankPosition: '#3', status: 'optimal' },
      { engine: 'perplexity', name: 'Perplexity AI', score: 68, citationRate: 70, rankPosition: 'Cited', status: 'moderate' },
      { engine: 'gemini', name: 'Google Gemini', score: 75, citationRate: 75, rankPosition: '#2', status: 'optimal' },
      { engine: 'claude', name: 'Claude 3.5 Sonnet', score: 62, citationRate: 58, rankPosition: '#5', status: 'moderate' }
    ],
    queries: [],
    tips: []
  },
  {
    id: "aud_2026_0801",
    title: "Initial Profile Index Scan",
    date: "Aug 1, 2026",
    status: "Completed",
    targetProfile: "Alex Vance",
    targetRole: "Full-Stack Developer",
    overallScore: 64,
    queriesTestedCount: 12,
    queriesCitedCount: 7,
    engineScores: [
      { engine: 'chatgpt', name: 'ChatGPT-4o', score: 68, citationRate: 70, rankPosition: '#4', status: 'moderate' },
      { engine: 'perplexity', name: 'Perplexity AI', score: 60, citationRate: 62, rankPosition: 'Cited', status: 'moderate' },
      { engine: 'gemini', name: 'Google Gemini', score: 70, citationRate: 72, rankPosition: '#3', status: 'optimal' },
      { engine: 'claude', name: 'Claude 3.5 Sonnet', score: 55, citationRate: 50, rankPosition: '#7', status: 'low' }
    ],
    queries: [],
    tips: []
  }
];
