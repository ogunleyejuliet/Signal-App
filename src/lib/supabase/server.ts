import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js';

const PLACEHOLDER_PATTERN = /YOUR_|your_project_ref|placeholder|changeme/i;

/**
 * Returns true when the Supabase env vars are still placeholders (from the
 * template `.env.local`). In that case we avoid making network requests that
 * could hang the page while the user is testing without a real backend.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
  return Boolean(url && key && !PLACEHOLDER_PATTERN.test(`${url} ${key}`));
}

/**
 * Creates a Supabase client with a fetch wrapper that fails fast instead of
 * hanging when the backend is unreachable or configured with placeholder creds.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (!isSupabaseConfigured()) {
    // Return a client that fails immediately on every request rather than
    // attempting a network call to a placeholder host.
    return createFailingClient(url, key, 'Supabase is not configured. Set your real credentials in .env.local.');
  }

  return createSupabaseClient(url, key, {
    global: {
      fetch: async (input, init) => {
        const timeout = new AbortController();
        const timer = setTimeout(() => timeout.abort(), 10000);
        try {
          return await fetch(input, { ...init, signal: timeout.signal }).catch((err) => {
            throw new Error(`Supabase request failed: ${err.message}`);
          });
        } finally {
          clearTimeout(timer);
        }
      },
    },
  });
}

function createFailingClient(_url: string, _key: string, message: string): SupabaseClient {
  const failingFetch: typeof fetch = async () => {
    throw new Error(message);
  };

  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co', 'placeholder', {
    global: { fetch: failingFetch },
  });
}