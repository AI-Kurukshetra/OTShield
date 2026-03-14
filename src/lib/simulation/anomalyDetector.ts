import { type Alert, type Asset, type NetworkEvent } from '@/src/types';

function severityToRiskLevel(severity: NetworkEvent['severity']): Alert['severity'] {
  switch (severity) {
    case 'critical':
      return 'Critical';
    case 'high':
      return 'High';
    case 'medium':
      return 'Medium';
    default:
      return 'Low';
  }
}

export function detectAnomaly(event: NetworkEvent, index: number): Alert | null {
  const suspiciousModbusWrite =
    event.protocol === 'Modbus' && event.eventType === 'WRITE_COMMAND' && index % 2 === 0;
  const opcUaSpike =
    event.protocol === 'OPC-UA' && event.eventType === 'BROWSE_REQUEST' && index % 3 === 0;
  const gatewayDrift =
    event.destination.includes('Gateway') &&
    (event.severity === 'high' || event.severity === 'medium') &&
    index % 4 === 0;

  if (!suspiciousModbusWrite && !opcUaSpike && !gatewayDrift) {
    return null;
  }

  const title = suspiciousModbusWrite
    ? 'Unauthorized Modbus Write Pattern'
    : opcUaSpike
      ? 'OPC-UA Enumeration Spike'
      : 'Abnormal Gateway Traffic Drift';
  const description = suspiciousModbusWrite
    ? `${event.source} attempted repeated write activity against ${event.destination}.`
    : opcUaSpike
      ? `${event.source} is aggressively browsing namespaces on ${event.destination}.`
      : `${event.source} generated unusual traffic volume toward ${event.destination}.`;
  const aiExplanation = suspiciousModbusWrite
    ? 'This resembles a potentially unsafe control-write sequence. Validate whether the command originated from an approved workstation.'
    : opcUaSpike
      ? 'Namespace enumeration spikes often precede deeper reconnaissance. Confirm whether this activity matches a maintenance task.'
      : 'The traffic pattern differs from the expected gateway baseline. Review external communication paths and rule changes.';

  return {
    id: `sim-alert-${event.id}`,
    title,
    device: event.destination,
    affectedDevices: [event.destination, event.source],
    severity: severityToRiskLevel(event.severity === 'info' ? 'medium' : event.severity),
    timestamp: event.timestamp,
    description,
    aiExplanation,
    status: 'Open',
  };
}

export function createBootstrapAlerts(assets: Asset[]): Alert[] {
  const [primaryAsset, secondaryAsset, tertiaryAsset, quaternaryAsset] = assets;

  return [
    {
      id: 'bootstrap-critical',
      title: 'Critical PLC Write Override Attempt',
      device: primaryAsset?.name ?? 'PLC-1',
      affectedDevices: [primaryAsset?.name ?? 'PLC-1', secondaryAsset?.name ?? 'Eng-WS-07'],
      severity: 'Critical',
      timestamp: new Date().toISOString(),
      description:
        'Unsafe write activity was detected against a control register tied to production logic.',
      aiExplanation:
        'This simulated incident represents an urgent control-path integrity event and should be isolated immediately.',
      status: 'Open',
    },
    {
      id: 'bootstrap-high',
      title: 'High OPC-UA Enumeration Burst',
      device: secondaryAsset?.name ?? 'Historian-01',
      affectedDevices: [
        secondaryAsset?.name ?? 'Historian-01',
        tertiaryAsset?.name ?? 'HMI-Panel-3',
      ],
      severity: 'High',
      timestamp: new Date().toISOString(),
      description:
        'Aggressive namespace browsing suggests reconnaissance against the OT data plane.',
      aiExplanation:
        'This simulated burst mirrors the early phase of operator workstation reconnaissance.',
      status: 'Open',
    },
    {
      id: 'bootstrap-medium',
      title: 'Medium Gateway Traffic Drift',
      device: tertiaryAsset?.name ?? 'Gateway-01',
      affectedDevices: [tertiaryAsset?.name ?? 'Gateway-01'],
      severity: 'Medium',
      timestamp: new Date().toISOString(),
      description:
        'Gateway traffic volume exceeded the expected maintenance baseline for the current shift.',
      aiExplanation:
        'This simulated condition highlights policy drift or unusual external communications.',
      status: 'Open',
    },
    {
      id: 'bootstrap-low',
      title: 'Low Sensor Heartbeat Jitter',
      device: quaternaryAsset?.name ?? 'FlowMeter-2',
      affectedDevices: [quaternaryAsset?.name ?? 'FlowMeter-2'],
      severity: 'Low',
      timestamp: new Date().toISOString(),
      description:
        'A non-critical telemetry sensor briefly exceeded its normal heartbeat interval.',
      aiExplanation:
        'This simulated low-severity event is useful to show the lower end of operational alerting.',
      status: 'Open',
    },
  ];
}
