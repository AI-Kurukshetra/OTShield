'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { AuthFeedbackProvider } from '@/src/components/providers/AuthFeedbackProvider';

const featureCards = [
  ['Scoped assets', 'Shared baseline inventory plus user-owned discovery changes.'],
  ['Alert workflow', 'Persisted incident triage with acknowledge and resolve states.'],
  ['SIEM handoffs', 'User-scoped export history for demo and audit walkthroughs.'],
  ['AI copilot', 'One conversation across the floating widget and full-page assistant.'],
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AuthFeedbackProvider>
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-bg px-6 py-10 text-zinc-100">
      <motion.div
        className="absolute inset-0 opacity-[0.08]"
        animate={{ backgroundPositionX: ['0%', '100%'] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,240,255,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.12) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />
      <motion.div
        className="absolute left-[12%] top-[18%] h-64 w-64 rounded-full bg-brand-primary/10 blur-[120px]"
        animate={{ scale: [1, 1.14, 1], opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[10%] right-[14%] h-72 w-72 rounded-full bg-brand-secondary/10 blur-[140px]"
        animate={{ scale: [1.06, 0.96, 1.06], opacity: [0.25, 0.5, 0.25] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-primary/70 to-transparent"
        animate={{ x: ['-18%', '18%', '-18%'] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 grid w-full max-w-6xl gap-10 lg:grid-cols-[1.2fr_0.9fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:block"
        >
          <div className="max-w-xl">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-brand-primary">
              OTShield Access
            </p>
            <h1 className="mt-6 text-5xl font-black tracking-tight text-zinc-50">
              OT security operations with a production-ready access layer.
            </h1>
            <p className="mt-6 text-base leading-8 text-zinc-400">
              Sign in to review industrial assets, triage protocol-aware alerts, and continue the
              simulated incident workflow with persisted state and user-scoped activity.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {featureCards.map(([title, description], index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.14 + index * 0.08,
                    duration: 0.45,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="rounded-2xl border border-brand-border/40 bg-white/[0.03] p-5 backdrop-blur-sm"
                >
                  <p className="text-sm font-black text-zinc-100">{title}</p>
                  <p className="mt-2 text-xs leading-6 text-zinc-500">{description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="relative">
          <div className="absolute inset-0 rounded-[2rem] border border-brand-primary/10 bg-gradient-to-br from-brand-primary/5 via-transparent to-brand-secondary/5 blur-2xl" />
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, x: 28, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: -28, y: -12, scale: 0.985 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

        <Link
          href="/dashboard"
          className="absolute left-6 top-6 rounded-full border border-brand-border/50 bg-brand-card/40 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-300 transition-colors hover:border-brand-primary/30 hover:text-brand-primary"
        >
          OTShield Demo
        </Link>
      </div>
    </AuthFeedbackProvider>
  );
}
