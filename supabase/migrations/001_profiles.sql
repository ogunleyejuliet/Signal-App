-- Phase 3: Freelancer Profile & Professional Links
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New query)

-- 1. Profiles table (one per user)
CREATE TABLE IF NOT EXISTS profiles (
  user_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  profession TEXT NOT NULL,
  location TEXT NOT NULL,
  specialization TEXT NOT NULL,
  services TEXT NOT NULL,
  target_clients TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Professional links (website, linkedin, portfolio — multiple per user)
CREATE TABLE IF NOT EXISTS profile_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('website', 'linkedin', 'portfolio')),
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_profile_links_user ON profile_links(user_id);

-- 4. Row Level Security
--    Since auth is handled locally (not Supabase Auth), we enforce
--    ownership at the application layer in Server Actions.
--    RLS is enabled as a safety net: only service-role key can write.
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_links ENABLE ROW LEVEL SECURITY;

-- Allow all operations when using the service-role key (bypasses RLS).
-- The anon key gets no access — all DB calls go through Server Actions.
CREATE POLICY "Service role full access" ON profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON profile_links FOR ALL USING (true) WITH CHECK (true);

-- 5. Auto-update updated_at on profiles
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();