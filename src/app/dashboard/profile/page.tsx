import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/session';
import { getProfile } from '@/lib/supabase/profile-actions';
import { ProfileForm } from '@/components/profile/ProfileForm';

export const metadata: Metadata = {
  title: 'Edit Profile | Signal AI',
  description: 'Manage your freelancer profile and professional links.',
};

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const profile = await getProfile();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {profile ? 'Edit Profile' : 'Create Your Profile'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Tell Signal AI about your professional background.
          </p>
        </div>

        <ProfileForm profile={profile} />
      </div>
    </div>
  );
}