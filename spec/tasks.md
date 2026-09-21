# Jira/Confluence Automation — Implementation Tasks

**Task plan:** `spec/plan.md`  
**Specification:** `spec/specification.md`  
**Constitution:** `spec/constitution.md`  
**Status:** Draft — Phase 0 tasks are prerequisites  
**Last Updated:** 2026-09-21

## Task conventions

- Tasks are independently trackable units of work.
- A task is complete only when its acceptance criteria pass and required documentation/tests are updated.
- `P0` tasks block implementation until resolved.
- No task may silently decide an item listed in `spec/clarify.md`.

## Phase 0 — Clarification and scope lock

### T0.1 — Confirm product boundary and migration strategy

**Priority:** P0  
**Status:** Completed  
**Dependencies:** None  
**Outputs:** Approved scope decision and updated specification.

**Acceptance criteria:**

- The decision states whether React/Express replaces Streamlit or temporarily coexists with it.
- The decision states whether the existing calculator/mock dashboard must remain runnable.
- Confluence publication is classified as required for v1, feature-flagged v1, or deferred.
- `spec/specification.md` and `spec/plan.md` reflect the decision consistently.

**Decision:** React 18/Vite plus Node.js/Express replaces the inherited Streamlit runtime. The existing calculator/mock dashboard remains runnable during migration as a compatibility constraint. Confluence publication is optional and feature-flagged for v1; core report generation, history, and Markdown download do not depend on it.

### T0.2 — Define authentication and authorization

**Priority:** P0  
**Dependencies:** T0.1  
**Outputs:** Authentication decision, role matrix, and audit-actor rules.

**Acceptance criteria:**

- Identity provider, login/session/token mechanism, refresh, logout, and expiration behavior are specified.
- Roles and permissions are defined for generation, preview, download, history, regeneration, configuration, and Confluence publication.
- Jira/Confluence user identity versus service-account behavior is defined.
- Local development behavior is documented without weakening deployed security.
- Unauthorized actions and audit actor identity are specified.

### T0.3 — Define reporting horizon and retention semantics

**Priority:** P0  
**Dependencies:** T0.1  
**Outputs:** Date/horizon and retention decision.

**Acceptance criteria:**

- “Three months” is defined as generation horizon, retention period, or both.
- Calendar-month versus rolling-period behavior is specified.
- Boundary behavior for current, future, and historical periods is documented.
- Retention, deletion, and backup implications are recorded.

### T0.4 — Define Jira query and metric semantics

**Priority:** P0  
**Dependencies:** T0.3  
**Outputs:** Query rules and metric-definition decision record.

**Acceptance criteria:**

- Completed-work query and WIP query are defined precisely.
- Issue types, subtasks, epics, archived/cancelled issues, duplicates, and unassigned issues have defined treatment.
- Date fields, timezone conversion, and half-open period boundaries are specified.
- WIP status mappings and unmapped-status behavior are defined.
- Trend metrics, comparison periods, missing-history behavior, and zero-denominator behavior are defined.

### T0.5 — Define field, status, and assignee configuration

**Priority:** P0  
**Dependencies:** T0.4  
**Outputs:** Versioned mapping schema and six-assignee configuration.

**Acceptance criteria:**

- The six canonical Jira account IDs and display names are identified.
- Mapping source types, fallback precedence, expected data types, cardinality, allowed values, and conflict behavior are specified.
- Effective dates/versioning for mapping changes are specified.
- Out-of-scope assignees and unassigned issues have defined handling.
- Required versus optional fields and warning behavior are documented.

### T0.6 — Define completeness states and action policy

**Priority:** P0  
**Dependencies:** T0.4  
**Outputs:** Completeness state machine.

**Acceptance criteria:**

- `complete`, `complete_with_warnings`, `partial`, and `failed` states are defined.
- Blocking and non-blocking conditions are listed.
- Generation, preview, download, regeneration, and Confluence publication permissions are defined for each state.
- Reports visibly distinguish valid empty results from unavailable data.
- State behavior is added to acceptance criteria.

### T0.7 — Define report versioning and immutability

**Priority:** P0  
**Dependencies:** T0.3, T0.6  
**Outputs:** Report/version lifecycle decision.

**Acceptance criteria:**

