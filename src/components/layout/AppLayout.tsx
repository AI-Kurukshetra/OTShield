'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ToastStack } from '@/src/components/Toast';
import { ChatWidget } from '@/src/components/ChatWidget';

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-brand-bg text-zinc-100 font-sans selection:bg-brand-primary/30 overflow-hidden">
      <ToastStack />
      <ChatWidget />
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
        <div className="scanline pointer-events-none" />
        <Header />
        <main className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-brand-bg relative">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-primary/5 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-secondary/5 blur-[120px] pointer-events-none" />
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
