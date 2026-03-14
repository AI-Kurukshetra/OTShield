'use client';

import React from 'react';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

const AUTH_TOAST_DURATION_MS = 5000;

export type AuthToastVariant = 'error' | 'success';

interface AuthToastProps {
  message: string;
  variant: AuthToastVariant;
  onDismiss: () => void;
  duration?: number;
}

export function AuthToast({ message, variant, onDismiss, duration = AUTH_TOAST_DURATION_MS }: AuthToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [onDismiss, duration]);

  const isError = variant === 'error';

  return (
    <motion.div
      initial={{ opacity: 0, x: 24, y: -8 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: 24, y: -10 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'pointer-events-auto relative overflow-hidden rounded-2xl border p-4 backdrop-blur-xl shadow-lg',
        isError
          ? 'border-brand-danger/40 bg-[linear-gradient(135deg,rgba(255,0,85,0.18),rgba(17,20,29,0.96)_42%,rgba(17,20,29,0.96))]'
          : 'border-brand-success/35 bg-[linear-gradient(135deg,rgba(0,255,148,0.14),rgba(17,20,29,0.96)_42%,rgba(17,20,29,0.96))]',
      )}
    >
      <div
        className={cn(
          'absolute inset-y-0 left-0 w-1.5',
          isError ? 'bg-brand-danger' : 'bg-brand-success shadow-[0_0_12px_rgba(0,255,148,0.6)]',
        )}
      />
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
            isError ? 'bg-brand-danger/20 text-brand-danger' : 'bg-brand-success/20 text-brand-success',
          )}
        >
          {isError ? <AlertTriangle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
        </div>
        <p className="flex-1 py-0.5 text-sm font-medium text-zinc-100">{message}</p>
        <button
          onClick={onDismiss}
          className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}

export function AuthToastStack({
  message,
  variant,
  onDismiss,
  duration,
}: AuthToastProps) {
  return (
    <div className="pointer-events-none fixed right-6 top-6 z-[100] flex w-full max-w-sm flex-col gap-3">
      <AnimatePresence mode="wait">
        {message ? (
          <AuthToast
            key={`${variant}-${message.slice(0, 40)}`}
            message={message}
            variant={variant}
            onDismiss={onDismiss}
            duration={duration}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
