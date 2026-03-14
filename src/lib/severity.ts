import type { RiskLevel } from '@/src/types';

export type SeverityLevel = RiskLevel | 'info' | 'low' | 'medium' | 'high' | 'critical';

export interface SeverityStyles {
  bg: string;
  text: string;
  border: string;
  dot: string;
  iconBox: string;
  bar: string;
  badge: string;
}

const lowStyles = {
  bg: 'bg-brand-success/10',
  text: 'text-brand-success',
  border: 'border-brand-success/20',
  dot: 'bg-brand-success shadow-[0_0_10px_rgba(0,255,148,0.5)]',
  iconBox: 'bg-brand-success/20 text-brand-success',
  bar: 'bg-brand-success',
  badge: 'bg-brand-success/10 text-brand-success border-brand-success/20',
};

const mediumStyles = {
  bg: 'bg-brand-warning/10',
  text: 'text-brand-warning',
  border: 'border-brand-warning/20',
  dot: 'bg-brand-warning shadow-[0_0_10px_rgba(255,184,0,0.5)]',
  iconBox: 'bg-brand-warning/20 text-brand-warning',
  bar: 'bg-brand-warning',
  badge: 'bg-brand-warning/10 text-brand-warning border-brand-warning/20',
};

const highStyles = {
  bg: 'bg-orange-500/10',
  text: 'text-orange-400',
  border: 'border-orange-500/20',
  dot: 'bg-brand-danger shadow-[0_0_10px_rgba(255,0,85,0.5)]',
  iconBox: 'bg-orange-500/20 text-orange-400 shadow-orange-500/10',
  bar: 'bg-orange-500',
  badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
};

const criticalStyles = {
  bg: 'bg-brand-danger/10',
  text: 'text-brand-danger',
  border: 'border-brand-danger/20',
  dot: 'bg-brand-danger shadow-[0_0_10px_rgba(255,0,85,0.5)]',
  iconBox: 'bg-brand-danger/20 text-brand-danger shadow-brand-danger/10',
  bar: 'bg-brand-danger shadow-[0_0_8px_rgba(255,0,85,0.4)]',
  badge:
    'bg-brand-danger/10 text-brand-danger border-brand-danger/20 shadow-[0_0_12px_rgba(255,0,85,0.2)]',
};

const SEVERITY_MAP: Record<string, SeverityStyles> = {
  Low: lowStyles,
  low: lowStyles,
  info: lowStyles,
  Medium: mediumStyles,
  medium: mediumStyles,
  High: highStyles,
  high: criticalStyles,
  Critical: criticalStyles,
  critical: criticalStyles,
};

export function getSeverityStyles(level: SeverityLevel): SeverityStyles {
  return SEVERITY_MAP[level] ?? SEVERITY_MAP.Low;
}
