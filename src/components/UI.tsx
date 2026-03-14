"use client";

import React from 'react';
import { cn } from '@/src/lib/utils';
import { RiskLevel, DeviceStatus, Protocol } from '@/src/types';
import { getSeverityStyles } from '@/src/lib/severity';
import type { SeverityLevel } from '@/src/lib/severity';

export const RiskBadge = ({ level }: { level: SeverityLevel }) => {
  const styles = getSeverityStyles(level);
  const displayLabel =
    typeof level === 'string'
      ? level.charAt(0).toUpperCase() + level.slice(1).toLowerCase()
      : level;

  return (
    <span
      className={cn(
        "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all duration-300",
        styles.badge
      )}
    >
      {displayLabel}
    </span>
  );
};

export const ProtocolBadge = ({ protocol }: { protocol: Protocol }) => {
  return (
    <span className="px-2 py-0.5 rounded bg-brand-primary/10 text-brand-primary border border-brand-primary/20 text-[10px] font-mono font-bold tracking-tight">
      {protocol}
    </span>
  );
};

export const StatusIndicator = ({ status }: { status: DeviceStatus }) => {
  const colors = {
    Online: 'bg-brand-success shadow-[0_0_10px_rgba(0,255,148,0.4)]',
    Offline: 'bg-zinc-600',
    Warning: 'bg-brand-warning shadow-[0_0_10px_rgba(255,184,0,0.4)]',
  };

  return (
    <div className="flex items-center gap-2.5">
      <div className={cn("w-1.5 h-1.5 rounded-full", colors[status])} />
      <span className="text-[11px] font-medium text-zinc-400 tracking-tight">{status}</span>
    </div>
  );
};

export const CyberCard = ({
  children,
  className,
  contentClassName,
  title,
  subtitle,
  key,
}: {
  children: React.ReactNode,
  className?: string,
  contentClassName?: string,
  title?: string,
  subtitle?: string,
  key?: string | number
}) => {
  return (
    <div key={key} className={cn(
      "relative glass-panel rounded-2xl overflow-hidden group transition-all duration-500 hover:border-brand-primary/30",
      className
    )}>
      {/* Subtle corner accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 blur-3xl pointer-events-none group-hover:bg-brand-primary/10 transition-all duration-500" />
      
      {(title || subtitle) && (
        <div className="px-6 py-5 border-b border-brand-border/50 flex flex-col gap-1">
          {title && <h3 className="text-sm font-bold text-zinc-100 tracking-tight flex items-center gap-2">
            <span className="w-1 h-3 bg-brand-primary rounded-full" />
            {title}
          </h3>}
          {subtitle && <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest pl-3">{subtitle}</p>}
        </div>
      )}
      <div className={cn("p-6", contentClassName)}>
        {children}
      </div>
    </div>
  );
};
