-- Phase 5: AI Visibility Checking
-- Run this in your Supabase SQL Editor after 002_audits.sql

-- 1. Add result columns to audit_queries
ALTER TABLE audit_queries
  ADD COLUMN IF NOT EXISTS ai_response TEXT,
  ADD COLUMN IF NOT EXISTS provider TEXT,
  ADD COLUMN IF NOT EXISTS visibility_status TEXT
    CHECK (visibility_status IN ('recommended', 'mentioned', 'not_found', 'could_not_check')),
  ADD COLUMN IF NOT EXISTS position INT,
  ADD COLUMN IF NOT EXISTS other_professionals JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS checked_at TIMESTAMPTZ;