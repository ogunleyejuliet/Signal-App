import type { AuditWithQueries } from '../supabase/types';
import type { ScoreBreakdown } from './types';

// ------------------------------------------------------------------
// Deterministic 0-100 visibility score.
//
// The score is a weighted composite of four sub-scores, each 0-100:
//   - Recommendation visibility  (40%)
//   - Mention visibility         (30%)
//   - Query coverage             (15%)
//   - Professional presence      (15%)
//
// All values are derived purely from the stored audit data, so the same
// audit always produces the same score (no randomness, no LLM calls).
// ------------------------------------------------------------------

const WEIGHTS = {
  recommendation: 0.4,
  mention: 0.3,
  coverage: 0.15,
  presence: 0.15,
} as const;

export const SCORE_WEIGHTS = WEIGHTS;

function round(n: number): number {
  return Math.round(n * 10) / 10;
}

/**
 * Sub-score 1+2: based on each query's visibility status.
 * A "recommended" query earns up to 100; rank position #1 = 100,
 * decreasing slightly for lower ranks. "mentioned" earns 50.
 * "not_found" earns 0. "could_not_check" is excluded (doesn't count as found).
 */
function visibilitySubScores(queries: AuditWithQueries['queries']) {
  const evaluable = queries.filter((q) => q.visibility_status === 'recommended' || q.visibility_status === 'mentioned');
  const total = queries.length || 1;

  const foundCount = evaluable.length;
  const recommended = queries.filter((q) => q.visibility_status === 'recommended');

  // Mention visibility: fraction of queries where we appear at all.
  const mentionScore = (foundCount / total) * 100;

  // Recommendation visibility: fraction of queries where we're a top-3
  // recommendation, and positioned well.
  let recPoints = 0;
  let recCount = 0;
  for (const q of recommended) {
    recCount++;
    let positionScore = 70; // recommended but unranked
    if (typeof q.position === 'number') {
      if (q.position === 1) positionScore = 100;
      else if (q.position === 2) positionScore = 92;
      else if (q.position === 3) positionScore = 84;
      else positionScore = Math.max(50, 84 - (q.position - 3) * 10);
    }
    recPoints += positionScore;
  }
  const recScore = recCount === 0 ? 0 : recPoints / recCount;

  return { mentionScore, recScore };
}

/**
 * Sub-score 3: query coverage — what fraction of queries returned a
 * usable result (i.e. not "could_not_check").
 */
function coverageScore(queries: AuditWithQueries['queries']): number {
  const total = queries.length || 1;
  const usable = queries.filter((q) => q.visibility_status !== 'could_not_check');
  return (usable.length / total) * 100;
}

/**
 * Sub-score 4: professional presence clarity — how complete the profile
 * snapshot was at audit time.
 */
function presenceClarity(snapshot: AuditWithQueries['profile_snapshot']): number {
  let points = 0;
  const parts = [
    snapshot.name,
    snapshot.profession,
    snapshot.specialization,
  ];
  for (const p of parts) {
    if (p && p.trim()) points += 20;
  }
  if (snapshot.services && snapshot.services.trim()) points += 10;
  if (snapshot.target_clients && snapshot.target_clients.trim()) points += 5;
  if (snapshot.location && snapshot.location.trim()) points += 5;
  if (snapshot.links && snapshot.links.length > 0) points += 10;
  return Math.min(100, points);
}

/**
 * Compute the full score breakdown for an audit.
 */
export function computeScore(audit: AuditWithQueries): ScoreBreakdown {
  const { mentionScore, recScore } = visibilitySubScores(audit.queries);
  const coverage = coverageScore(audit.queries);
  const presence = presenceClarity(audit.profile_snapshot);

  const overall =
    recScore * WEIGHTS.recommendation +
    mentionScore * WEIGHTS.mention +
    coverage * WEIGHTS.coverage +
    presence * WEIGHTS.presence;

  return {
    overall: round(overall),
    recommendationVisibility: round(recScore),
    mentionVisibility: round(mentionScore),
    queryCoverage: round(coverage),
    presenceClarity: round(presence),
  };
}