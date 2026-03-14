# OTShield

**OT security monitoring dashboard for industrial control systems.** Monitor PLCs, RTUs, sensors, gateways, and SCADA devices for anomalies and threats in real time.

## Overview

OTShield provides a Security Operations Center (SOC) experience for industrial environments. It tracks assets, network activity, and security alerts with a dark-themed UI and AI-assisted explanations.

## Core Features

- **Dashboard** — Overview stats, risk distribution, network activity charts, topology preview, recent alerts
- **Assets** — Device table (PLCs, RTUs, sensors, HMIs, gateways) with status, risk score, protocol
- **Network Activity** — Real-time event timeline (Modbus, OPC-UA, MQTT, S7, EtherNet/IP)
- **Alerts** — Expandable alert cards with severity, AI explanation, affected devices
- **AI Copilot** — Full-page chat assistant for security insights
- **Reports** — Compliance and audit reports

## Tech Stack

- **Framework**: Next.js 15, React 19
- **Styling**: Tailwind v4
- **Charts**: Recharts
- **Diagrams**: ReactFlow
- **Animation**: Motion (Framer Motion)
- **Tables**: TanStack Table
- **AI**: `@google/genai` (optional)

## Run Locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000). Root redirects to `/dashboard`.

## Environment Variables

| Variable                       | Description                                                                     |
| ------------------------------ | ------------------------------------------------------------------------------- |
| `GEMINI_API_KEY`               | API key for AI Copilot (Google Gemini). Get from [Google AI Studio](https://aistudio.google.com/apikey) |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Alternative env name; use one of the two. Optional; falls back to mock responses if not set |

**Where to add your key:** Create a `.env.local` file in the project root (copy from `.env.example`). Add your Codex/Google AI Studio key as `GEMINI_API_KEY=your_key_here`. Never commit `.env.local`.

## Project Structure

```text
src/
  app/
    (main)/           # Main app routes
      dashboard/
      assets/
      network/
      alerts/
      copilot/
      reports/
      layout.tsx      # Shared layout with sidebar
    layout.tsx
    page.tsx          # Redirects to /dashboard
  components/
    dashboard/        # Dashboard widgets
    layout/           # AppLayout, Sidebar, Header
    common/           # Button, PageHeader, SearchInput
    AICopilot.tsx
    Alerts.tsx
    Assets.tsx
    NetworkActivity.tsx
    Reports.tsx
    UI.tsx            # CyberCard, RiskBadge, ProtocolBadge, StatusIndicator
  lib/
    severity.ts       # getSeverityStyles
    utils.ts          # cn()
  types.ts            # Asset, NetworkEvent, Alert, mock data
docs/
  PROJECT_REFERENCE.md
```

## Planned Additions (MVP)

- Toast notifications for new alerts
- AI Chat widget (floating bottom-right)
- Threat Intelligence page