- Report ID, reporting-period ID, generation ID, and version ID semantics are defined.
- Original snapshots cannot be mutated.
- Regenerated reports have an explicit relationship to their source/original.
- Narrative edits and publication eligibility are versioned consistently.
- Comparison and download behavior for each version is specified.

### T0.8 — Define Confluence publication behavior

**Priority:** P0  
**Dependencies:** T0.1, T0.2, T0.6, T0.7  
**Outputs:** Confluence publication decision record.

**Acceptance criteria:**

- Confluence API/version and content representation are selected.
- Target space, parent page, title convention, and page identity are defined.
- Create-versus-update and overwrite ownership rules are defined.
- Version conflicts, concurrent edits, retries, and uncertain responses are defined.
- Idempotency key and duplicate-prevention behavior are specified.

### T0.9 — Define API and job model

**Priority:** P0  
**Dependencies:** T0.2, T0.6, T0.7, T0.8  
**Outputs:** API contract decision and job lifecycle.

**Acceptance criteria:**

- API versioning, HTTP methods, paths, request/response schemas, and error envelope are defined.
- Authentication requirements and authorization behavior are defined per endpoint.
- Synchronous versus asynchronous behavior is selected for generation, regeneration, and publication.
- Job states, polling/callback mechanism, cancellation, timeout, and retry behavior are defined if asynchronous.
- Idempotency headers/keys and correlation identifiers are specified.

### T0.10 — Define measurable quality and operations targets

**Priority:** P0  
**Dependencies:** T0.1–T0.9  
**Outputs:** Non-functional target decision record.

**Acceptance criteria:**

- Supported browsers and accessibility target are defined.
- Expected issue volume, concurrent users, latency, and rate-limit budget are defined.
- Backup frequency, restore testing, RPO, and RTO are defined.
- Log/metric/trace retention and alert thresholds are defined.
- Deployment environments and network requirements are documented.

### T0.11 — Baseline specification and acceptance matrix

**Priority:** P0  
**Dependencies:** T0.1–T0.10  
**Outputs:** Approved specification, clarified review, and traceability matrix.

**Acceptance criteria:**

- Every blocking item in `spec/clarify.md` has a disposition.
- `spec/specification.md` contains no contradictory normative requirements.
- Every acceptance criterion maps to at least one planned test or manual verification.
- The Product Owner and technical owner approve Milestone M0.

## Phase 1 — Repository and development foundation

### T1.1 — Initialize workspace and package boundaries

**Priority:** P0  
**Dependencies:** T0.11  
**Outputs:** Workspace configuration for `apps/web`, `apps/api`, and `packages/shared`.

**Acceptance criteria:**

- Frontend, backend, and shared package boundaries are defined.
- TypeScript compilation works for all packages.
- Package scripts support development, build, lint, type check, and test commands.
- No business implementation is hidden in scaffolding scripts.

### T1.2 — Pin runtime and dependency policy

**Priority:** P1  
**Dependencies:** T1.1  
**Outputs:** Node.js/package-manager version policy and dependency documentation.

**Acceptance criteria:**

- Supported Node.js and package-manager versions are recorded.
- Lockfile strategy and dependency update policy are documented.
- Dependency audit command is available and fails on the agreed severity threshold.

### T1.3 — Add PostgreSQL 15 Docker service

**Priority:** P0  
**Dependencies:** T1.1  
**Outputs:** Docker Compose PostgreSQL service.

**Acceptance criteria:**

- PostgreSQL 15 starts through Docker Compose with a persistent local volume.
- Credentials are supplied through environment configuration, not committed secrets.
- A health check detects readiness.
- The connection can be verified from the backend and integration test environment.

### T1.4 — Add configuration loading and validation

**Priority:** P0  
**Dependencies:** T0.2, T0.3, T0.5, T1.1  
**Outputs:** Typed environment/configuration module and `.env.example`.

**Acceptance criteria:**

- Required settings fail startup with actionable, non-secret errors when absent.
- Jira, Confluence, database, auth, timezone, and horizon settings are represented.
- Secret values are never included in validation errors or logs.
- `.env.example` contains placeholders only.

### T1.5 — Establish quality gates and CI

**Priority:** P0  
**Dependencies:** T1.1, T1.2  
**Outputs:** CI workflow and contributor commands.

**Acceptance criteria:**

