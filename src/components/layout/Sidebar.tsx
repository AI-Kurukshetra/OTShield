"use client";

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
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

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
  { id: 'copilot', href: '/copilot', label: 'AI Copilot', icon: MessageSquare },
  { id: 'reports', href: '/reports', label: 'Reports', icon: FileText },
];

export const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const pathname = usePathname();

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
                "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                isActive ? "bg-brand-primary/10 text-brand-primary" : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
                  isActive ? "text-brand-primary" : "text-zinc-500 group-hover:text-zinc-400"
                )}
              />
              {isSidebarOpen && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-semibold tracking-tight">
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

      <div className="p-6 border-t border-brand-border/30">
        <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-all group">
          <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500" />
          {isSidebarOpen && <span className="text-sm font-semibold tracking-tight">Settings</span>}
        </button>
      </div>
    </motion.aside>
  );
};
