# Jira/Confluence Automation — Feature Specification

**Specification ID:** JCA-001  
**Status:** Draft  
**Version:** 1.0.0  
**Source:** Module 08 `work/module03-task/project_spec.md`  
**Constitution:** `spec/constitution.md`  
**Primary project:** Jira `EPMCDMETST`  
**Target users:** Product Owner and six-person Cloud migration delivery team  
**Last Updated:** 2026-09-21

## 1. Purpose

Build a web application that retrieves Cloud migration delivery data from Jira Cloud, calculates trustworthy weekly delivery metrics, captures Product Owner narrative and manual RAG status, and produces a consistent Markdown status report for engineering leadership and project sponsors.

The application will use Jira as the source for delivery data, PostgreSQL for application-owned report history and audit metadata, and Confluence as an optional controlled publication destination for generated reports. The React frontend and Node.js/Express backend are the approved application boundary.

## 2. Goals

The first release MUST:

1. Reduce the manual effort required to prepare weekly status reports.
2. Provide a reproducible view of completed work, work in progress, and progress trends.
3. Surface migration highlights, risks, dependencies, and readiness information.
4. Preserve generated reports for historical review and regeneration.
5. Maintain issue-level traceability through Jira keys and links.
6. Allow an authorized user to publish an approved generated report to a configured Confluence location when that integration is enabled.
7. Make incomplete, stale, or partially retrieved data visible rather than presenting it as complete.

## 3. Non-goals and exclusions

The following are excluded from the first release:

- Editing Jira issues, statuses, assignees, or Jira fields.
- Automatically calculating or overriding the manual RAG status.
- Multi-project reporting.
- Automated email, Teams, or Slack distribution.
- Formal approval or sign-off workflow beyond explicit user confirmation before Confluence publication.
- Broad enterprise administration for unrelated teams.
- Uncontrolled bulk updates to Jira or Confluence.
- Treating Confluence as the source of Jira delivery metrics.

## 4. Users and personas

### 4.1 Product Owner

The Product Owner selects a reporting period, reviews Jira-derived metrics, enters narrative and manual RAG status, downloads the report, and optionally publishes the completed report to Confluence.

### 4.2 Delivery team member

A delivery team member is represented by a configured Jira assignee. Their work appears in completed-work, WIP, and per-assignee contribution views. Team members do not need write access to Jira or Confluence through this application unless a future specification adds it.

### 4.3 Report audience

Engineering leadership and project sponsors consume the generated Markdown or Confluence page. They require readable summaries, traceable issue links, clear limitations, and visible risks.

### 4.4 Operator

An operator configures credentials, mappings, status rules, database connectivity, logging, and deployment settings. Operators require actionable diagnostics but must not see secret values in logs or reports.

## 5. User journeys

### Journey A — Generate the current weekly report

1. The Product Owner opens the dashboard.
2. The application defaults to the previous completed Monday–Sunday week in `America/New_York`.
3. The user confirms the reporting period and reviews Jira connection and field-mapping status.
4. The application retrieves all required Jira issues for project `EPMCDMETST`.
5. The application displays issue counts, data-quality warnings, completed work, WIP, trends, and per-assignee metrics.
6. The user enters or edits the executive summary, weekly progress, highlights, risks, dependencies, and overall RAG status and rationale.
7. The application previews the Markdown report.
8. The user downloads the report with a deterministic filename.
9. The application stores the report snapshot, warnings, inputs, and rendered Markdown in PostgreSQL.

### Journey B — Review and regenerate historical reporting

1. The Product Owner opens report history.
2. The application lists previously generated reports by project and reporting period.
3. The user downloads an original stored report or selects a period for regeneration.
4. The application retrieves current Jira data for the selected period and identifies the result as regenerated.
5. The user can compare the regenerated result with the stored snapshot before downloading or publishing it.

### Journey C — Publish a completed report to Confluence

1. The user reviews a generated report and explicitly selects **Publish to Confluence**.
2. The application validates that the target space/page mapping is configured and that the report has no blocking retrieval errors.
3. The application creates or updates the configured Confluence page using an idempotent external identifier or controlled page mapping.
4. The application records the Confluence page identifier, URL, operation result, actor, and timestamp.
5. A failed or partial publication is shown as failed or partial and is never presented as successful.

### Journey D — Handle incomplete or failed Jira retrieval

