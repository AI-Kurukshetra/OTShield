'use client';

import React from 'react';
import { Shield, AlertTriangle, Activity, Zap, Radar, RotateCcw } from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { CyberCard } from '../UI';
import { StatCard } from './StatCard';
import { RiskDistributionChart } from './RiskDistributionChart';
import { NetworkActivityChart } from './NetworkActivityChart';
import { NetworkTopologyPreview } from './NetworkTopologyPreview';
import { RecentAlertsWidget } from './RecentAlertsWidget';
import { PrimaryButton, SecondaryButton } from '../common/Button';
import { useSimulation } from '@/src/components/providers/SimulationProvider';
import { cn } from '@/src/lib/utils';

export const Dashboard = () => {
  const {
    assets,
    alerts,
    events,
    discoveryStatus,
    discoveryProgress,
    monitoringStatus,
    discoverAssets,
    resetDiscovery,
  } = useSimulation();

  const criticalRiskAssets = assets.filter((asset) => asset.riskScore > 80).length;
  const discoveredDuringScan = assets.filter(
    (asset) => asset.discoverySource === 'Simulated Scan',
  ).length;
  const discoveryActionLabel =
    discoveryStatus === 'Scanning'
      ? 'Scanning Assets...'
      : discoveryStatus === 'Completed'
        ? 'Reset Discovery'
        : 'Discover Assets';

  return (
    <div className="space-y-10">
      <PageHeader
        title="Security Overview"
        description="Real-time monitoring of your industrial network infrastructure."
        actions={
          <div className="flex items-center gap-4">
            <div className="rounded-2xl border border-brand-border/50 bg-zinc-900/50 px-4 py-2">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                Discovery Status
              </p>
              <div className="mt-1 flex items-center gap-3">
                <span className="text-sm font-bold text-zinc-100">{discoveryStatus}</span>
                <span className="text-xs font-mono text-brand-primary">{discoveryProgress}%</span>
              </div>
            </div>
            {discoveryStatus === 'Completed' ? (
              <SecondaryButton icon={RotateCcw} onClick={resetDiscovery}>
                {discoveryActionLabel}
              </SecondaryButton>
            ) : (
              <PrimaryButton
                icon={Radar}
                onClick={discoverAssets}
                disabled={discoveryStatus === 'Scanning'}
                className={cn(
                  discoveryStatus === 'Scanning' ? 'cursor-not-allowed opacity-70' : '',
                )}
              >
                {discoveryActionLabel}
              </PrimaryButton>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Assets"
          value={String(assets.length).padStart(2, '0')}
          change={`+${discoveredDuringScan}`}
          icon={Shield}
          trend="up"
          color="brand-primary"
        />
        <StatCard
          title="Active Alerts"
          value={String(alerts.length).padStart(2, '0')}
          change={monitoringStatus === 'Streaming' ? '+live' : 'stable'}
          icon={AlertTriangle}
          trend={monitoringStatus === 'Streaming' ? 'up' : 'down'}
          color="brand-danger"
        />
        <StatCard
          title="High Risk"
          value={String(criticalRiskAssets).padStart(2, '0')}
          change={`${Math.round(discoveryProgress / 10)} segments`}
          icon={Activity}
          trend="up"
          color="brand-warning"
        />
        <StatCard
          title="Network Events"
          value={String(events.length).padStart(2, '0')}
          change={`${discoveryProgress}% mapped`}
          icon={Zap}
          trend="up"
          color="brand-secondary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <CyberCard
          title="Risk Distribution"
          subtitle="Asset vulnerability levels"
          className="lg:col-span-1"
        >
          <RiskDistributionChart />
        </CyberCard>
        <CyberCard
          title="Network Activity"
          subtitle="Events per hour (last 24h)"
          className="lg:col-span-2"
        >
          <NetworkActivityChart />
        </CyberCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CyberCard title="Network Topology" subtitle="Live infrastructure map">
          <NetworkTopologyPreview />
        </CyberCard>
        <RecentAlertsWidget />
      </div>
    </div>
  );
};
