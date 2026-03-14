export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type DeviceStatus = 'Online' | 'Offline' | 'Warning';
export type Protocol = 'Modbus' | 'OPC-UA' | 'MQTT' | 'S7' | 'EtherNet/IP';
export type DiscoverySource = 'Seeded' | 'Simulated Scan';
export type DiscoveryStatus = 'Not Started' | 'Scanning' | 'Completed';
export type MonitoringStatus = 'Idle' | 'Streaming';

export interface Asset {
  id: string;
  name: string;
  type: string;
  protocol: Protocol;
  location: string;
  riskScore: number;
  status: DeviceStatus;
  lastSeen: string;
  discoveredAt?: string;
  discoverySource?: DiscoverySource;
  site?: string;
}

export interface NetworkEvent {
  id: string;
  source: string;
  destination: string;
  protocol: Protocol;
  eventType: string;
  description: string;
  timestamp: string;
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
}

export interface Alert {
  id: string;
  title: string;
  device: string;
  affectedDevices: string[];
  severity: RiskLevel;
  timestamp: string;
  description: string;
  aiExplanation: string;
  status: 'Open' | 'Resolved' | 'Acknowledged';
  updatedAt?: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  severity: RiskLevel;
}

export interface VulnerabilityFinding {
  id: string;
  assetId: string;
  assetName: string;
  severity: RiskLevel;
  category: 'Firmware' | 'Remote Access' | 'Protocol Exposure' | 'Segmentation';
  title: string;
  description: string;
  mitigation: string;
  status: 'Open' | 'Accepted';
}

export type SiemTarget = 'Splunk' | 'Microsoft Sentinel';

export interface SiemExportRecord {
  id: string;
  target: SiemTarget;
  exportedAt: string;
  alertCount: number;
  alertTitles: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  kind: 'alert' | 'export';
  severity?: RiskLevel;
  seen: boolean;
}

export const MOCK_ASSETS: Asset[] = [
  {
    id: '1',
    name: 'PLC-1',
    type: 'PLC',
    protocol: 'Modbus',
    location: 'Assembly Line A',
    riskScore: 85,
    status: 'Online',
    lastSeen: '2026-03-14 05:45:00',
    discoveredAt: '2026-03-14 05:30:00',
    discoverySource: 'Seeded',
    site: 'Plant 01',
  },
  {
    id: '2',
    name: 'RobotArm-2',
    type: 'Robot',
    protocol: 'OPC-UA',
    location: 'Welding Station 4',
    riskScore: 42,
    status: 'Online',
    lastSeen: '2026-03-14 05:48:12',
    discoveredAt: '2026-03-14 05:31:00',
    discoverySource: 'Seeded',
    site: 'Plant 01',
  },
  {
    id: '3',
    name: 'TempSensor-4',
    type: 'Sensor',
    protocol: 'MQTT',
    location: 'Boiler Room',
    riskScore: 12,
    status: 'Online',
    lastSeen: '2026-03-14 05:50:00',
    discoveredAt: '2026-03-14 05:31:30',
    discoverySource: 'Seeded',
    site: 'Plant 01',
  },
  {
    id: '4',
    name: 'Camera-1',
    type: 'Camera',
    protocol: 'MQTT',
    location: 'Main Entrance',
    riskScore: 65,
    status: 'Warning',
    lastSeen: '2026-03-14 05:40:00',
    discoveredAt: '2026-03-14 05:32:10',
    discoverySource: 'Seeded',
    site: 'Plant 01',
  },
  {
    id: '5',
    name: 'HMI-Panel-3',
    type: 'HMI',
    protocol: 'S7',
    location: 'Control Room',
    riskScore: 28,
    status: 'Online',
    lastSeen: '2026-03-14 05:52:00',
    discoveredAt: '2026-03-14 05:33:00',
    discoverySource: 'Seeded',
    site: 'Plant 01',
  },
  {
    id: '6',
    name: 'Gateway-01',
    type: 'Gateway',
    protocol: 'EtherNet/IP',
    location: 'Server Room',
    riskScore: 92,
    status: 'Online',
    lastSeen: '2026-03-14 05:53:00',
    discoveredAt: '2026-03-14 05:34:20',
    discoverySource: 'Seeded',
    site: 'Plant 01',
  },
  {
    id: '7',
    name: 'FlowMeter-2',
    type: 'Sensor',
    protocol: 'Modbus',
    location: 'Pipeline B',
    riskScore: 15,
    status: 'Offline',
    lastSeen: '2026-03-14 04:12:00',
    discoveredAt: '2026-03-14 05:35:10',
    discoverySource: 'Seeded',
    site: 'Plant 01',
  },
];

