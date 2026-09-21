# Module 14 Completion Report

## Backlog Contents
# Implementation Backlog

> Decision tags: **MCP** = use an existing Jira/Confluence MCP server; **custom skill** = define a reusable agent workflow; **application code** = implement directly in the Streamlit/Python project.

This backlog translates the project specification into a practical delivery plan for the Atlas Jira Status Report Generator. It assumes an MVP-first approach while still following a single-pass implementation sequence across all required phases.

## Module 19: GitHub Coding Agent Delegation

The best candidates for delegation to the GitHub coding agent are bounded application-code tasks with clear acceptance criteria and minimal external access requirements. In particular, consider delegating:

- Issue #24: Create the application root directory and package folders.
- Issue #23: Add `app.py`, `requirements.txt`, and the core package modules.
- Issue #22: Create `config/` for environment and field-mapping configuration.
- Issue #21: Add `tests/` with a basic structure for unit and validation tests.
- Issue #18: Add required dependencies for Streamlit and supporting libraries.
- Issue #14: Create a settings module to read environment variables and default configuration.
- Issue #12: Create a minimal app shell for the Streamlit UI.
- Issue #11: Build a page title, layout, and sidebar structure.
- Issue #10: Add placeholders for report period selector, Jira status, narrative inputs, and download actions.
- Issue #8: Define the data model for Jira issues and report snapshots.
- Issue #7: Create issue models with required fields such as key, summary, assignee, status, priority, and dates.
- Issue #6: Define report metadata for generation timestamp, reporting period, and history tracking.
- Issue #3: Add a command to run the Streamlit app locally.
- Issue #2: Add a command to run the unit tests from the project root.

Tasks involving Jira/MCP access, credential decisions, ambiguous product behavior, or cross-cutting architecture should be refined and reviewed by a human before delegation.

## Phase 1: Setup

