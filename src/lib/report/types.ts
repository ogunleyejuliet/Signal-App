import type { AuditWithQueries, ProfileSnapshot } from '../supabase/types';

// ------------------------------------------------------------------
// Deterministic scoring breakdown (0-100 overall, transparent sub-scores)
// ------------------------------------------------------------------

export interface ScoreBreakdown {
  overall: number;
  recommendationVisibility: number;
  mentionVisibility: number;
  queryCoverage: number;
  presenceClarity: number;
}

// ------------------------------------------------------------------
// A single query's result, plus how it contributes to the report
// ------------------------------------------------------------------

export interface QueryResultRow {
  id: string;
  query_text: string;
  query_type: string;
  category: string;
  visibility_status: string | null;
  position: number | null;
  provider: string | null;
  ai_response: string | null;
}

// ------------------------------------------------------------------
// "Who AI recommended" — names extracted from responses that are ours
// ------------------------------------------------------------------

export interface RecommendedName {
  name: string;
  mentionCount: number;
}

// ------------------------------------------------------------------
// Gaps / missing information / recommended actions
// ------------------------------------------------------------------

export type Priority = 'High' | 'Medium' | 'Low';

export interface ReportGap {
  id: string;
  title: string;
  description: string;
  area: string;
  priority: Priority;
}

export interface MissingInfo {
  id: string;
  label: string;
  present: boolean;
  suggestion: string;
}

export interface RecommendedAction {
  id: string;
  priority: Priority;
  title: string;
  explanation: string;
  improvementArea: string;
}

// ------------------------------------------------------------------
// Inputs to the scoring + report functions
// ------------------------------------------------------------------

export interface ReportInput {
  audit: AuditWithQueries;
}

// ------------------------------------------------------------------
// The full report model — derived entirely from stored audit data
// ------------------------------------------------------------------

export interface VisibilityReport {
  auditId: string;
  createdAt: string;
  profile: ProfileSnapshot;
  score: ScoreBreakdown;
  queryResults: QueryResultRow[];
  counts: {
    total: number;
    recommended: number;
    mentioned: number;
    notFound: number;
    couldNotCheck: number;
  };
  aiRecommended: RecommendedName[];
  whatAiKnowsAboutYou: string[];
  gaps: ReportGap[];
  missingInformation: MissingInfo[];
  recommendedActions: RecommendedAction[];
}

export type { AuditWithQueries };