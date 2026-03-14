'use client';

import React from 'react';
import { getDiscoveryQueue, getSeededAssets } from '@/src/lib/simulation/discoverySimulator';
import { createBootstrapAlerts, detectAnomaly } from '@/src/lib/simulation/anomalyDetector';
import { createSimulatedEvent } from '@/src/lib/simulation/otLogSimulator';
import { generateFindings } from '@/src/lib/simulation/vulnerabilityScanner';
import {
  type Asset,
  type DiscoveryStatus,
  type MonitoringStatus,
  type Alert,
  type NetworkEvent,
  type ToastMessage,
  type VulnerabilityFinding,
  type SiemExportRecord,
  type SiemTarget,
  type NotificationItem,
  MOCK_ALERTS,
  MOCK_EVENTS,
} from '@/src/types';

type SimulationContextValue = {
  assets: Asset[];
  alerts: Alert[];
  events: NetworkEvent[];
  findings: VulnerabilityFinding[];
  exportHistory: SiemExportRecord[];
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  toasts: ToastMessage[];
  discoveryStatus: DiscoveryStatus;
  discoveryProgress: number;
  monitoringStatus: MonitoringStatus;
  discoverAssets: () => void;
  resetDiscovery: () => void;
  acknowledgeAlert: (alertId: string) => void;
  resolveAlert: (alertId: string) => void;
  acknowledgeAllAlerts: () => void;
  exportAlertsToSiem: (target: SiemTarget, alertIds?: string[]) => void;
  markNotificationsSeen: () => void;
  dismissToast: (toastId: string) => void;
};

const SimulationContext = React.createContext<SimulationContextValue | null>(null);

