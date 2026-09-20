# Module 08 Completion Report

## Tracked Files

```
.gitignore
README.md
app.py
calculator.py
calculator/main.py
calculator/operations.py
hello.txt
main.py
project_spec.md
requirements-document.md
requirements.txt
```

## Spec Commit History

```
8e626da (HEAD -> main) Module 8 completed and committed to git
```

## project_spec.md Contents

```markdown
# Weekly Jira Status Report Generator

## 1. Document control

| Item | Value |
|---|---|
| Status | Draft technical specification |
| Product owner | Product Owner for the Cloud migration project |
| Initial team | Six Jira assignees |
| Primary project | Jira project `EPMCDMETST` |
| Target application | Streamlit web app |
| Report format | Downloadable Markdown |
| Reporting cadence | Weekly, Eastern Time |
| Initial reporting horizon | Three months |

## 2. Purpose and goals

Build a Streamlit application that retrieves Cloud migration delivery data from Jira Cloud and produces a consistent weekly status report for engineering leadership and project sponsors.

The first release must:

- Reduce manual weekly reporting effort.
- Provide a trustworthy view of completed work, work in progress, and progress trends.
- Surface migration highlights, risks, and dependencies in a stakeholder-friendly format.
- Preserve generated reports so the Product Owner can review historical progress.
- Keep issue-level traceability through Jira keys and links.

## 3. Users and stakeholders

### Primary users

- Product Owner: generates and distributes the report; owns manual narrative and RAG status.
- Six-person Cloud migration delivery team: represented by Jira assignees.

### Report audience

- Engineering leadership.
- Project sponsors.

The first release does not require a review or approval workflow before download. A generated report is considered final for that run.

## 4. Scope

### In scope

- Jira Cloud REST API integration for project `EPMCDMETST`.
- Configurable Jira field mappings.
- Weekly Monday–Sunday reporting periods.
- Eastern Time date handling, including daylight-saving behavior.
- Completed-work, WIP, and progress/trend metrics.
- Cloud migration details: applications/workloads, migration waves, environments, target cloud, readiness, cutover dates, dependencies, and RAG status.
- Markdown report generation and Streamlit download.
- Persistent report history and regeneration/comparison support.
- Manual RAG status and rationale.
- Jira issue keys and links for traceability.
- Generation for the next three months.

### Out of scope for v1

- Editing Jira issues from the application.
- Automatically changing Jira status, assignees, or fields.
- Automated email, Teams, or Slack distribution.
- Multi-project reporting.
- Formal approval/sign-off workflow.
- Automated RAG calculation.
- A fixed choice of authentication or history database; these remain architecture decisions.
- Broad enterprise multi-team administration.

## 5. Functional requirements

### FR-1: Select reporting period

The application shall default to the previous completed Monday–Sunday week in `America/New_York` timezone. The user shall be able to select a supported report week when regenerating or reviewing history.

The application shall enforce the initial three-month reporting horizon. The exact interpretation of this horizon must be confirmed: planned generation window, retention period, or both.

### FR-2: Retrieve Jira data

The application shall query Jira Cloud for issues in project `EPMCDMETST` that are visible to the configured Jira identity. It shall handle pagination and retrieve all matching issues needed for the selected reporting period.

At minimum, the normalized issue record should support:

- Issue key, summary, description excerpt, and Jira URL.
- Issue type, status, status category, priority, and assignee.
- Created, updated, resolved, and due dates where available.
- Labels, components, sprint, and story points where available.
- Configured migration fields.

The completed-work query shall identify issues resolved during the reporting period. The WIP query shall identify unresolved issues relevant to the period, with the exact status mapping configurable.

### FR-3: Configure field mappings

Migration-specific fields shall not be hard-coded to one Jira custom-field ID. A configuration layer shall map logical fields to Jira fields or supported Jira metadata:

| Logical field | Required | Examples |
|---|---:|---|
| Application/workload | Recommended | Custom field, label, or component |
| Migration wave | Recommended | Custom field or label |
| Environment | Recommended | Custom field |
| Target cloud | Recommended | Custom field |
| Readiness | Recommended | Custom field or status |
| Cutover date | Recommended | Custom date field |
| Dependencies | Recommended | Linked issues or custom field |
| RAG status | Recommended | Manual application value in v1 |

Missing optional fields shall be reported as unavailable rather than causing the entire report to fail.

### FR-4: Capture Product Owner input

The user shall be able to enter or edit report-level narrative and manual status information before downloading:

- Executive summary.
- Weekly progress narrative.
- Highlights.
- Risks and dependencies.
- Overall RAG status and rationale.

The UI shall distinguish manually entered content from Jira-derived content.

### FR-5: Calculate metrics

The report shall include, at minimum:

- Count of issues completed during the reporting period.
- Completed issue list with keys, summaries, assignees, and links.
- Current WIP count and breakdown by status and assignee.
- Progress/trend comparison with at least the prior available reporting period when history exists.
- Per-assignee contribution or workload view for the six mapped Jira assignees.

Metric definitions and status mappings shall be visible in configuration or documentation so that results are reproducible.

### FR-6: Generate Markdown

The generated Markdown shall contain these sections, in order:

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

Tables shall remain readable in common Markdown renderers. Jira keys shall link to the corresponding Jira issue. Empty sections shall display a clear `No data available for this period` note rather than silently disappearing.

### FR-7: Persist and retrieve history

Each generated report shall store:

- Report identifier and reporting period.
- Generation timestamp and application version.
- Normalized metric snapshot.
- User-entered narrative and RAG values.
- Rendered Markdown.
- Data-quality warnings.

The application shall allow the user to download a historical report and regenerate a report for a selected period. If the source Jira data has changed, regenerated results shall be marked as regenerated rather than presented as an immutable original snapshot.

### FR-8: Handle errors and partial data

The application shall:

- Retry transient Jira failures with bounded exponential backoff.
- Show a clear actionable message for authentication, authorization, rate-limit, network, and query errors.
- Preserve partial results only when their completeness is explicitly shown.
- Display warnings for missing fields, unmapped statuses, incomplete pagination, or unavailable history.
- Never produce a report that appears complete when Jira retrieval failed.
- Log technical details without exposing credentials or tokens.

## 6. Proposed user interface

The Streamlit app should provide:

1. **Configuration sidebar**: report period, Jira connection status, field mapping status, and assignee scope.
2. **Data preview**: retrieved issue count, missing-field warnings, and metric preview.
3. **Narrative editor**: text areas for executive summary, progress, highlights, and risks/dependencies.
4. **RAG controls**: manual status selector (`Red`, `Amber`, `Green`) and rationale.
5. **Report preview**: rendered Markdown or formatted preview before download.
6. **History view**: prior periods, generation timestamps, and download/regenerate actions.
7. **Download action**: deterministic filename such as `jira-status-EPMCDMETST-YYYY-MM-DD.md`.

## 7. Technical architecture

### Components

- **Streamlit presentation layer**: input controls, previews, warnings, history navigation, and download.
- **Jira client**: authentication, REST requests, pagination, retries, rate-limit handling, and response validation.
- **Query service**: builds period-specific Jira queries and retrieves required fields.
- **Normalizer**: converts Jira responses to stable internal issue models.
- **Metrics service**: computes completed work, WIP, trends, and per-assignee summaries.
- **Report model and renderer**: validates report data and renders deterministic Markdown.
- **Persistence repository**: stores report snapshots and metadata behind a replaceable interface.
- **Configuration service**: loads environment settings and configurable field/status mappings.

### Suggested Python package layout

```text
module03-task/
├── app.py
├── project_spec.md
├── requirements.txt
├── .env                  # local secrets; never commit
├── config/
│   └── field_mappings.toml
├── jira_status_report/
│   ├── jira_client.py
│   ├── models.py
│   ├── queries.py
│   ├── metrics.py
│   ├── report_renderer.py
│   ├── repository.py
│   └── settings.py
└── tests/
    ├── test_metrics.py
    ├── test_queries.py
    └── test_report_renderer.py
