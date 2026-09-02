// Re-export everything from tokens.ts (no next/headers dependency).
export {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  type LocalUser,
  type SessionUser,
  hashPassword,
  verifyPassword,
  getUserByEmail,
  createUser,
  verifyUser,
  createSessionToken,
  getUserFromToken,
  destroySessionToken,
} from './tokens';

// ------------------------------------------------------------------
// Cookie helpers — these use next/headers (server context only).
// Do NOT import this module in proxy.ts.
// ------------------------------------------------------------------

import { cookies } from 'next/headers';
import { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from './tokens';

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value ?? null;
}