1. A Jira request fails, is rate-limited, or returns incomplete pagination.
2. The backend retries only bounded transient failures.
3. The UI shows an actionable error or warning with the affected operation.
4. The application does not generate a report that appears complete when required Jira data was not retrieved.
5. If partial results are allowed by the business rules, the report clearly labels them as partial and lists the limitations.

## 6. Functional requirements

### FR-1 — Reporting period selection

- The application MUST default to the previous completed Monday–Sunday week.
- Period calculations MUST use `America/New_York`, including daylight-saving transitions.
- Users MUST be able to select supported historical periods for review and regeneration.
- The initial three-month horizon MUST be enforced once its meaning is confirmed.
- The selected period MUST be displayed in the UI and stored with every report.

### FR-2 — Jira connection and retrieval

- The backend MUST query Jira Cloud for issues visible to the configured identity in project `EPMCDMETST`.
- Jira retrieval MUST handle pagination until all required results are processed or a clear incomplete state is recorded.
- Requests MUST use bounded timeouts, retry transient failures with bounded exponential backoff, and handle rate-limit responses.
- The normalized issue record MUST support:
  - Issue key, summary, description excerpt, and Jira URL.
  - Issue type, status, status category, priority, and assignee.
  - Created, updated, resolved, and due dates where available.
  - Labels, components, sprint, and story points where available.
  - Configured migration metadata.
- Completed work MUST identify issues resolved during the selected reporting period.
- WIP MUST identify unresolved issues relevant to the period using configurable status mappings.
- The frontend MUST NOT call Jira directly.

### FR-3 — Jira field and status mappings

Migration-specific fields MUST be mapped by logical name rather than hard-coded to one custom-field ID.

The configuration MUST support these logical fields:

| Logical field | Required for report generation | Possible source |
|---|---:|---|
| Application/workload | Recommended | Custom field, label, or component |
| Migration wave | Recommended | Custom field or label |
| Environment | Recommended | Custom field |
| Target cloud | Recommended | Custom field |
| Readiness | Recommended | Custom field or status |
| Cutover date | Recommended | Custom date field |
| Dependencies | Recommended | Linked issues or custom field |
| RAG status | Manual application input in v1 | Application form |

Missing optional fields MUST produce data-quality warnings and unavailable values, not misleading defaults or an otherwise unexplained failure.

WIP and completed-status mappings MUST be visible in configuration or documentation so that metrics are reproducible.

### FR-4 — Data preview and quality warnings

The application MUST show:

- Number of Jira issues retrieved and normalized.
- Number of completed issues and WIP issues.
- Missing optional fields.
- Unmapped statuses.
- Pagination or completeness warnings.
- Availability of prior history for trend calculations.
- Jira authentication, authorization, rate-limit, and network errors in actionable language.

Warnings MUST remain associated with the generated report and history record.

### FR-5 — Product Owner narrative and RAG input

The user MUST be able to enter or edit:

- Executive summary.
- Weekly progress narrative.
- Highlights.
- Risks and dependencies.
- Overall RAG status: `Red`, `Amber`, or `Green`.
- RAG rationale.

The UI MUST distinguish manually entered content from Jira-derived values. The application MUST preserve the entered values in the report snapshot.

### FR-6 — Metrics and trends

Each report MUST include:

- Count of issues completed during the selected period.
- Completed issue list with keys, summaries, assignees, and Jira links.
- Current WIP count.
- WIP breakdown by status and assignee.
- Progress or trend comparison with the prior available reporting period when history exists.
- Per-assignee contribution or workload for all six configured assignees.

Metric definitions, period boundaries, status mappings, and unavailable-data behavior MUST be documented and reproducible.

### FR-7 — Markdown report generation

The report MUST contain these sections in order:

1. Report title, project, reporting period, and generation timestamp.
2. Executive Summary.
3. Overall RAG Status and rationale.
4. Weekly Progress.
5. Completed Work.
6. Work in Progress.
7. Highlights.
8. Risks and Dependencies.
9. Cloud Migration Overview, including migration wave, environment, target cloud, readiness, and cutover information when available.
10. Progress Trends.
11. Data Notes and limitations.

Additional rules:

- Tables MUST remain readable in common Markdown renderers.
- Jira keys MUST link to their corresponding Jira issue.
- Empty sections MUST show `No data available for this period` rather than silently disappearing.
- Externally sourced text MUST be safely escaped for Markdown.
- The filename MUST follow a deterministic pattern such as `jira-status-EPMCDMETST-YYYY-MM-DD.md`.
- Re-running unchanged source data SHOULD produce equivalent metrics and stable Markdown except for explicitly dynamic timestamps.

