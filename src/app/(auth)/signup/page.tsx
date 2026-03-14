'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { ArrowRight, UserPlus } from 'lucide-react';
import { CyberCard } from '@/src/components/UI';
import { PrimaryButton } from '@/src/components/common/Button';
import { AuthToastStack } from '@/src/components/AuthToast';
import { getSupabase } from '@/src/lib/supabase/client';
import { isSupabaseConfigured } from '@/src/lib/supabase/config';

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const authEnabled = isSupabaseConfigured();

  const clearToast = React.useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError('Email is required.');
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      setError('Enter a valid email address.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (!authEnabled) {
      router.replace('/dashboard');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const supabase = getSupabase();
    if (!supabase) {
      setError('Supabase is not configured for authentication in this environment.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
    });

    setIsSubmitting(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (data.session) {
      router.replace('/dashboard');
      router.refresh();
      return;
    }

    setSuccess('Account created. Check your email to confirm access, then sign in.');
    router.replace('/login?message=Account%20created.%20Check%20your%20email%20to%20confirm%20access.');
  };

  return (
    <CyberCard className="mx-auto w-full max-w-md border-brand-border/40 bg-brand-card/80" contentClassName="space-y-6 p-8">
      <div>
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-brand-primary/30 bg-brand-primary/10 p-3 text-brand-primary">
            <UserPlus className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-brand-primary">
              Operator Onboarding
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-zinc-50">
              Create Access
            </h2>
          </div>
        </div>
        <p className="mt-4 text-sm leading-7 text-zinc-400">
          Provision an account for the OTShield workspace with persisted assets, alerts, and export activity.
        </p>
      </div>

      {!authEnabled && (
        <div className="rounded-2xl border border-brand-primary/20 bg-brand-primary/10 p-4 text-sm text-zinc-200">
          Supabase auth is not configured. Demo mode is open, so no sign-up is required.
        </div>
      )}

      <AuthToastStack
        message={error ?? success ?? ''}
        variant={error ? 'error' : 'success'}
        onDismiss={clearToast}
      />

      <form onSubmit={handleSubmit} className="space-y-4" noValidate autoComplete="off">
        <input type="text" name="username" autoComplete="username" className="hidden" tabIndex={-1} />
        <input
          type="password"
          name="password"
          autoComplete="new-password"
          className="hidden"
          tabIndex={-1}
        />
        <label className="block space-y-2">
          <span className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500">
            Email
          </span>
          <input
            type="email"
            name="otshield_signup_email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (error) setError(null);
            }}
            placeholder="operator@plant01.com"
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            className="w-full rounded-2xl border border-brand-border/50 bg-white/[0.04] px-4 py-3 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-brand-primary/40"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500">
            Password
          </span>
          <input
            type="password"
            name="otshield_signup_password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              if (error) {
                setError(null);
              }
            }}
            placeholder="Use at least 8 characters"
            autoComplete="new-password"
            data-lpignore="true"
            data-1p-ignore="true"
            data-form-type="other"
            className="w-full rounded-2xl border border-brand-border/50 bg-white/[0.04] px-4 py-3 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-brand-primary/40"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500">
            Confirm Password
          </span>
          <input
            type="password"
            name="otshield_signup_confirm_password"
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(event.target.value);
              if (error) {
                setError(null);
              }
            }}
            placeholder="Re-enter your password"
            autoComplete="new-password"
            data-lpignore="true"
            data-1p-ignore="true"
            data-form-type="other"
            className="w-full rounded-2xl border border-brand-border/50 bg-white/[0.04] px-4 py-3 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-brand-primary/40"
          />
        </label>

        <PrimaryButton type="submit" icon={authEnabled ? UserPlus : ArrowRight} className="w-full justify-center" disabled={isSubmitting}>
          {isSubmitting ? 'Creating Account...' : authEnabled ? 'Create Account' : 'Enter Demo Workspace'}
        </PrimaryButton>
      </form>

      <p className="text-center text-xs text-zinc-500">
        Already have access?{' '}
        <Link href="/login" className="font-bold text-brand-primary transition-colors hover:text-zinc-100">
          Sign in
        </Link>
      </p>
    </CyberCard>
  );
}
