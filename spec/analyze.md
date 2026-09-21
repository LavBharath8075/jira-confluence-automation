# Implementation Task Analysis

**Reviewed artifacts:** `spec/constitution.md`, `spec/specification.md`, `spec/clarify.md`, `spec/plan.md`, and `spec/tasks.md`  
**Review date:** 2026-09-21  
**Task count reviewed:** 59  
**Overall status:** Not implementation-ready until Phase 0 decisions are resolved.

## 1. Executive summary

The task breakdown is comprehensive and correctly treats clarification as a prerequisite. The highest complexity and risk are concentrated in:

- Phase 0 decisions, because unresolved policy choices affect nearly every later artifact.
- API/authentication/job design, because they define the security and integration boundary.
- Jira semantics and normalization, because incorrect query or mapping rules produce plausible but untrustworthy reports.
- Report versioning and PostgreSQL history, because immutability, regeneration, comparison, and retention are coupled.
- Confluence publication, because retries and uncertain responses can create duplicate or overwritten external content.
- Release hardening, because several non-functional targets are currently placeholders rather than measurable thresholds.

The task file is stronger than the source plan in operational detail, but several artifacts are still missing: formal decision records, an acceptance-test matrix, OpenAPI/schema files, a data dictionary, a state-transition diagram, a database design, a threat model, a deployment topology, and a traceability mechanism linking task IDs to specification requirements and test cases.

## 2. Complexity scale

- **Low:** bounded documentation, configuration, or test work with few unknowns.
- **Medium:** contained implementation with known interfaces and moderate integration risk.
- **High:** cross-cutting architecture, external side effects, security-sensitive behavior, data-model coupling, or unresolved requirements.

## 3. Per-task assessment

### Phase 0 — Clarification and scope lock

| Task | Complexity | Dependencies | Primary risks |
|---|---|---|---|
| T0.1 Product boundary | High | None | Streamlit-versus-React scope conflict; calculator compatibility and Confluence v1 status affect all downstream work. |
| T0.2 Authentication/authorization | High | T0.1 | Identity provider, roles, service-account delegation, browser session security, and audit identity remain undecided. |
| T0.3 Horizon/retention | Medium | T0.1 | Calendar versus rolling semantics can change query validation, database retention, and history behavior. |
| T0.4 Jira queries/metrics | High | T0.3 | “Relevant WIP,” issue types, status rules, date fields, and trend formulas are currently ambiguous; wrong decisions create misleading metrics. |
| T0.5 Field/status/assignee config | High | T0.4 | Missing account IDs and mapping precedence block normalization; fallback conflicts can produce silent data corruption. |
| T0.6 Completeness/action policy | High | T0.4 | Partial reports, downloads, and publication need a consistent state machine; otherwise users may mistake incomplete data for complete data. |
| T0.7 Report versioning | High | T0.3, T0.6 | Report, generation, and version identity may conflict with immutable originals and editable narrative. |
| T0.8 Confluence behavior | High | T0.1, T0.2, T0.6, T0.7 | Page identity, format, version conflicts, and uncertain network responses can cause duplicates or overwrite content. |
| T0.9 API/job model | High | T0.2, T0.6–T0.8 | Synchronous versus asynchronous processing changes API, UI, persistence, retries, and operations. |
| T0.10 Quality/operations targets | Medium | T0.1–T0.9 | Without numeric targets, later performance, accessibility, recovery, and observability tasks cannot pass objectively. |
| T0.11 Baseline/acceptance matrix | High | T0.1–T0.10 | Approval may be superficial unless every decision, requirement, test, and artifact is linked and contradictions are removed. |

**Phase assessment:** Phase 0 is a hard gate. It is not merely analysis work; it is architecture and product decision work. It needs named decision owners and a decision-record artifact, neither of which is currently defined in the repository.

### Phase 1 — Repository and development foundation

