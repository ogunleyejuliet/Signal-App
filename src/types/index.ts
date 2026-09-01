export type AIEngine = 'chatgpt' | 'perplexity' | 'claude' | 'gemini';

export interface AIEngineScore {
  engine: AIEngine;
  name: string;
  score: number; // 0 to 100
  citationRate: number; // percentage
  rankPosition: string; // e.g. "Top 3", "Cited #1", "Not Recommended"
  status: 'optimal' | 'moderate' | 'low';
}

export interface QueryInsight {
  id: string;
  queryText: string;
  category: string;
  cited: boolean;
  rank: number;
  snippet: string;
  volume: 'High' | 'Medium' | 'Low';
}

export interface OptimizationTip {
  id: string;
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  category: 'Schema' | 'Portfolio' | 'GitHub' | 'LinkedIn' | 'Citations';
  completed: boolean;
  actionUrl?: string;
}

export interface Audit {
  id: string;
  title: string;
  date: string;
  status: 'Completed' | 'In Progress' | 'Failed';
  targetProfile: string;
  targetRole: string;
  overallScore: number;
  queriesTestedCount: number;
  queriesCitedCount: number;
  engineScores: AIEngineScore[];
  queries: QueryInsight[];
  tips: OptimizationTip[];
}

export interface FreelancerProfile {
  name: string;
  title: string;
  location: string;
  avatarUrl: string;
  bio: string;
  primarySkills: string[];
}