export const MOCK_EVENTS: NetworkEvent[] = [
  {
    id: 'e1',
    source: 'RobotArm-2',
    destination: 'PLC-1',
    protocol: 'OPC-UA',
    eventType: 'WRITE_COMMAND',
    description: 'Set target coordinates J1:45.2',
    timestamp: '2026-03-14 05:52:10',
    severity: 'info',
  },
  {
    id: 'e2',
    source: 'TempSensor-4',
    destination: 'PLC-1',
    protocol: 'MQTT',
    eventType: 'DATA_UPDATE',
    description: 'Temperature reading: 85.4°C',
    timestamp: '2026-03-14 05:52:15',
    severity: 'info',
  },
  {
    id: 'e3',
    source: 'UnknownDevice',
    destination: 'PLC-1',
    protocol: 'Modbus',
    eventType: 'EXECUTE',
    description: 'Unauthorized function code 0x05',
    timestamp: '2026-03-14 05:52:20',
    severity: 'high',
  },
  {
    id: 'e4',
    source: 'Camera-1',
    destination: 'Gateway-01',
    protocol: 'MQTT',
    eventType: 'STREAM_START',
    description: 'Video feed initiated',
    timestamp: '2026-03-14 05:52:25',
    severity: 'low',
  },
  {
    id: 'e5',
    source: 'Gateway-01',
    destination: 'PLC-1',
    protocol: 'EtherNet/IP',
    eventType: 'CONFIG_CHANGE',
    description: 'Firmware update check',
    timestamp: '2026-03-14 05:52:30',
    severity: 'medium',
  },
];

export const MOCK_ALERTS: Alert[] = [
  {
    id: 'a1',
    title: 'Possible PLC Command Injection',
    device: 'PLC-1',
    affectedDevices: ['PLC-1', 'HMI-Panel-3'],
    severity: 'High',
    timestamp: '2026-03-14 05:50:12',
    description: 'An unknown device attempted to write to restricted registers on PLC-1.',
    aiExplanation:
      'The pattern suggests a brute-force attempt to overwrite safety parameters. This is typical of Industroyer-style malware.',
    status: 'Open',
  },
  {
    id: 'a2',
    title: 'Anomalous Traffic Volume',
    device: 'Gateway-01',
    affectedDevices: ['Gateway-01'],
    severity: 'Medium',
    timestamp: '2026-03-14 05:45:00',
    description: 'Outbound traffic to external IP 185.x.x.x exceeded baseline by 400%.',
    aiExplanation:
      'Potential data exfiltration or C2 communication detected. The destination IP is flagged in threat intelligence feeds.',
    status: 'Acknowledged',
  },
  {
    id: 'a3',
    title: 'Device Offline: FlowMeter-2',
    severity: 'Low',
    device: 'FlowMeter-2',
    affectedDevices: ['FlowMeter-2'],
    timestamp: '2026-03-14 04:12:00',
    description: 'Heartbeat signal lost for over 30 minutes.',
    aiExplanation:
      'Likely a hardware failure or network segment isolation. No malicious activity detected prior to disconnect.',
    status: 'Open',
  },
];
