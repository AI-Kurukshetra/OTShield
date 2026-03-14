# OTShield Project Reference

## Overview

OTShield is an **OT (Operational Technology) security monitoring** dashboard for industrial control systems. It monitors PLCs, RTUs, sensors, gateways, and SCADA devices for anomalies and threats in real time.

---

## Tech Stack

| Layer     | Technology               |
| --------- | ------------------------ |
| Framework | Next.js 15, React 19     |
| Styling   | Tailwind v4              |
| Charts    | Recharts                 |
| Diagrams  | ReactFlow                |
| Animation | Motion (Framer Motion)   |
| Tables    | TanStack Table           |
| AI        | @google/genai (optional) |

---

## Feature Checklist vs Implementation

| Feature                      | Spec                             | Status     | Notes                                                                                             |
| ---------------------------- | -------------------------------- | ---------- | ------------------------------------------------------------------------------------------------- |
| Dashboard                    | Stats, charts, topology          | ✅ Done    | StatCard, RiskDistributionChart, NetworkActivityChart, NetworkTopologyPreview, RecentAlertsWidget |
| Device Monitoring            | Table of assets                  | ✅ Done    | Assets.tsx – PLC, RTU, sensors, status, risk                                                      |
| Network Activity             | Event timeline                   | ✅ Done    | NetworkActivity.tsx                                                                               |
| Alerts                       | Expandable cards, AI explanation | ✅ Done    | Alerts.tsx with AlertCard                                                                         |
| AI Copilot                   | Full-page chat                   | ✅ Done    | AICopilot.tsx                                                                                     |
| Reports                      | Compliance reports               | ✅ Done    | Reports.tsx                                                                                       |
| **Toast notifications**      | Pop-up on new alerts             | ❌ Planned | MVP – Toast.tsx, ToastProvider                                                                    |
| **AI Chat Widget**           | Floating button bottom-right     | ❌ Planned | MVP – ChatWidget.tsx                                                                              |
| **Threat Intelligence**      | Dedicated threat list            | ❌ Planned | MVP – ThreatIntelligence.tsx                                                                      |
| Network Topology (ReactFlow) | Interactive canvas               | Deferred   | Dashboard has topology preview for MVP                                                            |

---

## Architecture

```
src/
  app/
    (main)/                    # Main console layout
      dashboard/page.tsx
      assets/page.tsx
      network/page.tsx
      alerts/page.tsx
      copilot/page.tsx
      reports/page.tsx
      layout.tsx               # AppLayout wrapper
    layout.tsx                 # Root layout
    page.tsx                   # Redirects to /dashboard
  components/
    dashboard/                 # Dashboard widgets
    layout/                   # AppLayout, Sidebar, Header
    common/                   # Button, PageHeader, SearchInput
    UI.tsx                    # CyberCard, RiskBadge, ProtocolBadge, StatusIndicator
    Alerts.tsx, Assets.tsx, NetworkActivity.tsx
    Reports.tsx, AICopilot.tsx
  lib/
    severity.ts               # getSeverityStyles()
    utils.ts                  # cn()
  types.ts                    # Asset, NetworkEvent, Alert, mock data
```

---

## Data Model

### Asset

```ts
{
  (id, name, type, protocol, location, riskScore, status, lastSeen);
}
```

- **RiskLevel**: Low | Medium | High | Critical
- **DeviceStatus**: Online | Offline | Warning
- **Protocol**: Modbus | OPC-UA | MQTT | S7 | EtherNet/IP

### NetworkEvent

```ts
{
  (id, source, destination, protocol, eventType, description, timestamp, severity);
}
```

- **severity**: info | low | medium | high | critical

### Alert

```ts
{
  (id, title, device, affectedDevices, severity, timestamp, description, aiExplanation, status);
}
```

- **status**: Open | Resolved | Acknowledged

### Mock Data

- `MOCK_ASSETS`, `MOCK_EVENTS`, `MOCK_ALERTS` in `src/types.ts`

---

## Design System

- **Theme**: Dark SOC (Security Operations Center), scanline effect
- **Card**: `CyberCard` – glass-panel, rounded-2xl, brand-primary accent
- **Badges**: `RiskBadge`, `ProtocolBadge`, `StatusIndicator`
- **Severity** (`getSeverityStyles`): Low/green, Medium/amber, High/orange, Critical/red

---

## Routes

| Path         | Component                 |
| ------------ | ------------------------- |
| `/`          | Redirects to `/dashboard` |
| `/dashboard` | Dashboard                 |
| `/assets`    | Assets                    |
| `/network`   | Network Activity          |
| `/alerts`    | Alerts                    |
| `/copilot`   | AI Copilot                |
| `/reports`   | Reports                   |

---

## MVP Additions (Planned)

1. **Simulation** – `src/lib/simulation/otLogSimulator.ts`, `anomalyDetector.ts`
2. **Toast** – `Toast.tsx`, `ToastProvider`, severity-styled
3. **Chat Widget** – Extract from AICopilot, floating bottom-right
4. **Threat Intelligence** – New page, threat list with mitigation
