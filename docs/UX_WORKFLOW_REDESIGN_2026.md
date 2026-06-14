# UX Workflow Redesign 2026

## Design Intent

The application is an operational data governance workspace. It should feel consistent, dense, readable, and workflow-led. Pages should not look like separate prototypes.

## Information Architecture

Navigation is grouped by the job the user is doing:

| Group | Pages | User Job |
| --- | --- | --- |
| Find & Understand | Home / Find Data, Search / Catalog, Lineage Explorer | Locate assets, disambiguate same-name objects, and answer lineage/impact questions. |
| Govern & Improve | Glossary & Metrics, Review Work / Governance Ops | Maintain business language, metric variants, and steward review queues. |
| Operate | Profiling, Connections, Lineage Acquisition, Platform Admin | Configure reusable source access, profile source data, refresh lineage evidence, and administer the platform. |

## Page Pattern

Every primary page should use the same top-level pattern:

1. App header with product location and user context.
2. Page intro with workflow label, title, short purpose, and quick actions.
3. Telemetry strip for ingestion, pipeline progress, and search index.
4. Workflow content grouped into cards or panels.

## Workflow Separation

Connections owns reusable connection inventory, draft creation, login/discovery testing, and access eligibility. It does not own schedules, profile run history, queue progress, publishing, or lineage extraction operations.

Profiling is a separate analyst/admin page. It owns recurring profile jobs, profile queues, manual run-now, worker state, run history, publish warnings, and schedule health. It must not edit source connection credentials.

Lineage Acquisition is a separate admin/operator page. It owns evidence refresh for configured investigation domains, such as the `SONIC_DW` domain that includes `Sonic_DW`, `VendorData`, `StagingDB`, `ETL_Staging`, and `SSIS_UAT`. It must not be the end-user lineage answer surface.

Lineage Explorer owns table, column, metric, and report impact answers. It starts with plain-English explanation, then exposes graph and evidence drilldowns.

Review Work / Governance Ops owns bite-sized steward queues such as failed profiles, failed lineage, and suspicious lineage. It may deep-link to operational pages but must not duplicate their controls.

Data Products is not a primary workflow until the product definition is explicit. Report metadata belongs in search, lineage, and metrics first.

## Visual Rules

- Cards use 8px or smaller radius.
- Page sections use the shared page intro and telemetry pattern.
- Search surfaces are compact utility panels, not dark hero sections.
- Chips, buttons, fields, and tables use shared contrast rules for readability.
- Avoid nested page cards unless the card represents a repeated item, modal, or framed tool.
- Default page states should show context, status, and next action before raw data.
- Do not show raw logs, package XML, SQL snippets, parser output, or queue internals unless the user opens a detail/advanced view.
- A page may use one stepper or one tab row, but not nested workflow tabs.

## Next UX Debt

- Convert remaining one-off inline styles in large workflow pages into named classes.
- Break the large single-file Vue template into workflow-owned pages and reusable components.
- Add visual regression coverage for Home / Find Data, Search / Catalog, Lineage Explorer, Review Work, Profiling, Connections, and Lineage Acquisition.
- Remove `Profile Operations`, `Ingestion Studio`, `Trust & Compliance`, and `Command Center` as primary navigation labels after their useful capabilities are moved to the workflow owners above.
