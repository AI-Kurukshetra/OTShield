"use client";

import React from 'react';
import { 
  AlertTriangle, 
  ChevronDown, 
  ChevronRight, 
  Shield, 
  CheckCircle2, 
  Filter, 
  Zap,
  MoreVertical,
  ArrowUpRight
} from 'lucide-react';
import { Alert, MOCK_ALERTS } from '../types';
import { RiskBadge, CyberCard } from './UI';
import { PageHeader } from './common/PageHeader';
import { getSeverityStyles } from '@/src/lib/severity';
import { PrimaryButton, SecondaryButton } from './common/Button';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const AlertCard = ({ alert }: { alert: Alert, key?: string }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <CyberCard className={cn(
      "p-0 transition-all duration-500",
      isExpanded ? "ring-2 ring-brand-primary/20" : ""
    )}>
      <div 
        className="p-6 cursor-pointer flex items-center gap-6"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
          getSeverityStyles(alert.severity).iconBox
        )}>
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1.5">
            <RiskBadge level={alert.severity} />
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{alert.timestamp}</span>
          </div>
          <h3 className="text-lg font-black text-zinc-100 tracking-tight group-hover:text-brand-primary transition-colors">{alert.title}</h3>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-xs text-zinc-400 font-medium">{alert.affectedDevices[0]}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-zinc-700" />
            <span className="text-xs text-zinc-500 font-mono">{alert.id.slice(0, 12)}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="hidden sm:block px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-xs font-bold text-zinc-400 hover:text-zinc-200 hover:bg-white/10 transition-all">
            Acknowledge
          </button>
          <div className={cn("transition-transform duration-500", isExpanded ? "rotate-180" : "")}>
            <ChevronDown className="w-5 h-5 text-zinc-600" />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-8 pt-2 border-t border-brand-border/30 bg-white/[0.01]">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h4 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] mb-3">AI Security Analysis</h4>
                    <div className="p-5 rounded-2xl bg-brand-primary/5 border border-brand-primary/10 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Zap className="w-12 h-12 text-brand-primary" />
                      </div>
                      <p className="text-sm text-zinc-300 leading-relaxed italic">
                        "{alert.aiExplanation}"
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Protocol</p>
                      <p className="text-sm font-mono text-zinc-200">Modbus TCP/IP</p>
                    </div>
                    <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Source IP</p>
                      <p className="text-sm font-mono text-zinc-200">192.168.1.105</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-3">Recommended Actions</h4>
                    <div className="space-y-3">
                      {['Isolate PLC-01 Segment', 'Review Firewall Rules', 'Initiate Deep Packet Inspection'].map((action, i) => (
                        <button key={i} className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-brand-primary/30 transition-all group">
                          <span className="text-xs font-bold text-zinc-300">{action}</span>
                          <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-brand-primary transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <button className="w-full py-3 bg-brand-danger text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-brand-danger/90 transition-all shadow-lg shadow-brand-danger/20">
                    Initiate Emergency Shutdown
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </CyberCard>
  );
};

export const Alerts = () => {
  return (
    <div className="space-y-10">
      <PageHeader
        title="Security Alerts"
        description="Critical security events and anomalies detected across the network."
        actions={
          <div className="flex items-center gap-4">
            <SecondaryButton icon={Filter}>Filter</SecondaryButton>
            <PrimaryButton icon={CheckCircle2}>Acknowledge All</PrimaryButton>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6">
        {MOCK_ALERTS.map((alert) => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
      </div>
    </div>
  );
};
