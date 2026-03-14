"use client";

import React from 'react';
import { 
  Activity, 
  Shield, 
  AlertCircle, 
  Clock, 
  ArrowRight, 
  Share2, 
  MoreHorizontal,
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';
import { MOCK_EVENTS } from '../types';
import { RiskBadge, CyberCard, ProtocolBadge } from './UI';
import { PageHeader } from './common/PageHeader';
import { PrimaryButton } from './common/Button';
import { cn } from '@/src/lib/utils';
import { getSeverityStyles } from '@/src/lib/severity';
import { motion } from 'motion/react';

export const NetworkActivity = () => {
  return (
    <div className="space-y-10">
      <PageHeader
        title="Network Activity"
        description="Real-time stream of industrial network events and traffic anomalies."
        actions={
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-brand-bg bg-zinc-800 flex items-center justify-center overflow-hidden">
                  <img src={`https://picsum.photos/seed/user${i}/32/32`} alt="User" referrerPolicy="no-referrer" />
                </div>
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-brand-bg bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                +5
              </div>
            </div>
            <PrimaryButton icon={Activity}>Live View</PrimaryButton>
          </div>
        }
      />

      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-brand-primary/50 via-brand-border/30 to-transparent" />
        
        <div className="space-y-8">
          {MOCK_EVENTS.map((event, index) => (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-20 group"
            >
              <div className={cn(
                "absolute left-6 top-0 w-4 h-4 rounded-full border-4 border-brand-bg z-10 transition-transform duration-300 group-hover:scale-125",
                getSeverityStyles(event.severity as any).dot
              )} />
              
              <CyberCard className="p-6 group-hover:border-brand-primary/30 transition-all duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start gap-5">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                      getSeverityStyles(event.severity as any).bg,
                      getSeverityStyles(event.severity as any).text
                    )}>
                      {event.severity === 'high' || event.severity === 'critical' ? <ShieldAlert className="w-6 h-6" /> : <Activity className="w-6 h-6" />}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{event.timestamp}</span>
                        <RiskBadge level={event.severity as any} />
                        <ProtocolBadge protocol={event.protocol} />
                      </div>
                      <h3 className="text-lg font-black text-zinc-100 tracking-tight">{event.description}</h3>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-2 px-2 py-0.5 rounded-md bg-zinc-800/50 border border-zinc-700/50">
                          <span className="text-[10px] font-mono text-zinc-400">SRC: {event.source}</span>
                        </div>
                        <ArrowRight className="w-3 h-3 text-zinc-600" />
                        <div className="flex items-center gap-2 px-2 py-0.5 rounded-md bg-zinc-800/50 border border-zinc-700/50">
                          <span className="text-[10px] font-mono text-zinc-400">DST: {event.destination}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 self-end md:self-center">
                    <button className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-zinc-500 hover:text-brand-primary hover:bg-brand-primary/5 transition-all">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-zinc-500 hover:text-brand-primary hover:bg-brand-primary/5 transition-all">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    <button className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/5 text-xs font-bold text-zinc-300 hover:text-zinc-100 hover:bg-white/10 transition-all">
                      Details
                    </button>
                  </div>
                </div>
              </CyberCard>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-center pt-6">
        <button className="px-8 py-3 rounded-2xl bg-brand-card/40 border border-brand-border/50 text-sm font-bold text-zinc-400 hover:text-zinc-200 hover:bg-brand-card/60 transition-all">
          Load More Activity
        </button>
      </div>
    </div>
  );
};
