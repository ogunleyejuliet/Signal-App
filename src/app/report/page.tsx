import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/session';
import { ReportShell } from '@/components/shells/ReportShell';

export const metadata: Metadata = {
  title: 'Audit Report | Signal AI',
  description: 'Your detailed discoverability audit report.',
};

export default async function ReportPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  return <ReportShell />;
}