- CI runs formatting, linting, type checking, unit tests, and dependency audit.
- A failing gate prevents a passing build status.
- Local commands and CI commands use the same scripts.
- Test artifacts and failure output are discoverable.

### T1.6 — Document local development

**Priority:** P1  
**Dependencies:** T1.3–T1.5  
**Outputs:** Local setup and troubleshooting documentation.

**Acceptance criteria:**

- A clean checkout can start the database and application shells.
- Ports, environment variables, migrations, test commands, and shutdown steps are documented.
- No real Jira or Confluence credential is required for the baseline workflow.

## Phase 2 — Contracts, identity, and integration boundaries

### T2.1 — Define versioned API contract

**Priority:** P0  
**Dependencies:** T0.9, T1.1  
**Outputs:** OpenAPI or equivalent contract.

**Acceptance criteria:**

- Health, readiness, configuration, Jira status, report, history, regeneration, and publication endpoints are defined.
- Every endpoint has method, path, request schema, response schema, status codes, and error behavior.
- Pagination, correlation IDs, and content types are specified.
- Contract validation runs in CI.

### T2.2 — Implement shared domain and validation schemas

**Priority:** P0  
**Dependencies:** T0.5–T0.9, T2.1  
**Outputs:** Shared TypeScript types and runtime validators.

**Acceptance criteria:**

- Report, period, issue, mapping, warning, completeness, job, publication, and audit schemas exist.
- Invalid external/API input is rejected with safe validation errors.
- Frontend and backend consume the shared contract types.
- Schema changes are reviewable and versioned.

### T2.3 — Implement authentication and authorization boundary

**Priority:** P0  
**Dependencies:** T0.2, T2.1  
**Outputs:** Auth middleware, role checks, and authorization tests.

**Acceptance criteria:**

- Unauthenticated requests are handled according to the approved local/deployed policy.
- Each protected endpoint enforces its specified role/permission.
- Expired or invalid credentials are rejected without leaking details.
- Audit events use the authenticated actor identity.

### T2.4 — Define integration adapter interfaces

**Priority:** P0  
**Dependencies:** T0.8, T0.9, T2.2  
**Outputs:** Jira/Confluence adapter interfaces and safe result types.

**Acceptance criteria:**

- Adapters expose timeout, retry, pagination, rate-limit, and error outcomes.
- Adapter interfaces do not expose secrets to callers.
- Integration code is server-only and cannot be imported into the frontend build.
- Unit tests can run against fixtures without external credentials.

### T2.5 — Implement job and idempotency conventions

**Priority:** P0  
**Dependencies:** T0.6, T0.7, T0.9, T2.1  
**Outputs:** Job state model and idempotency middleware/service.

**Acceptance criteria:**

- Duplicate requests with the same approved idempotency key do not create duplicate work.
- Job states and terminal outcomes match the approved contract.
- Correlation IDs are propagated to logs and audit records.
- Retry of an uncertain request follows the approved reconciliation policy.

### T2.6 — Add API contract tests

**Priority:** P0  
**Dependencies:** T2.1–T2.5  
**Outputs:** Contract and negative tests.

**Acceptance criteria:**

- Valid requests and representative error cases are covered.
- Authentication, authorization, validation, pagination, and idempotency cases are tested.
- Contract tests fail when implementation responses drift from the specification.

## Phase 3 — Jira ingestion and normalization

### T3.1 — Implement reporting-period calculator

**Priority:** P0  
**Dependencies:** T0.3, T0.4, T2.2  
**Outputs:** Timezone-aware period service.

**Acceptance criteria:**

- Default period is the previous completed Monday–Sunday period.
- The service uses `America/New_York` and emits an explicit UTC half-open interval.
- Month/year boundaries and daylight-saving transitions are tested.
- Current, future, and unsupported historical periods follow approved rules.

### T3.2 — Implement Jira client transport

**Priority:** P0  
**Dependencies:** T2.4, T2.5  
**Outputs:** Authenticated Jira HTTP client.

**Acceptance criteria:**

- Requests use HTTPS, bounded timeouts, and configured credentials.
- Pagination retrieves all pages or returns an explicit incomplete result.
- Transient failures retry with bounded exponential backoff.
- Rate limits honor the approved retry/reset policy.
- Authentication and authorization failures are not retried as transient failures.