| Task | Complexity | Dependencies | Primary risks |
|---|---|---|---|
| T1.1 Workspace/package boundaries | Medium | T0.11 | Existing empty scaffold may not yet have workspace metadata; package boundaries could diverge from the plan. |
| T1.2 Runtime/dependency policy | Low | T1.1 | Node/package-manager versions may be chosen from local environment rather than project support requirements; lockfile policy is not explicit. |
| T1.3 PostgreSQL 15 Docker service | Medium | T1.1 | Port collisions, volume lifecycle, insecure default credentials, and readiness versus mere process-start confusion. |
| T1.4 Configuration validation | Medium | T0.2, T0.3, T0.5, T1.1 | Environment variables, database config, integration config, and feature flags may be confused; secret redaction must be tested. |
| T1.5 Quality gates/CI | Medium | T1.1, T1.2 | CI provider and runner are unspecified; dependency audits can be noisy or fail on transitive issues without an agreed threshold. |
| T1.6 Local-development docs | Low | T1.3–T1.5 | Documentation can drift from actual scripts, ports, migration commands, and Docker behavior. |

**Phase assessment:** The plan calls this a no-business-behavior foundation, but T1.4 configuration validation and health endpoints already encode architecture. Those assumptions should be documented in the decision record.

### Phase 2 — Contracts, identity, and integration boundaries

| Task | Complexity | Dependencies | Primary risks |
|---|---|---|---|
| T2.1 Versioned API contract | High | T0.9, T1.1 | Endpoint list is still conceptual; missing schemas, status codes, auth rules, and async behavior could force frontend rework. |
| T2.2 Shared domain/validation schemas | High | T0.5–T0.9, T2.1 | Shared types can become a dumping ground or diverge from runtime validation and database models. |
| T2.3 Auth/authorization boundary | High | T0.2, T2.1 | Security implementation depends on an unselected identity model; local bypasses are especially risky. |
| T2.4 Integration adapter interfaces | Medium | T0.8, T0.9, T2.2 | Over-general interfaces may hide Jira/Confluence-specific semantics; safe error typing must preserve retryability and unknown outcomes. |
| T2.5 Jobs/idempotency conventions | High | T0.6, T0.7, T0.9, T2.1 | Idempotency for read/generate operations differs from external publication; concurrent requests and expired keys are unspecified. |
| T2.6 API contract tests | Medium | T2.1–T2.5 | Tests may validate shapes without proving authorization, side-effect, pagination, and error semantics. |

**Phase assessment:** Phase 2 is the main architectural choke point. T2.1, T2.3, and T2.5 must be designed together; treating them as independent tasks risks incompatible contracts.

### Phase 3 — Jira ingestion and normalization

| Task | Complexity | Dependencies | Primary risks |
|---|---|---|---|
| T3.1 Reporting-period calculator | Medium | T0.3, T0.4, T2.2 | DST and UTC conversion errors can shift issues between weeks; future/current period behavior is still policy-dependent. |
| T3.2 Jira transport | High | T2.4, T2.5 | Pagination, rate limits, retry storms, token handling, and unknown network outcomes can compromise completeness or duplicate work. |
| T3.3 Jira query service | High | T0.4, T3.1, T3.2 | Exact JQL, requested fields, issue hierarchy, and assignee filters are not yet present as an artifact. |
| T3.4 Response validation/normalization | High | T0.5, T2.2, T3.2, T3.3 | Jira schemas and custom fields vary; permissive normalization can convert malformed data into credible false values. |
| T3.5 Mapping engine | High | T0.5, T3.4 | Fallback precedence, multi-value fields, status aliases, and mapping versioning are complex and currently only described in prose. |
| T3.6 Assignee scope | Medium | T0.5, T3.4 | Display-name changes, inactive users, unassigned work, and out-of-scope issues can distort team totals. |
| T3.7 Jira fixtures/failure tests | Medium | T3.2–T3.6 | Fixtures may not represent real Jira payloads, pagination quirks, rate-limit headers, or malformed custom-field values. |