const DISCOVERY_INTERVAL_MS = 850;
const MONITORING_INTERVAL_MS = 1500;
const MAX_EVENTS = 18;
const MAX_ALERTS = 12;
const TOAST_TTL_MS = 4200;

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const seededAssets = React.useMemo(() => getSeededAssets(), []);
  const discoveryQueue = React.useMemo(() => getDiscoveryQueue(), []);

  const [assets, setAssets] = React.useState<Asset[]>(seededAssets);
  const [events, setEvents] = React.useState<NetworkEvent[]>(MOCK_EVENTS);
  const [alerts, setAlerts] = React.useState<Alert[]>(MOCK_ALERTS);
  const [exportHistory, setExportHistory] = React.useState<SiemExportRecord[]>([]);
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([]);
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);
  const [discoveryStatus, setDiscoveryStatus] = React.useState<DiscoveryStatus>('Not Started');
  const [discoveryProgress, setDiscoveryProgress] = React.useState(
    Math.round((seededAssets.length / discoveryQueue.length) * 100),
  );
  const [monitoringStatus, setMonitoringStatus] = React.useState<MonitoringStatus>('Idle');

  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const monitoringIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const eventCounterRef = React.useRef(MOCK_EVENTS.length + 1);
  const toastTimeoutsRef = React.useRef<Record<string, NodeJS.Timeout>>({});
  const bootstrapShownRef = React.useRef(false);

  const dismissToast = React.useCallback((toastId: string) => {
    const timeout = toastTimeoutsRef.current[toastId];
    if (timeout) {
      clearTimeout(timeout);
      delete toastTimeoutsRef.current[toastId];
    }
    setToasts((prev) => prev.filter((toast) => toast.id !== toastId));
  }, []);

  const pushNotification = React.useCallback((notification: NotificationItem) => {
    setNotifications((prev) => [notification, ...prev].slice(0, 10));
  }, []);

  const pushToast = React.useCallback((toast: ToastMessage) => {
    setToasts((prev) => [toast, ...prev].slice(0, 4));

    toastTimeoutsRef.current[toast.id] = setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== toast.id));
      delete toastTimeoutsRef.current[toast.id];
    }, TOAST_TTL_MS);
  }, []);

  const findings = React.useMemo(() => generateFindings(assets), [assets]);
  const unreadNotificationCount = React.useMemo(
    () => notifications.filter((notification) => !notification.seen).length,
    [notifications],
  );

  const stopMonitoring = React.useCallback(() => {
    if (monitoringIntervalRef.current) {
      clearInterval(monitoringIntervalRef.current);
      monitoringIntervalRef.current = null;
    }
    setMonitoringStatus('Idle');
  }, []);

  const startMonitoring = React.useCallback(
    (currentAssets: Asset[]) => {
      if (monitoringIntervalRef.current || currentAssets.length === 0) {
        return;
      }

      setMonitoringStatus('Streaming');

      monitoringIntervalRef.current = setInterval(() => {
        const event = createSimulatedEvent({
          assets: currentAssets,
          eventIndex: eventCounterRef.current,
        });
        const maybeAlert = detectAnomaly(event, eventCounterRef.current);
        eventCounterRef.current += 1;

        setEvents((prev) => [event, ...prev].slice(0, MAX_EVENTS));

        if (maybeAlert) {
          setAlerts((prev) => [maybeAlert, ...prev].slice(0, MAX_ALERTS));
          pushNotification({
            id: `notification-${maybeAlert.id}`,
            title: maybeAlert.title,
            description: maybeAlert.description,
            createdAt: maybeAlert.timestamp,
            kind: 'alert',
            severity: maybeAlert.severity,
            seen: false,
          });
          pushToast({
            id: `toast-${maybeAlert.id}`,
            title: maybeAlert.title,
            description: maybeAlert.description,
            severity: maybeAlert.severity,
          });
        }
      }, MONITORING_INTERVAL_MS);
    },
    [pushNotification, pushToast],
  );

  const resetDiscovery = React.useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    stopMonitoring();
    setAssets(seededAssets);
    setEvents(MOCK_EVENTS);
    setAlerts(MOCK_ALERTS);
    setExportHistory([]);
    setNotifications([]);
    setToasts([]);
    setDiscoveryStatus('Not Started');
    setDiscoveryProgress(Math.round((seededAssets.length / discoveryQueue.length) * 100));
    eventCounterRef.current = MOCK_EVENTS.length + 1;
    bootstrapShownRef.current = false;
  }, [discoveryQueue.length, seededAssets, stopMonitoring]);

  const acknowledgeAlert = React.useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId && alert.status === 'Open'
          ? {
              ...alert,
              status: 'Acknowledged',
              updatedAt: new Date().toISOString(),
            }
          : alert,
      ),
    );
  }, []);

  const resolveAlert = React.useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId && alert.status !== 'Resolved'
          ? {
              ...alert,
              status: 'Resolved',
              updatedAt: new Date().toISOString(),
            }
          : alert,
      ),
    );
  }, []);

  const acknowledgeAllAlerts = React.useCallback(() => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.status === 'Open'
          ? {
              ...alert,
              status: 'Acknowledged',
              updatedAt: new Date().toISOString(),
            }
          : alert,
      ),
    );
  }, []);

  const exportAlertsToSiem = React.useCallback(
    (target: SiemTarget, alertIds?: string[]) => {
      const selectedAlerts =
        alertIds && alertIds.length > 0
          ? alerts.filter((alert) => alertIds.includes(alert.id))
          : alerts.filter((alert) => alert.status !== 'Resolved').slice(0, 5);

      if (selectedAlerts.length === 0) {
        pushToast({
          id: `toast-export-empty-${Date.now()}`,
          title: 'No alerts available for export',
          description: `There are no active alerts to send to ${target}.`,
          severity: 'Low',
        });
        return;
      }

      const record: SiemExportRecord = {
        id: `export-${Date.now()}`,
        target,
        exportedAt: new Date().toISOString(),
        alertCount: selectedAlerts.length,
        alertTitles: selectedAlerts.map((alert) => alert.title),
      };

      setExportHistory((prev) => [record, ...prev].slice(0, 6));
      pushNotification({
        id: `notification-${record.id}`,
        title: `Export prepared for ${target}`,
        description: `${selectedAlerts.length} alert payload${selectedAlerts.length > 1 ? 's' : ''} are ready for SIEM handoff.`,
        createdAt: record.exportedAt,
        kind: 'export',
        seen: false,
      });
      pushToast({
        id: `toast-${record.id}`,
        title: `Exported to ${target}`,
        description: `${selectedAlerts.length} alert payload${selectedAlerts.length > 1 ? 's' : ''} prepared for SIEM handoff.`,
        severity: 'Low',
      });
    },
    [alerts, pushNotification, pushToast],
  );

  const markNotificationsSeen = React.useCallback(() => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.seen ? notification : { ...notification, seen: true },
      ),
    );
  }, []);

  const discoverAssets = React.useCallback(() => {
    if (discoveryStatus === 'Scanning' || discoveryStatus === 'Completed') {
      return;
    }

    setDiscoveryStatus('Scanning');
    startMonitoring(discoveryQueue.slice(0, seededAssets.length));

    if (!bootstrapShownRef.current) {
      const bootstrapAlerts = createBootstrapAlerts(discoveryQueue.slice(0, 4));
      bootstrapShownRef.current = true;
      setAlerts((prev) => [...bootstrapAlerts, ...prev].slice(0, MAX_ALERTS));
      bootstrapAlerts.forEach((alert, index) => {
        setTimeout(() => {
          pushNotification({
            id: `notification-${alert.id}`,
            title: alert.title,
            description: alert.description,
            createdAt: alert.timestamp,
            kind: 'alert',
            severity: alert.severity,
            seen: false,
          });
          pushToast({
            id: `toast-${alert.id}`,
            title: alert.title,
            description: alert.description,
            severity: alert.severity,
          });
        }, index * 250);
      });
    }

    let nextIndex = seededAssets.length;

    intervalRef.current = setInterval(() => {
      if (nextIndex >= discoveryQueue.length) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setDiscoveryStatus('Completed');
        setDiscoveryProgress(100);
        return;
      }

      const nextAsset = discoveryQueue[nextIndex];
      nextIndex += 1;

      setAssets((prev) => [...prev, nextAsset]);
      setDiscoveryProgress(Math.round((nextIndex / discoveryQueue.length) * 100));

      if (nextIndex >= discoveryQueue.length) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setDiscoveryStatus('Completed');
        setDiscoveryProgress(100);
      }
    }, DISCOVERY_INTERVAL_MS);
  }, [
    discoveryQueue,
    discoveryStatus,
    pushNotification,
    pushToast,
    seededAssets.length,
    startMonitoring,
  ]);

  React.useEffect(() => {
    const toastTimeouts = toastTimeoutsRef.current;

    return () => {

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (monitoringIntervalRef.current) {
        clearInterval(monitoringIntervalRef.current);
      }
      Object.values(toastTimeouts).forEach((timeout) => clearTimeout(timeout));
    };
  }, []);

  React.useEffect(() => {
    if (discoveryStatus === 'Completed') {
      stopMonitoring();
      startMonitoring(assets);
    }
  }, [assets, discoveryStatus, startMonitoring, stopMonitoring]);

  const value = React.useMemo(
    () => ({
      assets,
      alerts,
      events,
      findings,
      exportHistory,
      notifications,
      unreadNotificationCount,
      toasts,
      discoveryStatus,
      discoveryProgress,
      monitoringStatus,
      discoverAssets,
      resetDiscovery,
      acknowledgeAlert,
      resolveAlert,
      acknowledgeAllAlerts,
      exportAlertsToSiem,
      markNotificationsSeen,
      dismissToast,
    }),
    [
      acknowledgeAlert,
      acknowledgeAllAlerts,
      alerts,
      assets,
      dismissToast,
      events,
      exportAlertsToSiem,
      exportHistory,
      findings,
      markNotificationsSeen,
      notifications,
      discoveryProgress,
      discoveryStatus,
      monitoringStatus,
      resolveAlert,
      discoverAssets,
      resetDiscovery,
      toasts,
      unreadNotificationCount,
    ],
  );

  return <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>;
}

export function useSimulation() {
  const context = React.useContext(SimulationContext);

  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }

  return context;
}
