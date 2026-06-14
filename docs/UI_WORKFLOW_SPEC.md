# UI Workflow Specification

## Purpose

This specification translates the workflow interview into implementation rules. It is the source of truth for where UI capabilities belong. When a future change is unclear, choose the workflow owner first, then design the page.

## Product Principle

The app is search-first and workflow-led. Users should not have to understand the platform internals before they can find data, understand lineage, create connections, run profiles, or review issues.

## Roles

| Role | Default Needs |
| --- | --- |
| User | Search for assets, understand lineage, view business-friendly details, view glossary and metric context. |
| Analyst | User capabilities plus technical details, profile schedules/runs, columns, SQL/report logic drilldowns. |
| Data Steward | Review work queues, suggested metrics, suspicious lineage, failed profile/lineage issues, and approvals. |
| Admin | Manage connections, permissions, lineage acquisition, platform settings, and advanced troubleshooting. |

Normal users must not see raw extraction controls, package XML, parser logs, source credentials, or advanced operator actions.

## Navigation Model

| Navigation Label | Audience | Job |
| --- | --- | --- |
| Home / Find Data | All | Search for data first, show ranked results in place, and open a selected asset detail. |
| Asset Detail | Internal/deep link | Review a selected asset, then open lineage/impact or technical evidence. Not a primary navigation item. |
| Search | Internal/advanced | Advanced catalog search, filtering, and database browsing. Not a primary navigation item. |
| Glossary & Metrics | User, Steward, Analyst | Manage business terms, metric definitions, metric variants, and in-review suggestions. |
| Review Work | Steward, Admin | Work failed profile, failed lineage, suspicious lineage, metric review, and approval queues. |
| Profiling | Analyst, Admin | Configure, run, and monitor profile schedules and queues. |
| Connections | Admin | Create, test, discover, and manage reusable source connections and usage access. |
| Lineage Acquisition | Admin | Refresh lineage evidence for a domain and inspect extraction health. |
| Platform Admin | Admin | Manage roles, settings, diagnostics, and advanced platform operations. |

Deprecated or renamed labels:

- `Command Center` should become a simple search-first home page or be retired.
- `Profile Operations` should be removed as a primary surface.
- `Ingestion Studio` should become `Lineage Acquisition` if it owns lineage evidence refresh.
- `Trust & Compliance` should be decomposed into confidence reasons, warnings, and steward work queues.
- `Data Products` should not be promoted as a primary workflow until the product definition is explicit.

## Page Contracts

### Home / Find Data

Primary job: search for data and choose the right asset.

Default content:

- large search entry point
- ranked results on the same page, sorted by match and confidence
- result rows with object name, source location, type, match reason, and confidence
- no default cards, operational panels, or secondary workflow widgets below the search area

Selecting a result opens Asset Detail. Home search must not route users through the advanced Search / Catalog page.

### Asset Detail

Primary job: explain the selected asset before the user opens lineage or technical drilldowns.

Asset Detail must lead with "what is this and can I trust the system's understanding of it?" before showing columns and technical metadata.

Required content:

- asset name and source location
- object type
- match/confidence explanation
- business summary
- owner or unassigned owner state
- selected-asset lineage entry point
- columns and technical metadata below the summary when available

### Search / Catalog

Primary job: advanced catalog search, filters, and database browsing for users who need a heavier inspection console.

Search results must show:

- object name
- object type
- source location such as server, database, schema, report workspace, or storage location
- match reason
- system confidence score or warning

Search / Catalog is not the default user path from Home. Home owns normal query-and-results behavior; Asset Detail owns the selected asset page. Search / Catalog may remain available as an internal advanced route.

### Selected-Asset Lineage

Primary job: answer "what does this do?" and "what is impacted if this changes?"

Default answer order:

1. plain-English summary
2. upstream and downstream impact summary
3. business logic / transformation summary where available
4. confidence labels and footnoted evidence
5. graph, SQL, SSIS, report, and parser details as drilldowns

End users can see labels such as `Strongly Suggested`, but the label must include a tooltip that explains what it means. This capability is reached from Asset Detail or deep links, not from a separate primary navigation item.

### Connections

