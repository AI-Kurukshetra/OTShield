'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { ArrowRight, KeyRound, ShieldCheck } from 'lucide-react';
import { CyberCard } from '@/src/components/UI';
import { PrimaryButton } from '@/src/components/common/Button';
import { AuthToastStack } from '@/src/components/AuthToast';
import { getSupabase } from '@/src/lib/supabase/client';
import { isSupabaseConfigured } from '@/src/lib/supabase/config';

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const authEnabled = isSupabaseConfigured();

  const clearToast = React.useCallback(() => {
    setError(null);
    setSuccessMessage(null);
  }, []);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const msg = params.get('message');
    if (msg) setSuccessMessage(msg);
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

    if (!password) {
      setError('Password is required.');
      return;
    }

    if (!authEnabled) {
      router.replace('/dashboard');
      return;
    }

    const supabase = getSupabase();
    if (!supabase) {
      setError('Supabase is not configured for authentication in this environment.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    setIsSubmitting(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.replace('/dashboard');
    router.refresh();
  };

  return (
    <CyberCard className="mx-auto w-full max-w-md border-brand-border/40 bg-brand-card/80" contentClassName="space-y-6 p-8">
      <div>
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-brand-primary/30 bg-brand-primary/10 p-3 text-brand-primary">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-brand-primary">
              Secure Sign In
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-zinc-50">
              Access OTShield
            </h2>
          </div>
        </div>
        <p className="mt-4 text-sm leading-7 text-zinc-400">
          Continue to the OT operations workspace and resume the persisted demo environment.
        </p>
      </div>

      {!authEnabled && (
        <div className="rounded-2xl border border-brand-primary/20 bg-brand-primary/10 p-4 text-sm text-zinc-200">
          Supabase auth is not configured. Demo mode is currently open, so you can continue
          directly to the dashboard.
        </div>
      )}

      <AuthToastStack
        message={error ?? successMessage ?? ''}
        variant={error ? 'error' : 'success'}
        onDismiss={clearToast}
      />

      <form onSubmit={handleSubmit} className="space-y-4" noValidate autoComplete="off">
        <input type="text" name="username" autoComplete="username" className="hidden" tabIndex={-1} />
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          className="hidden"
          tabIndex={-1}
        />
        <label className="block space-y-2">
          <span className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500">
            Email
          </span>
          <input
            type="email"
            name="otshield_login_email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (error) setError(null);
            }}
            placeholder="analyst@plant01.com"
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
            name="otshield_login_password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              if (error) {
                setError(null);
              }
            }}
            placeholder="Enter your password"
            autoComplete="new-password"
            data-lpignore="true"
            data-1p-ignore="true"
            data-form-type="other"
            className="w-full rounded-2xl border border-brand-border/50 bg-white/[0.04] px-4 py-3 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-brand-primary/40"
          />
        </label>

        <PrimaryButton type="submit" icon={authEnabled ? KeyRound : ArrowRight} className="w-full justify-center" disabled={isSubmitting}>
          {isSubmitting ? 'Signing In...' : authEnabled ? 'Sign In' : 'Enter Demo Workspace'}
        </PrimaryButton>
      </form>

      <p className="text-center text-xs text-zinc-500">
        Need an operator account?{' '}
        <Link href="/signup" className="font-bold text-brand-primary transition-colors hover:text-zinc-100">
          Create one
        </Link>
      </p>
    </CyberCard>
  );
}
