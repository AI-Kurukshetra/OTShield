'use client';

import React from 'react';
import {
  FileText,
  Download,
  ShieldCheck,
  AlertTriangle,
  Radio,
  Calendar,
  Clock,
  Plus,
  MoreVertical,
  Filter,
  Share2,
  type LucideIcon,
} from 'lucide-react';
import { CyberCard } from './UI';
import { PageHeader } from './common/PageHeader';
import { PrimaryButton, SecondaryButton } from './common/Button';
import { motion } from 'motion/react';
import { useSimulation } from '@/src/components/providers/SimulationProvider';

type ReportCardProps = {
  title: string;
  description: string;
  date: string;
  icon: LucideIcon;
  type: string;
  index: number;
  onDownload: () => void;
};

const ReportCard = ({ title, description, date, icon: Icon, type, index, onDownload }: ReportCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
  >
    <CyberCard className="group hover:border-brand-primary/30 transition-all duration-500 h-full flex flex-col">
      <div className="flex items-start gap-5 flex-1">
        <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 group-hover:bg-brand-primary/10 group-hover:border-brand-primary/20 transition-all duration-500">
          <Icon className="w-7 h-7 text-zinc-500 group-hover:text-brand-primary transition-colors duration-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-lg font-black text-zinc-100 tracking-tight group-hover:text-brand-primary transition-colors">
              {title}
            </h3>
            <div className="px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                {type}
              </span>
            </div>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2">{description}</p>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-brand-border/30 flex items-center justify-between">
        <div className="flex items-center gap-2 text-zinc-600">
          <Calendar className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold uppercase tracking-widest">{date}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-xl bg-white/5 border border-white/5 text-zinc-500 hover:text-brand-primary hover:bg-brand-primary/5 transition-all">
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDownload();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-black rounded-xl text-xs font-black uppercase tracking-widest hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/10"
          >
            <Download className="w-3.5 h-3.5" />
            PDF
          </button>
        </div>
      </div>
    </CyberCard>
  </motion.div>
);

