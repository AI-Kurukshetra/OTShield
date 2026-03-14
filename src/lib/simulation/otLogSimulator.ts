import { type Asset, type NetworkEvent, type Protocol } from '@/src/types';

const defaultDestinations = ['Gateway-01', 'Historian-01', 'PLC-1'];

function formatTimestamp(date: Date) {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function getEventTemplate(protocol: Protocol, index: number, source: Asset, assets: Asset[]) {
  const plcTargets = assets.filter(
    (asset) => asset.type.includes('PLC') || asset.type.includes('Controller'),
  );
  const defaultTarget =
    plcTargets[index % Math.max(plcTargets.length, 1)] ?? assets[index % assets.length] ?? source;

  switch (protocol) {
    case 'Modbus':
      return {
        eventType: index % 5 <= 1 ? 'WRITE_COMMAND' : 'READ_HOLDING_REGISTERS',
        description:
          index % 5 <= 1
            ? `Write command issued to ${defaultTarget.name} register block 40${index % 9}`
            : `Polling ${defaultTarget.name} register block 30${index % 9}`,
        destination: defaultTarget.name,
      };
    case 'OPC-UA':
      return {
        eventType: index % 4 === 0 ? 'BROWSE_REQUEST' : 'DATA_SUBSCRIPTION',
        description:
          index % 4 === 0
            ? `${source.name} browsed the OPC-UA namespace on ${defaultTarget.name}`
            : `${source.name} subscribed to telemetry updates from ${defaultTarget.name}`,
        destination: defaultTarget.name,
      };
    case 'EtherNet/IP':
      return {
        eventType: 'FORWARD_OPEN',
        description: `${source.name} opened an EtherNet/IP session with ${defaultTarget.name}`,
        destination: defaultTarget.name,
      };
    case 'S7':
      return {
        eventType: 'READ_VAR',
        description: `${source.name} requested process variables from ${defaultTarget.name}`,
        destination: defaultTarget.name,
      };
    default:
      return {
        eventType: 'DATA_UPDATE',
        description: `${source.name} reported telemetry to ${defaultTarget.name}`,
        destination: defaultTarget.name,
      };
  }
}

export function createSimulatedEvent({
  assets,
  eventIndex,
}: {
  assets: Asset[];
  eventIndex: number;
}): NetworkEvent {
  const source = assets[eventIndex % assets.length];
  const protocol = source.protocol;
  const eventTemplate = getEventTemplate(protocol, eventIndex, source, assets);
  const severity = eventIndex % 6 === 0 ? 'medium' : eventIndex % 9 === 0 ? 'high' : 'info';

  return {
    id: `sim-event-${eventIndex}`,
    source: source.name,
    destination:
      eventTemplate.destination ?? defaultDestinations[eventIndex % defaultDestinations.length],
    protocol,
    eventType: eventTemplate.eventType,
    description: eventTemplate.description,
    timestamp: formatTimestamp(new Date()),
    severity,
  };
}
