// Token store and user store — no next/headers dependency.
// Safe to import from proxy.ts (Node.js runtime).

import { createHash, randomBytes, randomUUID } from 'node:crypto';

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

export interface LocalUser {
  id: string;
  email: string;
  displayName: string;
  hashedPassword: string;
}

export interface SessionUser {
  id: string;
  email: string;
  displayName: string;
  emailVerified: boolean;
}

// ------------------------------------------------------------------
// In-memory stores (reset on server restart — intentional for MVP)
// ------------------------------------------------------------------

const users = new Map<string, LocalUser>();
const tokens = new Map<string, SessionUser>();

export const SESSION_COOKIE = 'signal_session';
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

// ------------------------------------------------------------------
// Password helpers (SHA-256 + salt, acceptable for local-only MVP)
// ------------------------------------------------------------------

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = createHash('sha256').update(`${salt}:${password}`).digest('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, expectedHash] = stored.split(':');
  if (!salt || !expectedHash) return false;
  const actualHash = createHash('sha256').update(`${salt}:${password}`).digest('hex');
  return actualHash === expectedHash;
}

// ------------------------------------------------------------------
// User operations
// ------------------------------------------------------------------

export function getUserByEmail(email: string): LocalUser | undefined {
  return users.get(email.toLowerCase().trim());
}

export function createUser(
  email: string,
  password: string,
  displayName?: string
): LocalUser {
  const normalised = email.toLowerCase().trim();
  if (users.has(normalised)) {
    throw new Error('A user with this email already exists.');
  }

  const user: LocalUser = {
    id: randomUUID(),
    email: normalised,
    displayName: displayName?.trim() || normalised.split('@')[0],
    hashedPassword: hashPassword(password),
  };

  users.set(normalised, user);
  return user;
}

export function verifyUser(email: string, password: string): LocalUser | null {
  const user = users.get(email.toLowerCase().trim());
  if (!user) return null;
  return verifyPassword(password, user.hashedPassword) ? user : null;
}

// ------------------------------------------------------------------
// Token / session operations
// ------------------------------------------------------------------

export function createSessionToken(user: LocalUser): string {
  const token = randomBytes(24).toString('hex');
  tokens.set(token, {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    emailVerified: true,
  });
  return token;
}

export function getUserFromToken(token: string): SessionUser | null {
  return tokens.get(token) ?? null;
}

export function destroySessionToken(token: string): void {
  tokens.delete(token);
}