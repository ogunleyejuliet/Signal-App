import type { ProfileSnapshot } from '../supabase/types';

// ------------------------------------------------------------------
// Visibility classification result
// ------------------------------------------------------------------

export type VisibilityStatus =
  | 'recommended'
  | 'mentioned'
  | 'not_found'
  | 'could_not_check';

export interface ClassificationResult {
  status: VisibilityStatus;
  position: number | null;
  other_professionals: string[];
  reasoning: string;
}

// ------------------------------------------------------------------
// Provider interface — every provider implements this
// ------------------------------------------------------------------

export interface ProviderCheckInput {
  query: string;
  freelancerName: string;
  snapshot: ProfileSnapshot;
}

export interface ProviderCheckResult {
  provider: string;
  responseText: string;
  classification: ClassificationResult;
}

export interface Provider {
  readonly name: string;
  check(input: ProviderCheckInput): Promise<ProviderCheckResult>;
}