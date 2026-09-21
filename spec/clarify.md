# Specification Review and Clarifications

**Reviewed artifacts:**

- `spec/constitution.md`
- `spec/specification.md`
- Source: `work/module03-task/project_spec.md`

**Reviewer:** Senior developer review  
**Review date:** 2026-09-21  
**Disposition:** Not ready for implementation planning until the blocking items are resolved or explicitly accepted as assumptions.

## Executive assessment

The specification establishes a strong direction and contains useful acceptance criteria, but it is not yet implementation-ready. The largest risks are unresolved product decisions presented alongside normative requirements, scope drift between the original Module 08 Streamlit/Jira report and the newer React/Express/Jira/Confluence product, and insufficiently defined contracts for identity, external integrations, data completeness, persistence, and publication.

Several requirements use terms such as **complete**, **relevant**, **supported**, **configured**, **authorized**, **blocking**, and **partial** without defining measurable behavior. Different implementation teams could satisfy the current wording while producing incompatible systems.

## Blocking gaps and ambiguities

### C-01 — Product scope changed without an explicit migration decision

**Affected sections:** Specification purpose, FR-9, constitution technology baseline, source Module 08 architecture.

The source specification defines a Streamlit application that generates downloadable Markdown. The new specification defines a React 18/Vite frontend, Node.js/Express backend, PostgreSQL 15, Docker, and optional Confluence publication. The change is reasonable, but the specification does not state whether:

- the React/Express application replaces the Streamlit application;
- both applications must remain operational during migration;
- the current calculator/mock dashboard must be preserved in this product; or
- Confluence publication is a required first-release feature or a future extension.

**Impact:** Architecture, delivery scope, acceptance testing, deployment, and estimates cannot be finalized.

**Clarify:** Declare the target product and migration boundary. If React/Express is the replacement, state that Streamlit is no longer a runtime requirement. Decide whether Confluence publication is v1, feature-flagged v1, or post-v1.

### C-02 — Authentication and authorization are unspecified

**Affected sections:** Constitution IV; FR-2, FR-9, FR-11; security requirements; open questions 5 and 11.

The specification requires authorized users, explicit authorization checks, and protected endpoints, but does not define:

- user identity provider or login mechanism;
- session or token strategy;
- frontend-to-backend authentication flow;
- backend roles and permissions;
- whether the Jira/Confluence identity is per-user or a service account;
- permission checks for generation, regeneration, download, and publication;
- token refresh, logout, session expiration, or CSRF behavior; or
- whether local development bypasses authentication.

**Impact:** Security architecture and API design cannot be implemented safely.

**Clarify:** Define identity provider, roles, authentication flow, service-account delegation, authorization matrix, local-development behavior, and audit actor identity.

### C-03 — Three-month horizon has no defined meaning

**Affected sections:** Source scope; FR-1; open question 1.

The application is required to enforce an initial three-month horizon, but the specification leaves open whether this means:

- only the next three months may be generated;
- only the most recent three months may be retained;
- both generation and retention;
- three calendar months or a rolling 90-day period; or
- three months relative to deployment, current date, or selected report period.

**Impact:** Date validation, history retention, and acceptance tests will differ.

**Clarify:** Define whether the horizon is a generation filter, retention policy, or both; specify calendar versus rolling semantics and boundary dates.

### C-04 — Partial-data behavior is contradictory and unresolved

**Affected sections:** Goals; Journey D; FR-4; FR-8; FR-9; open question 12; constitution V.

The specification says the application must not generate an apparently complete report after required retrieval failure, but also says partial results may be preserved and downloaded. It does not define:

- which fields or failed requests are blocking;
- whether a report can be generated with incomplete pagination;
- whether download is allowed when Jira retrieval is partial;
- whether Confluence publication is always blocked for partial reports;
- the required completeness state values; or
- how partial metrics affect trends and counts.

**Impact:** The same failure could be treated as a successful report, a warning, or a hard failure by different implementations.

**Clarify:** Define a state machine such as `complete`, `complete_with_warnings`, `partial`, and `failed`, plus blocking conditions and allowed actions for each state.

### C-05 — Jira query scope and “relevant WIP” are undefined

**Affected sections:** FR-2 and FR-6.

Completed work is based on resolution during a period, but WIP is described as unresolved issues “relevant to the period.” The specification does not define the JQL or equivalent rules for:

- issue types included or excluded;
- resolved issues with missing resolution dates;
- created-date boundaries for WIP;
- issues updated during the period versus all current unresolved issues;
- subtasks, parent issues, epics, and linked issues;
- archived or cancelled issues;
- duplicate or moved issues; and
- timezone interpretation of Jira timestamps.

