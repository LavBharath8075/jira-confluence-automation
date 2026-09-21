# Specification Implementation Checklist

**Specification:** `spec/specification.md`  
**Reviewed:** 2026-09-21  
**Implementation reviewed:** `apps/api`, `apps/web`, `packages/shared`, `docker-compose.yml`, repository tests/configuration  
**Overall status:** Foundation smoke tests pass; product functionality is not implemented.

## Status legend

- **Verified:** Implemented and tested successfully.
- **Partial:** Some supporting behavior exists, but the requirement is not satisfied end to end.
- **Missing:** No implementation exists.
- **Blocked:** Cannot be meaningfully verified because prerequisite decisions or implementation are absent.

## 1. Verification evidence

| Check | Result | Evidence |
|---|---|---|
| Backend startup | Verified | Express server running on `http://localhost:3000`. |
| Backend health endpoint | Verified | `GET /health` returned HTTP 200 and `{"status":"ok","service":"api"}`. |
| Frontend startup | Verified | Vite served `http://127.0.0.1:5173/` with HTTP 200 and a React root element. |
| Frontend type check | Verified | Direct local `tsc --noEmit` exited successfully. |
| Frontend production build | Verified | Direct local Vite build completed successfully. |
| PostgreSQL startup | Verified | Docker Compose PostgreSQL 15 container reported `healthy`. |
| PostgreSQL connectivity | Verified | `pg_isready -U app -d jira_automation` reported `accepting connections`. |
| Jira integration | Missing | No Jira client implementation; `apps/api/src/services/jiraClient.ts` is empty. |
| Confluence integration | Missing | No Confluence client/service exists. |
| Report generation | Missing | No report service or renderer implementation. |
| Persistence/history | Missing | Repository/database files are empty; no migrations exist. |
| Automated product tests | Missing | Test directories contain only `.gitkeep` placeholders. |

## 2. Product boundary and goals

| Requirement | Status | Assessment |
|---|---|---|
| React 18/Vite replaces Streamlit runtime | Partial | The React/Vite shell exists, but it is not the specified application workflow. Streamlit replacement behavior has not been tested. |
| Existing calculator/mock dashboard remains runnable | Not verifiable | No compatibility test was run as part of this implementation; the new app does not reference it. |
| Confluence is optional and feature-flagged | Missing | No feature flag or Confluence configuration exists. The shell works without Confluence, but optional capability behavior is not implemented. |
| Reduce manual weekly reporting effort | Missing | No reporting workflow exists. |
| Provide completed/WIP/trend view | Missing | No Jira retrieval or metrics service exists. |
| Surface migration highlights, risks, dependencies, readiness | Missing | No data model, editor, or report generation exists. |
| Preserve generated reports/history | Missing | No database schema, migrations, repositories, or history API exists. |
| Maintain Jira issue traceability | Missing | No Jira keys, links, or normalized issues are implemented. |
| Publish an authorized report to Confluence when enabled | Missing | No authorization, feature flag, publication service, or UI exists. |
| Make incomplete/stale/partial data visible | Missing | No completeness state or warning model exists. |

## 3. User journeys

| Journey | Status | Assessment |
|---|---|---|
| A — Generate current weekly report | Missing | Only the static frontend shell and API health check exist. |
| B — Review/regenerate history | Missing | No report history, persistence, regeneration, or comparison implementation exists. |
| C — Publish to Confluence | Missing | No Confluence adapter, publication API, confirmation UI, or audit record exists. |
| D — Handle incomplete/failed Jira retrieval | Missing | No Jira calls, retry policy, completeness states, or partial-result UI exists. |

## 4. Functional requirements

### FR-1 — Reporting period selection

**Status:** Missing

- No previous completed Monday–Sunday calculation exists.
- No `America/New_York` timezone handling exists.
- No historical period selector exists.
- No three-month horizon enforcement exists.
- No selected period is stored with a report.

**Works:** No implementation to test.

### FR-2 — Jira connection and retrieval

**Status:** Missing

- No Jira client or authentication exists.
- No project `EPMCDMETST` query exists.
- No pagination, retry, timeout, or rate-limit handling exists.
- No normalized issue record exists.
- No completed-work or WIP query exists.
- The frontend does not call Jira directly, but only because no integration exists; this is not an implemented boundary.

**Works:** Not testable until a Jira adapter and fixtures/sandbox are available.

### FR-3 — Jira field and status mappings

**Status:** Missing

- `config/field-mappings.toml` is empty.
- `fieldMappings.ts` is empty.
- No logical-field mapping schema exists.
- No fallback precedence, type validation, conflict handling, or mapping version exists.
- No optional-field warnings exist.

**Works:** No implementation to test.

### FR-4 — Data preview and quality warnings

**Status:** Missing

