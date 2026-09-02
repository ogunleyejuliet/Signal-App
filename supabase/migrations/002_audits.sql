-- Phase 4: Audit Creation & Query Generation
-- Run this in your Supabase SQL Editor after 001_profiles.sql

-- 1. Audits table — one row per audit run
CREATE TABLE IF NOT EXISTS audits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  profile_snapshot JSONB NOT NULL,
  queries_count INT NOT NULL DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Audit queries — generated queries linked to an audit
CREATE TABLE IF NOT EXISTS audit_queries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  audit_id UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
  query_text TEXT NOT NULL,
  query_type TEXT NOT NULL
    CHECK (query_type IN ('local_discovery', 'specialization', 'service', 'hiring_intent')),
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_audits_user ON audits(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_queries_audit ON audit_queries(audit_id);

-- 4. Row Level Security (service-role only, same pattern as Phase 3)
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_queries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON audits FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON audit_queries FOR ALL USING (true) WITH CHECK (true);

-- 5. Auto-update updated_at on audits
CREATE OR REPLACE FUNCTION update_audits_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS audits_updated_at ON audits;
CREATE TRIGGER audits_updated_at
  BEFORE UPDATE ON audits
  FOR EACH ROW
  EXECUTE FUNCTION update_audits_updated_at();