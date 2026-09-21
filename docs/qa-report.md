# QA Report — Jira/Confluence Automation Web App

**Date:** 2026-09-21
**Environment:** Local dev (docker-compose postgres, API on http://localhost:3000, web on http://localhost:5173)

## Pages Visited

| Page | URL | Status |
|---|---|---|
| Root shell | `/` | Loaded successfully |

Only one page is reachable in the running application. The following page components exist in source but are not wired into routing, so they could not be visited or tested:
- [DashboardPage.tsx](../apps/web/src/pages/DashboardPage.tsx)
- [HistoryPage.tsx](../apps/web/src/pages/HistoryPage.tsx)
- [SettingsPage.tsx](../apps/web/src/pages/SettingsPage.tsx)

## Elements Tested

On the root page (`/`):
- Heading: "Jira/Confluence Automation" — renders correctly
- Paragraph: "Frontend shell is running." — renders correctly
- No buttons, links, forms, or inputs are present on this page.

## Bugs Found

1. **No routing configured** — [App.tsx](../apps/web/src/App.tsx) renders only a static shell and does not use any router (e.g. `react-router`). The existing Dashboard, History, and Settings pages are unreachable from the browser.
2. **No main user flow implemented** — there are no forms, inputs, or submit actions on the reachable page, so the primary user flow (e.g. submitting a Jira/Confluence request) could not be exercised or verified.

## Fixes Applied

None. No code changes were made during this session; findings above are based on observation only.

## Current Status

- Infrastructure (docker-compose postgres, API server, web dev server) starts and runs without errors.
- Frontend application is a placeholder shell with no functional UI, routing, or forms yet.
- End-to-end user flow testing is blocked until routing and page content/forms are implemented and wired up.
