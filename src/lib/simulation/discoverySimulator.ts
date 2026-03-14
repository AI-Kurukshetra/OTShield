import { type Asset, MOCK_ASSETS } from '@/src/types';

const seededDiscoveryQueue: Asset[] = [
  ...MOCK_ASSETS,
  {
    id: '8',
    name: 'Historian-01',
    type: 'Historian',
    protocol: 'OPC-UA',
    location: 'Data Center Rack A',
    riskScore: 38,
    status: 'Online',
    lastSeen: '2026-03-14 05:54:20',
    discoveredAt: '2026-03-14 05:36:05',
    discoverySource: 'Simulated Scan',
    site: 'Plant 01',
  },
  {
    id: '9',
    name: 'Eng-WS-07',
    type: 'Engineering Workstation',
    protocol: 'EtherNet/IP',
    location: 'Engineering Bay',
    riskScore: 74,
    status: 'Online',
    lastSeen: '2026-03-14 05:55:12',
    discoveredAt: '2026-03-14 05:36:40',
    discoverySource: 'Simulated Scan',
    site: 'Plant 01',
  },
  {
    id: '10',
    name: 'PLC-Packaging-02',
    type: 'PLC',
    protocol: 'Modbus',
    location: 'Packaging Line 2',
    riskScore: 81,
    status: 'Online',
    lastSeen: '2026-03-14 05:55:50',
    discoveredAt: '2026-03-14 05:37:10',
    discoverySource: 'Simulated Scan',
    site: 'Plant 01',
  },
  {
    id: '11',
    name: 'HMI-Blending-01',
    type: 'HMI',
    protocol: 'S7',
    location: 'Blending Station',
    riskScore: 44,
    status: 'Warning',
    lastSeen: '2026-03-14 05:56:08',
    discoveredAt: '2026-03-14 05:37:45',
    discoverySource: 'Simulated Scan',
    site: 'Plant 01',
  },
  {
    id: '12',
    name: 'Safety-Controller-01',
    type: 'Safety Controller',
    protocol: 'EtherNet/IP',
    location: 'Assembly Line B',
    riskScore: 88,
    status: 'Online',
    lastSeen: '2026-03-14 05:56:20',
    discoveredAt: '2026-03-14 05:38:20',
    discoverySource: 'Simulated Scan',
    site: 'Plant 01',
  },
];

export function getSeededAssets() {
  return seededDiscoveryQueue.slice(0, 3);
}

export function getDiscoveryQueue() {
  return seededDiscoveryQueue.map((asset, index) => ({
    ...asset,
    discoveredAt: asset.discoveredAt ?? `2026-03-14 05:${String(30 + index).padStart(2, '0')}:00`,
  }));
}