export const Reports = () => {
  const { assets, alerts, findings, exportHistory, exportAlertsToSiem } = useSimulation();

  const downloadReport = (reportTitle: string, reportType: string) => {
    const slug = reportTitle.replace(/\s+/g, '-').toLowerCase();
    let content: string;
    if (reportType === 'Security') {
      content = `OTShield – Asset Risk Summary\n${'='.repeat(50)}\nGenerated: ${new Date().toISOString().slice(0, 10)}\n\nDiscovered Assets: ${assets.length}\n\n${assets.map((a) => `- ${a.name} (${a.type}) | Risk: ${a.riskScore} | ${a.location}`).join('\n')}`;
    } else if (reportType === 'Compliance') {
      content = `OTShield – Vulnerability Assessment\n${'='.repeat(50)}\nGenerated: ${new Date().toISOString().slice(0, 10)}\n\nOpen Findings: ${findings.length}\n\n${findings.map((f) => `- ${f.title} | ${f.assetName} | Severity: ${f.severity}\n  Mitigation: ${f.mitigation}`).join('\n\n')}`;
    } else if (reportType === 'Audit') {
      content = `OTShield – Incident History Log\n${'='.repeat(50)}\nGenerated: ${new Date().toISOString().slice(0, 10)}\n\nTotal Alerts: ${alerts.length}\nActive: ${alerts.filter((a) => a.status !== 'Resolved').length}\n\n${alerts.map((a) => `- [${a.status}] ${a.title} | ${a.severity} | ${a.timestamp}`).join('\n')}`;
    } else {
      content = `OTShield – SIEM Export Summary\n${'='.repeat(50)}\nGenerated: ${new Date().toISOString().slice(0, 10)}\n\nExports: ${exportHistory.length}\n\n${exportHistory.map((e) => `- ${e.target} | ${e.alertCount} alerts | ${e.exportedAt}`).join('\n')}`;
    }
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `otshield-${slug}-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reportCards = [
    {
      title: 'Asset Risk Summary',
      description: `${assets.length} discovered OT assets are currently modeled in the manufacturing environment.`,
      date: 'MAR 14, 2026',
      icon: ShieldCheck,
      type: 'Security',
    },
    {
      title: 'Vulnerability Assessment',
      description: `${findings.length} exposure findings are currently open across controllers, HMIs, and gateways.`,
      date: 'MAR 14, 2026',
      icon: AlertTriangle,
      type: 'Compliance',
    },
    {
      title: 'Incident History Log',
      description: `${alerts.length} alerts are available for triage, with ${alerts.filter((alert) => alert.status !== 'Resolved').length} still active.`,
      date: 'MAR 14, 2026',
      icon: FileText,
      type: 'Audit',
    },
    {
      title: 'SIEM Export Summary',
      description: `${exportHistory.length} export handoffs have been prepared for customer SIEM workflows.`,
      date: 'MAR 14, 2026',
      icon: Radio,
      type: 'Operations',
    },
  ];

  return (
    <div className="space-y-10">
      <PageHeader
        title="Compliance Reports"
        description="Audit-ready industrial security documentation and compliance summaries."
        actions={
          <div className="flex items-center gap-4">
            <SecondaryButton icon={Filter}>Filter</SecondaryButton>
            <PrimaryButton icon={Plus} onClick={() => exportAlertsToSiem('Microsoft Sentinel')}>
              Generate Export Snapshot
            </PrimaryButton>
          </div>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {reportCards.map((report, i) => (
          <ReportCard
            key={i}
            {...report}
            index={i}
            onDownload={() => downloadReport(report.title, report.type)}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <CyberCard className="border-brand-border/30">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
            Discovered Assets
          </p>
          <p className="mt-3 text-3xl font-black tracking-tight text-zinc-100">{assets.length}</p>
          <p className="mt-2 text-xs text-zinc-500">
            Current inventory derived from the simulated discovery workflow.
          </p>
        </CyberCard>
        <CyberCard className="border-brand-border/30">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
            Open Findings
          </p>
          <p className="mt-3 text-3xl font-black tracking-tight text-zinc-100">{findings.length}</p>
          <p className="mt-2 text-xs text-zinc-500">
            Deterministic exposure findings generated from asset posture rules.
          </p>
        </CyberCard>
        <CyberCard className="border-brand-border/30">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
            SIEM Handoffs
          </p>
          <p className="mt-3 text-3xl font-black tracking-tight text-zinc-100">
            {exportHistory.length}
          </p>
          <p className="mt-2 text-xs text-zinc-500">
            Mock export records prepared for downstream Splunk or Sentinel workflows.
          </p>
        </CyberCard>
      </div>

      <CyberCard className="p-0 border-brand-border/30 overflow-hidden">
        <div className="px-8 py-6 border-b border-brand-border/30 bg-white/[0.02] flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-zinc-100 tracking-tight">Scheduled Reports</h3>
            <p className="text-xs text-zinc-500 font-medium mt-1">
              Automated delivery configuration for stakeholders.
            </p>
          </div>
          <button className="p-2 rounded-xl bg-white/5 border border-white/5 text-zinc-500 hover:text-brand-primary hover:bg-brand-primary/5 transition-all">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="divide-y divide-brand-border/30">
          {[
            {
              name: 'Weekly Executive Summary',
              frequency: 'Every Monday at 08:00',
              recipients: 'CISO, Operations Manager',
            },
            { name: 'Daily Threat Briefing', frequency: 'Daily at 06:00', recipients: 'SOC Team' },
            {
              name: 'Monthly Compliance Audit',
              frequency: '1st of every month',
              recipients: 'Compliance Officer',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="px-8 py-6 flex items-center justify-between hover:bg-white/[0.01] transition-colors group"
            >
              <div className="flex items-center gap-6">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-brand-primary transition-colors">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-zinc-200 tracking-tight">{item.name}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      {item.frequency}
                    </span>
                    <div className="w-1 h-1 rounded-full bg-zinc-700" />
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      {item.recipients}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-brand-success/10 border border-brand-success/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-success" />
                  <span className="text-[10px] font-black text-brand-success uppercase tracking-widest">
                    Active
                  </span>
                </div>
                <button className="p-2 rounded-xl bg-white/5 border border-white/5 text-zinc-500 hover:text-brand-primary hover:bg-brand-primary/5 transition-all">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </CyberCard>
    </div>
  );
};