**Phase assessment:** Jira ingestion needs a concrete query specification and representative sanitized payload fixtures before implementation. The plan should add a data dictionary and JQL artifact.

### Phase 4 — Metrics and deterministic report generation

| Task | Complexity | Dependencies | Primary risks |
|---|---|---|---|
| T4.1 Delivery metrics | High | T0.4, T3.4–T3.6 | Metrics may be mathematically correct but semantically wrong if query/status definitions are unsettled; partial inputs need explicit propagation. |
| T4.2 Trend calculations | Medium | T0.4, T4.1 | Missing history, zero denominators, regenerated data, and changing mappings can make trends incomparable. |
| T4.3 Narrative/RAG validation | Medium | T0.6, T2.2 | Markdown allowance, length limits, required rationale, and sanitization are not specified; client and server may diverge. |
| T4.4 Report model | High | T4.1–T4.3 | Aggregate combines source data, manual input, completeness, versioning, and configuration snapshots; invalid combinations are easy to permit. |
| T4.5 Deterministic Markdown renderer | High | T0.7, T4.4 | Safe rendering, Jira links, tables, dynamic timestamps, stable sorting, and Confluence conversion requirements overlap. |
| T4.6 Golden/security tests | Medium | T4.1–T4.5 | Golden files can lock in unresolved behavior; hostile-content tests need a defined threat model and sanitizer policy. |

**Phase assessment:** T4.4 and T4.5 are central domain tasks, not simple presentation work. They should not begin until report lifecycle and content-security decisions are approved.

### Phase 5 — Persistence, history, and auditability

| Task | Complexity | Dependencies | Primary risks |
|---|---|---|---|
| T5.1 PostgreSQL schema design | High | T0.3, T0.5–T0.8, T4.4 | Versioning, snapshots, audit data, retention, and publication records are tightly coupled; schema changes after implementation will be expensive. |
| T5.2 Migrations/repositories | High | T1.3, T5.1 | Migration rollback, transaction boundaries, connection pooling, error mapping, and concurrent writes are underspecified. |
| T5.3 Report/configuration persistence | High | T0.7, T4.4, T5.2 | Mutable narrative versus immutable original, source snapshots, idempotency, and sensitive-content storage need explicit policy. |
| T5.4 History/comparison/regeneration | High | T3.3, T4.5, T5.3 | Regeneration may use changed Jira data, mappings, or credentials; comparison semantics and concurrency can be difficult to explain to users. |
| T5.5 Audit/publication records | Medium | T0.2, T0.8, T2.5, T5.2 | Audit records may leak report content or secrets; publication records need to distinguish failed, partial, and unknown outcomes. |
| T5.6 PostgreSQL/recovery tests | High | T5.2–T5.5 | Backup/restore and retention are operational capabilities, not ordinary repository tests; target RPO/RTO is not yet defined. |

**Phase assessment:** T5.1 must precede detailed implementation, but the current task file does not require a reviewed ERD/data dictionary artifact. Add one before migrations.

### Phase 6 — React reporting workflow

| Task | Complexity | Dependencies | Primary risks |
|---|---|---|---|
| T6.1 Authenticated application shell | High | T0.2, T2.1–T2.3 | Browser token storage, refresh, route protection, and API error handling depend on the identity decision and threat model. |
| T6.2 Configuration/status UI | Medium | T2.1, T3.5, T6.1 | UI may expose sensitive connection details or imply that warnings are resolved when they are only informational. |
| T6.3 Period selector/data preview | Medium | T3.1, T4.1, T6.1 | Preview can trigger repeated expensive jobs; partial versus empty states need exact UI and API behavior. |
| T6.4 Narrative/RAG controls | Medium | T4.3, T6.1 | Client validation, autosave/submit semantics, accessibility, and version creation behavior remain unclear. |
| T6.5 Markdown preview/download | High | T4.5, T5.3, T6.3, T6.4 | Rendering untrusted content in the browser, filename/version selection, and partial-data download policy are security and UX risks. |
| T6.6 History/regeneration UI | High | T5.4, T6.1 | Long-running jobs, permissions, comparison complexity, stale data, and accidental regeneration can produce confusing or costly actions. |
| T6.7 Accessibility/workflow gates | Medium | T6.2–T6.6 | No WCAG level/browser matrix is currently fixed; automated checks alone will miss focus and screen-reader defects. |

