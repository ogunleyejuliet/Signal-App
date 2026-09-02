'use client';

import React, { createContext, useContext, useMemo } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  emailVerified: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
}

const AuthContext = createContext<AuthContextValue>({ user: null });

export interface AuthProviderProps {
  user: AuthUser | null;
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ user, children }) => {
  const value = useMemo(() => ({ user }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}