'use client';

import React from 'react';
import { AlertTriangle, Radar, ShieldCheck, UploadCloud } from 'lucide-react';
import { CyberCard, RiskBadge } from './UI';
import { PageHeader } from './common/PageHeader';
import { PrimaryButton, SecondaryButton } from './common/Button';
import { useSimulation } from '@/src/components/providers/SimulationProvider';

export const ThreatIntelligence = () => {
  const { findings, alerts, exportHistory, exportAlertsToSiem } = useSimulation();

  return (
    <div className="space-y-10">
      <PageHeader
        title="Threat Intelligence"
        description="Threat context, vulnerable systems, and mock SIEM handoff for the simulated plant."
        actions={
          <div className="flex items-center gap-4">
            <SecondaryButton icon={UploadCloud} onClick={() => exportAlertsToSiem('Splunk')}>
              Export to Splunk
            </SecondaryButton>
            <PrimaryButton
              icon={UploadCloud}
              onClick={() => exportAlertsToSiem('Microsoft Sentinel')}
            >
              Export to Sentinel
            </PrimaryButton>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <CyberCard className="border-brand-border/30">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
            Active Findings
          </p>
          <p className="mt-3 text-3xl font-black tracking-tight text-zinc-100">{findings.length}</p>
          <p className="mt-2 text-xs text-zinc-500">
            Derived from discovered assets and simulated exposure rules.
          </p>
        </CyberCard>
        <CyberCard className="border-brand-border/30">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
            Open Alerts
          </p>
          <p className="mt-3 text-3xl font-black tracking-tight text-zinc-100">
            {alerts.filter((alert) => alert.status !== 'Resolved').length}
          </p>
          <p className="mt-2 text-xs text-zinc-500">
            Correlated from the live OT monitoring simulation.
          </p>
        </CyberCard>
        <CyberCard className="border-brand-border/30">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
            SIEM Handovers
          </p>
          <p className="mt-3 text-3xl font-black tracking-tight text-zinc-100">
            {exportHistory.length}
          </p>
          <p className="mt-2 text-xs text-zinc-500">
            Prepared payloads for customer demo workflows.
          </p>
        </CyberCard>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.25fr_0.9fr]">
        <CyberCard
          title="Vulnerability Findings"
          subtitle="Top exposure items from simulated asset analysis"
          className="border-brand-border/30"
        >
          <div className="space-y-4">
            {findings.slice(0, 8).map((finding) => (
              <div
                key={finding.id}
                className="rounded-2xl border border-white/5 bg-white/[0.03] p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-sm font-bold text-zinc-100">{finding.title}</h3>
                      <RiskBadge level={finding.severity} />
                    </div>
                    <p className="mt-2 text-xs text-zinc-400">
                      {finding.assetName} · {finding.category}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                      {finding.description}
                    </p>
                    <p className="mt-3 text-xs font-medium text-brand-primary">
                      Mitigation: {finding.mitigation}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-3 text-zinc-500">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CyberCard>

        <div className="space-y-8">
          <CyberCard
            title="Latest Threat Signals"
            subtitle="Current anomalies and alert context"
            className="border-brand-border/30"
          >
            <div className="space-y-4">
              {alerts.slice(0, 4).map((alert) => (
                <div
                  key={alert.id}
                  className="rounded-2xl border border-white/5 bg-white/[0.03] p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-brand-danger/10 p-2 text-brand-danger">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-zinc-100">{alert.title}</p>
                        <RiskBadge level={alert.severity} />
                      </div>
                      <p className="mt-2 text-xs text-zinc-400">{alert.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CyberCard>

          <CyberCard
            title="Export History"
            subtitle="Mock SIEM payload handoff log"
            className="border-brand-border/30"
          >
            <div className="space-y-4">
              {exportHistory.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-brand-border/50 p-5 text-sm text-zinc-500">
                  No SIEM exports yet. Use the export actions to generate Splunk or Sentinel demo
                  payloads.
                </div>
              ) : (
                exportHistory.map((record) => (
                  <div
                    key={record.id}
                    className="rounded-2xl border border-white/5 bg-white/[0.03] p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-zinc-100">{record.target}</p>
                        <p className="mt-1 text-xs text-zinc-500">
                          {record.alertCount} alert payloads exported
                        </p>
                      </div>
                      <div className="rounded-xl bg-brand-primary/10 p-2 text-brand-primary">
                        <Radar className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CyberCard>
        </div>
      </div>
    </div>
  );
};