**Phase assessment:** The UI tasks depend on API contracts and completeness/version semantics more than the current dependency lists show. T6.5 and T6.6 should explicitly depend on T2.5 and T0.7.

### Phase 7 — Confluence publication

| Task | Complexity | Dependencies | Primary risks |
|---|---|---|---|
| T7.1 Confluence client | High | T0.8, T2.4 | API representation, permissions, rate limits, and unknown response handling are unresolved; credentials and tenant access are external prerequisites. |
| T7.2 Page identity/content conversion | High | T0.8, T4.5, T7.1 | Markdown-to-Confluence conversion may lose formatting or enable injection; create/update and ownership policy is not settled. |
| T7.3 Idempotent publication workflow | High | T0.6–T0.9, T5.5, T7.2 | External side effects, version conflicts, retries, and duplicate prevention make this the highest operational-risk feature. |
| T7.4 Publication UI/tests | Medium | T7.3, T6.5, T6.7 | UI can report false success if reconciliation is incomplete; sandbox/tenant test strategy is missing. |

**Phase assessment:** These tasks are correctly conditional, but the plan and tasks should make the entire phase optional if Confluence is deferred—not merely mark individual tasks “deferred.”

### Phase 8 — Hardening and release readiness

| Task | Complexity | Dependencies | Primary risks |
|---|---|---|---|
| T8.1 Integrated acceptance suite | High | T1.5, T2.6, T3.7, T4.6, T5.6, T6.7, T7.4 if applicable | There is no completed acceptance matrix artifact yet; broad pass status may hide untested manual criteria. |
| T8.2 Security/privacy validation | High | T2.3, T3.2, T4.6, T5.5, T6.1, T7.3 if applicable | Threat model, scan thresholds, data classification, and deployment topology are missing. |
| T8.3 Performance/resilience validation | High | T3.2, T4.1, T5.4, T7.3 if applicable | No issue-volume, concurrency, latency, or rate-limit targets exist; results cannot be judged objectively. |
| T8.4 Accessibility/browser validation | Medium | T6.7 | WCAG target and browser matrix are unresolved; manual assistive-technology evidence is not defined. |
| T8.5 Deployment/operations/recovery | High | T1.3, T1.6, T5.6, T8.2, T8.3 | Target deployment, secrets management, backup tooling, rollback, monitoring, and incident ownership are unspecified. |
| T8.6 Release review/sign-off | Medium | T8.1–T8.5 | Sign-off roles and exception-acceptance authority are not explicitly named; release can be blocked by unresolved scope drift. |

**Phase assessment:** Phase 8 is a release program, not one task. It needs separate evidence artifacts and named owners for security, performance, accessibility, operations, and product acceptance.

## 4. Dependency analysis

### 4.1 Critical path

The likely critical path is:

`T0.1 → T0.2/T0.3/T0.4 → T0.5/T0.6/T0.7 → T0.8/T0.9 → T0.11 → T1.1 → T2.1/T2.2/T2.3/T2.5 → T3.1–T3.5 → T4.1/T4.4/T4.5 → T5.1–T5.4 → T6.1/T6.3/T6.5/T6.6 → T8.1–T8.6`

Confluence publication is a parallel conditional path after its decisions and report model are stable:

`T0.8/T0.9 → T2.4/T2.5 → T5.5 → T7.1–T7.4 → T8.*`

### 4.2 Missing or weak dependency edges