**Impact:** Metrics will not be reproducible or comparable between runs.

**Clarify:** Provide exact query definitions, inclusion/exclusion rules, date fields, timezone conversion rules, and deduplication behavior.

### C-06 — Jira and migration field mappings lack a concrete schema

**Affected sections:** FR-3; domain entities; configuration requirements.

The specification names logical fields but does not define the mapping format, precedence, data types, allowed values, cardinality, or validation rules. It is unclear whether a field may use multiple fallbacks, for example custom field then label then component, and which value wins when sources disagree.

**Impact:** Configuration loading, normalization, warnings, and report output cannot be designed consistently.

**Clarify:** Define a versioned mapping schema containing source type, field ID/name, fallback order, expected type, allowed values, requiredness, and conflict behavior.

### C-07 — Six-assignee scope is not operationally defined

**Affected sections:** Personas; FR-6; acceptance criterion 11; open question 2.

The specification requires all six configured assignees to be represented but does not define their identifiers, display names, inactive-user behavior, or whether issues assigned to anyone outside the list are included, excluded, or reported separately.

**Impact:** Per-assignee metrics and completeness checks cannot be verified.

**Clarify:** Define the assignee configuration schema, canonical Jira account IDs, display names, active/inactive behavior, and treatment of unrecognized assignees and unassigned issues.

### C-08 — Reporting period boundaries are incomplete

**Affected sections:** FR-1; domain entity `Report period`; required tests.

The specification says Monday–Sunday in Eastern Time but does not define inclusive/exclusive boundaries, the exact end instant, behavior when generated during the current week, or how Jira timestamps with offsets are converted.

**Impact:** Issues near midnight, Sunday/Monday boundaries, and daylight-saving transitions may be counted inconsistently.

**Clarify:** Define period as local dates plus an explicit UTC interval, for example `[Monday 00:00 America/New_York, following Monday 00:00 America/New_York)`, and define behavior for future and current periods.

### C-09 — Confluence publication model is underspecified

**Affected sections:** Journey C; FR-9; domain entity `Publication record`; open questions 6 and 7.

The specification does not define:

- Confluence Cloud API/version and page representation format;
- target space, parent page, or page-title rules;
- create-versus-update behavior;
- how a page is found idempotently;
- whether a page is one per period or a stable rolling page;
- version conflicts and concurrent edits;
- whether existing page content may be overwritten;
- Markdown-to-Confluence conversion rules; or
- publication retries and reconciliation after an uncertain response.

**Impact:** Publication could create duplicates, overwrite user content, or produce malformed pages.

**Clarify:** Decide target/page identity, storage format, update and conflict policy, version handling, ownership boundaries, and retry/reconciliation behavior before implementation.

### C-10 — API contracts are named but not specified

**Affected sections:** Constitution II; FR-11.

The endpoint categories are listed, but there are no paths, HTTP methods, request schemas, response schemas, status codes, pagination rules, error envelope, versioning convention, or idempotency headers. “Configuration and mapping status” and “publication status and execution” are especially ambiguous.

**Impact:** Frontend and backend cannot be developed independently and contract tests cannot be written.

**Clarify:** Add an OpenAPI contract or equivalent for every endpoint, including authentication requirements, validation errors, long-running job behavior, correlation IDs, and safe error fields.

### C-11 — Report identity, versioning, and immutability conflict

**Affected sections:** FR-8; `Report` and `Publication record` entities; acceptance criterion 8.

The report is described as an immutable original snapshot, but the user can edit narrative and regenerate a period. The specification does not define whether a report ID identifies a period, a generation, or a version, nor how original, regenerated, edited, and published variants relate.

**Impact:** History, comparison, downloads, and audit records may refer to the wrong content.

**Clarify:** Define immutable generation/version semantics, parent report relationships, whether narrative edits create a new version, and which version may be published.

### C-12 — Database model and retention requirements are incomplete

**Affected sections:** Constitution VI; FR-8; operations; source persistence recommendation.

The specification says PostgreSQL is the application source of truth but does not define tables, keys, indexes, constraints, transaction boundaries, JSON versus normalized storage, encryption/backup requirements, or retention/deletion behavior.

**Impact:** Persistence cannot be planned and historical behavior may violate privacy or operational requirements.

**Clarify:** Define the minimum schema, uniqueness constraints, report/version relationships, audit linkage, migration tool, backup/restore expectations, retention, deletion, and concurrency model.