### T3.3 — Implement Jira query service

**Priority:** P0  
**Dependencies:** T0.4, T3.1, T3.2  
**Outputs:** Completed-work and WIP query builder.

**Acceptance criteria:**

- Queries exactly match approved project, date, status, issue-type, and assignee rules.
- Query parameters and requested fields are explicit and testable.
- Duplicate/moved/archived issue behavior follows the approved decision.
- Query tests prove boundary dates and excluded records.

### T3.4 — Implement Jira response validation and normalization

**Priority:** P0  
**Dependencies:** T0.5, T2.2, T3.2, T3.3  
**Outputs:** Normalized issue model and warnings.

**Acceptance criteria:**

- Required fields are validated before normalization.
- Optional missing fields produce structured warnings.
- Malformed records cannot silently become valid-looking data.
- External Jira links and identifiers are retained.
- Normalized output is stable for identical inputs.

### T3.5 — Implement field and status mapping engine

**Priority:** P0  
**Dependencies:** T0.5, T3.4  
**Outputs:** Versioned mapping resolver.

**Acceptance criteria:**

- Custom fields, labels, components, statuses, and linked issues can be resolved according to configuration.
- Fallback precedence and conflicts follow the approved schema.
- Unmapped statuses and invalid values produce warnings.
- Mapping version is included in retrieval/report metadata.

### T3.6 — Implement assignee scope handling

**Priority:** P1  
**Dependencies:** T0.5, T3.4  
**Outputs:** Six-assignee contribution model.

**Acceptance criteria:**

- All six configured assignees appear even with zero contribution where required.
- Unassigned and out-of-scope issues are handled and counted according to policy.
- Inactive or renamed users do not silently disappear from historical output.
- Assignee identifiers are not based solely on display names.

### T3.7 — Add Jira fixture and failure tests

**Priority:** P0  
**Dependencies:** T3.2–T3.6  
**Outputs:** Controlled Jira integration test suite.

**Acceptance criteria:**

- Fixtures cover multiple pages, empty results, duplicates, malformed responses, rate limits, transient errors, authorization failures, and incomplete pagination.
- Tests assert completeness state and warnings, not only returned issue count.
- No test requires a production Jira credential.

## Phase 4 — Metrics and deterministic report generation

### T4.1 — Implement delivery metrics

**Priority:** P0  
**Dependencies:** T0.4, T3.4–T3.6  
**Outputs:** Metrics service.

**Acceptance criteria:**

- Completed count/list, WIP count/breakdown, per-assignee metrics, and migration summaries are calculated.
- Status and period rules are applied consistently.
- Empty results, unmapped statuses, missing history, and zero denominators are explicit.
- Metrics include source completeness and warning metadata.

### T4.2 — Implement trend calculations

**Priority:** P1  
**Dependencies:** T0.4, T4.1  
**Outputs:** Trend service.

**Acceptance criteria:**

- The comparison period is selected according to the approved rule.
- Missing prior history is represented without fabricated values.
- Trend direction and percentage calculations handle zero and null values safely.
- Trend inputs and definitions are documented in output metadata.

### T4.3 — Validate narrative and RAG input

**Priority:** P0  
**Dependencies:** T0.6, T2.2  
**Outputs:** Server-side narrative/RAG validator.

**Acceptance criteria:**

- Required/optional fields, maximum lengths, allowed Markdown, and sanitization follow the approved policy.
- RAG values are limited to `Red`, `Amber`, or `Green`.
- RAG rationale rules are enforced.
- Validation errors are safe, actionable, and represented in the API contract.

### T4.4 — Implement report model

**Priority:** P0  
**Dependencies:** T4.1–T4.3  
**Outputs:** Validated report aggregate.

**Acceptance criteria:**

- The model combines Jira-derived data, metrics, warnings, completeness, narrative, RAG, timestamps, and configuration versions.
- Required report sections cannot be silently omitted.
- Original/regenerated/version metadata follows the approved lifecycle.
- Invalid report state cannot be persisted or published.

### T4.5 — Implement deterministic Markdown renderer

**Priority:** P0  
**Dependencies:** T0.7, T4.4  
**Outputs:** Markdown renderer and filename generator.

**Acceptance criteria:**

