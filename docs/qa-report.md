# QA Report — Jira/Confluence Automation Web App

**Date:** 2026-09-21
**Environment:** Local dev (docker-compose postgres, API on http://localhost:3000, web on http://localhost:5173)

## Pages Visited

| Page | URL | Status |
|---|---|---|
| Home | `/` | Loaded successfully |
| Sprint Board | `/sprint-board` | Loaded successfully |
| Issue Detail | `/issues/:issueId` | Loaded successfully |
| Create Issue | `/issues/new` | Loaded successfully |
| Edit Issue | `/issues/:issueId/edit` | Loaded successfully |

The following page components still exist in source but remain unwired and were not part of this session's testing:
- [DashboardPage.tsx](../apps/web/src/pages/DashboardPage.tsx)
- [HistoryPage.tsx](../apps/web/src/pages/HistoryPage.tsx)
- [SettingsPage.tsx](../apps/web/src/pages/SettingsPage.tsx)

## Elements Tested

- **Home** (`/`): heading and static text render correctly; "Home" / "Sprint Board" nav links work.
- **Sprint Board** (`/sprint-board`): issues render as cards grouped into To Do / In Progress / In Review / Done columns; "+ New Issue" link; each issue card links to its detail page.
- **Issue Detail** (`/issues/:issueId`): displays key, summary, description, status, assignee, team name, story points, priority; "← Back to Sprint Board" and "Edit" links.
- **Create Issue form** (`/issues/new`): Summary, Description, Status (select), Assignee, Team Name, Story Points (number), Priority (select), submit button.
  - Submitting with required fields (Summary/Assignee/Team Name) empty was correctly blocked by native HTML `required` validation.
  - Submitting with valid data created a new issue (e.g. JCA-106), redirected to its detail page with correct field values, and the new card appeared in the correct Sprint Board column.
- **Edit Issue form** (`/issues/:issueId/edit`): pre-populates all fields with the existing issue's values correctly.
- **Browser console**: checked after navigating/reloading — no JavaScript errors or warnings observed.

## Bugs Found

1. ~~No routing configured~~ — **Fixed.**
2. ~~No main user flow implemented~~ — **Fixed** (Create/Edit Issue flow now exists).
3. **Dead validation code (minor, not fixed):** the custom `error` state/message in [IssueFormPage.tsx](../apps/web/src/pages/IssueFormPage.tsx) for missing required fields is unreachable in practice, since native HTML `required` attributes on Summary/Assignee/Team Name block submission before the custom validation logic runs.
4. **Data is in-memory only (by design, not a bug):** issues created/edited via [mockIssues.ts](../apps/web/src/services/mockIssues.ts) reset on a full page reload since there is no backend persistence yet (`jiraClient.ts` / `apiClient.ts` are still empty).

## Fixes Applied

- Added `react-router-dom`; wired `BrowserRouter` in [main.tsx](../apps/web/src/main.tsx) and routes/nav in [App.tsx](../apps/web/src/App.tsx).
- Added [SprintBoardPage.tsx](../apps/web/src/pages/SprintBoardPage.tsx) and [IssueDetailPage.tsx](../apps/web/src/pages/IssueDetailPage.tsx).
- Added [IssueFormPage.tsx](../apps/web/src/pages/IssueFormPage.tsx) shared between create (`/issues/new`) and edit (`/issues/:issueId/edit`) flows.
- Added `Issue`/`IssueFormValues` types in [types/index.ts](../apps/web/src/types/index.ts) and mock data + `createIssue`/`updateIssue`/`getIssueById` helpers in [mockIssues.ts](../apps/web/src/services/mockIssues.ts).
- Repaired a broken `node_modules` install (missing `react`/`react-dom` in `apps/web`) by reinstalling from the workspace root, and cleared a stale Vite dependency cache.

## Current Status

- Infrastructure (docker-compose postgres, API server, web dev server) starts and runs without errors.
- Frontend now has a working Sprint Board + Issue Detail + Create/Edit Issue flow, backed by in-memory mock data.
- No console errors or warnings observed during testing.
- Outstanding: wire the form/board to the real API (`jiraClient.ts`, `apiClient.ts` are still unimplemented) so data persists beyond a page reload; clean up the unreachable validation error branch in `IssueFormPage.tsx`.

