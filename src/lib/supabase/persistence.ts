import { getSupabase } from './client';
import type { Alert, Asset, SiemExportRecord } from '@/src/types';

type ScopedRow = {
  id: string;
  user_id: string | null;
};

type AssetRow = ScopedRow & {
  name: string;
  type: string;
  protocol: Asset['protocol'];
  location: string;
  risk_score: number;
  status: Asset['status'];
  last_seen: string;
  discovered_at: string | null;
  discovery_source: Asset['discoverySource'] | null;
  site: string | null;
};

type AlertRow = ScopedRow & {
  title: string;
  device: string;
  affected_devices: string[] | null;
  severity: Alert['severity'];
  timestamp: string;
  description: string | null;
  ai_explanation: string | null;
  status: Alert['status'];
  updated_at: string | null;
};

type ExportRow = ScopedRow & {
  target: SiemExportRecord['target'];
  exported_at: string;
  alert_count: number;
  alert_titles: string[] | null;
};

function preferUserScopedRows<T extends ScopedRow>(rows: T[]) {
  const sortedRows = [...rows].sort((left, right) => {
    return Number(Boolean(right.user_id)) - Number(Boolean(left.user_id));
  });

  const dedupedRows = new Map<string, T>();

  for (const row of sortedRows) {
    if (!dedupedRows.has(row.id)) {
      dedupedRows.set(row.id, row);
    }
  }

  return [...dedupedRows.values()];
}

async function getCurrentUserScope() {
  const supabase = getSupabase();

  if (!supabase) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  return {
    userId: user.id,
    ownerScope: user.id,
  };
}

export async function loadAssets(): Promise<Asset[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('ot_assets')
    .select('id, user_id, name, type, protocol, location, risk_score, status, last_seen, discovered_at, discovery_source, site');

  if (error) {
    console.warn('[OTShield Supabase] loadAssets:', error.message);
    return [];
  }

  return preferUserScopedRows((data ?? []) as AssetRow[])
    .map((row) => ({
      id: row.id,
      name: row.name,
      type: row.type,
      protocol: row.protocol,
      location: row.location,
      riskScore: row.risk_score,
      status: row.status,
      lastSeen: row.last_seen,
      discoveredAt: row.discovered_at ?? undefined,
      discoverySource: row.discovery_source ?? undefined,
      site: row.site ?? undefined,
    }))
    .sort((left, right) => left.id.localeCompare(right.id, undefined, { numeric: true }));
}

export async function saveAssets(assets: Asset[]): Promise<void> {
  const supabase = getSupabase();
  const scope = await getCurrentUserScope();

  if (!supabase || !scope || assets.length === 0) return;

  const rows = assets.map((asset) => ({
    id: asset.id,
    user_id: scope.userId,
    owner_scope: scope.ownerScope,
    name: asset.name,
    type: asset.type,
    protocol: asset.protocol,
    location: asset.location,
    risk_score: asset.riskScore,
    status: asset.status,
    last_seen: asset.lastSeen,
    discovered_at: asset.discoveredAt ?? null,
    discovery_source: asset.discoverySource ?? null,
    site: asset.site ?? null,
  }));

  const { error } = await supabase.from('ot_assets').upsert(rows, { onConflict: 'id,owner_scope' });
  if (error) console.warn('[OTShield Supabase] saveAssets:', error.message);
}

export async function loadAlerts(): Promise<Alert[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('ot_alerts')
    .select('id, user_id, title, device, affected_devices, severity, timestamp, description, ai_explanation, status, updated_at');

  if (error) {
    console.warn('[OTShield Supabase] loadAlerts:', error.message);
    return [];
  }

  return preferUserScopedRows((data ?? []) as AlertRow[])
    .map((row) => ({
      id: row.id,
      title: row.title,
      device: row.device,
      affectedDevices: Array.isArray(row.affected_devices) ? row.affected_devices : [],
      severity: row.severity,
      timestamp: row.timestamp,
      description: row.description ?? '',
      aiExplanation: row.ai_explanation ?? '',
      status: row.status,
      updatedAt: row.updated_at ?? undefined,
    }))
    .sort((left, right) => right.timestamp.localeCompare(left.timestamp));
}

export async function saveAlerts(alerts: Alert[]): Promise<void> {
  const supabase = getSupabase();
  const scope = await getCurrentUserScope();

  if (!supabase || !scope || alerts.length === 0) return;

  const rows = alerts.map((alert) => ({
    id: alert.id,
    user_id: scope.userId,
    owner_scope: scope.ownerScope,
    title: alert.title,
    device: alert.device,
    affected_devices: alert.affectedDevices,
    severity: alert.severity,
    timestamp: alert.timestamp,
    description: alert.description,
    ai_explanation: alert.aiExplanation,
    status: alert.status,
    updated_at: alert.updatedAt ?? null,
  }));

  const { error } = await supabase.from('ot_alerts').upsert(rows, { onConflict: 'id,owner_scope' });
  if (error) console.warn('[OTShield Supabase] saveAlerts:', error.message);
}

export async function loadExports(): Promise<SiemExportRecord[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('ot_siem_exports')
    .select('id, user_id, target, exported_at, alert_count, alert_titles');

  if (error) {
    console.warn('[OTShield Supabase] loadExports:', error.message);
    return [];
  }

  return preferUserScopedRows((data ?? []) as ExportRow[])
    .map((row) => ({
      id: row.id,
      target: row.target,
      exportedAt: row.exported_at,
      alertCount: row.alert_count,
      alertTitles: Array.isArray(row.alert_titles) ? row.alert_titles : [],
    }))
    .sort((left, right) => right.exportedAt.localeCompare(left.exportedAt));
}

export async function saveExports(records: SiemExportRecord[]): Promise<void> {
  const supabase = getSupabase();
  const scope = await getCurrentUserScope();

  if (!supabase || !scope || records.length === 0) return;

  const rows = records.map((record) => ({
    id: record.id,
    user_id: scope.userId,
    owner_scope: scope.ownerScope,
    target: record.target,
    exported_at: record.exportedAt,
    alert_count: record.alertCount,
    alert_titles: record.alertTitles,
  }));

  const { error } = await supabase
    .from('ot_siem_exports')
    .upsert(rows, { onConflict: 'id,owner_scope' });

  if (error) console.warn('[OTShield Supabase] saveExports:', error.message);
}

export async function clearUserState(): Promise<void> {
  const supabase = getSupabase();
  const scope = await getCurrentUserScope();

  if (!supabase || !scope) {
    return;
  }

  await Promise.all([
    supabase.from('ot_assets').delete().eq('user_id', scope.userId),
    supabase.from('ot_alerts').delete().eq('user_id', scope.userId),
    supabase.from('ot_siem_exports').delete().eq('user_id', scope.userId),
  ]);
}

export async function loadFullState(): Promise<{
  isConfigured: boolean;
  assets: Asset[];
  alerts: Alert[];
  exportHistory: SiemExportRecord[];
}> {
  const supabase = getSupabase();

  if (!supabase) {
    return {
      isConfigured: false,
      assets: [],
      alerts: [],
      exportHistory: [],
    };
  }

  const [assets, alerts, exportHistory] = await Promise.all([
    loadAssets(),
    loadAlerts(),
    loadExports(),
  ]);

  return {
    isConfigured: true,
    assets,
    alerts,
    exportHistory,
  };
}
