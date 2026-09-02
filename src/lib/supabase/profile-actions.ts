'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from './server';
import { getCurrentUser } from './session';
import type { Profile, ProfileLink, ProfileWithLinks } from './types';

// ------------------------------------------------------------------
// Validation helpers
// ------------------------------------------------------------------

const URL_PATTERN = /^https?:\/\/.+\..+/;

function validateUrl(url: string): boolean {
  if (!url) return true; // empty = optional
  return URL_PATTERN.test(url);
}

export interface ProfileFormState {
  success?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
}

// ------------------------------------------------------------------
// Get profile (returns null when none exists yet)
// ------------------------------------------------------------------

export async function getProfile(): Promise<ProfileWithLinks | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const db = createClient();

  const { data: profile, error: profileError } = await db
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (profileError || !profile) return null;

  const { data: links } = await db
    .from('profile_links')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true });

  return { ...profile, links: links ?? [] };
}

// ------------------------------------------------------------------
// Upsert profile + links
// ------------------------------------------------------------------

export async function upsertProfile(
  _state: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: 'You must be signed in to save your profile.' };
  }

  const name = String(formData.get('name') ?? '').trim();
  const profession = String(formData.get('profession') ?? '').trim();
  const location = String(formData.get('location') ?? '').trim();
  const specialization = String(formData.get('specialization') ?? '').trim();
  const services = String(formData.get('services') ?? '').trim();
  const targetClients = String(formData.get('target_clients') ?? '').trim();

  const website = String(formData.get('website') ?? '').trim();
  const linkedin = String(formData.get('linkedin') ?? '').trim();
  const portfolio = String(formData.get('portfolio') ?? '').trim();

  // --- field validation ---
  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = 'Name is required.';
  if (!profession) fieldErrors.profession = 'Profession is required.';
  if (!location) fieldErrors.location = 'Location is required.';
  if (!specialization) fieldErrors.specialization = 'Specialization is required.';
  if (!services) fieldErrors.services = 'Services are required.';
  if (!targetClients) fieldErrors.target_clients = 'Target clients is required.';

  if (website && !validateUrl(website)) fieldErrors.website = 'Enter a valid URL starting with https://';
  if (linkedin && !validateUrl(linkedin)) fieldErrors.linkedin = 'Enter a valid URL starting with https://';
  if (portfolio && !validateUrl(portfolio)) fieldErrors.portfolio = 'Enter a valid URL starting with https://';

  if (Object.keys(fieldErrors).length > 0) {
    return { error: 'Please fix the errors below.', fieldErrors };
  }

  const db = createClient();

  // Upsert profile
  const { error: upsertError } = await db
    .from('profiles')
    .upsert(
      {
        user_id: user.id,
        name,
        profession,
        location,
        specialization,
        services,
        target_clients: targetClients,
      },
      { onConflict: 'user_id' }
    );

  if (upsertError) {
    return { error: `Failed to save profile: ${upsertError.message}` };
  }

  // Replace links: delete existing, then insert new ones
  await db.from('profile_links').delete().eq('user_id', user.id);

  const linkRows: { user_id: string; type: string; url: string }[] = [];
  if (website) linkRows.push({ user_id: user.id, type: 'website', url: website });
  if (linkedin) linkRows.push({ user_id: user.id, type: 'linkedin', url: linkedin });
  if (portfolio) linkRows.push({ user_id: user.id, type: 'portfolio', url: portfolio });

  if (linkRows.length > 0) {
    const { error: linksError } = await db.from('profile_links').insert(linkRows);
    if (linksError) {
      return { error: `Profile saved but links failed: ${linksError.message}` };
    }
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/profile');
  return { success: 'Profile saved successfully.' };
}

// ------------------------------------------------------------------
// Delete profile
// ------------------------------------------------------------------

export async function deleteProfile(): Promise<ProfileFormState> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: 'You must be signed in.' };
  }

  const db = createClient();

  await db.from('profile_links').delete().eq('user_id', user.id);
  const { error } = await db.from('profiles').delete().eq('user_id', user.id);

  if (error) {
    return { error: `Failed to delete profile: ${error.message}` };
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/profile');
  return { success: 'Profile deleted.' };
}