'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, ExternalLink, UploadCloud, User } from 'lucide-react';
import { SearchInput } from '@/src/components/common/SearchInput';
import { useSimulation } from '@/src/components/providers/SimulationProvider';
import { cn } from '@/src/lib/utils';
import { getSeverityStyles } from '@/src/lib/severity';

export const Header = () => {
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const { notifications, unreadNotificationCount, markNotificationsSeen } = useSimulation();
  const panelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isNotificationsOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isNotificationsOpen]);

  return (
    <header className="h-20 border-b border-brand-border/30 bg-brand-bg/50 backdrop-blur-md flex items-center justify-between px-10 z-40">
      <div className="flex items-center gap-4 flex-1 max-w-2xl">
        <SearchInput placeholder="Search assets, alerts, or events..." className="w-full" />
      </div>

      <div className="flex items-center gap-8">
        <div className="hidden lg:flex items-center gap-3 px-4 py-1.5 rounded-full bg-brand-success/5 border border-brand-success/10">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-success animate-pulse shadow-[0_0_8px_#00ff94]" />
          <span className="text-[10px] font-black text-brand-success uppercase tracking-[0.15em]">
            System Nominal
          </span>
        </div>

        <div className="flex items-center gap-5">
          <div ref={panelRef} className="relative">
            <button
              onClick={() => {
                setIsNotificationsOpen((prev) => !prev);
                if (!isNotificationsOpen) {
                  markNotificationsSeen();
                }
              }}
              className="relative rounded-xl p-2.5 text-zinc-400 transition-all hover:bg-brand-primary/5 hover:text-brand-primary"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationCount > 0 && (
                <>
                  <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full border-2 border-brand-bg bg-brand-danger" />
                  <span className="absolute -right-1 -top-1 rounded-full bg-brand-danger px-1.5 py-0.5 text-[9px] font-black text-white">
                    {Math.min(unreadNotificationCount, 9)}
                  </span>
                </>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 top-14 z-[85] w-[24rem] overflow-hidden rounded-2xl border border-brand-border/50 bg-brand-card/95 shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-brand-border/30 px-5 py-4">
                  <div>
                    <p className="text-sm font-black text-zinc-100">Notifications</p>
                    <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-500">
                      Alerts and SIEM handoffs
                    </p>
                  </div>
                  <button
                    onClick={markNotificationsSeen}
                    className="text-[10px] font-black uppercase tracking-[0.18em] text-brand-primary transition-colors hover:text-zinc-100"
                  >
                    Mark All Seen
                  </button>
                </div>

                <div className="max-h-[24rem] overflow-y-auto custom-scrollbar p-3">
                  {notifications.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-brand-border/50 px-4 py-8 text-center text-sm text-zinc-500">
                      No notifications yet. Start discovery to generate events.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {notifications.map((notification) => {
                        const severityStyles = notification.severity
                          ? getSeverityStyles(notification.severity)
                          : null;

                        return (
                          <div
                            key={notification.id}
                            className={cn(
                              'rounded-2xl border px-4 py-3 transition-colors',
                              notification.seen
                                ? 'border-white/5 bg-white/[0.03]'
                                : 'border-brand-primary/20 bg-brand-primary/5',
                            )}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={cn(
                                      'rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.18em]',
                                      notification.kind === 'export'
                                        ? 'border-brand-primary/20 bg-brand-primary/10 text-brand-primary'
                                        : (severityStyles?.badge ??
                                            'border-white/10 bg-white/5 text-zinc-300'),
                                    )}
                                  >
                                    {notification.kind === 'export'
                                      ? 'Export'
                                      : notification.severity}
                                  </span>
                                  {!notification.seen && (
                                    <span className="text-[9px] font-black uppercase tracking-[0.18em] text-brand-danger">
                                      New
                                    </span>
                                  )}
                                </div>
                                <p className="mt-2 text-sm font-bold text-zinc-100">
                                  {notification.title}
                                </p>
                                <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                                  {notification.description}
                                </p>
                              </div>
                              <div className="rounded-xl bg-white/5 p-2 text-zinc-500">
                                {notification.kind === 'export' ? (
                                  <UploadCloud className="h-4 w-4" />
                                ) : (
                                  <Bell className="h-4 w-4" />
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-brand-border/30 px-5 py-4">
                  <Link
                    href="/alerts"
                    onClick={() => setIsNotificationsOpen(false)}
                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-brand-primary transition-colors hover:text-zinc-100"
                  >
                    Open Alerts
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                  <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-500">
                    {notifications.length} recent items
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 pl-6 border-l border-brand-border/50">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-zinc-100">Kavita Kanvar</p>
              <p className="text-[9px] font-mono text-brand-primary uppercase tracking-widest">
                Lead SOC Analyst
              </p>
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
