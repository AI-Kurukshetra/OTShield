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
- **AI**: OpenAI Responses API (optional)
- **Database/Auth**: Supabase (`@supabase/supabase-js`, `@supabase/ssr`)

## Run Locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000). Root redirects to `/dashboard` in demo mode, or `/login` when Supabase auth is enabled.

## Environment Variables

| Variable                         | Description                                                                     |
| -------------------------------- | ------------------------------------------------------------------------------- |
| `OPENAI_API_KEY`                 | API key for AI Copilot                                                          |
| `NEXT_PUBLIC_SUPABASE_URL`       | Supabase project URL (optional; enables auth and DB-backed state)               |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`  | Supabase anon key (optional; used by auth and browser persistence)              |

**Setup:** Copy `.env.example` to `.env.local` and fill in your keys.

### Setup with Supabase

1. Create a Supabase project and get the project URL and anon key.
2. Run [schema.sql](/Users/admin/Desktop/hackathon/OTShield/supabase/schema.sql) in the Supabase SQL Editor.
3. Run [seed.sql](/Users/admin/Desktop/hackathon/OTShield/supabase/seed.sql) in the Supabase SQL Editor.
4. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`.
5. Restart the app.

When Supabase is configured:
- `/login` and `/signup` become active
- the main app requires an authenticated session
- assets, alerts, and SIEM exports load from Supabase first
- shared seeded baseline rows remain visible, while user changes are stored as user-scoped overlay rows

When Supabase is not configured:
- auth is disabled
- the app falls back to in-memory mock/demo mode

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

## Current Demo Notes

- Shared chat state powers both the floating copilot widget and the full `/copilot` page
- Supabase-backed mode persists user-scoped assets, alert triage, and SIEM export history
- Local fallback mode remains available for no-config demo environments
