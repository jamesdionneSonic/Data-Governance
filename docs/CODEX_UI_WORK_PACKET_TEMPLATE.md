# Codex UI Work Packet Template

Use this template for every UI workflow remediation task. A Codex chat should not start implementation until the packet is filled in or the missing fields are explicitly marked not applicable.

## Required Pre-Flight

1. Read `docs/adr/ADR-005-Workflow-Led-UI-Surfaces.md`.
2. Read `docs/UI_WORKFLOW_SPEC.md`.
3. Read the matching `UIWF-*` backlog item in `docs/PROJECT_BACKLOG.md`.
4. Confirm the task is small enough for the current model setting.
5. If the task matches an upgrade trigger below, stop and ask the user to raise intelligence before editing files.

## Upgrade And Stop Triggers

Codex must stop and ask the user to upgrade before implementation when the task includes any of these:

- splitting or materially restructuring `docker/frontend/app.js`
- changing role-based navigation or access visibility across multiple roles
- introducing or changing the shared UI component architecture
- moving controls between workflow owners, such as Connections to Profiling or Ingestion Studio to Lineage Acquisition
- changing connector, profiling, lineage, or security contracts while changing UI
- designing the Entra ID / group-based security model
- changing lineage confidence scoring, inferred edge publishing, or column-level lineage semantics
- changing schedule execution semantics, queue persistence, publish behavior, or runtime permissions
- implementing more than one `UIWF-*` backlog item in the same pass
- editing more than five production files
- removing an existing primary navigation item
- deleting UI code rather than hiding or replacing it behind a validated migration path

Recommended upgraded setting for those tasks: strongest available Codex model, slow speed, high thinking.

## Work Packet

### Backlog Item

- `UIWF ID`:
- priority:
- current status:

### Workflow Owner

Choose one:

- Home / Find Data
- Search / Catalog
- Lineage Explorer
- Glossary & Metrics
- Review Work / Governance Ops
- Profiling
- Connections
- Lineage Acquisition
- Platform Admin

### Target Role

Choose one or more:

- User
- Analyst
- Data Steward
- Admin

### Page Job Statement

Use this page to:

### Scope

In scope:

- 

Out of scope:

- 

### Allowed Files

- 

### Forbidden Changes

- Do not add a new primary navigation label unless `docs/UI_WORKFLOW_SPEC.md` is updated first.
- Do not add nested workflow tabs.
- Do not duplicate connector test, profile run, publish retry, or schedule action logic.
- Do not expose raw logs, JSON, SQL, package XML, parser output, or queue internals in the default view.
- Do not mix setup, execution, operations, review, and troubleshooting in one default page.

### Acceptance Criteria

- The page has one primary job and one primary CTA.
- The default view has no more than three major panels.
- Related workflows are linked, not duplicated.
- Technical details appear only in drilldown or advanced views.
- Shared actions/components are reused where they already exist.
- Empty, loading, success, blocked, and failure states are handled.
- The UI copy explains plain-English status and next action.

### Required Validation

- Unit tests:
- API/contract tests:
- E2E/browser smoke:
- Screenshot/manual verification:
- `git diff --check`:

### Completion Note

When finished, update `docs/PROJECT_BACKLOG.md` with:

- status change
- files changed
- validation evidence
- follow-up items or risks
