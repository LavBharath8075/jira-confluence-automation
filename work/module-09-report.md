# Module 09 Completion Report

## Tracked Files
fatal: not a git repository (or any of the parent directories): .git

## Backlog Commit History
fatal: not a git repository (or any of the parent directories): .git

## backlog.md Contents
# Implementation Backlog

This backlog translates the project specification into a practical delivery plan for the Atlas Jira Status Report Generator. It assumes an MVP-first approach while still following a single-pass implementation sequence across all required phases.

## Phase 1: Setup

- [ ] Create the project structure for the Streamlit app and shared package layout.
  - [ ] Create the application root directory and package folders.
  - [ ] Add `app.py`, `requirements.txt`, and the core package modules.
  - [ ] Create `config/` for environment and field-mapping configuration.
  - [ ] Add `tests/` with a basic structure for unit and validation tests.
- [ ] Define the runtime environment and dependency baseline.
  - [ ] Confirm Python version and package compatibility.
  - [ ] Add required dependencies for Streamlit and supporting libraries.
  - [ ] Document local setup steps for Windows development.
- [ ] Establish configuration patterns for Jira and report settings.
  - [ ] Decide how Jira URL, credentials, and project identifiers are loaded.
  - [ ] Create a settings module to read environment variables and default configuration.
  - [ ] Define a default project scope for `EPMCDMETST` and default timezone handling for `America/New_York`.
- [ ] Create a minimal app shell for the Streamlit UI.
  - [ ] Build a page title, layout, and sidebar structure.
  - [ ] Add placeholders for report period selector, Jira status, narrative inputs, and download actions.
  - [ ] Ensure the application launches without secret configuration in the default local environment.
- [ ] Define the data model for Jira issues and report snapshots.
  - [ ] Create issue models with required fields such as key, summary, assignee, status, priority, and dates.
  - [ ] Define report metadata for generation timestamp, reporting period, and history tracking.
  - [ ] Establish what missing values look like and how warnings are represented.
- [ ] Create a local development task flow.
  - [ ] Add a command to run the Streamlit app locally.
  - [ ] Add a command to run the unit tests from the project root.
  - [ ] Decide on a simple validation workflow for each feature before moving on.

## Phase 2: Core Features

### 2.1 Reporting Period and Report Selection

- [ ] Implement the default reporting period logic.
  - [ ] Calculate the previous completed Monday–Sunday week in `America/New_York`.
  - [ ] Allow manual selection of a supported report week.
  - [ ] Enforce the initial three-month reporting horizon logic.
- [ ] Build the reporting-period UI.
  - [ ] Add a date/week selector in the sidebar or configuration panel.
  - [ ] Show the selected reporting range and generation window clearly.
  - [ ] Display validation warnings when the selected period is out of range.

### 2.2 Jira Query and Retrieval Layer

- [ ] Implement a Jira client abstraction.
  - [ ] Add request setup with authentication and HTTPS handling.
  - [ ] Handle Jira REST calls for issue retrieval and pagination.
  - [ ] Include bounded retry logic for transient failures.
  - [ ] Detect and classify auth, authorization, rate-limit, network, and query errors.
- [ ] Build Jira query generation.
  - [ ] Query issues for project `EPMCDMETST` visible to the configured identity.
  - [ ] Filter issues to the reporting period for completed work and WIP.
  - [ ] Support required metadata such as key, summary, type, status, assignee, dates, labels, and links.
- [ ] Implement normalisation of Jira issue payloads.
  - [ ] Convert raw API responses into stable internal issue records.
  - [ ] Fill in missing values with safe defaults or explicit null markers.
  - [ ] Capture warnings for unavailable or unmapped fields.

### 2.3 Metrics, WIP, and Trend Calculations

- [ ] Define the completed-work calculation.
  - [ ] Identify issues resolved during the reporting period.
  - [ ] Include key, summary, assignee, and Jira links in the completed-work list.
- [ ] Define the WIP calculation.
  - [ ] Identify unresolved issues relevant to the reporting period.
  - [ ] Summarise counts by status and assignee.
  - [ ] Map status categories in a configurable way.
- [ ] Add trend and progress metrics.
  - [ ] Compare against the previous reporting period when available.
  - [ ] Show counts and change direction for a simple period-over-period summary.
- [ ] Implement per-assignee workload summaries.
  - [ ] Support the six Jira assignees in scope.
  - [ ] Display contribution breakdowns clearly in the report and UI.
- [ ] Add data-quality warnings.
  - [ ] Warn when fields are missing or partially unavailable.
  - [ ] Warn when pagination is incomplete or source data is partial.
  - [ ] Keep metrics reproducible and clearly labeled.

### 2.4 Report Narrative and Manual Inputs

- [ ] Build the narrative editor UI.
  - [ ] Add fields for executive summary, weekly progress, highlights, risks, and dependencies.
  - [ ] Add a manual RAG status selector with `Red`, `Amber`, and `Green` values.
  - [ ] Add a rationale field for the chosen status.
- [ ] Make data provenance clear in the UI.
  - [ ] Distinguish manually entered content from Jira-derived content.
  - [ ] Show explicit labels and sections for narrative vs. metrics.
- [ ] Save user-entered values in the current report session.
  - [ ] Keep values in memory for preview generation.
  - [ ] Prepare for persistence in later report history work.

### 2.5 Markdown Report Rendering

