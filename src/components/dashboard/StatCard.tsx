"use client";

import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { CyberCard } from '../UI';
import { motion } from 'motion/react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  trend: 'up' | 'down';
  color: string;
}

export const StatCard = ({ title, value, change, icon: Icon, trend, color }: StatCardProps) => {
  return (
    <CyberCard className="group hover:translate-y-[-4px] transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            "p-3 rounded-xl",
            color === 'brand-primary' ? "bg-brand-primary/10 text-brand-primary" :
            color === 'brand-danger' ? "bg-brand-danger/10 text-brand-danger" :
            color === 'brand-warning' ? "bg-brand-warning/10 text-brand-warning" :
            "bg-brand-secondary/10 text-brand-secondary"
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div
          className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold",
            trend === 'up' ? "bg-brand-success/10 text-brand-success" : "bg-brand-danger/10 text-brand-danger"
          )}
        >
          {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {change}
        </div>
      </div>
      <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">{title}</h3>
      <p className="text-3xl font-black text-zinc-100 tracking-tighter">{value}</p>
      <div className="mt-4 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: trend === 'up' ? '70%' : '40%' }}
          transition={{ duration: 1, delay: 0.5 }}
          className={cn("h-full rounded-full", trend === 'up' ? "bg-brand-success" : "bg-brand-danger")}
        />
      </div>
    </CyberCard>
  );
};
