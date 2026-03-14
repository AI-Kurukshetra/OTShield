'use client';

import React from 'react';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { getSeverityStyles } from '@/src/lib/severity';
import { cn } from '@/src/lib/utils';
import { useSimulation } from '@/src/components/providers/SimulationProvider';

export const ToastStack = () => {
  const { toasts, dismissToast } = useSimulation();

  return (
    <div className="pointer-events-none fixed right-6 top-6 z-[90] flex w-full max-w-sm flex-col gap-3">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const styles = getSeverityStyles(toast.severity);
          const severityTone =
            toast.severity === 'Critical'
              ? 'border-brand-danger/40 bg-[linear-gradient(135deg,rgba(255,0,85,0.24),rgba(17,20,29,0.96)_42%,rgba(17,20,29,0.96))]'
              : toast.severity === 'High'
                ? 'border-orange-500/40 bg-[linear-gradient(135deg,rgba(251,146,60,0.22),rgba(17,20,29,0.96)_42%,rgba(17,20,29,0.96))]'
                : toast.severity === 'Medium'
                  ? 'border-brand-warning/40 bg-[linear-gradient(135deg,rgba(255,184,0,0.18),rgba(17,20,29,0.96)_42%,rgba(17,20,29,0.96))]'
                  : 'border-brand-success/35 bg-[linear-gradient(135deg,rgba(0,255,148,0.16),rgba(17,20,29,0.96)_42%,rgba(17,20,29,0.96))]';
          const severityGlow =
            toast.severity === 'Critical'
              ? 'shadow-[0_0_0_1px_rgba(255,0,85,0.22),0_24px_60px_rgba(255,0,85,0.22)]'
              : toast.severity === 'High'
                ? 'shadow-[0_0_0_1px_rgba(251,146,60,0.18),0_24px_60px_rgba(251,146,60,0.18)]'
                : toast.severity === 'Medium'
                  ? 'shadow-[0_0_0_1px_rgba(255,184,0,0.14),0_24px_60px_rgba(255,184,0,0.14)]'
                  : 'shadow-[0_0_0_1px_rgba(0,255,148,0.12),0_24px_60px_rgba(0,255,148,0.12)]';

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 24, y: -8 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 24, y: -10 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'pointer-events-auto relative overflow-hidden rounded-2xl border p-4 backdrop-blur-xl',
                styles.border,
                severityTone,
                severityGlow,
                toast.severity === 'Critical'
                  ? 'ring-2 ring-brand-danger/30'
                  : toast.severity === 'High'
                    ? 'ring-1 ring-orange-500/30'
                    : '',
              )}
            >
              <div
                className={cn(
                  'absolute inset-y-0 left-0 w-1.5',
                  toast.severity === 'Critical'
                    ? 'bg-brand-danger shadow-[0_0_18px_rgba(255,0,85,0.9)]'
                    : toast.severity === 'High'
                      ? 'bg-orange-400 shadow-[0_0_18px_rgba(251,146,60,0.85)]'
                      : toast.severity === 'Medium'
                        ? 'bg-brand-warning shadow-[0_0_18px_rgba(255,184,0,0.85)]'
                        : 'bg-brand-success shadow-[0_0_18px_rgba(0,255,148,0.75)]',
                )}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white/[0.08] via-transparent to-transparent pointer-events-none" />
              <div
                className={cn(
                  'absolute -right-10 -top-10 h-28 w-28 rounded-full blur-3xl pointer-events-none',
                  toast.severity === 'Critical'
                    ? 'bg-brand-danger/30'
                    : toast.severity === 'High'
                      ? 'bg-orange-400/25'
                      : toast.severity === 'Medium'
                        ? 'bg-brand-warning/25'
                        : 'bg-brand-success/20',
                )}
              />
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    'mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl shadow-lg',
                    styles.iconBox,
                    toast.severity === 'Critical' ? 'animate-pulse' : '',
                  )}
                >
                  {toast.severity === 'Low' ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <AlertTriangle className="h-5 w-5" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                          New Alert
                        </p>
                        <span
                          className={cn(
                            'rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.2em]',
                            toast.severity === 'Critical'
                              ? 'border-brand-danger/30 bg-brand-danger/10 text-brand-danger'
                              : toast.severity === 'High'
                                ? 'border-orange-500/30 bg-orange-500/10 text-orange-400'
                                : toast.severity === 'Medium'
                                  ? 'border-brand-warning/30 bg-brand-warning/10 text-brand-warning'
                                  : 'border-brand-success/30 bg-brand-success/10 text-brand-success',
                          )}
                        >
                          {toast.severity}
                        </span>
                      </div>
                      <h4 className="mt-1 text-sm font-bold text-zinc-100">{toast.title}</h4>
                    </div>
                    <button
                      onClick={() => dismissToast(toast.id)}
                      className="rounded-lg p-1 text-zinc-400 transition-colors hover:text-white"
                      aria-label="Dismiss toast"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-200">{toast.description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