### C-13 — Integration freshness and reproducibility are not defined

**Affected sections:** Goals; FR-4; FR-6; FR-8.

The specification uses terms such as “trustworthy,” “stale,” and “reproducible,” but does not define:

- acceptable Jira data age;
- whether all source responses are snapshotted;
- how Jira changes after generation affect regeneration;
- whether API metadata, field mappings, and status mappings are stored with the report;
- how metrics are recalculated from a historical snapshot; or
- how clock/timezone differences are handled.

**Impact:** Historical reports may be impossible to explain or reproduce.

**Clarify:** Define freshness thresholds, source snapshot contents, regeneration semantics, configuration versioning, and the reproducibility boundary.

## Significant non-blocking gaps

### G-01 — Jira API version and client behavior are unspecified

Define Jira Cloud API version, requested fields, expansion parameters, maximum page size, pagination termination conditions, retryable status codes, rate-limit reset handling, and response schema validation.

### G-02 — Confluence and Jira failure taxonomy is incomplete

Define user-facing categories and operator diagnostics for authentication, authorization, validation, timeout, DNS/TLS, rate limit, server error, malformed response, database failure, and unknown outcome. Specify which errors are retryable.

### G-03 — Idempotency requirements lack an algorithm

“Stable identifiers, idempotency controls, or reconciliation logic” is principle-level guidance, not an implementation requirement. Define the idempotency key for report generation and Confluence publication, duplicate detection, replay behavior, and handling of two concurrent requests.

### G-04 — Long-running job behavior is absent

Jira retrieval, report generation, and Confluence publication may exceed a normal HTTP request duration. Define synchronous versus asynchronous execution, job states, polling or server-sent events, cancellation, timeout, and retry behavior.

### G-05 — Manual narrative validation is undefined

Define required versus optional narrative fields, maximum lengths, allowed Markdown, sanitization rules, preservation of line breaks, and whether edits are autosaved or only stored on generation.

### G-06 — RAG semantics are incomplete

Define whether all three statuses require a rationale, whether a default is allowed, whether RAG is per report only or also per migration item, and how RAG changes appear during regeneration and publication.

### G-07 — Markdown rendering rules are incomplete

Define handling of Jira rich text, tables, pipes, newlines, HTML, links, user mentions, empty values, date formatting, locale, and unsafe URL schemes. Clarify whether Markdown is also converted to another format for Confluence.

### G-08 — Trend calculation is underspecified

“Progress/trend comparison” does not identify the metrics, comparison periods, missing-history behavior, division-by-zero behavior, or whether regenerated historical reports use current or original snapshots.

### G-09 — WIP and completed status configuration lacks validation

Define allowed status categories, behavior for unmapped statuses, whether mappings are versioned per report, and whether a status can belong to multiple categories.

### G-10 — Deployment and environment requirements are incomplete

Define local, test, staging, and production environments; Node.js version; package manager; Docker Compose services; ports; health checks; frontend/backend hosting; database migrations at startup; network egress; and Jira/Confluence allow-list requirements.

### G-11 — Configuration ownership and change control are unclear

Specify which settings are environment variables, database records, checked-in configuration, or operator-managed UI settings. Define who may change mappings and whether changes require effective dates or versioning.

### G-12 — Authorization is not reflected in audit requirements

Define audit event retention, actor identity, event taxonomy, access to audit records, correlation between API requests and external calls, and whether report downloads are audited.

### G-13 — Accessibility target is not measurable

Specify a target such as WCAG 2.2 AA, supported browsers, keyboard and screen-reader expectations, focus behavior, and accessible table/status/error requirements.

### G-14 — Performance objectives lack measurable targets

Define expected Jira issue volume, concurrent users, report generation latency, API response targets, database size, rate-limit budget, and acceptable time for Confluence publication.

### G-15 — Security requirements need threat-model coverage

Address SSRF through configurable URLs, HTML/Markdown injection, malicious Jira content, redirect handling, dependency and container scanning, rate limiting on application endpoints, browser security headers, CORS, CSRF, and data export authorization.

### G-16 — Observability requirements lack retention and alert rules

Define log levels, structured fields, metrics, traces, sensitive-field redaction, log retention, health dependency checks, and alerts for repeated integration failure or rate limiting.

### G-17 — Backup and disaster recovery are missing

Define PostgreSQL backup frequency, restore testing, recovery point objective, recovery time objective, and whether generated reports must be recoverable independently of live Jira/Confluence access.

### G-18 — Test fixtures and external test strategy are undefined

