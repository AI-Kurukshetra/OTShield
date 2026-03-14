# OTShield

OTShield is now organized as a proper Next.js App Router application instead of a
single client page with tab state pretending to be routing.

## Architecture

```text
src/
  app/
    (console)/
      alerts/
      assets/
      copilot/
      dashboard/
      network/
      reports/
      layout.tsx
    layout.tsx
    page.tsx
  components/
    dashboard-shell/
    ui/
  config/
    navigation.ts
  data/
    mock/
  features/
    alerts/
    assets/
    copilot/
    dashboard/
    network/
    reports/
  lib/
  types/
```

## Run Locally

1. Install dependencies with `npm install`.
2. Start the development server with `npm run dev`.
3. Open `http://localhost:3000`.

## Notes

- Root requests redirect to `/dashboard`.
- Each major console section now has its own route and page entrypoint.
- Shared shell, UI primitives, config, and mock data live in dedicated folders.