- Required sections appear in the specified order.
- Empty sections show the approved no-data text.
- Jira keys link to safe corresponding URLs.
- External text is escaped and unsafe URL schemes are rejected.
- Stable sorting and deterministic filename behavior are tested.
- Dynamic timestamps are excluded from substantive equality/hash comparisons according to policy.

### T4.6 — Add report golden and security tests

**Priority:** P0  
**Dependencies:** T4.1–T4.5  
**Outputs:** Renderer and content-safety test suite.

**Acceptance criteria:**

- Normal, empty, warning, partial, malformed, and hostile-content fixtures are covered.
- Golden output verifies section order and stable formatting.
- Tests prove secrets and unsafe markup/links do not appear in output.
- Requirement traceability covers FR-5 through FR-7.

## Phase 5 — Persistence, history, and auditability

### T5.1 — Design PostgreSQL schema

**Priority:** P0  
**Dependencies:** T0.3, T0.5–T0.8, T4.4  
**Outputs:** Reviewed schema and migration design.

**Acceptance criteria:**

- Schema represents actors, configuration versions, reports, report versions, warnings, jobs, publication records, and audit events as approved.
- Keys, constraints, indexes, foreign keys, and uniqueness rules are documented.
- Immutable originals and regenerated versions are representable.
- Retention, deletion, and sensitive-data handling are addressed.

### T5.2 — Implement database migrations and repositories

**Priority:** P0  
**Dependencies:** T1.3, T5.1  
**Outputs:** PostgreSQL migrations and typed repositories.

**Acceptance criteria:**

- A clean PostgreSQL 15 instance can migrate to the current schema reproducibly.
- Repository methods enforce validation and transaction boundaries.
- Migration failure does not leave an unknown application state.
- Database errors are mapped to safe API errors.

### T5.3 — Persist report versions and configuration snapshots

**Priority:** P0  
**Dependencies:** T0.7, T4.4, T5.2  
**Outputs:** Report-generation persistence service.

**Acceptance criteria:**

- Generated reports store required metadata, metrics, narrative, RAG, Markdown, warnings, completeness, and mapping/configuration versions.
- Original snapshots cannot be updated by regeneration.
- Regenerated versions link to their source and record changed source/configuration context.
- Duplicate generation behavior follows idempotency and uniqueness policy.

### T5.4 — Implement history, comparison, and regeneration

**Priority:** P0  
**Dependencies:** T3.3, T4.5, T5.3  
**Outputs:** History and regeneration services.

**Acceptance criteria:**

- Users can list history by project and period according to authorization.
- Users can download original and regenerated versions.
- Comparisons show metric, warning, narrative, and source differences according to policy.
- Regeneration never silently overwrites an immutable original.
- Concurrent regeneration is handled deterministically.

### T5.5 — Implement audit events and publication records

**Priority:** P0  
**Dependencies:** T0.2, T0.8, T2.5, T5.2  
**Outputs:** Audit persistence service.

**Acceptance criteria:**

- Generation, regeneration, download, configuration changes, and publication attempts record actor, target, outcome, timestamp, and correlation ID as required.
- Secrets and unnecessary sensitive payloads are excluded.
- Audit records are queryable only by authorized roles.
- External IDs and URLs are retained when available.

### T5.6 — Add PostgreSQL integration and recovery tests

**Priority:** P0  
**Dependencies:** T5.2–T5.5  
**Outputs:** Database test suite and recovery evidence.

**Acceptance criteria:**

- Tests run against PostgreSQL 15 in Docker, not only an in-memory substitute.
- Transaction rollback and constraint failures are covered.
- Backup/restore and retention behavior meet approved targets.
- No test data contains real credentials or production-sensitive content.

## Phase 6 — React reporting workflow

### T6.1 — Implement authenticated application shell

**Priority:** P0  
**Dependencies:** T0.2, T2.1–T2.3  
**Outputs:** React routing, auth state, and protected routes.

**Acceptance criteria:**

- Protected views enforce the approved authentication behavior.
- Unauthorized users cannot access protected report data or controls.
- Session expiration presents a clear recovery path.
- Auth tokens/secrets are not exposed in source-controlled configuration or unsafe browser storage.

### T6.2 — Implement configuration and connection status UI

**Priority:** P1  
**Dependencies:** T2.1, T3.5, T6.1  
**Outputs:** Configuration/status views.

