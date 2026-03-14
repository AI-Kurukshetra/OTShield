'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import { CyberCard, RiskBadge } from '../UI';
import { getSeverityStyles } from '@/src/lib/severity';
import { cn } from '@/src/lib/utils';
import { useSimulation } from '@/src/components/providers/SimulationProvider';

export const RecentAlertsWidget = () => {
  const { alerts } = useSimulation();

  return (
    <CyberCard title="Recent Alerts" subtitle="Latest security incidents">
      <div className="space-y-4 mt-4">
        {alerts.slice(0, 4).map((alert) => (
          <Link
            key={alert.id}
            href="/alerts"
            className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer group"
          >
            <div
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                getSeverityStyles(alert.severity).iconBox,
              )}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-bold text-zinc-100 truncate group-hover:text-brand-primary transition-colors">
                  {alert.title}
                </h4>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">
                  {alert.timestamp}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <RiskBadge level={alert.severity} />
                <span className="text-xs text-zinc-500 truncate">{alert.affectedDevices[0]}</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
          </Link>
        ))}
        <Link
          href="/alerts"
          className="block w-full py-3 text-center text-xs font-bold text-brand-primary uppercase tracking-widest hover:bg-brand-primary/5 rounded-xl transition-all"
        >
          View All Alerts
        </Link>
      </div>
    </CyberCard>
  );
};
