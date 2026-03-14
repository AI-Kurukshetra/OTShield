'use client';

import React from 'react';
import { Shield } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { CyberCard } from '../UI';
import { motion } from 'motion/react';

export const NetworkTopologyPreview = () => {
  return (
    <CyberCard title="Network Topology" subtitle="Live infrastructure map">
      <div className="h-[350px] bg-brand-card/20 rounded-xl border border-brand-border/30 relative overflow-hidden mt-4 group">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-brand-primary/20 border border-brand-primary/40 flex items-center justify-center z-10 relative shadow-[0_0_30px_rgba(0,240,255,0.2)]">
              <Shield className="w-8 h-8 text-brand-primary" />
            </div>
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <motion.div
                key={i}
                animate={{ rotate: 360 }}
                transition={{ duration: 20 + i * 5, repeat: Infinity, ease: 'linear' }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ width: 200 + i * 20, height: 200 + i * 20 }}
              >
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center"
                  style={{ transform: `rotate(${angle}deg)` }}
                >
                  <div
                    className={cn(
                      'w-1.5 h-1.5 rounded-full',
                      i % 3 === 0 ? 'bg-brand-danger' : 'bg-brand-success',
                    )}
                  />
                </div>
              </motion.div>
            ))}
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
              <circle
                cx="0"
                cy="0"
                r="100"
                fill="none"
                stroke="rgba(0,240,255,0.1)"
                strokeWidth="1"
                className="translate-x-1/2 translate-y-1/2"
              />
              <circle
                cx="0"
                cy="0"
                r="140"
                fill="none"
                stroke="rgba(0,240,255,0.05)"
                strokeWidth="1"
                className="translate-x-1/2 translate-y-1/2"
              />
            </svg>
          </div>
        </div>
        <div className="absolute bottom-4 left-4 flex gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/5">
            <div className="w-2 h-2 rounded-full bg-brand-success" />
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              Secure
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/5">
            <div className="w-2 h-2 rounded-full bg-brand-danger" />
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              Threat
            </span>
          </div>
        </div>
      </div>
    </CyberCard>
  );
};
