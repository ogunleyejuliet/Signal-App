'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from './server';
import { getCurrentUser } from './session';
import { generateQueries } from '../llm/generate-queries';
import type {
  Audit,
  AuditQuery,
  AuditWithQueries,
  AuditStatus,
  ProfileSnapshot,
} from './types';

// ------------------------------------------------------------------
// Build a frozen snapshot from the live profile
// ------------------------------------------------------------------

function buildSnapshot(profile: {
  name: string;
  profession: string;
  location: string;
  specialization: string;
  services: string;
  target_clients: string;
  links?: { type: string; url: string }[];
}): ProfileSnapshot {
  return {
    name: profile.name,
    profession: profile.profession,
    location: profile.location,
    specialization: profile.specialization,
    services: profile.services,
    target_clients: profile.target_clients,
    links: (profile.links ?? []).map((l) => ({ type: l.type, url: l.url })),
  };
}

// ------------------------------------------------------------------
// Create audit — the full lifecycle
// ------------------------------------------------------------------

export interface CreateAuditResult {
  audit?: AuditWithQueries;
  error?: string;
}

export async function createAudit(): Promise<CreateAuditResult> {
  const user = await getCurrentUser();
  if (!user) return { error: 'You must be signed in.' };

  const db = createClient();

  // 1. Fetch live profile
  const { data: profile, error: profileError } = await db
    .from('profiles')
    .select('*, profile_links(type, url)')
    .eq('user_id', user.id)
    .single();

  if (profileError || !profile) {
    return { error: 'Create a profile before running an audit.' };
  }

  // 2. Build snapshot and insert audit (status = pending)
  const snapshot = buildSnapshot(profile);

  const { data: audit, error: auditError } = await db
    .from('audits')
    .insert({
      user_id: user.id,
      status: 'pending',
      profile_snapshot: snapshot,
    })
    .select()
    .single();

  if (auditError || !audit) {
    return { error: `Failed to create audit: ${auditError?.message}` };
  }

  // 3. Move to processing
  await db
    .from('audits')
    .update({ status: 'processing' })
    .eq('id', audit.id);

  revalidatePath('/dashboard');

  // 4. Generate queries via LLM
  try {
    const generated = await generateQueries(snapshot);

    // 5. Store queries
    const queryRows = generated.map((q) => ({
      audit_id: audit.id,
      query_text: q.query_text,
      query_type: q.query_type,
      category: q.category,
    }));

    const { error: queriesError } = await db
      .from('audit_queries')
      .insert(queryRows);

    if (queriesError) {
      throw new Error(`Failed to store queries: ${queriesError.message}`);
    }

    // 6. Mark completed
    await db
      .from('audits')
      .update({ status: 'completed', queries_count: generated.length })
      .eq('id', audit.id);

    revalidatePath('/dashboard');

    // 7. Fetch the full audit with queries
    const full = await getAudit(audit.id);
    return { audit: full! };
  } catch (err) {
    // Mark failed
    const message = err instanceof Error ? err.message : 'Unknown error';
    await db
      .from('audits')
      .update({ status: 'failed', error_message: message })
      .eq('id', audit.id);

    revalidatePath('/dashboard');
    return { error: `Audit failed: ${message}` };
  }
}

// ------------------------------------------------------------------
// Get a single audit with its queries
// ------------------------------------------------------------------

export async function getAudit(auditId: string): Promise<AuditWithQueries | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const db = createClient();

  const { data: audit } = await db
    .from('audits')
    .select('*')
    .eq('id', auditId)
    .eq('user_id', user.id)
    .single();

  if (!audit) return null;

  const { data: queries } = await db
    .from('audit_queries')
    .select('*')
    .eq('audit_id', auditId)
    .order('created_at', { ascending: true });

  return { ...audit, queries: queries ?? [] };
}

// ------------------------------------------------------------------
// List audits for the current user (most recent first)
// ------------------------------------------------------------------

export async function getAudits(): Promise<Audit[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const db = createClient();

  const { data } = await db
    .from('audits')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return data ?? [];
}

// ------------------------------------------------------------------
// Get the most recent audit (for dashboard display)
// ------------------------------------------------------------------

export async function getLatestAudit(): Promise<AuditWithQueries | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const db = createClient();

  const { data: audit } = await db
    .from('audits')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!audit) return null;

  const { data: queries } = await db
    .from('audit_queries')
    .select('*')
    .eq('audit_id', audit.id)
    .order('created_at', { ascending: true });

  return { ...audit, queries: queries ?? [] };
}