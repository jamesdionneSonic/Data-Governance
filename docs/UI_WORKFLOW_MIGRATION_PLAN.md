# UI Workflow Migration Plan

## Purpose

This plan turns ADR-005 and the UI workflow specification into an ordered implementation path. Use it when the user says "start work on the backlog" or asks Codex to make the app conform to the new workflow model.

## Required Reading Order

1. `docs/PROJECT_BACKLOG.md`, section `UI Workflow Architecture Remediation`
2. `docs/adr/ADR-005-Workflow-Led-UI-Surfaces.md`
3. `docs/UI_WORKFLOW_SPEC.md`
4. `docs/CODEX_UI_WORK_PACKET_TEMPLATE.md`
5. This migration plan

## Model Routing Rule

Medium-thinking Codex may work on documentation, small isolated UI fixes, tests, and single-component additions when the work packet is complete.

Codex must stop and request stronger intelligence before implementation when a task crosses workflow boundaries, restructures `docker/frontend/app.js`, changes role visibility, moves controls between pages, or changes connector/profiling/lineage/security contracts.

Recommended upgraded setting for high-risk migration tasks: strongest available Codex model, slow speed, high thinking.

## Migration Principles

- Build new workflow-owned surfaces before removing old mixed surfaces.
- Keep backend behavior stable unless the backlog item explicitly requires a contract change.
- Prefer shared components and shared view-model actions over copied button handlers.
- Preserve access to existing functionality during the transition.
- Hide advanced/raw operations from normal users, but keep admin troubleshooting paths available.
- Update the backlog after each completed `UIWF-*` item.

## Ordered Workstreams

### Workstream 1: Guardrails And Test Harness

Backlog items: `UIWF-023`, `UIWF-024`, `UIWF-025`

Goal: make future UI changes safer before moving large screens.

Deliverables:

- shared status, blocker, failure summary, and action components
- smoke tests for role-aware navigation and primary workflow pages
- static guardrail script for forbidden labels, nested workflow tabs, and duplicated action logic

Upgrade requirement: medium is acceptable for isolated tests or small shared components. Upgrade before creating a broad component architecture or modifying many pages.

### Workstream 2: Navigation Skeleton

Backlog items: `UIWF-011`, `UIWF-022`

Goal: introduce the target navigation without deleting old capabilities.

Deliverables:

- search-first Home / Find Data route
- role-aware navigation labels for User, Analyst, Data Steward, and Admin
- advanced pages hidden from normal users
- deprecated labels mapped to replacement workflow owners

Upgrade requirement: stop and upgrade before changing role visibility across multiple roles or removing old navigation entries.

### Workstream 3: Connections

Backlog items: `UIWF-012`, `UIWF-013`

Goal: make Connections a clean admin inventory for reusable source access.

Deliverables:

- connection list with type, intelligent name, status, login check, discovery check
- connection detail with summary, test results, discovery results, access, advanced config, and drilldown related schedules
- no schedule configuration, queue status, run history, publishing, or profile controls on the main surface
- draft resume behavior preserved

Upgrade requirement: stop and upgrade before moving existing profile/schedule controls or changing connector runtime contracts.

### Workstream 4: Profiling

Backlog items: `UIWF-014`, `UIWF-013`

Goal: make Profiling the only surface for profile schedules, queues, run-now, and publish warnings.

Deliverables:

- simple queue-health hero with one primary `New Schedule` action, compact status summaries, and a live queue list sorted by action need: running active, active failed, active successful, deactivated, drafts
- schedule builder with one-database scope, schema selection, blockers, activate, save draft, and run now
- queue detail view with current table, completed, failed, remaining, last success, last error, estimated finish, and publish status
- publish warning and retry path

Upgrade requirement: stop and upgrade before changing schedule execution, queue persistence, or publish semantics.

### Workstream 5: Lineage Acquisition

Backlog items: `UIWF-015`

Goal: reframe Ingestion Studio as admin/operator lineage evidence refresh.

Deliverables:

- `Lineage Acquisition` label and route
- `SONIC_DW` domain refresh using `Sonic_DW`, `VendorData`, `StagingDB`, `ETL_Staging`, and `SSIS_UAT`
- default refresh-all domain action
- scope override for targeted refresh
- raw extraction details hidden under advanced troubleshooting

Upgrade requirement: stop and upgrade before changing lineage extraction contracts, confidence scoring, inferred edge publishing, or cross-source domain resolution.

### Workstream 6: Lineage Explorer

Backlog items: `UIWF-016`

Goal: make manual trace business-friendly and evidence-backed.

Deliverables:

- table/column/report/metric trace entry
- plain-English answer first
- upstream/downstream impact summary
- business logic summary where available
- `Strongly Suggested` labels with tooltips
- graph and evidence drilldowns

Upgrade requirement: stop and upgrade before changing lineage confidence, column-level semantics, or graph resolution.

### Workstream 7: Search / Catalog

Backlog items: `UIWF-017`

Goal: make search disambiguation-first and business-friendly.

Deliverables:

- Google-like search entry
- result type pills
- source location for same-name objects
- match reason
- system confidence score and plain-English reason
- asset detail that shows business summary and confidence before columns/technical metadata

Upgrade requirement: medium is acceptable for focused result-card changes. Upgrade before changing search ranking or index contracts.

### Workstream 8: Review Work / Governance Ops

Backlog items: `UIWF-018`, `UIWF-019`

Goal: turn Governance Ops into steward work queues.

Deliverables:

- failed profiles queue
- failed lineage queue
- suspicious lineage queue
- grouped/bite-sized work items
- deep links to Profiling, Lineage Explorer, or Lineage Acquisition
- no duplicated operational controls

Upgrade requirement: stop and upgrade before introducing workflow state machines, approval routing, or global rule application.

### Workstream 9: Glossary & Metrics

Backlog items: `UIWF-020`

Goal: separate business definitions from metric logic and metric variants.

Deliverables:

- business-friendly glossary term management
- metric concepts with variants by department/report
- in-review engine-suggested metric definitions
- plain-English business logic first
- source columns/tables and SQL/report/proc details as drilldown

Upgrade requirement: stop and upgrade before changing metric detection, grouping, approval, or certification semantics.

### Workstream 10: Park Data Products

Backlog items: `UIWF-021`

Goal: avoid promoting an undefined workflow.

Deliverables:

- remove Data Products from primary navigation or mark as future-state
- move report metadata needs into Search, Lineage Explorer, and Metrics
- document what definition is still missing before Data Products can return

Upgrade requirement: medium is acceptable if this is navigation/documentation only. Upgrade before deleting existing product code.

## Starting Prompt For Future Codex Chats

Use this prompt when asking Codex to start the UI workflow backlog:

```text
Start work on the UI Workflow Architecture Remediation backlog in docs/PROJECT_BACKLOG.md. First read ADR-005, docs/UI_WORKFLOW_SPEC.md, docs/CODEX_UI_WORK_PACKET_TEMPLATE.md, and docs/UI_WORKFLOW_MIGRATION_PLAN.md. Pick the first unblocked UIWF item in the ordered migration plan. Before editing files, create a short work packet in your response. If the task hits any upgrade-and-stop trigger, stop and tell me the exact stronger setting needed instead of editing code.
```

## Completion Rule

After each migration task, update `docs/PROJECT_BACKLOG.md` with the completed status, validation evidence, changed files, and any follow-up backlog items.