```

The existing calculator files and the current mock dashboard should remain functional while this capability is introduced. The implementation may refactor `app.py` into modules, provided existing calculator behavior is not changed.

## 8. Configuration and secrets

The implementation should use environment variables or a local secret store rather than hard-coded credentials. Proposed settings are:

- `JIRA_BASE_URL`
- `JIRA_PROJECT_KEY=EPMCDMETST`
- `JIRA_AUTH_MODE`
- `JIRA_EMAIL` and `JIRA_API_TOKEN` for the initial token-based option, if selected
- `REPORT_TIMEZONE=America/New_York`
- `REPORT_HORIZON_MONTHS=3`
- `REPORT_HISTORY_DATABASE_URL`

The existing project contains a `.env` file. It must remain excluded from version control, and real tokens must never be committed, logged, rendered, or included in generated Markdown.

Authentication is undecided. The preferred production baseline is SSO for Streamlit users plus a least-privilege Jira service account, or OAuth where organizational policy supports it. Personal API tokens may be used for local development only.

## 9. Persistence recommendation

Use SQLite for local development and a repository abstraction that can be moved to PostgreSQL or a managed cloud database for shared deployment. The selected production store must support:

- Unique report period/project constraint or explicit versioning.
- Transactional writes.
- Concurrent reads.
- Backup and retention policy.

The final database choice is an open decision and depends on deployment topology and whether multiple users will access one shared instance.

## 10. Non-functional requirements

### Reliability

- Complete Jira pagination is mandatory.
- A report must identify its source period and generation timestamp.
- Re-running the same period with unchanged data should produce equivalent metrics and stable Markdown apart from explicitly dynamic timestamps.

### Security

- Least-privilege Jira access.
- Secrets supplied through environment configuration or a managed secret store.
- No secrets in source control, logs, exception messages, or report output.
- Sanitize or safely escape Jira text before Markdown rendering to prevent malformed output and unsafe links.

### Performance

- Avoid repeated Jira calls during one generation run.
- Cache read-only Jira data for the active Streamlit session where safe.
- Keep the first release suitable for one six-assignee team and normal project-scale Jira results.

### Accessibility and usability

- Use descriptive labels and status text, not color alone.
- Provide readable tables and clear empty/error states.
- Optimize for desktop browser use.

### Compatibility

- Preserve existing calculator functionality.
- Continue supporting local launch through Streamlit.
- Pin or constrain new dependencies in `requirements.txt`.

## 11. Testing and acceptance criteria

### Automated tests

- Reporting period calculation across month, year, and daylight-saving boundaries.
- Jira pagination and retry behavior using mocked responses.
- Completed and WIP metric calculations.
- Trend calculations with missing prior history.
- Configurable field and status mappings.
- Markdown escaping, links, stable ordering, and empty sections.
- Persistence create/read/regenerate behavior.
- Secret values do not appear in logs or rendered reports.

### Acceptance criteria

1. A user can connect to Jira Cloud and retrieve visible issues from `EPMCDMETST`.
2. The default period is the previous Monday–Sunday week in `America/New_York`.
3. The report includes completed work, WIP, trends, highlights, risks/dependencies, and migration details when mapped data exists.
4. The report includes issue keys and working Jira links.
5. The user can enter manual narrative and RAG status and download Markdown from Streamlit.
6. Reports are stored and can be downloaded or regenerated from history.
7. Missing optional fields produce warnings, not misleading values or unexplained crashes.
8. Jira failures produce clear errors and never result in an apparently complete report.
9. The app handles all six configured assignees and does not silently omit unmapped issues.
10. Existing calculator functionality and project startup remain intact.

## 12. Open decisions and prerequisites

The following items must be resolved before implementation is considered production-ready:

- Confirm whether “three months” is a generation horizon, retention period, or both.
- Confirm the six Jira account identifiers for the delivery team.
- Identify Jira custom-field IDs and allowed values for migration metadata.
- Define the exact status categories included in WIP and completed work.
- Decide authentication: local token, OAuth, or SSO plus service account.
- Decide persistence target: SQLite for single instance versus PostgreSQL/managed storage.
- Confirm whether report history should be retained indefinitely or for a fixed period.
- Confirm whether issue descriptions and dependency details may contain sensitive data.
- Confirm deployment target and network access path to Jira Cloud.
- Define the three-month release schedule or whether the horizon is only a reporting filter.

## 13. Implementation phases

### Phase 1: Foundation

- Confirm open decisions and Jira field mappings.
- Add settings, models, and repository interfaces.
- Keep the existing mock dashboard runnable.

### Phase 2: Jira integration

- Implement authenticated client, pagination, retries, query construction, and normalization.
- Add mocked API tests and data-quality warnings.

### Phase 3: Metrics and report generation

- Implement period logic, metrics, trends, manual narrative model, and Markdown renderer.
- Add deterministic output and renderer tests.

### Phase 4: Streamlit workflow and history

- Add connection/configuration UI, preview, history, persistence, and download.
- Add end-to-end tests with mocked Jira and a temporary database.

### Phase 5: Deployment hardening

- Select production authentication and database.
- Configure secret management, logging, backups, retention, and operational monitoring.
```