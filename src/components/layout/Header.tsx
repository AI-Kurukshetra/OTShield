'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, ExternalLink, LogOut, UploadCloud, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SearchInput } from '@/src/components/common/SearchInput';
import { useSimulation } from '@/src/components/providers/SimulationProvider';
import { useAuth } from '@/src/components/providers/AuthProvider';
import { cn } from '@/src/lib/utils';
import { getSeverityStyles } from '@/src/lib/severity';

export const Header = () => {
  const router = useRouter();
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [isSigningOut, setIsSigningOut] = React.useState(false);
  const { notifications, unreadNotificationCount, markNotificationsSeen } = useSimulation();
  const { authEnabled, isAuthReady, user, signOut } = useAuth();
  const notificationPanelRef = React.useRef<HTMLDivElement>(null);
  const userMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isNotificationsOpen && !isUserMenuOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (
        notificationPanelRef.current &&
        !notificationPanelRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }

      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isNotificationsOpen, isUserMenuOpen]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut();
    setIsSigningOut(false);
    router.replace('/login');
    router.refresh();
  };

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
          <div ref={notificationPanelRef} className="relative">
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

          <div ref={userMenuRef} className="relative flex items-center pl-6 border-l border-brand-border/50">
            <button
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-border/50 bg-gradient-to-br from-zinc-800 to-zinc-900 shadow-inner transition-all hover:border-brand-primary/30"
            >
              <User className="h-5 w-5 text-zinc-500 transition-colors hover:text-brand-primary" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 top-14 z-[85] w-72 overflow-hidden rounded-2xl border border-brand-border/50 bg-brand-card/95 shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
                <div className="border-b border-brand-border/30 px-5 py-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary">
                    User Workspace
                  </p>
                  <p className="mt-3 text-sm font-bold text-zinc-100">
                    {authEnabled
                      ? isAuthReady
                        ? user?.email ?? 'Authenticated User'
                        : 'Loading session...'
                      : 'Demo Operator'}
                  </p>
                  <p className="mt-1 text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-500">
                    {authEnabled ? 'Secure workspace' : 'Local demo mode'}
                  </p>
                </div>

                <div className="px-5 py-4">
                  <div className="rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
                      Access
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                      {authEnabled
                        ? 'Your alerts, exports, and discovered assets are scoped to your authenticated workspace.'
                        : 'You are viewing the local demo mode with no authentication required.'}
                    </p>
                  </div>
                </div>

                {authEnabled && (
                  <div className="border-t border-brand-border/30 px-5 py-4">
                    <button
                      onClick={handleSignOut}
                      disabled={!isAuthReady || isSigningOut}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-brand-border/50 bg-brand-card/40 px-4 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-zinc-300 transition-colors hover:border-brand-primary/30 hover:text-brand-primary disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      {isSigningOut ? 'Signing Out...' : 'Sign Out'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