Specify whether Jira and Confluence use contract fixtures, mocks, sandbox tenants, or recorded responses; how secrets are provided in CI; and how rate limits and failure modes are tested safely.

### G-19 — Browser download and file naming behavior is incomplete

Define content type, character encoding, collision behavior, timezone used in filenames, maximum report size, and whether historical versions use generation date or reporting-period date.

### G-20 — Existing calculator compatibility is not scoped

The acceptance criteria require preserving unrelated calculator functionality, but the React/Express project structure does not identify where that functionality lives or how it will be tested. Decide whether this is a migration constraint, a temporary compatibility requirement, or an inherited source-repository check.

## Contradictions and tension points

### T-01 — Streamlit source versus React/Express target

The source specification requires Streamlit and local Streamlit startup, while the new specification requires React 18/Vite and Node.js/Express. The new document references migration from the source but does not define the transition or deprecation plan.

### T-02 — Optional Confluence versus first-release goal

The goals say the first release should allow Confluence publication, while FR-9 makes publication conditional on being enabled and configured. Decide whether publication is mandatory for acceptance or an optional deployment capability.

### T-03 — Immutable reports versus editable/regenerated reports

FR-8 requires immutable original snapshots but also supports user edits and regeneration. A formal version model is required to reconcile these behaviors.

### T-04 — PostgreSQL source of truth versus Jira/Confluence authority

The constitution calls PostgreSQL the source of truth for application-owned state while Jira and Confluence are authoritative for their respective resources. The specification should distinguish source-of-truth ownership for metrics, narrative, mappings, publication state, and historical snapshots.

### T-05 — Partial results versus no apparently complete report

The documents permit preservation and download of partial data but do not define the status and UI safeguards that prevent users or audiences from mistaking it for complete data.

### T-06 — Explicit confirmation versus no approval workflow

The non-goals exclude a formal approval workflow, but Confluence publication requires explicit user confirmation. Clarify that confirmation is an action safeguard, not a review/approval state, and define whether a second user is ever required.

### T-07 — “No data available” versus required completeness

FR-7 requires empty sections to remain in the report, while FR-10 prohibits apparently complete reports after required retrieval failures. Define the difference between a valid empty result and an unavailable result, and represent both visibly.

### T-08 — Stable deterministic output versus generation timestamp

The report includes a generation timestamp and also requires stable Markdown for unchanged data apart from dynamic timestamps. Define whether timestamps are excluded from content hashing/comparison and which fields participate in deterministic ordering.

## Missing acceptance criteria

Add explicit acceptance criteria for:

- Authentication, authorization, role permissions, session expiry, and unauthenticated access.
- Exact reporting-period boundaries, timezone conversions, and daylight-saving transitions.
- Jira query scope, pagination completion, duplicate handling, and unmapped statuses.
- Field mapping precedence, type validation, and mapping version persistence.
- Six-assignee configuration and out-of-scope assignees.
- Complete versus partial report state and allowed actions.
- Report/version identity, comparison, regeneration, and immutable snapshots.
- PostgreSQL migration execution, transaction rollback, backup, and restore.
- Confluence page creation/update, duplicate prevention, version conflict, and uncertain network response.
- API schemas, error envelopes, status codes, and long-running jobs.
- Markdown and Confluence escaping for hostile or malformed external content.
- Accessibility target and supported browsers.
- Performance at a defined Jira issue volume and concurrent-user count.
- Secret redaction in logs, traces, database records, API responses, and browser assets.

## Recommended clarification sequence

Resolve these decisions in order because later decisions depend on them:

1. Confirm the product boundary: React/Express replacement for Streamlit, and whether Confluence publication is v1.
2. Define authentication, authorization roles, and integration identity model.
3. Define reporting-period, three-month horizon, Jira query, WIP, and completed-work semantics.
4. Define field/status/assignee mapping schemas and versioning.
5. Define complete/partial/failed state behavior and user action gates.
6. Define report/version identity and PostgreSQL schema/retention.
7. Define Confluence page identity, format, update, conflict, and retry behavior.
8. Define API contracts and long-running job model.
9. Add measurable security, accessibility, performance, operations, and recovery targets.
10. Update acceptance tests and only then create the implementation plan.

## Minimum decisions required for planning approval

Planning should not begin until the specification has explicit answers for:

- target runtime and migration boundary;
- authentication and authorization;
- three-month horizon and retention semantics;
- exact Jira query and metric definitions;
- mapping and assignee configuration;
- partial-data policy;
- report versioning and database model;
- Confluence publication identity and conflict policy; and
- API contract and asynchronous-job behavior.