- No issue-count or metric preview exists.
- No missing-field, unmapped-status, pagination, or history warnings exist.
- No actionable Jira error presentation exists.
- No warning persistence exists.

**Works:** The frontend shell loads, but it displays no preview or warnings.

### FR-5 — Product Owner narrative and RAG input

**Status:** Missing

- No narrative editor exists.
- No executive summary, progress, highlights, risks, or dependency fields exist.
- No Red/Amber/Green controls or rationale validation exists.
- No distinction between manual and Jira-derived content exists.
- No narrative persistence exists.

**Works:** No implementation to test.

### FR-6 — Metrics and trends

**Status:** Missing

- No completed count/list exists.
- No WIP count or status/assignee breakdown exists.
- No trend comparison exists.
- No six-assignee configuration or workload view exists.
- No reproducible metric definitions are implemented.

**Works:** No implementation to test.

### FR-7 — Markdown report generation

**Status:** Missing

- `apps/api/src/renderers/markdownRenderer.ts` is empty.
- None of the required eleven report sections are generated.
- No Jira links, empty-section text, safe escaping, deterministic sorting, or filename generation exists.
- No dynamic timestamp/hash comparison behavior exists.

**Works:** No report preview or download is available.

### FR-8 — Report persistence and history

**Status:** Missing

- Database/repository files are empty.
- `database/migrations` contains only `.gitkeep`.
- No report, version, metric snapshot, narrative, warning, or completeness persistence exists.
- No historical download or regeneration exists.
- No immutable original/version relationship exists.

**Works:** PostgreSQL itself is reachable, but the application does not use it.

### FR-9 — Confluence publication

**Status:** Missing

- No Confluence client or adapter exists.
- No target mapping, authorization, feature flag, page identity, or idempotency exists.
- No Markdown-to-Confluence conversion exists.
- No publication record or audit trail exists.
- No publication UI exists.

**Works:** Not applicable until the optional feature is enabled and implemented.

### FR-10 — Error and partial-data handling

**Status:** Missing

- API health is the only implemented error boundary.
- No integration error taxonomy exists.
- No bounded retry/backoff behavior exists.
- No complete/partial/failed state exists.
- No warning or safe technical logging exists.

**Works:** The health endpoint responds, but product failure behavior is not implemented.

### FR-11 — API boundary

**Status:** Partial

- `GET /health` exists and works.
- No documented/versioned API contract exists.
- No configuration, Jira-status, report, history, regeneration, or publication endpoints exist.
- No request/response schemas, authorization, pagination, error envelope, or idempotency behavior exists.
- The React app does not yet consume the API.

## 5. Domain entities

| Entity | Status | Assessment |
|---|---|---|
| Report | Missing | No model or persistence. |
| Normalized issue | Missing | No model or normalizer. |
| Field mapping | Missing | Empty configuration and mapping code. |
| Status mapping | Missing | No status rules or validation. |
| Report period | Missing | No period service. |
| Publication record | Missing | No Confluence workflow. |
| Audit event | Missing | No audit middleware or repository. |

## 6. React UI requirements

| UI capability | Status | Assessment |
|---|---|---|
| Configuration area | Missing | ConfigurationSidebar placeholder is empty. |
| Data preview | Missing | DataPreview placeholder is empty. |
| Narrative editor | Missing | NarrativeEditor placeholder is empty. |
| RAG controls | Missing | RagControls placeholder is empty. |
| Report preview | Missing | ReportPreview placeholder is empty. |
| History view | Missing | HistoryView and history page are empty. |
| Confluence publication controls | Missing | No UI or API. |
| Loading/empty/partial/success/error states | Missing | Static shell has no state handling. |
| Descriptive/non-color-only statuses | Partial | The static heading and paragraph are readable, but no status workflow exists. |
| Keyboard accessibility | Not verifiable | No interactive controls exist to test. |

## 7. Security and privacy requirements

| Requirement | Status | Assessment |
|---|---|---|
| Externalized Jira/Confluence/database secrets | Partial | PostgreSQL Compose uses environment variables and `.env` is ignored; Jira/Confluence/auth configuration does not exist. |
| No secrets in logs/API/browser/reports | Not verifiable | No integration or report implementation exists; no redaction tests exist. |
| Least-privilege integration credentials | Missing | No credentials or permission model exists. |
| HTTPS for deployed external communication | Missing | No external clients or deployment configuration exists. |
| API authentication/authorization | Missing | `/health` is unauthenticated and no protected endpoint exists. |
| Sensitive content handling | Missing | No input validation, sanitization, or data classification is implemented. |
| Audit log redaction | Missing | No audit log exists. |
| `.env` exclusion | Verified | Root `.gitignore` excludes `.env` and `.env.*` while allowing `.env.example`. |

