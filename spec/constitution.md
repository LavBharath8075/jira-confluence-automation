# Project Constitution

**Project:** Jira/Confluence Automation
**Status:** Ratified
**Version:** 1.0.0
**Last Updated:** 2026-09-21

This constitution defines the non-negotiable engineering principles for the Jira/Confluence automation project. Every specification, implementation plan, pull request, and release must comply with these principles or document an explicit, approved exception.

## I. Specification-First Development

All meaningful changes MUST begin with a written specification describing user intent, scope, acceptance criteria, dependencies, and known edge cases. Specifications MUST be clarified before implementation begins and MUST remain traceable to implementation tasks and tests.

Implementation MUST NOT silently expand scope. Ambiguous behavior, missing Jira or Confluence mappings, and unresolved permission or data-retention decisions MUST be recorded as open questions rather than guessed in code.

## II. Contract-Driven Full-Stack Boundaries

The React frontend and Express backend MUST communicate through documented, versioned HTTP API contracts. Shared request, response, and error schemas SHOULD be defined in a reusable TypeScript package or equivalent contract source.

The frontend MUST NOT call Jira or Confluence directly. External integrations, authentication, retries, pagination, normalization, and secret handling MUST remain behind backend service boundaries.

Breaking API changes MUST include an explicit migration plan and updated consumer tests.

## III. Approved Technology Baseline

The project MUST use the following baseline unless a constitution amendment is approved:

- React 18 with Vite for the frontend.
- Node.js with Express for the backend.
- TypeScript for application code.
- PostgreSQL 15 for persistent data.
- Docker and Docker Compose for local database and supporting-service orchestration.

Dependencies MUST be justified by a concrete requirement, kept up to date within compatibility constraints, and audited for known vulnerabilities. PostgreSQL schema changes MUST be versioned and reproducible through migrations.

## IV. Secure Integration and Secret Management

Jira and Confluence credentials, API tokens, OAuth secrets, database passwords, and encryption keys MUST be supplied through environment configuration or a managed secret store. Secrets MUST NOT be committed, logged, exposed in client bundles, returned in API responses, or included in generated Jira/Confluence content.

Integrations MUST use least-privilege credentials, HTTPS, bounded timeouts, and explicit authorization checks. User-provided or externally retrieved content MUST be validated and safely escaped before rendering or publishing.

## V. Reliable and Idempotent Automation

Automation operations MUST be safe to retry where practical. Creating or updating Jira issues, Confluence pages, comments, or labels MUST use stable identifiers, idempotency controls, or reconciliation logic to prevent duplicates.

External calls MUST define timeout, retry, rate-limit, and partial-failure behavior. The system MUST distinguish successful, partial, skipped, and failed operations and MUST never report an operation as complete when required downstream work did not complete.

## VI. Data Integrity and Auditability

PostgreSQL is the source of truth for application-owned automation state, mappings, job records, and audit metadata. Transactions MUST protect multi-step state changes where consistency is required.

Each automation run MUST record the initiating actor or process, target resources, requested operation, outcome, timestamps, correlation identifier, and safe diagnostic details. Audit records MUST exclude credentials and unnecessary sensitive content.

Jira and Confluence remain authoritative for their respective external resources; local records MUST retain external identifiers and links for traceability.

## VII. Testable Quality Gates

Every feature MUST include tests appropriate to its risk and behavior:

- Unit tests for domain logic, validation, transformations, and retry decisions.
- Integration tests for PostgreSQL repositories and Jira/Confluence adapters using mocks or controlled test fixtures.
- API contract tests for backend endpoints and error responses.
- End-to-end tests for critical user workflows in the React application.

A change MUST pass formatting, linting, type checking, automated tests, and security checks before merge. Acceptance criteria from the specification MUST be demonstrably covered by tests or documented manual verification.

## VIII. Observable and Operable Services

The backend MUST provide structured logs, health/readiness checks, correlation identifiers, and actionable error responses. Logs MUST support diagnosis without exposing secrets or sensitive payloads.

Long-running or retryable automation jobs MUST expose status and failure details suitable for user review. Operational limits, rate-limit responses, and dependency outages MUST be visible to operators and users in an appropriate form.

## IX. Usable and Accessible Frontend

The React application MUST provide clear loading, success, empty, partial, and error states for automation workflows. Destructive or externally visible actions MUST require clear user intent and communicate their scope before execution.

The UI MUST use semantic HTML, keyboard-accessible controls, descriptive labels, readable status text, and sufficient contrast. Color MUST NOT be the sole way to communicate state.

## X. Documentation and Maintainability

Public APIs, environment variables, database migrations, integration mappings, local Docker setup, and operational procedures MUST be documented. Code MUST favor small, cohesive modules with clear ownership and minimal hidden coupling.

Pull requests MUST explain the requirement addressed, design impact, testing performed, and any security or migration considerations. Temporary workarounds MUST include an owner or follow-up issue.

## Governance

This constitution supersedes conflicting informal project practices. Amendments MUST include the proposed change, rationale, impact assessment, and updates to affected specifications, plans, tests, and documentation. The constitution version MUST be incremented according to the scope of the amendment.

SpecKit artifacts MUST reference the principles that materially affect their design. Reviewers MAY reject work that violates a principle unless an explicit exception has been approved and documented.