**Acceptance criteria:**

- The UI shows period, Jira connectivity, mapping status, assignee scope, and actionable configuration warnings.
- Sensitive configuration values are never displayed.
- Loading, empty, success, partial, and error states are accessible.

### T6.3 — Implement period selection and data preview

**Priority:** P0  
**Dependencies:** T3.1, T4.1, T6.1  
**Outputs:** Period selector and metrics preview.

**Acceptance criteria:**

- The default period and valid historical periods follow the approved horizon.
- The preview shows issue counts, completed/WIP metrics, trends, warnings, and completeness state.
- A valid empty result is distinguishable from retrieval failure.
- Retry behavior is clear and does not duplicate server-side work.

### T6.4 — Implement narrative editor and RAG controls

**Priority:** P0  
**Dependencies:** T4.3, T6.1  
**Outputs:** Narrative and RAG forms.

**Acceptance criteria:**

- All required narrative fields and RAG controls are available.
- Client validation agrees with server validation without replacing server enforcement.
- Manual content is visually distinguished from Jira-derived content.
- Validation errors are associated with fields and are keyboard/screen-reader accessible.

### T6.5 — Implement Markdown preview and download

**Priority:** P0  
**Dependencies:** T4.5, T5.3, T6.3, T6.4  
**Outputs:** Safe report preview and browser download.

**Acceptance criteria:**

- Preview displays required sections and completeness/warning state.
- Unsafe content is rendered safely.
- Download uses the approved content type, encoding, filename, and version.
- Download is blocked or confirmed according to completeness policy.

### T6.6 — Implement history and regeneration UI

**Priority:** P0  
**Dependencies:** T5.4, T6.1  
**Outputs:** History, comparison, and regeneration screens.

**Acceptance criteria:**

- Authorized users can list, filter, download, compare, and regenerate permitted versions.
- Original and regenerated versions are clearly labeled.
- Long-running jobs expose status according to the approved job model.
- Errors and partial outcomes are actionable and never shown as success.

### T6.7 — Meet frontend accessibility and workflow test gates

**Priority:** P0  
**Dependencies:** T6.2–T6.6  
**Outputs:** Frontend tests and accessibility evidence.

**Acceptance criteria:**

- Critical workflows pass component and end-to-end tests.
- Approved accessibility target is tested with automated and manual checks.
- Keyboard navigation, focus management, labels, status announcements, tables, and non-color-only states are verified.
- Supported-browser checks pass.

## Phase 7 — Confluence publication

### T7.1 — Implement Confluence client

**Priority:** P0 if publication is v1; otherwise deferred  
**Dependencies:** T0.8, T2.4  
**Outputs:** Authenticated Confluence adapter.

**Acceptance criteria:**

- Client uses the approved API, representation, credentials, timeout, retry, and rate-limit policies.
- Permission and malformed-response failures are classified safely.
- No Confluence credential is available to frontend code or logs.

### T7.2 — Implement page identity and content conversion

**Priority:** P0 if publication is v1; otherwise deferred  
**Dependencies:** T0.8, T4.5, T7.1  
**Outputs:** Page mapping and safe content conversion.

**Acceptance criteria:**

- The intended space, parent, title, and page identity are resolved deterministically.
- Markdown/report content converts to the approved Confluence representation.
- Links, tables, empty sections, warnings, and report metadata remain correct.
- Existing content ownership and overwrite boundaries are enforced.

### T7.3 — Implement idempotent publication workflow

**Priority:** P0 if publication is v1; otherwise deferred  
**Dependencies:** T0.6–T0.9, T5.5, T7.2  
**Outputs:** Publication service and API integration.

**Acceptance criteria:**

- Only eligible report states can be published.
- Explicit confirmation and publication permission are required.
- Repeating an approved request does not create duplicate pages or versions beyond policy.
- Version conflicts, permission failures, rate limits, and uncertain responses produce explicit outcomes.
- Publication records contain external page ID/URL, actor, report version, and result.

### T7.4 — Implement publication UI and tests

**Priority:** P1 if publication is v1; otherwise deferred  
**Dependencies:** T7.3, T6.5, T6.7  
**Outputs:** Publication controls and integration tests.

**Acceptance criteria:**

