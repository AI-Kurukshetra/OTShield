"use client";

import React from 'react';
import { Bell, User } from 'lucide-react';
import { SearchInput } from '@/src/components/common/SearchInput';

export const Header = () => {
  return (
    <header className="h-20 border-b border-brand-border/30 bg-brand-bg/50 backdrop-blur-md flex items-center justify-between px-10 z-40">
      <div className="flex items-center gap-4 flex-1 max-w-2xl">
        <SearchInput placeholder="Search assets, alerts, or events..." className="w-full" />
      </div>

      <div className="flex items-center gap-8">
        <div className="hidden lg:flex items-center gap-3 px-4 py-1.5 rounded-full bg-brand-success/5 border border-brand-success/10">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-success animate-pulse shadow-[0_0_8px_#00ff94]" />
          <span className="text-[10px] font-black text-brand-success uppercase tracking-[0.15em]">System Nominal</span>
        </div>

        <div className="flex items-center gap-5">
          <button className="relative p-2.5 text-zinc-400 hover:text-brand-primary transition-all hover:bg-brand-primary/5 rounded-xl">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-brand-danger rounded-full border-2 border-brand-bg" />
          </button>

          <div className="flex items-center gap-4 pl-6 border-l border-brand-border/50">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-zinc-100">Kavita Kanvar</p>
              <p className="text-[9px] font-mono text-brand-primary uppercase tracking-widest">Lead SOC Analyst</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-brand-border/50 flex items-center justify-center overflow-hidden shadow-inner group cursor-pointer hover:border-brand-primary/30 transition-all">
              <User className="w-5 h-5 text-zinc-500 group-hover:text-brand-primary transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
