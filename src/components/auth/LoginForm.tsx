'use client';

import React, { useActionState } from 'react';
import Link from 'next/link';
import { Mail, Lock, LogIn } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Alert } from '../ui/Alert';
import { signIn } from '@/lib/supabase/actions';

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, isPending] = useActionState(signIn, {});

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Sign in to continue your discoverability audit.
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="next" value={next} />

        {state.error && (
          <Alert type="error" title="Sign in failed">
            {state.error}
          </Alert>
        )}
        {state.message && (
          <Alert type="success" title="Check your inbox">
            {state.message}
          </Alert>
        )}

        <Input
          id="login-email"
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          icon={<Mail className="w-4 h-4" />}
          required
        />

        <Input
          id="login-password"
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          icon={<Lock className="w-4 h-4" />}
          required
        />

        <Button
          type="submit"
          disabled={isPending}
          className="w-full"
          icon={isPending ? undefined : <LogIn className="w-4 h-4" />}
        >
          {isPending ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500">
        New to Signal?{' '}
        <Link href="/signup" className="font-semibold text-rose-900 hover:text-rose-800">
          Create an account
        </Link>
      </p>
    </div>
  );
}