'use client';

import { AppLayout } from '@/src/components/layout/AppLayout';
import { AuthProvider } from '@/src/components/providers/AuthProvider';
import { ChatProvider } from '@/src/components/providers/ChatProvider';
import { SimulationProvider } from '@/src/components/providers/SimulationProvider';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SimulationProvider>
        <ChatProvider>
          <AppLayout>{children}</AppLayout>
        </ChatProvider>
      </SimulationProvider>
    </AuthProvider>
  );
}
