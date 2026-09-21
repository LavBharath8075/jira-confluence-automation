# Jira/Confluence Automation — Implementation Plan

**Plan ID:** JCA-PLAN-001  
**Specification:** `spec/specification.md`  
**Constitution:** `spec/constitution.md`  
**Clarifications:** `spec/clarify.md`  
**Status:** Draft — product boundary decided; gated by remaining clarification decisions  
**Version:** 1.0.0  
**Last Updated:** 2026-09-21

## 1. Delivery approach

Implementation will proceed in vertical, testable increments. Each phase must produce reviewable artifacts and pass its exit criteria before dependent work begins.

The project will use:

- React 18 with Vite for the browser application.
- TypeScript across frontend, backend, and shared contracts.
- Node.js with Express for the API and orchestration layer.
- PostgreSQL 15 for application-owned state, report history, and audit records.
- Docker Compose for local PostgreSQL and supporting services.
- Server-side Jira and Confluence adapters; the browser will never call either external service directly.

No phase may silently resolve an item listed in `spec/clarify.md`. Any assumption made to unblock work must be recorded, approved, and reflected in the specification.

## 2. Phase overview

| Phase | Name | Primary outcome | Depends on |
|---|---|---|---|
| 0 | Clarification and scope lock | Approved decisions and baselined specification | None |
| 1 | Repository and development foundation | Runnable monorepo, local PostgreSQL 15, quality gates | Phase 0 |
| 2 | Contracts, identity, and integration boundaries | Versioned API contracts and secure integration interfaces | Phases 0–1 |
| 3 | Jira ingestion and normalization | Reliable, paginated, mapped Jira data pipeline | Phases 0–2 |
| 4 | Metrics and deterministic report generation | Validated metrics and Markdown report engine | Phase 3 |
| 5 | Persistence, history, and auditability | Versioned report storage and regeneration | Phases 2–4 |
| 6 | React reporting workflow | Usable dashboard, editor, preview, history, and download | Phases 2, 4–5 |
| 7 | Confluence publication | Idempotent, auditable publication workflow | Phases 2, 5–6 |
| 8 | Hardening and release readiness | Security, accessibility, performance, operations, and deployment readiness | Phases 1–7 |

## 3. Phase 0 — Clarification and scope lock

### Objective

Resolve the implementation-blocking decisions identified in `spec/clarify.md` before establishing production contracts or database behavior.

### Required decisions

1. **Resolved:** React/Express replaces the source Streamlit runtime; the existing calculator/mock dashboard remains runnable as a migration compatibility constraint.
2. **Resolved:** Confluence publication is optional and feature-flagged for v1; core report generation and Markdown download work without it.
3. Select authentication, authorization roles, session strategy, and Jira/Confluence service-account model.
4. Define the three-month horizon and history-retention semantics.
5. Define exact Jira query scope, WIP rules, completed-work rules, status mappings, and period boundaries.
6. Define the six assignees, out-of-scope issue behavior, and mapping configuration schema.
7. Define `complete`, `complete_with_warnings`, `partial`, and `failed` states and permitted actions.
8. Define report/version identity, immutability, regeneration, comparison, and publication rules.
9. Define Confluence target/page identity, representation format, update policy, conflict behavior, and retry reconciliation.
10. Define API contract style, error envelope, idempotency behavior, and synchronous/asynchronous job model.
11. Define minimum performance, accessibility, backup, recovery, and observability targets.

### Deliverables

- Updated `spec/specification.md` with resolved decisions.
- Updated `spec/clarify.md` showing disposition of each blocking item.
- Decision record for any architecture or scope choice that changes the constitution or source requirements.
- Initial acceptance-test matrix mapping requirements to verification.

### Milestone M0 — Specification approved

**Exit criteria:** No unresolved blocking clarification remains; the product boundary, security model, data semantics, API strategy, and publication behavior are approved by the Product Owner and technical owner.

## 4. Phase 1 — Repository and development foundation

### Objective

Create a reproducible full-stack workspace that can be built, tested, and run locally without implementing business behavior.

### Work items

- Confirm monorepo layout for `apps/web`, `apps/api`, and `packages/shared`.
- Initialize TypeScript, React/Vite, Express, package-manager workspaces, and build scripts.
- Pin compatible Node.js and package-manager versions.
- Add formatting, linting, type checking, unit-test, integration-test, and end-to-end-test commands.
- Create Docker Compose configuration for PostgreSQL 15 with persistent local volume and health check.
- Add environment-variable loading and `.env.example` without real credentials.
- Add configuration validation that fails clearly for missing required settings.
- Add baseline CI checks for install, lint, type check, tests, and dependency audit.
- Document local setup, service ports, migrations, test commands, and secret handling.

