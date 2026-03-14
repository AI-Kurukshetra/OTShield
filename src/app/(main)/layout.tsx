'use client';

import { AppLayout } from '@/src/components/layout/AppLayout';
import { SimulationProvider } from '@/src/components/providers/SimulationProvider';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SimulationProvider>
      <AppLayout>{children}</AppLayout>
    </SimulationProvider>
  );
}