1. **T6.5 should depend explicitly on T2.5**, because download behavior may use job and idempotency state.
2. **T6.6 should depend explicitly on T2.5**, because regeneration UI needs job status and duplicate-request behavior.
3. **T5.1 should depend on T2.1/T2.2**, because persistence must represent API and shared-domain identifiers.
4. **T5.4 should depend on T2.5**, because regeneration concurrency and idempotency are cross-cutting.
5. **T8.1 should depend on T2.3**, not only indirectly through T6.7, so authorization acceptance is explicit.
6. **T8.5 should depend on T2.3 and T2.5**, because deployment operations must include auth/session and idempotency behavior.
7. **T4.2 should depend on T5.3/T5.4** if trends use historical persisted snapshots; the current dependency list assumes trend input exists before history is implemented.
8. **T7.2 should depend on T5.3** if publication includes persisted report version metadata or publication eligibility.
9. **T0.10 should explicitly precede T1.5**, because CI thresholds and test environments depend on quality targets.
10. **T0.11 should produce the artifact consumed by T8.1**; this relationship is conceptual but not represented as a file or identifier.

## 5. Cross-artifact gaps and missing artifacts

### A-01 — No decision-record artifact

The plan requires approved decision records, but no path or format is defined. Add `spec/decisions/` with one record per blocking decision or a single versioned `spec/decisions.md`.

### A-02 — No acceptance-test matrix exists

T0.11, T8.1, and the plan’s traceability section refer to an acceptance matrix, but no file is present. Add `spec/acceptance-matrix.md` with requirement ID, scenario, test type, test location, owner, and status.

### A-03 — No OpenAPI or contract artifact exists

T2.1 is implementation-critical, but the repository has no API contract path. Add a documented location such as `spec/api/openapi.yaml` and link it from the plan/tasks.

### A-04 — No data dictionary or Jira query artifact exists

T0.4 and T3.3 require exact query semantics, requested fields, mappings, and normalized types, but these are only prose. Add `spec/integration/jira-data-dictionary.md` and `spec/integration/jira-queries.md`.

### A-05 — No state-transition artifact exists

Completeness, job, report-version, and publication states are central to the system, but no state diagrams or transition tables exist. Add `spec/state-models.md` or separate diagrams.

### A-06 — No database design artifact exists

T5.1 expects a reviewed schema, but there is no ERD, table specification, migration convention, or data-retention design. Add `spec/data-model.md` before writing migrations.

### A-07 — No threat model or data classification artifact exists

T8.2 covers SSRF, injection, secrets, authorization, and sensitive Jira/Confluence content, but no threat model or data classification is planned. Add `spec/security/threat-model.md` and `spec/security/data-classification.md`.

### A-08 — No deployment topology artifact exists

T0.10 and T8.5 require deployment/network decisions, but target hosting, ingress, TLS termination, egress, secrets manager, and Jira/Confluence connectivity are not captured in an artifact. Add `spec/deployment.md`.

### A-09 — No observability/runbook artifact exists

The constitution requires structured logs, health/readiness, and operational support, but the plan only mentions runbooks late in Phase 8. Add an observability contract and runbook outline earlier.

### A-10 — No external test-environment artifact exists

The tasks mention fixtures, sandbox tenants, and controlled integration tests, but do not identify whether Jira/Confluence sandbox access exists, how test credentials are injected, or what data may be recorded. Add `spec/testing/integration-strategy.md`.

### A-11 — No ownership or estimation metadata exists

Every task has priority and dependencies, but no owner, estimated size, milestone date, or parallelization marker. Add owner/size/status fields if this is intended to drive a real backlog.

### A-12 — No change-control rule for spec updates

The constitution says amendments require rationale and impact assessment, but the plan does not state which changes require constitution/spec/plan/tasks updates or who approves them.

## 6. Contradictions and inconsistencies

### X-01 — “Updated spec” still contains unresolved open questions