### Deliverables

- Runnable frontend and backend shells.
- Shared package build and import path.
- PostgreSQL 15 Docker service.
- CI quality-gate workflow.
- Local development and troubleshooting documentation.

### Milestone M1 — Foundation runnable

**Exit criteria:** A clean checkout can install dependencies, start PostgreSQL, run migrations or an empty migration check, start frontend and backend health endpoints, and pass all baseline quality checks without external Jira/Confluence credentials.

## 5. Phase 2 — Contracts, identity, and integration boundaries

### Objective

Establish stable boundaries before implementing integrations or UI assumptions.

### Work items

- Define versioned API namespace and OpenAPI or equivalent contract source.
- Specify request/response schemas, error envelope, status codes, pagination, correlation IDs, and validation behavior.
- Define authentication middleware and authorization policy for generation, history, regeneration, download, and publication.
- Define local-development authentication behavior without weakening deployed security.
- Define shared TypeScript domain types and runtime validation schemas.
- Define Jira and Confluence adapter interfaces, timeout policy, retry classification, rate-limit behavior, and safe diagnostic model.
- Define job model if report generation or publication is asynchronous.
- Define idempotency-key behavior for generation, regeneration, and publication.
- Add contract tests for health, configuration, report, history, and publication endpoints.

### Deliverables

- Versioned API contract.
- Shared schemas and domain types.
- Authentication/authorization matrix.
- Integration adapter interfaces.
- Error, job, correlation, and idempotency conventions.

### Milestone M2 — Boundaries locked

**Exit criteria:** Frontend and backend can develop against the same contract; unauthorized operations are rejected; contract tests pass; no external credential is required for adapter unit tests.

## 6. Phase 3 — Jira ingestion and normalization

### Objective

Implement a reliable Jira data pipeline with reproducible period and mapping semantics.

### Work items

- Implement Jira client with configured authentication, HTTPS, timeout, pagination, retry, and rate-limit handling.
- Implement exact completed-work and WIP query rules from Phase 0.
- Implement `America/New_York` period calculation using explicit half-open UTC intervals.
- Implement response validation and normalization into the internal issue model.
- Implement versioned field mappings with source type, fallback order, expected type, optionality, allowed values, and conflict handling.
- Implement six-assignee configuration and behavior for unassigned or out-of-scope issues.
- Track retrieval completeness, warnings, unmapped statuses, missing optional fields, and source metadata.
- Add fixtures for successful pages, empty results, duplicate results, malformed responses, rate limits, transient errors, authorization failures, and incomplete pagination.
- Ensure no Jira client code is imported by the frontend.

### Deliverables

- Jira adapter and query service.
- Period calculator.
- Normalizer and mapping validator.
- Retrieval result with explicit completeness state and warnings.
- Unit and integration tests using controlled fixtures.

### Milestone M3 — Jira pipeline trusted

**Exit criteria:** Given the same fixture data and configuration, the pipeline produces stable normalized output and metrics inputs; pagination, retries, mappings, timezones, and failure states are covered by tests.

## 7. Phase 4 — Metrics and deterministic report generation

### Objective

Transform normalized Jira data and user narrative into validated metrics and deterministic Markdown.

### Work items

- Implement completed-work, WIP, status, assignee, migration-field, and trend calculations.
- Define missing-history, zero-denominator, empty-result, and partial-data behavior.
- Validate manual narrative and RAG inputs, including required fields and length/sanitization rules from Phase 0.
- Implement report model validation.
- Implement Markdown renderer with fixed section order, stable sorting, Jira links, safe escaping, empty-section text, and deterministic filename rules.
- Include source completeness, warnings, mapping/version metadata, and generation information in Data Notes.
- Add content comparison or hash rules that distinguish dynamic timestamps from substantive report changes.
- Add unit and golden-file tests for normal, empty, partial, malformed, and hostile content.

### Deliverables

- Metrics service.
- Report model and renderer.
- Narrative/RAG validation.
- Deterministic Markdown fixtures and tests.
- Requirement-to-test traceability for FR-5 through FR-7.

### Milestone M4 — Report engine accepted

**Exit criteria:** Report output satisfies required section order and acceptance criteria; unchanged fixture inputs produce equivalent output apart from explicitly dynamic values; unsafe external content cannot break the report or create unsafe links.

## 8. Phase 5 — Persistence, history, and auditability

