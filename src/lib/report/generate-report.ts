import type { AuditWithQueries, ProfileSnapshot, VisibilityStatus } from '../supabase/types';
import { computeScore } from './scoring';
import type {
  MissingInfo,
  Priority,
  QueryResultRow,
  RecommendedName,
  RecommendedAction,
  ReportGap,
  VisibilityReport,
} from './types';

// ------------------------------------------------------------------
// Build query result rows (UI-ready, no secrets)
// ------------------------------------------------------------------

function buildQueryRows(audit: AuditWithQueries): QueryResultRow[] {
  return audit.queries.map((q) => ({
    id: q.id,
    query_text: q.query_text,
    query_type: q.query_type,
    category: q.category,
    visibility_status: q.visibility_status,
    position: q.position,
    provider: q.provider,
    ai_response: q.ai_response,
  }));
}

// ------------------------------------------------------------------
// Who AI recommended / mentioned — names from the freelancer's own
// responses. We only surface names we can identify from the "other
// professionals" evidence captured at audit time, plus the freelance
// name itself when it appears.
// ------------------------------------------------------------------

function buildAiRecommended(audit: AuditWithQueries): RecommendedName[] {
  const counters = new Map<string, number>();

  for (const q of audit.queries) {
    if (!q.other_professionals || q.other_professionals.length === 0) continue;
    for (const name of q.other_professionals) {
      if (!name || !name.trim()) continue;
      counters.set(name, (counters.get(name) ?? 0) + 1);
    }
  }

  return Array.from(counters.entries())
    .map(([name, mentionCount]) => ({ name, mentionCount }))
    .sort((a, b) => b.mentionCount - a.mentionCount);
}

// ------------------------------------------------------------------
// What AI knows about you — derived from evidence in the responses
// (queries where you were found, plus profile snapshot basics).
// ------------------------------------------------------------------

function buildWhatAiKnows(audit: AuditWithQueries): string[] {
  const snapshot = audit.profile_snapshot;
  const facts: string[] = [];

  if (snapshot.name) facts.push(`Identified by name ("${snapshot.name}").`);
  if (snapshot.profession) facts.push(`Described as a ${snapshot.profession}.`);
  if (snapshot.specialization) facts.push(`Specialization: ${snapshot.specialization}.`);
  if (snapshot.location) facts.push(`Associated with location: ${snapshot.location}.`);
  if (snapshot.services) facts.push(`Offers: ${snapshot.services}.`);
  if (snapshot.links && snapshot.links.length > 0) {
    facts.push(`Public links exist: ${snapshot.links.map((l) => l.url).join(', ')}.`);
  }

  const foundQueries = audit.queries.filter(
    (q) => q.visibility_status === 'recommended' || q.visibility_status === 'mentioned'
  );
  if (foundQueries.length > 0) {
    facts.push(
      `Appeared in ${foundQueries.length} high-intent query result(s) captured by the provider.`
    );
  }

  return facts;
}

// ------------------------------------------------------------------
// Missing information — which profile fields were empty/absent at audit
// time (a potential visibility gap).
// ------------------------------------------------------------------

function buildMissingInformation(snapshot: ProfileSnapshot): MissingInfo[] {
  const items: MissingInfo[] = [];

  const add = (id: string, label: string, present: boolean, suggestion: string) => {
    items.push({ id, label, present, suggestion });
  };

  add('name', 'Full name / brand', Boolean(snapshot.name?.trim()), 'Add your professional name to your profile so AI can identify you.');
  add('profession', 'Profession / title', Boolean(snapshot.profession?.trim()), 'State your profession clearly (e.g. "Senior React Developer").');
  add('specialization', 'Specialization', Boolean(snapshot.specialization?.trim()), 'Describe your specific niche — this may make your specialization less clear if missing.');
  add('services', 'Services offered', Boolean(snapshot.services?.trim()), 'List concrete services so AI responses can pair you with client needs.');
  add('target_clients', 'Target clients', Boolean(snapshot.target_clients?.trim()), 'Describe who you help — this may make your fit for a query less clear if missing.');
  add('location', 'Location', Boolean(snapshot.location?.trim()), 'Add your location so local discovery queries can surface you.');
  add('links', 'Public links', Boolean(snapshot.links && snapshot.links.length > 0), 'Add website/portfolio/LinkedIn links so AI can cite verifiable sources.');

  return items;
}

// ------------------------------------------------------------------
// Recommended actions — priorities from the derived analysis.
// ------------------------------------------------------------------

