'use client';

import { AICopilot } from '@/src/components/AICopilot';

export default function CopilotPage() {
  // Wrapper: fixed height so main doesn't scroll; AICopilot fills it with flex-1
  return (
    <div className="h-[calc(100svh-12rem)] min-h-0 flex flex-col">
      <AICopilot />
    </div>
  );
}
