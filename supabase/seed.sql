-- OTShield shared baseline seed
-- Run after schema.sql in the Supabase SQL Editor.
--
-- Seeds all assets and alerts so loadFullState() returns data from Supabase.
-- Matches discoverySimulator.ts and MOCK_ALERTS for consistent local testing.

insert into ot_assets (
  id,
  user_id,
  owner_scope,
  name,
  type,
  protocol,
  location,
  risk_score,
  status,
  last_seen,
  discovered_at,
  discovery_source,
  site
)
values
  ('1', null, 'shared', 'PLC-1', 'PLC', 'Modbus', 'Assembly Line A', 85, 'Online', '2026-03-14 05:45:00', '2026-03-14 05:30:00', 'Seeded', 'Plant 01'),
  ('2', null, 'shared', 'RobotArm-2', 'Robot', 'OPC-UA', 'Welding Station 4', 42, 'Online', '2026-03-14 05:48:12', '2026-03-14 05:31:00', 'Seeded', 'Plant 01'),
  ('3', null, 'shared', 'TempSensor-4', 'Sensor', 'MQTT', 'Boiler Room', 12, 'Online', '2026-03-14 05:50:00', '2026-03-14 05:31:30', 'Seeded', 'Plant 01'),
  ('4', null, 'shared', 'Camera-1', 'Camera', 'MQTT', 'Main Entrance', 65, 'Warning', '2026-03-14 05:40:00', '2026-03-14 05:32:10', 'Seeded', 'Plant 01'),
  ('5', null, 'shared', 'HMI-Panel-3', 'HMI', 'S7', 'Control Room', 28, 'Online', '2026-03-14 05:52:00', '2026-03-14 05:33:00', 'Seeded', 'Plant 01'),
  ('6', null, 'shared', 'Gateway-01', 'Gateway', 'EtherNet/IP', 'Server Room', 92, 'Online', '2026-03-14 05:53:00', '2026-03-14 05:34:20', 'Seeded', 'Plant 01'),
  ('7', null, 'shared', 'FlowMeter-2', 'Sensor', 'Modbus', 'Pipeline B', 15, 'Offline', '2026-03-14 04:12:00', '2026-03-14 05:35:10', 'Seeded', 'Plant 01'),
  ('8', null, 'shared', 'Historian-01', 'Historian', 'OPC-UA', 'Data Center Rack A', 38, 'Online', '2026-03-14 05:54:20', '2026-03-14 05:36:05', 'Simulated Scan', 'Plant 01'),
  ('9', null, 'shared', 'Eng-WS-07', 'Engineering Workstation', 'EtherNet/IP', 'Engineering Bay', 74, 'Online', '2026-03-14 05:55:12', '2026-03-14 05:36:40', 'Simulated Scan', 'Plant 01'),
  ('10', null, 'shared', 'PLC-Packaging-02', 'PLC', 'Modbus', 'Packaging Line 2', 81, 'Online', '2026-03-14 05:55:50', '2026-03-14 05:37:10', 'Simulated Scan', 'Plant 01'),
  ('11', null, 'shared', 'HMI-Blending-01', 'HMI', 'S7', 'Blending Station', 44, 'Warning', '2026-03-14 05:56:08', '2026-03-14 05:37:45', 'Simulated Scan', 'Plant 01'),
  ('12', null, 'shared', 'Safety-Controller-01', 'Safety Controller', 'EtherNet/IP', 'Assembly Line B', 88, 'Online', '2026-03-14 05:56:20', '2026-03-14 05:38:20', 'Simulated Scan', 'Plant 01')
on conflict (id, owner_scope) do update
set
  name = excluded.name,
  type = excluded.type,
  protocol = excluded.protocol,
  location = excluded.location,
  risk_score = excluded.risk_score,
  status = excluded.status,
  last_seen = excluded.last_seen,
  discovered_at = excluded.discovered_at,
  discovery_source = excluded.discovery_source,
  site = excluded.site;

insert into ot_alerts (
  id,
  user_id,
  owner_scope,
  title,
  device,
  affected_devices,
  severity,
  timestamp,
  description,
  ai_explanation,
  status,
  updated_at
)
values
  (
    'a1',
    null,
    'shared',
    'Possible PLC Command Injection',
    'PLC-1',
    '["PLC-1","HMI-Panel-3"]'::jsonb,
    'High',
    '2026-03-14 05:50:12',
    'An unknown device attempted to write to restricted registers on PLC-1.',
    'The pattern suggests a brute-force attempt to overwrite safety parameters. This is typical of Industroyer-style malware.',
    'Open',
    null
  ),
  (
    'a2',
    null,
    'shared',
    'Anomalous Traffic Volume',
    'Gateway-01',
    '["Gateway-01"]'::jsonb,
    'Medium',
    '2026-03-14 05:45:00',
    'Outbound traffic to external IP 185.x.x.x exceeded baseline by 400%.',
    'Potential data exfiltration or C2 communication detected. The destination IP is flagged in threat intelligence feeds.',
    'Acknowledged',
    '2026-03-14 05:46:30'
  ),
  (
    'a3',
    null,
    'shared',
    'Device Offline: FlowMeter-2',
    'FlowMeter-2',
    '["FlowMeter-2"]'::jsonb,
    'Low',
    '2026-03-14 04:12:00',
    'Heartbeat signal lost for over 30 minutes.',
    'Likely a hardware failure or network segment isolation. No malicious activity detected prior to disconnect.',
    'Open',
    null
  )
on conflict (id, owner_scope) do update
set
  title = excluded.title,
  device = excluded.device,
  affected_devices = excluded.affected_devices,
  severity = excluded.severity,
  timestamp = excluded.timestamp,
  description = excluded.description,
  ai_explanation = excluded.ai_explanation,
  status = excluded.status,
  updated_at = excluded.updated_at;