Primary job: manage reusable app connections.

Main list fields:

- type
- intelligent name
- status
- login check
- discovery check

Allowed statuses:

- `Draft`
- `Untested`
- `Testing`
- `Passed`
- `Failed`
- `Disabled`
- `Access Restricted`

Connection test must prove both login/connectivity and discovery/read access. Drafts can be saved at any point and must reopen at the step where the user left off.

Naming standard:

- Database connection: `<server> - <database>` when the type already says database.
- Database connection without a separate type label: `<database type> - <server> - <database>`.
- SSIS connection: `<server> - SSIS`.
- Report server connection: `<server or workspace> - Reports`.
- Storage connection: `<provider> - <account/bucket/container>`.

Connection details may show summary, test results, discovery results, access, advanced config, and related schedules. Related schedules must be drilldown only, such as `Used by 4 schedules`.

Connections must not show schedule configuration, queue progress, profile run history, publishing controls, or profiling operations on the main surface.

### Profiling

Primary job: create, run, and monitor profile schedules and queues.

Main page starts with a sorted schedule list:

1. active and running
2. active with failure
3. active and completed successfully
4. deactivated
5. drafts

Main list fields:

- schedule name
- connection/source
- scope
- status
- last run date/time
- last result
- details link for failure or active queue state

Database schedules must cover exactly one database. Setup flow:

1. choose database connection
2. verify login/discovery prerequisites
3. discover schemas
4. choose all schemas or selected schemas
5. choose cadence
6. save draft, activate, or run now

Schedules with blockers stay draft with blocker messages. They cannot activate or run until prerequisites are resolved. For SSIS, normal scheduling collects all jobs/packages for the SSIS connection.

Running queue detail should show current table, completed count, failed count, remaining count, last successful table, last error, estimated finish, and publish status.

Profiles should publish as they are produced. A publish failure is a `Publish Warning` with retry options, not a hidden failure.

### Lineage Acquisition

Primary job: acquire lineage evidence for an investigation domain.

The user starts from a source-centered domain such as `SONIC_DW`, but the engine must use all configured domain sources needed to build holistic lineage. The current `SONIC_DW` domain includes `Sonic_DW`, `VendorData`, `StagingDB`, `ETL_Staging`, and `SSIS_UAT`.

Default action is refresh all evidence for the domain. Operators may override scope when they know only one database or SSIS server changed. Monthly refresh is the default cadence, with manual refresh for investigations.

Raw extraction functions are advanced troubleshooting only.

### Glossary & Metrics

Primary job: manage business definitions and metric logic.

Glossary terms are business-friendly, business-defined terms. Admins and data stewards can edit them.

Metrics can vary by department or report. The UI must group metric variants under one business metric concept and show when technical evidence proves different logic is being used.

Engine-suggested metric definitions are published with an in-review status rather than blocked. Metric pages show plain-English business logic first, then source tables/columns, then SQL/report/proc details as drilldown.

Suggested statuses:

- `Draft`
- `Suggested`
- `In Review`
- `Certified`
- `Deprecated`

### Review Work / Governance Ops

Primary job: give stewards bite-sized work queues.

Initial queues:

- failed profiles
- failed lineage
- suspicious lineage

Later queues may include approvals, metrics in review, sensitive-data review, duplicate/similar tables, and low-confidence groups.

Governance Ops may link into Profiling, Search / Catalog selected-asset lineage, or Lineage Acquisition to fix work, but it must not duplicate those pages' controls.

### Confidence

System confidence answers: "How confident is the platform's understanding of this asset?"

The score is lowered by stale/missing profile, failed profile, missing lineage, uncertain lineage, weak evidence, missing columns, parse failures, and conflicting metric logic.

The score is not lowered by missing owner or missing business description. Low confidence warns users and explains why in plain English; it does not block usage.

## Implementation Acceptance Checklist

Every UI change must answer:

- What workflow owns this change?
- What role is this for?
- What is the one-sentence job of this page?
- What is the primary CTA?
- What is the default success state?
- What is the default error/blocker state?
- What related workflows are linked but not duplicated?
- What technical detail is hidden until drilldown?
- What shared component or shared view-model action is reused?
