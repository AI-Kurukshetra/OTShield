'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Shield,
  Activity,
  AlertTriangle,
  MessageSquare,
  FileText,
  Settings,
  Radar,
  RotateCcw,
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';
import { useAuth } from '@/src/components/providers/AuthProvider';
import { useSimulation } from '@/src/components/providers/SimulationProvider';

interface NavItem {
  id: string;
  href: string;
  label: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'assets', href: '/assets', label: 'Assets', icon: Shield },
  { id: 'network', href: '/network', label: 'Network Activity', icon: Activity },
  { id: 'alerts', href: '/alerts', label: 'Alerts', icon: AlertTriangle },
  { id: 'threat-intel', href: '/threat-intel', label: 'Threat Intel', icon: Radar },
  { id: 'copilot', href: '/copilot', label: 'AI Copilot', icon: MessageSquare },
  { id: 'reports', href: '/reports', label: 'Reports', icon: FileText },
];

export const Sidebar = () => {
  const [isSidebarOpen] = React.useState(true);
  const [showResetConfirm, setShowResetConfirm] = React.useState(false);
  const [isResetting, setIsResetting] = React.useState(false);
  const pathname = usePathname();
  const { authEnabled, signOut } = useAuth();
  const { resetWorkspace } = useSimulation();

  const handleResetWorkspace = async () => {
    if (isResetting) return;
    setIsResetting(true);
    try {
      await fetch('/api/reset-workspace', { method: 'POST' });
      await resetWorkspace();
    } finally {
      await signOut();
      setIsResetting(false);
      setShowResetConfirm(false);
      window.location.href = '/login';
    }
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isSidebarOpen ? 260 : 80 }}
      className="relative border-r border-brand-border/50 bg-brand-card/30 backdrop-blur-2xl z-50 flex flex-col"
    >
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.3)]">
          <Shield className="w-6 h-6 text-white" />
        </div>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <span className="text-xl font-black tracking-tighter bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent leading-none">
              OTShield
            </span>
            <span className="text-[9px] font-mono text-brand-primary/60 uppercase tracking-[0.2em] mt-0.5">
              Industrial Sec
            </span>
          </motion.div>
        )}
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden',
                isActive
                  ? 'bg-brand-primary/10 text-brand-primary'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5',
              )}
            >
              <item.icon
                className={cn(
                  'w-5 h-5 transition-transform duration-300 group-hover:scale-110',
                  isActive ? 'text-brand-primary' : 'text-zinc-500 group-hover:text-zinc-400',
                )}
              />
              {isSidebarOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm font-semibold tracking-tight"
                >
                  {item.label}
                </motion.span>
              )}
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 w-1 h-6 bg-brand-primary rounded-r-full shadow-[0_0_10px_#00f0ff]"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-brand-border/30 space-y-2">
        <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-all group">
          <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500" />
          {isSidebarOpen && <span className="text-sm font-semibold tracking-tight">Settings</span>}
        </button>
        {authEnabled && (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-all group"
          >
            <RotateCcw className="w-5 h-5 group-hover:-rotate-180 transition-transform duration-300" />
            {isSidebarOpen && <span className="text-sm font-semibold tracking-tight">Reset Workspace</span>}
          </button>
        )}
      </div>

      {showResetConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-2xl border border-brand-border/50 bg-brand-card/95 p-6 shadow-2xl">
            <p className="text-sm font-bold text-zinc-100">Reset workspace?</p>
            <p className="mt-2 text-xs text-zinc-400">
              Clear all your assets, alerts, and export history. Shared baseline data will remain.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                disabled={isResetting}
                className="flex-1 rounded-xl border border-brand-border/50 bg-white/5 px-4 py-2.5 text-xs font-bold text-zinc-300 transition-colors hover:bg-white/10 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleResetWorkspace}
                disabled={isResetting}
                className="flex-1 rounded-xl border border-brand-danger/40 bg-brand-danger/20 px-4 py-2.5 text-xs font-bold text-brand-danger transition-colors hover:bg-brand-danger/30 disabled:opacity-50"
              >
                {isResetting ? 'Resetting...' : 'Reset'}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.aside>
  );
};
