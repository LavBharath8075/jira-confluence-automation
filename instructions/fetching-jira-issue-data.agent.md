# Fetch Jira Issue Data

Fetch and format issue data from the Jira API for reporting and summarisation.

## Input format

Use one of these supported input forms:

- Structured object with fields:
  - jira_url
  - project_key
  - auth
  - start_date
  - end_date
  - max_results
  - optional filters
- Environment-based configuration:
  - JIRA_URL
  - JIRA_PROJECT
  - JIRA_USER
  - JIRA_TOKEN
  - REPORTING_START
  - REPORTING_END

Required values:
- Jira base URL
- Project key
- Authentication details
- Reporting window or equivalent filter

## Processing steps

- Validate required inputs before any request is sent.
- Build the Jira search query using the configured project and reporting window.
- Include pagination handling so all matching results are retrieved within the allowed limit.
- Send authenticated requests to the Jira Search API using HTTPS and consistent retry behavior.
- Extract the required fields for each issue:
  - key
  - summary
  - status
  - assignee
  - priority
  - created
  - resolved
  - labels
  - url
- Normalise raw Jira payloads into a consistent internal record.
- Replace missing values with nulls, empty strings, or explicit placeholders.
- Record warnings for missing values, partial retrieval, or unmapped fields.
- Sort records consistently by date, key, or the configured report order.
- Convert the final issue list into a ready-to-render structure for downstream reporting.

## Output format

Return a structured result with two sections:

- Metadata:
  - project_key
  - fetched_at
  - query_window
  - total_issues
  - warnings
- Issues:
  - key
  - summary
  - status
  - assignee
  - priority
  - created
  - resolved
  - labels
  - url
  - warnings

Use machine-readable JSON or a Python dictionary-like structure. Keep the output deterministic and suitable for Markdown rendering or report generation.

## Constraints

- Never log, print, or return credentials or tokens.
- Do not silently ignore failed pages, rate-limit responses, or incomplete data sets.
- Treat missing optional fields as warnings, not fatal errors, unless the field is required for the output format.
- Keep the response stable for the same inputs so reporting stays reproducible.
- Handle API failures, auth issues, and network errors with explicit error messages and safe fallback behavior.
- Keep the output concise, structured, and ready for downstream processing.