function buildRecommendedActions(audit: AuditWithQueries): RecommendedAction[] {
  const actions: RecommendedAction[] = [];
  const snapshot = audit.profile_snapshot;

  const add = (
    id: string,
    priority: Priority,
    title: string,
    explanation: string,
    improvementArea: string
  ) => actions.push({ id, priority, title, explanation, improvementArea });

  const noRecommendations = !audit.queries.some((q) => q.visibility_status === 'recommended');
  if (noRecommendations) {
    add(
      'rec-none',
      'High',
      'Build up recommendation-level visibility',
      'You were not returned as a top recommendation for any high-intent query. Strengthen sites and profiles that AI engines draw from.',
      'Recommendation visibility'
    );
  }

  if (!snapshot.specialization?.trim()) {
    add(
      'rec-niche',
      'High',
      'Clarify your specialization',
      'Your specialization is empty. This may make your specialization less clear to AI engines when matching client queries.',
      'Professional presence'
    );
  }

  if (!snapshot.services?.trim()) {
    add(
      'rec-services',
      'Medium',
      'List your services',
      'Adding concrete services helps AI pair you with specific client needs.',
      'Professional presence'
    );
  }

  if (!snapshot.links || snapshot.links.length === 0) {
    add(
      'rec-links',
      'Medium',
      'Add verifiable public links',
      'No portfolio, website, or LinkedIn links were captured. Verifiable sources help AI cite you.',
      'Professional presence'
    );
  }

  const highNotFound = audit.queries.filter(
    (q) => q.visibility_status === 'not_found' || q.visibility_status === 'mentioned'
  ).length;
  if (highNotFound >= audit.queries.length * 0.5) {
    add(
      'rec-gaps',
      'Medium',
      'Improve coverage across high-intent queries',
      `You were not strongly present in ${highNotFound} of ${audit.queries.length} tested queries. Consider which gaps matter most to clients.`,
      'Query coverage'
    );
  }

  if (audit.queries.some((q) => q.visibility_status === 'could_not_check')) {
    add(
      'rec-recheck',
      'Low',
      'Re-run the audit to confirm results',
      'Some queries could not be checked (provider/API issue). Re-auditing may give a fuller picture.',
      'Data quality'
    );
  }

  return actions;
}

// ------------------------------------------------------------------
// Gaps — potential visibility gaps, phrased as possibilities (we never
// claim to know why an external system made a decision).
// ------------------------------------------------------------------

function buildGaps(audit: AuditWithQueries): ReportGap[] {
  const gaps: ReportGap[] = [];
  const snapshot = audit.profile_snapshot;

  const add = (id: string, priority: Priority, area: string, title: string, description: string) =>
    gaps.push({ id, title, description, area, priority });

  const notFoundCount = audit.queries.filter((q) => q.visibility_status === 'not_found').length;
  if (notFoundCount > 0) {
    add(
      'gap-found',
      notFoundCount >= audit.queries.length * 0.5 ? 'High' : 'Medium',
      'AI visibility',
      'Potential visibility gap: not appearing in some queries',
      `You were not found in ${notFoundCount} of ${audit.queries.length} tested queries. This may reflect limited indexed presence in those subject areas.`
    );
  }

  const mentionOnly = audit.queries.filter((q) => q.visibility_status === 'mentioned').length;
  if (mentionOnly > 0) {
    add(
      'gap-mention',
      'Medium',
      'Recommendation strength',
      'Potential visibility gap: mentioned but not recommended',
      `You were mentioned (not top-ranked) in ${mentionOnly} query result(s). This may make your specialization less clear than competitors who are recommended.`
    );
  }

  if (!snapshot.specialization?.trim()) {
    add(
      'gap-niche',
      'High',
      'Professional presence',
      'Potential visibility gap: specialization not set',
      'Without a specialization, AI engines have less to match you to specific high-intent queries. This may make your specialization less clear.'
    );
  }

  if (!snapshot.links || snapshot.links.length === 0) {
    add(
      'gap-links',
      'Medium',
      'Professional presence',
      'Potential visibility gap: no public links captured',
      'No verifiable portfolio, website, or LinkedIn links were present at audit time. This may make it harder for AI to cite you.'
    );
  }

  return gaps;
}

// ------------------------------------------------------------------
// Main entry point — build the full report from stored audit data.
// ------------------------------------------------------------------

export function buildReport(audit: AuditWithQueries): VisibilityReport {
  const queries = audit.queries;
  const counts = {
    total: queries.length,
    recommended: queries.filter((q) => q.visibility_status === 'recommended').length,
    mentioned: queries.filter((q) => q.visibility_status === 'mentioned').length,
    notFound: queries.filter((q) => q.visibility_status === 'not_found').length,
    couldNotCheck: queries.filter((q) => q.visibility_status === 'could_not_check').length,
  };

  return {
    auditId: audit.id,
    createdAt: audit.created_at,
    profile: audit.profile_snapshot,
    score: computeScore(audit),
    queryResults: buildQueryRows(audit),
    counts,
    aiRecommended: buildAiRecommended(audit),
    whatAiKnowsAboutYou: buildWhatAiKnows(audit),
    gaps: buildGaps(audit),
    missingInformation: buildMissingInformation(audit.profile_snapshot),
    recommendedActions: buildRecommendedActions(audit),
  };
}

export type { Priority, VisibilityStatus };