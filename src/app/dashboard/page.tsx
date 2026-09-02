import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/session';
import { DashboardShell } from '@/components/shells/DashboardShell';

export const metadata: Metadata = {
  title: 'Dashboard | Signal AI',
  description: 'Your freelance discoverability dashboard.',
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  return <DashboardShell />;
}