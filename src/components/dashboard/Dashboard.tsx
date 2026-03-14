"use client";

import React from 'react';
import { Shield, AlertTriangle, Activity, Zap } from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { CyberCard } from '../UI';
import { StatCard } from './StatCard';
import { RiskDistributionChart } from './RiskDistributionChart';
import { NetworkActivityChart } from './NetworkActivityChart';
import { NetworkTopologyPreview } from './NetworkTopologyPreview';
import { RecentAlertsWidget } from './RecentAlertsWidget';

export const Dashboard = () => {
  return (
    <div className="space-y-10">
      <PageHeader
        title="Security Overview"
        description="Real-time monitoring of your industrial network infrastructure."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Assets"
          value="1,284"
          change="+12"
          icon={Shield}
          trend="up"
          color="brand-primary"
        />
        <StatCard
          title="Active Alerts"
          value="24"
          change="-3"
          icon={AlertTriangle}
          trend="down"
          color="brand-danger"
        />
        <StatCard
          title="High Risk"
          value="08"
          change="+2"
          icon={Activity}
          trend="up"
          color="brand-warning"
        />
        <StatCard
          title="Network Events"
          value="45.2k"
          change="+5.4%"
          icon={Zap}
          trend="up"
          color="brand-secondary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <CyberCard title="Risk Distribution" subtitle="Asset vulnerability levels" className="lg:col-span-1">
          <RiskDistributionChart />
        </CyberCard>
        <CyberCard title="Network Activity" subtitle="Events per hour (last 24h)" className="lg:col-span-2">
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