### Objective

Persist immutable report generations, configuration snapshots, regeneration relationships, and automation audit records in PostgreSQL 15.

### Work items

- Finalize schema for users/actors, configuration versions, reports, report versions, normalized snapshots or metric snapshots, warnings, publication records, jobs, and audit events as approved in Phase 0.
- Add versioned database migrations and rollback strategy where supported.
- Add constraints and indexes for project/period/version uniqueness and external identifiers.
- Store the configuration and mapping versions used for each generation.
- Implement transactional report creation and audit-event persistence.
- Implement immutable original snapshots and explicit regenerated versions.
- Implement history listing, original download, version comparison, and regeneration orchestration.
- Define and implement retention, deletion, backup, and restore behavior.
- Add concurrency controls for duplicate generation and simultaneous regeneration.
- Add repository integration tests against PostgreSQL 15 in Docker.

### Deliverables

- PostgreSQL schema and migrations.
- Report/history repositories.
- Audit repository and correlation linkage.
- Regeneration and comparison services.
- Backup/restore and retention documentation.

### Milestone M5 — History reliable

**Exit criteria:** Reports can be created, retrieved, compared, regenerated, and downloaded without mutating immutable originals; transactions roll back correctly; audit records identify actor, target, outcome, and correlation ID without secrets.

## 9. Phase 6 — React reporting workflow

### Objective

Deliver the accessible browser workflow for configuration, preview, narrative editing, history, and download.

### Work items

- Implement authenticated application shell and route protection.
- Implement configuration and connection-status views.
- Implement reporting-period selector with valid-period constraints.
- Implement data preview with counts, metrics, mappings, completeness state, and warnings.
- Implement narrative editor and RAG controls with client/server validation.
- Implement Markdown preview with safe rendering and clear source/manual-content distinction.
- Implement history list, original/regenerated indicators, comparison, download, and regeneration actions.
- Implement loading, empty, complete, partial, failed, and retry states.
- Implement accessible semantic controls, keyboard navigation, focus management, status announcements, and non-color-only state indicators.
- Add API integration, component, and end-to-end tests.

### Deliverables

- React dashboard and route structure.
- Configuration, preview, editor, report, and history screens.
- Accessible state handling.
- Browser download flow.
- Frontend test suite.

### Milestone M6 — Report workflow usable

**Exit criteria:** An authorized Product Owner can generate or regenerate a report through the browser, review warnings, edit narrative/RAG data, preview output, download a deterministic Markdown file, and retrieve history. Critical flows pass accessibility and end-to-end tests.

## 10. Phase 7 — Confluence publication

### Objective

Add controlled, idempotent, auditable publication of eligible reports to Confluence.

### Work items

- Implement Confluence client using the approved API and representation format.
- Implement configured space/parent/page identity and create/update policy.
- Implement explicit user confirmation and publication authorization.
- Implement idempotency key, page lookup, version conflict detection, and reconciliation after uncertain responses.
- Block publication for disallowed completeness states or retrieval failures.
- Convert Markdown/report model to the approved Confluence representation safely.
- Record publication attempts, external page IDs, URLs, versions, outcomes, and safe diagnostics.
- Expose publication status and retry/reconciliation behavior through the API and UI.
- Add contract, integration, end-to-end, and failure-mode tests using fixtures or a sandbox tenant.

### Deliverables

- Confluence adapter and publication service.
- Page mapping/configuration.
- Publication API and UI controls.
- Publication audit records.
- Duplicate, conflict, permission, rate-limit, and unknown-outcome tests.

### Milestone M7 — Publication controlled

**Exit criteria:** A permitted user can publish an eligible report once, repeat the same request without duplicates, see the resulting page link, and receive an explicit failure or partial result for every unsuccessful or uncertain outcome.

## 11. Phase 8 — Hardening and release readiness

### Objective

Validate the integrated system against the constitution and measurable production requirements.

### Work items

- Run full unit, integration, contract, end-to-end, migration, and regression suites.
- Perform dependency, container, secret, and static security scans.
- Test authentication, authorization, CSRF/CORS, security headers, rate limits, SSRF defenses, and malicious Jira/Confluence content.
- Verify no secret appears in logs, traces, database records, API responses, browser assets, or reports.
- Run accessibility review against the approved WCAG target and supported browsers.
- Load-test at the approved Jira issue volume and concurrency target.
- Validate timeout, retry, rate-limit, dependency-outage, database-failure, and recovery behavior.
- Verify Docker Compose setup, health/readiness checks, migrations, backup/restore, and deployment configuration.
- Review operational dashboards, alert thresholds, log retention, and runbooks.
- Perform acceptance review against every specification criterion and document exceptions.

