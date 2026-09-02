import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/session';
import { getProfile } from '@/lib/supabase/profile-actions';
import { isSupabaseConfigured } from '@/lib/supabase/server';
import { HistoryShell } from '@/components/history/HistoryShell';
import { ConfigNotice } from '@/components/ui/ConfigNotice';

export const metadata: Metadata = {
  title: 'Audit History | Signal AI',
  description: 'Your past AI visibility audits and comparisons.',
};

export default async function HistoryPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const profile = await getProfile();
  const supabaseConfigured = isSupabaseConfigured();

  return (
    <>
      <ConfigNotice enabled={supabaseConfigured} />
      <HistoryShell profile={profile} />
    </>
  );
}