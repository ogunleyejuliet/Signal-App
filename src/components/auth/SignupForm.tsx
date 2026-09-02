'use client';

import React, { useActionState } from 'react';
import Link from 'next/link';
import { Mail, Lock, User, UserPlus } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Alert } from '../ui/Alert';
import { signUp } from '@/lib/supabase/actions';

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(signUp, {});

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Free for freelancers. See how AI rates your visibility.
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        {state.error && (
          <Alert type="error" title="Sign up failed">
            {state.error}
          </Alert>
        )}
        {state.message && (
          <Alert type="success" title="Almost there">
            {state.message}
          </Alert>
        )}

        <Input
          id="signup-name"
          label="Full name (optional)"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Ada Lovelace"
          icon={<User className="w-4 h-4" />}
        />

        <Input
          id="signup-email"
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          icon={<Mail className="w-4 h-4" />}
          required
        />

        <Input
          id="signup-password"
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 6 characters"
          icon={<Lock className="w-4 h-4" />}
          helperText="Use at least 6 characters."
          required
        />

        <Input
          id="signup-confirm-password"
          label="Confirm password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Repeat your password"
          icon={<Lock className="w-4 h-4" />}
          required
        />

        <Button
          type="submit"
          disabled={isPending}
          className="w-full"
          icon={isPending ? undefined : <UserPlus className="w-4 h-4" />}
        >
          {isPending ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-rose-900 hover:text-rose-800">
          Sign in
        </Link>
      </p>
    </div>
  );
}