### FR-8 — Report persistence and history

Every generated report MUST store:

- Report identifier.
- Project key and reporting period.
- Generation timestamp and application version.
- Normalized metric snapshot.
- User-entered narrative and RAG values.
- Rendered Markdown.
- Data-quality warnings.
- Source retrieval completeness.

The application MUST allow users to download historical reports and regenerate a selected period. Regenerated results MUST be marked as regenerated and MUST NOT overwrite the original immutable snapshot without explicit versioning.

### FR-9 — Confluence publication

When enabled and configured:

- The backend MUST publish only a user-selected completed report.
- Publication MUST validate target space/page configuration and required authorization.
- The operation MUST create or update the intended Confluence page idempotently.
- The report content MUST identify its reporting period, generation time, source project, and limitations.
- The application MUST retain the Confluence page ID and URL when publication succeeds.
- Publication errors, permission failures, rate limits, and partial outcomes MUST be visible and auditable.
- The application MUST NOT publish a report with blocking Jira retrieval errors.

The exact Confluence page versioning and overwrite policy remains an open decision.

### FR-10 — Error and partial-data handling

The application MUST:

- Provide actionable messages for authentication, authorization, rate-limit, network, query, database, and publication errors.
- Retry only bounded transient failures.
- Preserve partial results only when their completeness is explicitly shown.
- Warn about missing fields, unmapped statuses, incomplete pagination, and unavailable history.
- Never produce an apparently complete report after a required retrieval failure.
- Log technical details without credentials, tokens, or unnecessary sensitive payloads.

### FR-11 — API boundary

The Express backend MUST provide documented, versioned endpoints for at least:

- Health and readiness status.
- Configuration and mapping status.
- Jira connection status.
- Report preview and generation.
- Report retrieval and Markdown download.
- Report history listing.
- Historical regeneration.
- Confluence publication status and execution.

The React frontend MUST consume these endpoints through an API client and MUST not contain Jira or Confluence credentials.

## 7. Domain entities

### Report

A generated or regenerated report with an identifier, project key, reporting period, generation timestamp, application version, rendered Markdown, metric snapshot, narrative input, RAG data, warnings, and source completeness.

### Normalized issue

A stable internal representation of a Jira issue containing its external key, summary, status, assignee, dates, links, optional planning fields, and migration metadata.

### Field mapping

A logical migration field mapped to a Jira field, label, component, status, linked issue relationship, or other supported source.

### Status mapping

A configured classification that determines whether a Jira status contributes to completed work, WIP, or neither.

### Report period

A Monday–Sunday interval represented in `America/New_York`, with explicit start and end dates and a clear timezone interpretation.

### Publication record

An audit record for a Confluence create/update attempt, including report ID, target space/page mapping, external page ID and URL when known, actor, timestamps, status, and safe diagnostics.

### Audit event

An immutable record of an automation action, initiating actor or process, target resource, outcome, correlation ID, and timestamp without secret values.

## 8. User interface requirements

The React application MUST provide:

1. **Configuration area:** reporting period, Jira connection status, mapping status, status rules, and assignee scope.
2. **Data preview:** issue counts, metrics preview, and data-quality warnings.
3. **Narrative editor:** fields for summary, progress, highlights, risks, and dependencies.
4. **RAG controls:** status selector and rationale editor.
5. **Report preview:** rendered Markdown or equivalent readable preview before download.
6. **History view:** periods, generation timestamps, original/regenerated state, download, and regeneration actions.
7. **Confluence publication controls:** configured destination, pre-publication validation, explicit confirmation, and publication result.
8. **Loading and error states:** clear states for loading, empty, partial, successful, and failed operations.

The UI MUST use descriptive labels and status text rather than color alone and MUST support keyboard-accessible interaction.

## 9. Security and privacy requirements

- Jira and Confluence credentials MUST be supplied through environment configuration or managed secrets.
- Tokens and passwords MUST never be committed, logged, returned by the API, placed in a browser bundle, or included in Markdown.
- Integration credentials MUST use least privilege.
- All external communication MUST use HTTPS in deployed environments.
- API endpoints MUST authenticate and authorize users according to the deployment model.
- Jira descriptions, comments, issue fields, and Confluence content MUST be treated as potentially sensitive.
- User input and external content MUST be validated and safely escaped.
- Audit logs MUST exclude secrets and unnecessary sensitive content.
- `.env` files containing real values MUST remain excluded from version control.

## 10. Reliability, performance, and operations