- [ ] Implement a report renderer.
  - [ ] Follow the required section order from the specification.
  - [ ] Include title, project, reporting period, and generation timestamp.
  - [ ] Render completed work, WIP, highlights, dependencies, and trends.
  - [ ] Use readable Markdown tables and issue links.
- [ ] Add empty-state handling.
  - [ ] Show `No data available for this period` when sections are empty.
  - [ ] Avoid silent omissions in generated reports.
- [ ] Add deterministic output rules.
  - [ ] Ensure report content is stable and reproducible for the same inputs.
  - [ ] Standardise the generated filename format.

## Phase 3: Integration

- [ ] Integrate Jira retrieval with the report-generation flow.
  - [ ] Create a clear end-to-end process from configuration to data fetch to metrics to final Markdown.
  - [ ] Ensure report generation fails gracefully with clear diagnostics if the data retrieval is incomplete.
- [ ] Connect the Streamlit UI to the report model.
  - [ ] Display retrieved issue counts and warnings in a data preview panel.
  - [ ] Bind narrative and status controls to the generated report preview.
  - [ ] Add a preview pane for rendered Markdown before download.
- [ ] Implement download actions.
  - [ ] Add a button to export the current report as a Markdown file.
  - [ ] Use a deterministic file naming pattern such as `jira-status-EPMCDMETST-YYYY-MM-DD.md`.
- [ ] Add historical report persistence.
  - [ ] Store report metadata, narrative, metrics snapshot, and rendered Markdown.
  - [ ] Include report identifier, period, generation timestamp, and application version.
  - [ ] Allow retrieval of previous reports for review and regeneration.
- [ ] Support regeneration and comparison.
  - [ ] Rebuild a report for a selected period and store it as regenerated rather than immutable.
  - [ ] Mark changed data sources or refreshed outputs clearly.
- [ ] Implement configuration-driven field mapping.
  - [ ] Allow logical fields like application, migration wave, environment, target cloud, readiness, and cutover date to map to Jira fields or metadata.
  - [ ] Log warnings when optional mappings are missing.
- [ ] Wire in migration details.
  - [ ] Render cloud migration overview data in the Markdown report where available.
  - [ ] Keep missing migration fields visible as unavailable rather than breaking the report.

## Phase 4: Testing

- [ ] Create unit tests for core calculations and normalisation.
  - [ ] Test completed work and WIP aggregation logic.
  - [ ] Test status and assignee breakdown logic.
  - [ ] Test report-period date logic and timezone edge conditions.
- [ ] Create unit tests for the report renderer.
  - [ ] Assert required section headings exist in order.
  - [ ] Verify empty sections show the expected fallback message.
  - [ ] Verify Jira keys are rendered as links.
- [ ] Create unit tests for Jira query and response handling.
  - [ ] Validate pagination logic.
  - [ ] Validate retry and failure classification.
  - [ ] Ensure partial-data scenarios produce warnings instead of silent success.
- [ ] Add integration-level smoke tests.
  - [ ] Run the Streamlit app locally in headless mode.
  - [ ] Confirm UI panels render without critical runtime errors.
  - [ ] Verify report generation works with sample issue data.
- [ ] Add validation for edge cases.
  - [ ] Test no-matching-data scenarios.
  - [ ] Test missing fields and optional data.
  - [ ] Test divide-by-zero or invalid metric situations where applicable.
- [ ] Add regression coverage before each release milestone.
  - [ ] Ensure the existing calculator examples remain intact while the new reporting app is developed.
  - [ ] Validate that all critical user workflows still work after refactoring.

## Phase 5: Documentation

- [ ] Update project documentation for setup and usage.
  - [ ] Document Python installation and dependency setup.
  - [ ] Add instructions for starting the Streamlit app locally on Windows.
  - [ ] Describe each required environment variable or config file.
- [ ] Document architecture and responsibilities.
  - [ ] Explain the role of the Jira client, query layer, normalizer, metrics service, renderer, and repository.
  - [ ] Clarify the configuration model for field mappings and status mappings.
- [ ] Document report behavior and data notes.
  - [ ] Clarify what counts as completed work, WIP, and trend metrics.
  - [ ] Explain how missing data and partial retrieval warnings are surfaced.
- [ ] Document release and maintenance steps.
  - [ ] Describe how to regenerate a report for a historical period.
  - [ ] Document how to download and review previous reports.
  - [ ] Add a short troubleshooting section for Jira auth, rate limits, and partial data scenarios.
- [ ] Keep examples current.
  - [ ] Update README content if the UI or generated report sections change.
  - [ ] Ensure sample usage and commands match the actual project structure.
- [ ] Final project review checklist.
  - [ ] Verify all acceptance criteria in the project spec are mapped to an implementation task.
  - [ ] Confirm no required feature is left untracked.
  - [ ] Review release readiness before moving to delivery or handoff.

## Suggested Delivery Order

1. Setup
2. Core Features
3. Integration
4. Testing
5. Documentation

## Definition of Done

- [ ] The app runs locally from the project directory.
- [ ] The report generation flow works end-to-end with Jira data and sample data.
- [ ] Markdown output includes all required sections and empty-state handling.
- [ ] Users can review period selection, enter narrative content, and download a final report.
- [ ] Tests cover the core logic and fail-safe scenarios.
- [ ] Documentation matches the implementation and the project can be onboarded by a new developer.
