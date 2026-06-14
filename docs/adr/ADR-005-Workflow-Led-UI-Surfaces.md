# ADR-005: Use Workflow-Led UI Surfaces

## Status

Accepted

## Date

2026-06-11

## Context

The platform UI accumulated multiple jobs inside the same screens. The clearest failure was the former profile operations surface, which mixed connection inventory, connection testing, profiling, schedule creation, queue health, run history, publishing, access, notifications, and integration controls. This made it hard for an operator to answer simple questions such as "where do I create and test connections?" or "where do I check schedule progress?"

The same pattern appeared across the broader app. Navigation labels described implementation areas more than user jobs, raw diagnostic details appeared beside business workflows, and pages could show technical controls before explaining the outcome in plain English. The result was data overload without enough context.

## Decision

Primary UI surfaces must be workflow-led. A page must own one primary user job, one default state, and one workflow state machine. Setup, execution, operations, review, and troubleshooting must be separated unless the user intentionally drills into a related detail surface.

The platform adopts these primary workflow owners:

| Workflow | Owner Surface | Primary Job |
| --- | --- | --- |
| Find data and ask questions | Home / Search | Search first, with business-friendly result cards and type disambiguation. |
| Understand lineage and impact | Lineage Explorer | Answer table, column, report, and metric lineage questions in plain English before graph/evidence detail. |
| Manage business terms and metrics | Glossary & Metrics | Maintain business definitions and metric variants with in-review suggestions. |
| Review governance issues | Review Work / Governance Ops | Break failed profiles, failed lineage, suspicious lineage, metric review, and approvals into steward work queues. |
| Manage reusable source access | Connections | Create draft connections, test login/discovery, and control who can use each connection. |
| Profile source data | Profiling | Create, run, and monitor profile schedules and profile queues. |
| Acquire lineage evidence | Lineage Acquisition | Refresh domain evidence across the configured lineage sources needed to build holistic lineage. |
| Configure the platform | Platform Admin | Manage roles, settings, diagnostics, and advanced operations. |

## Consequences

- Pages stop acting as dumping grounds for adjacent features.
- Normal users see business-friendly answers first and technical drilldowns second.
- Admin/operator-only controls move out of normal user flows.
- Future UI work must choose the owning workflow before adding a panel, card, table, action, or API call.
- Existing monolithic surfaces must be decomposed over time into workflow-owned pages and shared components.

## Implementation Rules

- One page may have only one primary job and one primary call to action above the fold.
- A page may use one stepper or one tab row, but not nested workflow tabs.
- A default page view may show at most three major panels before the user drills in.
- Tables, raw logs, JSON, SQL snippets, package XML, parser output, and queue internals are advanced drilldowns unless the page's primary job is troubleshooting.
- Shared actions such as `Test`, `Run Now`, `Save Draft`, `Activate`, `Publish`, and `Retry` must use shared components or shared view-model functions when they appear in more than one workflow.
- A connection page must not show schedule configuration, queue progress, run history, publishing controls, or profiling operations on the main surface.
- A profiling page must not create or edit source connection credentials.
- A lineage acquisition page must not be the end-user lineage answer surface.
- A lineage answer must be readable before it is inspectable: plain-English summary first, graph/evidence detail second.
- Search results must disambiguate same-name objects with source, database, schema, object type, and match reason before asking the user to click.
- Governance Ops may link into operational pages, but it must not duplicate their controls.
- If a page cannot be described as "Use this page to ___" in one sentence, it is not ready for implementation.

## Current Workflow Decisions

- Database connections point to exactly one database.
- Database profile schedules cover exactly one database.
- Schedule scope starts at schema selection; table drilldown can be added later.
- A schedule can be saved as draft when prerequisites are missing, but it cannot be active or run until blockers are resolved.
- Profile queue status during partial table failure is `Running With Errors`; profile success with publish failure is `Publish Warning` with retry options.
- Lineage for `SONIC_DW` uses the configured investigation domain: `Sonic_DW`, `VendorData`, `StagingDB`, `ETL_Staging`, and `SSIS_UAT`.
- Uncertain lineage is published with a visible label such as `Strongly Suggested` and a plain-English tooltip.
- System confidence is not ownership or compliance. It measures how confidently the platform understands the asset through metadata, profile, lineage, parse evidence, and metric logic.

## Related Documents

- `docs/UI_WORKFLOW_SPEC.md`
- `docs/UX_WORKFLOW_REDESIGN_2026.md`
- `CONTRIBUTOR.md`
- `CONTRIBUTING.md`
- `docs/PROJECT_BACKLOG.md`