- The UI shows configured destination, pre-publication validation, confirmation, progress, and final result.
- Partial or failed publication is never displayed as successful.
- Duplicate, conflict, permission, rate-limit, and unknown-outcome cases are tested.
- Publication audit evidence is visible to authorized operators.

## Phase 8 — Hardening and release readiness

### T8.1 — Execute integrated acceptance suite

**Priority:** P0  
**Dependencies:** T1.5, T2.6, T3.7, T4.6, T5.6, T6.7, T7.4 if applicable  
**Outputs:** Completed acceptance matrix.

**Acceptance criteria:**

- Every specification acceptance criterion has passing automated evidence or approved manual evidence.
- Failures identify requirement, environment, reproduction steps, and owner.
- No unresolved blocker is hidden by a passing smoke test.

### T8.2 — Perform security and privacy validation

**Priority:** P0  
**Dependencies:** T2.3, T3.2, T4.6, T5.5, T6.1, T7.3 if applicable  
**Outputs:** Security review and scan results.

**Acceptance criteria:**

- Dependency, container, static, and secret scans meet approved thresholds.
- Authentication, authorization, CSRF/CORS, security headers, rate limiting, SSRF, injection, unsafe URL, and malicious external-content tests pass.
- Secrets are absent from logs, traces, database records, API responses, browser assets, fixtures, and reports.

### T8.3 — Validate performance and resilience

**Priority:** P1  
**Dependencies:** T3.2, T4.1, T5.4, T7.3 if applicable  
**Outputs:** Performance and failure-mode report.

**Acceptance criteria:**

- Approved issue volume, concurrency, latency, and rate-limit targets are met.
- Timeout, retry, dependency outage, database failure, partial retrieval, and recovery behavior meet policy.
- No duplicate side effects occur during approved retry scenarios.

### T8.4 — Validate accessibility and browser support

**Priority:** P0  
**Dependencies:** T6.7  
**Outputs:** Accessibility and browser compatibility evidence.

**Acceptance criteria:**

- Approved WCAG target and browser matrix pass.
- Critical workflows are operable with keyboard and assistive technology.
- Loading, empty, partial, error, confirmation, and success states are accessible.

### T8.5 — Verify deployment, operations, backup, and rollback

**Priority:** P0  
**Dependencies:** T1.3, T1.6, T5.6, T8.2, T8.3  
**Outputs:** Deployment artifacts and runbooks.

**Acceptance criteria:**

- Docker Compose/local deployment and target deployment are reproducible.
- Health/readiness checks identify application and dependency failures.
- Migrations, backup/restore, rollback, retention, and incident procedures are tested.
- Logs, metrics, alerts, and runbooks meet approved operational targets.

### T8.6 — Release review and sign-off

**Priority:** P0  
**Dependencies:** T8.1–T8.5  
**Outputs:** Release decision and known-issues register.

**Acceptance criteria:**

- Constitution quality gates pass.
- All blocking issues are closed or explicitly accepted by the Product Owner and technical owner.
- Deployment, support, security, accessibility, performance, and recovery evidence is attached.
- The release definition of done in `spec/plan.md` is satisfied.

## Milestone mapping

| Milestone | Required task completion |
|---|---|
| M0 — Specification approved | T0.1–T0.11 |
| M1 — Foundation runnable | T1.1–T1.6 |
| M2 — Boundaries locked | T2.1–T2.6 |
| M3 — Jira pipeline trusted | T3.1–T3.7 |
| M4 — Report engine accepted | T4.1–T4.6 |
| M5 — History reliable | T5.1–T5.6 |
| M6 — Report workflow usable | T6.1–T6.7 |
| M7 — Publication controlled | T7.1–T7.4, when publication is in scope |
| M8 — Release candidate approved | T8.1–T8.6 |

## Global definition of done

A task is complete only when:

1. Its acceptance criteria pass.
2. Automated tests are added or the approved manual verification is recorded.
3. Documentation and API/schema artifacts are updated where applicable.
4. No secret or sensitive fixture data is introduced.
5. Formatting, linting, type checking, and relevant tests pass.
6. The change remains consistent with `spec/constitution.md`, `spec/specification.md`, and resolved decisions in `spec/clarify.md`.
7. Any deviation or newly discovered ambiguity is recorded for review rather than silently implemented.