- [ ] Create the project structure for the Streamlit app and shared package layout. — **application code** (#25)
  - [ ] Create the application root directory and package folders. — **application code** (#24)
  - [ ] Add `app.py`, `requirements.txt`, and the core package modules. — **application code** (#23)
  - [ ] Create `config/` for environment and field-mapping configuration. — **application code** (#22)
  - [ ] Add `tests/` with a basic structure for unit and validation tests. — **application code** (#21)
- [ ] Define the runtime environment and dependency baseline. — **application code** (#20)
  - [ ] Confirm Python version and package compatibility. — **application code** (#19)
  - [ ] Add required dependencies for Streamlit and supporting libraries. — **application code** (#18)
  - [ ] Document local setup steps for Windows development. — **application code** (#17)
- [ ] Establish configuration patterns for Jira and report settings. — **application code** (#16)
  - [ ] Decide how Jira URL, credentials, and project identifiers are loaded. — **application code** (#15)
  - [ ] Create a settings module to read environment variables and default configuration. — **application code** (#14)
  - [ ] Define a default project scope for `EPMCDMETST` and default timezone handling for `America/New_York`. — **application code** (#13)
- [ ] Create a minimal app shell for the Streamlit UI. — **application code** (#12)
  - [ ] Build a page title, layout, and sidebar structure. — **application code** (#11)
  - [ ] Add placeholders for report period selector, Jira status, narrative inputs, and download actions. — **application code** (#10)
  - [ ] Ensure the application launches without secret configuration in the default local environment. — **application code** (#9)
- [ ] Define the data model for Jira issues and report snapshots. — **application code** (#8)
  - [ ] Create issue models with required fields such as key, summary, assignee, status, priority, and dates. — **application code** (#7)
  - [ ] Define report metadata for generation timestamp, reporting period, and history tracking. — **application code** (#6)
  - [ ] Establish what missing values look like and how warnings are represented. — **application code** (#5)
- [ ] Create a local development task flow. — **application code** (#4)
  - [ ] Add a command to run the Streamlit app locally. — **application code** (#3)
  - [ ] Add a command to run the unit tests from the project root. — **application code** (#2)
  - [ ] Decide on a simple validation workflow for each feature before moving on. — **custom skill** (#1)

## Phase 2: Core Features

### 2.1 Reporting Period and Report Selection

- [ ] Implement the default reporting period logic. — **application code**
  - [ ] Calculate the previous completed Monday–Sunday week in `America/New_York`. — **application code**
  - [ ] Allow manual selection of a supported report week. — **application code**
  - [ ] Enforce the initial three-month reporting horizon logic. — **application code**
- [ ] Build the reporting-period UI. — **application code**
  - [ ] Add a date/week selector in the sidebar or configuration panel. — **application code**
  - [ ] Show the selected reporting range and generation window clearly. — **application code**
  - [ ] Display validation warnings when the selected period is out of range. — **application code**

### 2.2 Jira Query and Retrieval Layer

- [ ] Implement a Jira client abstraction. — **MCP** + **application code**
  - [ ] Add request setup with authentication and HTTPS handling. — **MCP**
  - [ ] Handle Jira REST calls for issue retrieval and pagination. — **MCP** + **application code**
  - [ ] Include bounded retry logic for transient failures. — **application code**
  - [ ] Detect and classify auth, authorization, rate-limit, network, and query errors. — **MCP** + **application code**
- [ ] Build Jira query generation. — **MCP** + **application code**
  - [ ] Query issues for project `EPMCDMETST` visible to the configured identity. — **MCP**
  - [ ] Filter issues to the reporting period for completed work and WIP. — **MCP** + **application code**
  - [ ] Support required metadata such as key, summary, type, status, assignee, dates, labels, and links. — **MCP**
- [ ] Implement normalisation of Jira issue payloads. — **custom skill** + **application code**
  - [ ] Convert raw API responses into stable internal issue records. — **application code**
  - [ ] Fill in missing values with safe defaults or explicit null markers. — **custom skill** + **application code**
  - [ ] Capture warnings for unavailable or unmapped fields. — **custom skill** + **application code**

### 2.3 Metrics, WIP, and Trend Calculations

- [ ] Define the completed-work calculation. — **application code**
  - [ ] Identify issues resolved during the reporting period. — **MCP** + **application code**
  - [ ] Include key, summary, assignee, and Jira links in the completed-work list. — **MCP** + **application code**
- [ ] Define the WIP calculation. — **application code**
  - [ ] Identify unresolved issues relevant to the reporting period. — **MCP** + **application code**
  - [ ] Summarise counts by status and assignee. — **application code**
  - [ ] Map status categories in a configurable way. — **application code**
- [ ] Add trend and progress metrics. — **application code**
  - [ ] Compare against the previous reporting period when available. — **application code**
  - [ ] Show counts and change direction for a simple period-over-period summary. — **application code**
- [ ] Implement per-assignee workload summaries. — **application code**
  - [ ] Support the six Jira assignees in scope. — **MCP** + **application code**
  - [ ] Display contribution breakdowns clearly in the report and UI. — **application code**
- [ ] Add data-quality warnings. — **custom skill** + **application code**
  - [ ] Warn when fields are missing or partially unavailable. — **custom skill** + **application code**
  - [ ] Warn when pagination is incomplete or source data is partial. — **application code**
  - [ ] Keep metrics reproducible and clearly labeled. — **application code**

### 2.4 Report Narrative and Manual Inputs

- [ ] Build the narrative editor UI. — **application code**
  - [ ] Add fields for executive summary, weekly progress, highlights, risks, and dependencies. — **application code**
  - [ ] Add a manual RAG status selector with `Red`, `Amber`, and `Green` values. — **application code**
  - [ ] Add a rationale field for the chosen status. — **application code**
- [ ] Make data provenance clear in the UI. — **application code**
  - [ ] Distinguish manually entered content from Jira-derived content. — **application code**
  - [ ] Show explicit labels and sections for narrative vs. metrics. — **application code**
- [ ] Save user-entered values in the current report session. — **application code**
  - [ ] Keep values in memory for preview generation. — **application code**
  - [ ] Prepare for persistence in later report history work. — **application code**

### 2.5 Markdown Report Rendering

- [ ] Implement a report renderer. — **custom skill** + **application code**
  - [ ] Follow the required section order from the specification. — **custom skill** + **application code**
  - [ ] Include title, project, reporting period, and generation timestamp. — **application code**
  - [ ] Render completed work, WIP, highlights, dependencies, and trends. — **custom skill** + **application code**
  - [ ] Use readable Markdown tables and issue links. — **application code**
- [ ] Add empty-state handling. — **application code**
  - [ ] Show `No data available for this period` when sections are empty. — **application code**
  - [ ] Avoid silent omissions in generated reports. — **application code**
- [ ] Add deterministic output rules. — **application code**
  - [ ] Ensure report content is stable and reproducible for the same inputs. — **application code**
  - [ ] Standardise the generated filename format. — **application code**

## Phase 3: Integration

- [ ] Integrate Jira retrieval with the report-generation flow. — **custom skill** + **MCP** + **application code**
  - [ ] Create a clear end-to-end process from configuration to data fetch to metrics to final Markdown. — **custom skill** + **application code**
  - [ ] Ensure report generation fails gracefully with clear diagnostics if the data retrieval is incomplete. — **application code**
- [ ] Connect the Streamlit UI to the report model. — **application code**
  - [ ] Display retrieved issue counts and warnings in a data preview panel. — **MCP** + **application code**
  - [ ] Bind narrative and status controls to the generated report preview. — **application code**
  - [ ] Add a preview pane for rendered Markdown before download. — **application code**
- [ ] Implement download actions. — **application code**
  - [ ] Add a button to export the current report as a Markdown file. — **application code**
  - [ ] Use a deterministic file naming pattern such as `jira-status-EPMCDMETST-YYYY-MM-DD.md`. — **application code**
- [ ] Add historical report persistence. — **application code**
  - [ ] Store report metadata, narrative, metrics snapshot, and rendered Markdown. — **application code**
  - [ ] Include report identifier, period, generation timestamp, and application version. — **application code**
  - [ ] Allow retrieval of previous reports for review and regeneration. — **application code**
- [ ] Support regeneration and comparison. — **custom skill** + **application code**
  - [ ] Rebuild a report for a selected period and store it as regenerated rather than immutable. — **custom skill** + **application code**
  - [ ] Mark changed data sources or refreshed outputs clearly. — **application code**
- [ ] Implement configuration-driven field mapping. — **custom skill** + **MCP** + **application code**
  - [ ] Allow logical fields like application, migration wave, environment, target cloud, readiness, and cutover date to map to Jira fields or metadata. — **MCP** + **application code**
  - [ ] Log warnings when optional mappings are missing. — **custom skill** + **application code**
- [ ] Wire in migration details. — **MCP** + **application code**
  - [ ] Render cloud migration overview data in the Markdown report where available. — **MCP** + **application code**
  - [ ] Keep missing migration fields visible as unavailable rather than breaking the report. — **application code**

## Phase 4: Testing

- [ ] Create unit tests for core calculations and normalisation. — **application code**
  - [ ] Test completed work and WIP aggregation logic. — **application code**
  - [ ] Test status and assignee breakdown logic. — **application code**
  - [ ] Test report-period date logic and timezone edge conditions. — **application code**
- [ ] Create unit tests for the report renderer. — **application code**
  - [ ] Assert required section headings exist in order. — **application code**
  - [ ] Verify empty sections show the expected fallback message. — **application code**
  - [ ] Verify Jira keys are rendered as links. — **application code**
- [ ] Create unit tests for Jira query and response handling. — **MCP** + **application code**
  - [ ] Validate pagination logic. — **MCP** + **application code**
  - [ ] Validate retry and failure classification. — **application code**
  - [ ] Ensure partial-data scenarios produce warnings instead of silent success. — **application code**
- [ ] Add integration-level smoke tests. — **application code**
  - [ ] Run the Streamlit app locally in headless mode. — **application code**
  - [ ] Confirm UI panels render without critical runtime errors. — **application code**
  - [ ] Verify report generation works with sample issue data. — **application code**
- [ ] Add validation for edge cases. — **application code**
  - [ ] Test no-matching-data scenarios. — **application code**
  - [ ] Test missing fields and optional data. — **application code**
  - [ ] Test divide-by-zero or invalid metric situations where applicable. — **application code**
- [ ] Add regression coverage before each release milestone. — **application code**
  - [ ] Ensure the existing calculator examples remain intact while the new reporting app is developed. — **application code**
  - [ ] Validate that all critical user workflows still work after refactoring. — **application code**

## Phase 5: Documentation

- [ ] Update project documentation for setup and usage. — **application code**
  - [ ] Document Python installation and dependency setup. — **application code**
  - [ ] Add instructions for starting the Streamlit app locally on Windows. — **application code**
  - [ ] Describe each required environment variable or config file. — **application code**
- [ ] Document architecture and responsibilities. — **custom skill** + **application code**
  - [ ] Explain the role of the Jira client, query layer, normalizer, metrics service, renderer, and repository. — **application code**
  - [ ] Clarify the configuration model for field mappings and status mappings. — **custom skill** + **application code**
- [ ] Document report behavior and data notes. — **custom skill** + **application code**
  - [ ] Clarify what counts as completed work, WIP, and trend metrics. — **custom skill** + **application code**
  - [ ] Explain how missing data and partial retrieval warnings are surfaced. — **custom skill** + **application code**
- [ ] Document release and maintenance steps. — **custom skill** + **application code**
  - [ ] Describe how to regenerate a report for a historical period. — **custom skill** + **application code**
  - [ ] Document how to download and review previous reports. — **application code**
  - [ ] Add a short troubleshooting section for Jira auth, rate limits, and partial data scenarios. — **MCP** + **application code**
- [ ] Keep examples current. — **application code**
  - [ ] Update README content if the UI or generated report sections change. — **application code**
  - [ ] Ensure sample usage and commands match the actual project structure. — **application code**
- [ ] Final project review checklist. — **application code**
  - [ ] Verify all acceptance criteria in the project spec are mapped to an implementation task. — **application code**
  - [ ] Confirm no required feature is left untracked. — **application code**
  - [ ] Review release readiness before moving to delivery or handoff. — **application code**

## Suggested Delivery Order

1. Setup
2. Core Features
3. Integration
4. Testing
5. Documentation

## Definition of Done

- [ ] The app runs locally from the project directory. — **application code**
- [ ] The report generation flow works end-to-end with Jira data and sample data. — **custom skill** + **MCP** + **application code**
- [ ] Markdown output includes all required sections and empty-state handling. — **application code**
- [ ] Users can review period selection, enter narrative content, and download a final report. — **application code**
- [ ] Tests cover the core logic and fail-safe scenarios. — **application code**
- [ ] Documentation matches the implementation and the project can be onboarded by a new developer. — **custom skill** + **application code**

## GitHub Issues
| Issue URL | Title | Created via MCP? |
|-----------|-------|-----------------|
| https://github.com/LavBharath8075/jira-confluence-automation/issues/1 | Decide on a simple validation workflow for each feature before moving on. | No |

## MCP Tools Used
- mcp_github_mcp_se_create_repository
- mcp_github_mcp_se_search_repositories
- mcp_github_mcp_se_get_file_contents