## 8. Reliability, performance, and operations

| Requirement | Status | Assessment |
|---|---|---|
| Complete Jira pagination | Missing | No Jira client exists. |
| Bounded external timeouts/retries | Missing | No external calls exist. |
| Idempotent automation | Missing | No generation/publication side effects exist. |
| Transactional report/audit writes | Missing | No schema or repositories exist. |
| Avoid repeated Jira calls/cache safely | Missing | No Jira workflow exists. |
| Support six-assignee project scale | Missing | No metrics implementation exists. |
| Backend health/readiness | Partial | `/health` is implemented; it does not check database or external dependency readiness. |
| Structured correlated logs | Missing | Server uses `console.log` only; no request/correlation middleware exists. |
| User-visible job/dependency status | Missing | No jobs or UI state model exists. |
| PostgreSQL 15 through Docker Compose | Verified | PostgreSQL 15 container is healthy and accepts connections. |

## 9. Acceptance criteria

| # | Acceptance criterion | Status | Evidence/assessment |
|---:|---|---|---|
| 1 | Authorized user retrieves visible Jira issues from `EPMCDMETST` | Missing | No auth or Jira client. |
| 2 | Default previous Monday–Sunday period in Eastern Time | Missing | No period service. |
| 3 | Jira pagination/retry tested without omission | Missing | No Jira tests or implementation. |
| 4 | Report includes required work, trends, risks, and migration details | Missing | No report engine. |
| 5 | Completed issues contain working Jira keys/links | Missing | No normalized issues or renderer. |
| 6 | User enters narrative/RAG and previews/downloads Markdown | Missing | UI placeholders are empty. |
| 7 | Reports stored in PostgreSQL and regenerated/downloaded | Missing | PostgreSQL is running, but unused. |
| 8 | Regenerated reports do not replace originals | Missing | No report version model. |
| 9 | Missing optional fields produce warnings | Missing | No mapping or warning model. |
| 10 | Jira failures produce clear errors and no false-complete report | Missing | No Jira/error workflow. |
| 11 | All six configured assignees are represented | Missing | No assignee configuration or metrics. |
| 12 | Configured report can be published to Confluence with audit result | Missing | No Confluence implementation. |
| 13 | Accessible loading/empty/partial/success/error states | Missing | Static UI only; no interactive state. |
| 14 | Secrets absent from logs, API, browser, audit, and reports | Not verifiable | No product paths or redaction tests. |
| 15 | Existing startup/calculator compatibility preserved; Streamlit not target runtime | Partial | New target shell runs; calculator compatibility has not been regression-tested. |
| 16 | Core report workflow works with Confluence disabled | Missing | The app starts without Confluence, but report generation/history/download are absent. |

## 10. Required test coverage

| Test area | Status | Assessment |
|---|---|---|
| Reporting periods and DST | Missing | No tests. |
| Jira pagination/retry/rate-limit/auth | Missing | No tests or adapter. |
| Normalization and mappings | Missing | No tests or implementation. |
| Metrics and trends | Missing | No tests or implementation. |
| Missing history/partial warnings | Missing | No state model. |
| Markdown escaping/links/stable ordering | Missing | No renderer/tests. |
| PostgreSQL persistence/versioning/regeneration | Missing | No migrations/repositories/tests. |
| API contract and safe errors | Missing | Only uncontracted `/health`. |
| Confluence idempotency/permissions/audit | Missing | No Confluence path. |
| Secret redaction | Missing | No redaction tests. |
| React workflow/accessibility | Missing | No workflow tests; only direct build/typecheck smoke checks exist. |

## 11. Open decisions still blocking full implementation

The specification remains Draft and these decisions are still unresolved:

1. Meaning of the three-month horizon.
2. Six Jira account identifiers.
3. Jira custom-field IDs and allowed values.
4. Exact WIP/completed status mappings.
5. Authentication model and service-account strategy.
6. Confluence space, parent, title, and versioning policy.
7. Confluence page-per-period versus stable-page behavior.
8. History retention and backup policy.
9. Sensitive-content policy.
10. Deployment target and network path.
11. User permissions for generation, regeneration, and publication.
12. Policy for partial Jira data.

## 12. Implementation readiness

**Current readiness:** Foundation-only / not feature-complete.

Implemented and working:

- Minimal Express process and `/health` endpoint.
- Minimal React/Vite process and static shell.
- PostgreSQL 15 Docker service and readiness check.
- Frontend type checking and production build.

Not implemented:

- All Jira, metrics, report, history, authentication, Confluence, audit, and substantive UI requirements.
- All product-level automated test suites.

The next implementation gate is to resolve the remaining Phase 0 decisions, then implement the API contracts, domain models, Jira adapter, and persistence before expanding the UI.
