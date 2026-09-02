'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  createUser,
  verifyUser,
  createSessionToken,
  destroySessionToken,
} from '../auth/tokens';
import {
  setSessionCookie,
  clearSessionCookie,
  getSessionTokenFromCookies,
} from '../auth/local';

export interface AuthFormState {
  error?: string;
  message?: string;
}

function parseNext(value: FormDataEntryValue | null): string {
  const next = typeof value === 'string' ? value.trim() : '';
  return next && next.startsWith('/') && !next.startsWith('//')
    ? next
    : '/dashboard';
}

// ------------------------------------------------------------------
// Sign in
// ------------------------------------------------------------------

export async function signIn(
  _state: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  const user = verifyUser(email, password);
  if (!user) {
    return { error: 'Invalid email or password.' };
  }

  const token = createSessionToken(user);
  await setSessionCookie(token);

  revalidatePath('/', 'layout');
  redirect(parseNext(formData.get('next')));
}

// ------------------------------------------------------------------
// Sign up
// ------------------------------------------------------------------

const MIN_PASSWORD_LENGTH = 6;

export async function signUp(
  _state: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get('email') ?? '').trim();
  const name = String(formData.get('name') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const confirmPassword = String(formData.get('confirmPassword') ?? '');

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`,
    };
  }

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match.' };
  }

  try {
    const user = createUser(email, password, name);
    const token = createSessionToken(user);
    await setSessionCookie(token);
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Could not create account.',
    };
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

// ------------------------------------------------------------------
// Sign out
// ------------------------------------------------------------------

export async function signOut(): Promise<void> {
  try {
    const token = await getSessionTokenFromCookies();
    if (token) {
      destroySessionToken(token);
    }
    await clearSessionCookie();
  } catch {
    // best-effort cleanup
  }

  revalidatePath('/', 'layout');
  redirect('/');
}