'use client';

import React, { useActionState, useRef, useState } from 'react';
import {
  User, Briefcase, MapPin, Target, Wrench, Users,
  Globe, Link2, Palette, Save, Trash2,
} from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { Card } from '../ui/Card';
import { upsertProfile, deleteProfile } from '@/lib/supabase/profile-actions';
import type { ProfileWithLinks } from '@/lib/supabase/types';
import { useRouter } from 'next/navigation';

interface ProfileFormProps {
  profile: ProfileWithLinks | null;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ profile }) => {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(upsertProfile, {});
  const [deleteState, deleteAction, deletePending] = useActionState(deleteProfile, {});
  const formRef = useRef<HTMLFormElement>(null);
  const [dismissed, setDismissed] = useState(false);

  const fe = state.fieldErrors ?? {};
  const showSuccess = state.success && !dismissed;
  const links = profile?.links ?? [];
  const getLink = (type: string) => links.find((l) => l.type === type)?.url ?? '';

  return (
    <div className="space-y-6">
      {showSuccess && (
        <Alert type="success" title="Saved" onClose={() => setDismissed(true)}>
          {state.success}
        </Alert>
      )}

      {deleteState.success && (
        <Alert type="success" title="Deleted">{deleteState.success}</Alert>
      )}

      {state.error && !state.fieldErrors && (
        <Alert type="error">{state.error}</Alert>
      )}

      {deleteState.error && (
        <Alert type="error">{deleteState.error}</Alert>
      )}

      <form ref={formRef} action={formAction} className="space-y-8">
        {/* ---- Basic Info ---- */}
        <Card borderVariant="wine" className="space-y-5">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
            <User className="w-4 h-4 text-rose-700" />
            Basic Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="profile-name"
              label="Full Name"
              name="name"
              defaultValue={profile?.name}
              placeholder="Ada Lovelace"
              icon={<User className="w-4 h-4" />}
              error={fe.name}
              required
            />
            <Input
              id="profile-profession"
              label="Profession"
              name="profession"
              defaultValue={profile?.profession}
              placeholder="Frontend Developer"
              icon={<Briefcase className="w-4 h-4" />}
              error={fe.profession}
              required
            />
            <Input
              id="profile-location"
              label="Location"
              name="location"
              defaultValue={profile?.location}
              placeholder="San Francisco, CA"
              icon={<MapPin className="w-4 h-4" />}
              error={fe.location}
              required
            />
            <Input
              id="profile-specialization"
              label="Specialization"
              name="specialization"
              defaultValue={profile?.specialization}
              placeholder="React & Next.js"
              icon={<Target className="w-4 h-4" />}
              error={fe.specialization}
              required
            />
          </div>

          <Input
            id="profile-services"
            label="Services"
            name="services"
            defaultValue={profile?.services}
            placeholder="Web development, UI/UX consulting, code audits"
            icon={<Wrench className="w-4 h-4" />}
            error={fe.services}
            required
          />

          <Input
            id="profile-target-clients"
            label="Target Clients"
            name="target_clients"
            defaultValue={profile?.target_clients}
            placeholder="SaaS startups, e-commerce brands, agencies"
            icon={<Users className="w-4 h-4" />}
            error={fe.target_clients}
            required
          />
        </Card>

        {/* ---- Professional Links ---- */}
        <Card borderVariant="wine" className="space-y-5">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
            <Globe className="w-4 h-4 text-rose-700" />
            Professional Links
            <span className="text-[10px] font-normal text-slate-400 ml-1">Optional</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              id="profile-website"
              label="Website"
              name="website"
              type="url"
              defaultValue={getLink('website')}
              placeholder="https://yoursite.com"
              icon={<Globe className="w-4 h-4" />}
              error={fe.website}
            />
            <Input
              id="profile-linkedin"
              label="LinkedIn"
              name="linkedin"
              type="url"
              defaultValue={getLink('linkedin')}
              placeholder="https://linkedin.com/in/you"
              icon={<Link2 className="w-4 h-4" />}
              error={fe.linkedin}
            />
            <Input
              id="profile-portfolio"
              label="Portfolio"
              name="portfolio"
              type="url"
              defaultValue={getLink('portfolio')}
              placeholder="https://portfolio.dev/you"
              icon={<Palette className="w-4 h-4" />}
              error={fe.portfolio}
            />
          </div>
        </Card>

        {/* ---- Actions ---- */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div>
            {profile && (
              <form action={deleteAction}>
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  disabled={deletePending}
                  icon={<Trash2 className="w-4 h-4 text-rose-500" />}
                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                >
                  {deletePending ? 'Deleting…' : 'Delete Profile'}
                </Button>
              </form>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => router.push('/dashboard')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="glow"
              size="md"
              disabled={isPending}
              icon={isPending ? undefined : <Save className="w-4 h-4" />}
            >
              {isPending ? 'Saving…' : 'Save Profile'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};