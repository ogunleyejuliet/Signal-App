import { cache } from 'react';
import {
  getSessionTokenFromCookies,
  getUserFromToken,
  type SessionUser,
} from '../auth/local';

export type { SessionUser };

export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  try {
    const token = await getSessionTokenFromCookies();
    if (!token) return null;
    return getUserFromToken(token);
  } catch {
    return null;
  }
});

export const isAuthenticated = cache(async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return user !== null;
});