The tasks and plan correctly gate implementation on `spec/clarify.md`, but `spec/specification.md` remains marked Draft and still contains all 12 unresolved decisions. The plan should not describe later phases as implementation-ready until the specification status changes to Approved or Baseline.

### X-02 — Confluence is both v1 goal and conditional/deferred work

The specification goal includes Confluence publication, while FR-9 says “when enabled and configured,” and tasks make Phase 7 conditionally deferred. A single release-scope flag is needed across specification, plan, tasks, and acceptance criteria.

### X-03 — Streamlit remains in inherited requirements

The source specification’s Streamlit architecture and startup compatibility remain referenced by acceptance criterion 15, while the constitution and current specification target React/Express. T0.1 is correctly assigned, but no current artifact states how the inherited criterion is retired or transformed.

### X-04 — `T4.2` trend timing conflicts with history dependencies

The plan places trend calculations in Phase 4 before persistence/history in Phase 5, but the specification defines trends using prior available reporting history. Either provide a history-read interface before Phase 4 or move historical trend integration after Phase 5.

### X-05 — T1.1 says no business implementation, but T1.4 and health behavior encode runtime decisions

This is not a severe contradiction, but the foundation phase needs a clear boundary between scaffolding and behavior. Configuration validation and health/readiness are part of the platform contract and should be acknowledged as such.

### X-06 — “Application source of truth” is not reconciled with source snapshots

The constitution makes PostgreSQL authoritative for application-owned state while Jira/Confluence remain authoritative externally. The specification requires normalized metric snapshots but does not say whether raw Jira responses are retained. This affects reproducibility, privacy, storage, and regeneration.

### X-07 — T7.4 publication audit visibility is broader than the UI requirements

T7.4 requires publication audit evidence visible to authorized operators, but FR-11 only lists publication status/execution and the UI requirements do not specify an audit view. Add an endpoint and UI requirement or remove the visibility criterion.

### X-08 — T8.1 dependency on T7.4 is conditional but milestone M8 is not

If Confluence is deferred, the release task must explicitly omit T7.4 and adjust acceptance criterion 12. Otherwise M8 cannot be reached despite a valid non-Confluence release.

## 7. Missing task-level acceptance detail

The following areas need stronger, measurable criteria before execution:

- Numeric retry count, backoff ceiling, timeout values, and rate-limit behavior.
- Exact API paths and response examples.
- Exact database constraints, migration and rollback behavior.
- Test fixture provenance and sanitization.
- Authentication security controls and browser storage policy.
- Completeness-state transition table and allowed actions.
- Report-version and publication-version relationships.
- Performance, accessibility, backup, and recovery thresholds.
- Log/trace redaction rules and retention periods.
- Confluence conflict and unknown-outcome reconciliation.

## 8. Recommended corrective actions

1. Complete T0.1–T0.10 with named decision owners before implementation.
2. Create the missing artifacts listed in Section 5, beginning with decisions, acceptance matrix, API contract, and data model.
3. Resolve the Confluence release-scope flag consistently across all four documents.
4. Resolve the Streamlit-to-React migration criterion and update the inherited acceptance requirement.
5. Add missing dependency edges for jobs, history, authorization, and contract schemas.
6. Decide whether trend calculation is domain-only in Phase 4 or history-integrated after Phase 5.
7. Add owners, estimates, status, and test locations if `spec/tasks.md` will drive execution.
8. Convert qualitative acceptance language into measurable thresholds before Phase 8.
9. Update document status from Draft only after the clarification gate passes.
10. Re-run this analysis after Phase 0 and update task complexity/risk ratings when decisions reduce uncertainty.

## 9. Readiness conclusion

The task breakdown is suitable as a planning backlog, but not yet as an execution-ready implementation backlog. Phase 0 should be treated as a formal product/architecture decision milestone. Once the blocking decisions and missing artifacts are completed, the remaining tasks can be scheduled with substantially lower rework risk.