### Deliverables

- Release candidate build and deployment artifacts.
- Security, accessibility, performance, and recovery reports.
- Operations runbook and support procedures.
- Completed acceptance-test matrix.
- Known-issues and exception register.

### Milestone M8 — Release candidate approved

**Exit criteria:** All constitution quality gates pass; all blocking acceptance criteria pass; unresolved issues are explicitly accepted; deployment, rollback, backup, monitoring, and support procedures are verified.

## 12. Cross-phase quality gates

Every pull request MUST:

- identify the specification requirement or decision it implements;
- include or update automated tests;
- pass formatting, linting, type checking, and relevant test suites;
- avoid exposing secrets in code, logs, fixtures, or snapshots;
- preserve API contract compatibility or include a migration plan;
- include migration and rollback notes for database changes; and
- document any approved deviation from the constitution.

Every phase review MUST verify:

- source-of-truth ownership is clear;
- completeness and failure states are preserved end to end;
- audit correlation exists for external side effects;
- external operations are bounded and retry-safe; and
- user-visible behavior is accessible and unambiguous.

## 13. Requirement traceability

| Specification area | Primary phases | Verification |
|---|---|---|
| FR-1 Reporting periods | 0, 3, 4 | Period unit tests and acceptance tests |
| FR-2 Jira retrieval | 0, 2, 3 | Adapter integration and failure tests |
| FR-3 Field/status mappings | 0, 3, 5 | Mapping validation and snapshot tests |
| FR-4 Data preview/warnings | 3, 4, 6 | Service and UI tests |
| FR-5 Narrative/RAG | 0, 4, 6 | Validation and end-to-end tests |
| FR-6 Metrics/trends | 3, 4 | Metric unit and golden tests |
| FR-7 Markdown report | 4, 6 | Renderer and download tests |
| FR-8 History/regeneration | 0, 5, 6 | PostgreSQL integration and workflow tests |
| FR-9 Confluence publication | 0, 2, 5, 7 | Adapter, contract, and end-to-end tests |
| FR-10 Errors/partial data | 0, 2, 3, 4, 6, 7 | Failure-state matrix |
| FR-11 API boundary | 2, 6, 7 | Contract tests and compatibility checks |
| Security/privacy | 1, 2, 3, 5, 7, 8 | Security scans and abuse tests |
| Accessibility/usability | 6, 8 | Automated and manual accessibility review |
| Operations/recovery | 1, 5, 8 | Docker, health, backup, restore, and runbook checks |

## 14. Major risks and mitigations

| Risk | Effect | Mitigation |
|---|---|---|
| Unresolved product decisions | Rework and incompatible implementations | Make Phase 0 a hard gate; update specification before coding |
| Jira field/status variability | Incorrect or non-reproducible metrics | Versioned mappings, validation, warnings, and fixture coverage |
| Jira/Confluence rate limits or outages | Failed or delayed reports/publications | Bounded retries, explicit job states, cached snapshots, actionable errors |
| Duplicate Confluence pages | Content sprawl or overwritten content | Stable page identity, idempotency keys, version conflict handling |
| Sensitive source content | Data exposure | Least privilege, sanitization, redaction, access control, threat testing |
| Large or slow report generation | HTTP timeouts and poor UX | Define async job model in Phase 0; expose progress and retry state |
| Historical non-reproducibility | Loss of stakeholder trust | Store source/configuration snapshots and immutable report versions |
| Scope drift from Streamlit source | Unplanned migration work | React/Express replacement is decided; preserve legacy calculator/mock-dashboard compatibility and test the boundary |

## 15. Release definition of done

The release is complete only when:

1. The approved specification and constitution are consistent.
2. All Phase 0 blocking decisions are resolved.
3. React 18/Vite, Node.js/Express, PostgreSQL 15, and Docker workflows are reproducible.
4. The API contract is versioned, tested, and consumed by the frontend.
5. Jira retrieval, mappings, period logic, metrics, and completeness states are tested.
6. Reports are deterministic, traceable, safely rendered, persisted, and versioned.
7. The React workflow supports preview, narrative/RAG input, history, regeneration, and download.
8. Confluence publication, if in v1 scope, is authorized, idempotent, conflict-aware, and auditable.
9. Security, accessibility, performance, backup/recovery, and observability gates pass.
10. Deployment and operational documentation is complete, including rollback and support procedures.
