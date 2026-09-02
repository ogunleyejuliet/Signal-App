'use server';

import { getCurrentUser } from '../supabase/session';
import { getAudit, getAudits } from '../supabase/audit-actions';
import { buildReport } from './generate-report';
import { computeScore } from './scoring';
import type { VisibilityReport } from './types';
import type { AuditWithQueries } from '../supabase/types';

// ------------------------------------------------------------------
// Load a single audit and build its report.
// Returns an object so the page can distinguish "not found/empty"
// from "error".
// ------------------------------------------------------------------

export interface ReportLoadResult {
  report: VisibilityReport | null;
  error: string | null;
  notFound: boolean;
}

// If auditId is provided, load that exact audit; otherwise load the user's
// most recent completed audit.
export async function loadReport(auditId?: string): Promise<ReportLoadResult> {
  const user = await getCurrentUser();
  if (!user) return { report: null, error: 'You must be signed in.', notFound: false };

  let audit: AuditWithQueries | null = null;

  try {
    if (auditId) {
      audit = await getAudit(auditId);
    } else {
      audit = await getLatestCompletedAudit();
    }
  } catch (err) {
    return {
      report: null,
      error: `Could not load the audit: ${err instanceof Error ? err.message : 'unknown error'}`,
      notFound: false,
    };
  }

  if (!audit) {
    return { report: null, error: null, notFound: true };
  }

  if (audit.status !== 'completed') {
    return {
      report: null,
      error:
        audit.status === 'failed'
          ? 'This audit failed and has no report.'
          : 'This audit is still processing. A report is available once it completes.',
      notFound: false,
    };
  }

  const report = buildReport(audit);
  return { report, error: null, notFound: false };
}

// ------------------------------------------------------------------
// Load the most recent completed audit for the current user.
// ------------------------------------------------------------------

async function getLatestCompletedAudit(): Promise<AuditWithQueries | null> {
  const audits = await getAudits();
  const completed = audits.find((a) => a.status === 'completed');
  if (!completed) return null;
  return getAudit(completed.id);
}

// ------------------------------------------------------------------
// History: list completed audits with their computed scores.
// ------------------------------------------------------------------

export interface HistoryRow {
  id: string;
  createdAt: string;
  status: string;
  score: number | null;
}

export async function loadHistory(): Promise<{ rows: HistoryRow[]; error: string | null }> {
  const user = await getCurrentUser();
  if (!user) return { rows: [], error: null };

  try {
    const audits = await getAudits();
    const completedWithScore: HistoryRow[] = [];

    for (const audit of audits) {
      let score: number | null = null;
      if (audit.status === 'completed') {
        const full = await getAudit(audit.id);
        if (full) score = computeScore(full).overall;
      }
      completedWithScore.push({
        id: audit.id,
        createdAt: audit.created_at,
        status: audit.status,
        score,
      });
    }

    return { rows: completedWithScore, error: null };
  } catch (err) {
    return {
      rows: [],
      error: `Could not load audit history: ${err instanceof Error ? err.message : 'unknown error'}`,
    };
  }
}

// ------------------------------------------------------------------
// Comparison: latest completed audit vs a chosen previous completed audit.
// ------------------------------------------------------------------

export interface ComparisonRow {
  label: string;
  previous: string | number | null;
  current: string | number | null;
  change?: number | null;
}

export interface ComparisonResult {
  previous: {
    id: string;
    createdAt: string;
    score: ScoreSummary;
  } | null;
  current: {
    id: string;
    createdAt: string;
    score: ScoreSummary;
  } | null;
  rows: ComparisonRow[];
  error: string | null;
}

interface ScoreSummary {
  overall: number;
  recommended: number;
  mentioned: number;
  notFound: number;
  couldNotCheck: number;
  coverage: number;
}

function toScoreSummary(audit: AuditWithQueries): ScoreSummary {
  const score = computeScore(audit);
  const q = audit.queries;
  return {
    overall: score.overall,
    recommended: q.filter((x) => x.visibility_status === 'recommended').length,
    mentioned: q.filter((x) => x.visibility_status === 'mentioned').length,
    notFound: q.filter((x) => x.visibility_status === 'not_found').length,
    couldNotCheck: q.filter((x) => x.visibility_status === 'could_not_check').length,
    coverage: score.queryCoverage,
  };
}

export async function loadComparison(auditId: string): Promise<ComparisonResult> {
  const user = await getCurrentUser();
  if (!user) return { previous: null, current: null, rows: [], error: 'You must be signed in.' };

  try {
    // The "current" is the selected audit (which is already completed).
    const current = await getAudit(auditId);
    if (!current) return { previous: null, current: null, rows: [], error: 'Audit not found.' };

    // Find the previous completed audit older than the current one.
    const audits = await getAudits();
    const previousAudit = audits
      .filter((a) => a.status === 'completed' && a.id !== auditId && a.created_at <= current.created_at)
      .sort((a, b) => (a.created_at > b.created_at ? -1 : 1))[0];

    const previous = previousAudit ? await getAudit(previousAudit.id) : null;

    const curS = toScoreSummary(current);
    const prevS = previous ? toScoreSummary(previous) : null;

    const rows: ComparisonRow[] = [
      { label: 'Overall score', previous: prevS?.overall ?? null, current: curS.overall },
      {
        label: 'Recommended queries',
        previous: prevS?.recommended ?? null,
        current: curS.recommended,
      },
      {
        label: 'Mentioned queries',
        previous: prevS?.mentioned ?? null,
        current: curS.mentioned,
      },
      {
        label: 'Not found queries',
        previous: prevS?.notFound ?? null,
        current: curS.notFound,
      },
      {
        label: 'Could not check',
        previous: prevS?.couldNotCheck ?? null,
        current: curS.couldNotCheck,
      },
      {
        label: 'Query coverage (%)',
        previous: prevS ? prevS.coverage : null,
        current: curS.coverage,
      },
    ];

    return {
      previous: previous
        ? { id: previous.id, createdAt: previous.created_at, score: prevS! }
        : null,
      current: { id: current.id, createdAt: current.created_at, score: curS },
      rows,
      error: null,
    };
  } catch (err) {
    return {
      previous: null,
      current: null,
      rows: [],
      error: `Could not build comparison: ${err instanceof Error ? err.message : 'unknown error'}`,
    };
  }
}