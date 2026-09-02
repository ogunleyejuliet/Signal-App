import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/session';
import { getProfile } from '@/lib/supabase/profile-actions';
import { isSupabaseConfigured } from '@/lib/supabase/server';
import { loadReport } from '@/lib/report/report-actions';
import { ReportShell } from '@/components/shells/ReportShell';
import { ConfigNotice } from '@/components/ui/ConfigNotice';

export const metadata: Metadata = {
  title: 'Audit Report | Signal AI',
  description: 'Your detailed AI discoverability audit report.',
};

export default async function ReportPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const { id } = await searchParams;
  const profile = await getProfile();
  const supabaseConfigured = isSupabaseConfigured();
  const result = await loadReport(id);

  return (
    <>
      <ConfigNotice enabled={supabaseConfigured} />
      <ReportShell
        profile={profile}
        report={result.report}
        error={result.error}
        notFound={result.notFound}
      />
    </>
  );
}