### Reliability

- Complete Jira pagination is mandatory for a successful complete report.
- External calls require bounded timeouts and retry policies.
- Automation operations should be idempotent and safe to retry.
- Database writes for report state and audit records must be transactional where consistency requires it.

### Performance

- The application SHOULD avoid repeated Jira calls during one generation run.
- Read-only Jira data MAY be cached for the active session when safe.
- The first release MUST support one six-assignee team and normal project-scale Jira results without unnecessary repeated requests.

### Operations

- The backend MUST expose health and readiness checks.
- Logs MUST be structured and correlated by request or automation-run ID.
- Operators MUST be able to distinguish dependency outage, authentication failure, rate limiting, and application failure.
- PostgreSQL schema changes MUST use versioned migrations.
- PostgreSQL 15 MUST be runnable locally through Docker Compose.

## 11. Acceptance criteria

1. An authorized user can connect to Jira Cloud and retrieve visible issues from `EPMCDMETST`.
2. The default report period is the previous completed Monday–Sunday week in `America/New_York`.
3. Jira pagination and transient retry behavior are tested and do not silently omit issues.
4. The report includes completed work, WIP, trends, highlights, risks/dependencies, and migration details when mapped data exists.
5. Completed issues contain working Jira keys and links.
6. The user can enter narrative and manual RAG status and preview/download Markdown.
7. Reports are stored in PostgreSQL and can be downloaded or regenerated from history.
8. Regenerated reports are identified as regenerated and do not silently replace original snapshots.
9. Missing optional fields generate warnings rather than misleading values or unexplained crashes.
10. Jira failures produce clear errors and never result in an apparently complete report.
11. All six configured assignees are represented, including zero-contribution assignees where appropriate.
12. A configured report can be explicitly published to Confluence with an auditable result.
13. The UI provides accessible loading, empty, partial, success, and error states.
14. Secrets do not appear in logs, API responses, browser assets, audit records, or rendered reports.
15. Existing project startup and unrelated calculator functionality remain intact during migration from the source specification.

## 12. Required test coverage

The implementation plan MUST include tests for:

- Reporting periods across month, year, and daylight-saving boundaries.
- Jira pagination, retry, timeout, rate-limit, and authorization behavior.
- Jira response normalization and configurable field/status mappings.
- Completed-work, WIP, per-assignee, and trend calculations.
- Missing prior history and partial-data warnings.
- Markdown escaping, stable ordering, links, deterministic filenames, and empty sections.
- PostgreSQL report persistence, versioning, retrieval, and regeneration.
- API contract validation and safe error responses.
- Confluence publication idempotency, permission failures, and audit records.
- Secret redaction from logs and rendered output.
- Critical React workflows and accessible error/loading states.

## 13. Open questions and decisions required before implementation

1. Does “three months” define the generation horizon, the retention period, or both?
2. What are the six Jira account identifiers for the delivery team?
3. What Jira custom-field IDs and allowed values represent migration metadata?
4. Which exact Jira statuses count as WIP and completed work?
5. What authentication model will be used: local token, OAuth, SSO, or service account?
6. What Confluence space, parent page, page title convention, and versioning policy should be used?
7. Should Confluence publication create a new page per reporting period or update a stable page?
8. What report history retention and backup policy is required?
9. May issue descriptions, dependency details, or generated reports contain sensitive data?
10. What deployment target and network path will provide access to Jira, Confluence, and PostgreSQL?
11. Which users may generate reports, regenerate history, and publish to Confluence?
12. What is the policy for reports with partial Jira data: block generation, allow download with warnings, or allow both with explicit confirmation?

## 14. Constitution alignment

This specification follows `spec/constitution.md`:

- **I — Specification-First:** requirements, scenarios, acceptance criteria, and open questions are explicit.
- **II — Contract-Driven Boundaries:** React communicates with Express; integrations remain server-side.
- **III — Approved Technology:** React 18/Vite, Node.js/Express, TypeScript, PostgreSQL 15, and Docker are the target baseline.
- **IV — Security:** credentials are externalized, least privilege is required, and content is validated.
- **V — Reliable Automation:** Jira/Confluence operations define retries, idempotency, and partial outcomes.
- **VI — Auditability:** report and publication records retain external identifiers and safe audit metadata.
- **VII — Quality Gates:** unit, integration, contract, and end-to-end coverage is required.
- **VIII–X — Operations, accessibility, and maintainability:** health checks, usable states, documentation, and migration discipline are required.
