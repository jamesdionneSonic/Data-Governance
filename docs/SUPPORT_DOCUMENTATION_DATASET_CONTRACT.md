# Support Documentation Dataset Contract

## Purpose

This contract defines the shared support dataset and page shape for generated
ADF, SSIS, and SSRS documentation. SSIS is the pattern to mimic: support readers
should see what the asset does, why it matters, where data comes from and goes,
and what to check first before they reach raw technical detail.

Use this contract when generating local markdown cache, DevOps documentation
artifacts, or Confluence support pages.

## Required Page Shape

Every platform page must use this order:

1. Plain-English Summary
2. At a Glance
3. Business Use
4. Support Checks
5. Lineage And Dependencies
6. Runtime Or Usage Signals
7. Technical Details
8. Evidence And Caveats

Folder, factory, project, and report-folder pages may add an inventory section
after `At a Glance`, but they must still begin with plain-English support
meaning.

## Shared Dataset Fields

Each generated support record should carry these fields where evidence supports
them:

| Field                     | Meaning                                                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `platform`                | `ADF`, `SSIS`, or `SSRS`                                                                                            |
| `asset_id`                | Stable generated id for the asset                                                                                   |
| `asset_name`              | Human display name                                                                                                  |
| `asset_type`              | Factory, trigger, pipeline, activity, SSIS folder, SSIS package, SSRS folder, SSRS report, dataset, etc.            |
| `native_path`             | Native platform path, such as ADF resource id, SSIS folder/project/package, or SSRS report path                     |
| `support_role`            | Orchestrator, child load, data movement, utility/logging, report, report folder, lookup/reference, review candidate |
| `plain_english_summary`   | Concrete explanation of what this asset does                                                                        |
| `business_use`            | Business question or process supported                                                                              |
| `support_impact`          | What is stale, delayed, wrong, or unavailable when this asset fails                                                 |
| `first_support_check`     | The first concrete thing support should check                                                                       |
| `source_systems`          | Named source systems, databases, APIs, files, datasets, or reports                                                  |
| `target_systems`          | Named target systems, databases, tables, files, datasets, reports, or consumers                                     |
| `upstream_dependencies`   | Parent pipelines/packages, source datasets, procedures, tables, or reports                                          |
| `downstream_dependencies` | Child pipelines/packages, target objects, reports, consumers, or subscriptions                                      |
| `parameters`              | User/runtime/configuration parameters safe to publish                                                               |
| `schedule_or_trigger`     | Trigger, SQL Agent job, subscription, schedule, or not surfaced in metadata                                         |
| `runtime_or_usage_signal` | Last run, last used, executions, users, subscriptions, or bounded runtime baseline                                  |
| `status_signal`           | Active, stale, review candidate, failed recent run, no recent usage, or unknown                                     |
| `evidence_paths`          | Local markdown/runtime/catalog paths used to build the page                                                         |
| `confidence`              | High, medium, low, plus caveat                                                                                      |
| `not_surfaced_facts`      | Important facts missing from metadata                                                                               |

Do not publish raw activity output, unrestricted row data, secrets, password
fields, access tokens, or connection strings with credentials.

## Shared At A Glance Table

Use the same labels across platforms when possible:

| Field                 | Value |
| --------------------- | ----- |
| Platform              |       |
| Asset type            |       |
| Native path           |       |
| Support role          |       |
| Business process      |       |
| Primary source        |       |
| Primary target/output |       |
| Schedule or trigger   |       |
| Runtime/usage signal  |       |
| Status signal         |       |
| Evidence              |       |

## Plain-English Summary Rules

The summary must be specific to the asset. Avoid generic phrases such as:

- `This page documents metadata for...`
- `This report supports the reporting area...`
- `This package moves data...`

Preferred pattern:

```text
<Asset> <does the concrete work> from <source area> into <target/output area>.
It matters because <business/support process> depends on it; if it fails,
<impact>. Start troubleshooting by checking <first concrete check>.
```

If evidence is weak, say so directly:

```text
The metadata shows this asset exists and is scheduled, but source/target detail
was not surfaced in metadata. Start by checking the latest execution and the
owning source artifact before changing it.
```

## ADF Mapping

ADF support records must mimic SSIS support records.

| ADF evidence              | Support meaning                                                   |
| ------------------------- | ----------------------------------------------------------------- |
| Factory                   | Support section root and environment scope                        |
| Trigger                   | Schedule, operational entry point, and linked root pipeline       |
| Pipeline                  | Orchestrator, child load, utility/logging, or standalone workflow |
| ExecutePipeline activity  | Parent/child dependency                                           |
| Copy activity             | Data movement step with source and sink datasets                  |
| Lookup activity           | Parameter/control-table/process-log lookup                        |
| Stored procedure activity | Process logging, closeout, error capture, or business procedure   |
| Dataset                   | Source or target endpoint clue                                    |
| Linked service            | System boundary; publish name/type only, not secret details       |
| Pipeline run/activity run | Runtime support signal, bounded and redacted                      |

ADF pages must include:

- whether the pipeline is a root orchestrator or child pipeline;
- trigger schedule when surfaced;
- child pipelines and activity groups;
- source and target datasets where surfaced;
- process-management stored procedures where surfaced;
- first support checks based on parent run, failed child pipeline, source
  dataset, target dataset, and process log ids.

For `adf-dw-marketing-prod`, treat `pl_Marketing_AWS_Export` as the current
root orchestrator unless a later approved packet changes the queue.

## SSIS Mapping

SSIS pages keep the existing support model:

- native folder/project/package hierarchy;
- package role, including master/orchestration and child package;
- source and target object families;
- classified read/write summaries;
- package calls separated from procedure/audit/utility calls;
- representative column mappings;
- file/config evidence;
- bounded runtime baseline only where approved by ADR-006.

SSIS pages should continue to follow
`docs/adr/ADR-006-SSIS-Native-Hierarchy-And-Classified-Lineage.md`.

## SSRS Mapping

SSRS pages must use the same support pattern as ADF and SSIS.

| SSRS evidence          | Support meaning                                      |
| ---------------------- | ---------------------------------------------------- |
| Catalog folder         | Report family or business area                       |
| Report                 | User-facing report asset                             |
| ExecutionLog3          | Usage, last used, users, stale/review signal         |
| Subscription           | Operational dependency or scheduled delivery         |
| Parameters             | User controls and support reproduction inputs        |
| Dataset command        | Business logic entry point                           |
| Shared datasource      | Backend system boundary; publish safe name/path/type |
| SQL object definitions | Backend dependency and troubleshooting clue          |

SSRS pages must explain:

- the business question the report appears to answer;
- likely user or support audience when surfaced by folder, usage, or report
  naming evidence;
- key parameters and how support can reproduce the issue;
- backend stored procedures, views, tables, and functions;
- usage signal: executions in lookback, last used, distinct users, and
  subscriptions where available;
- whether the report is active, stale, or a review candidate.

Do not prefix Confluence page titles with generated labels. Use the clean report
or folder name.

## Folder And Section Pages

Folder-level pages should summarize inventory and impact:

- number of child assets;
- most common source systems;
- most common target systems or outputs;
- active/stale/review counts;
- root/orchestrator assets;
- high-impact reports, packages, or pipelines;
- common support checks for the folder.

ADF factory and folder pages should look like SSIS folder pages: inventory and
support impact first, object lists second.

## Quality Gate

Before a broad publish, spot-check:

- one ADF root pipeline page;
- one ADF child pipeline page;
- one SSIS master package page;
- one SSIS child package page with mappings;
- one active SSRS report page;
- one stale or review-candidate SSRS report page;
- one folder/section page for each platform.

Each page passes only if a support analyst can answer these questions without
opening the technical appendix:

1. What is this asset?
2. Why does it matter?
3. What feeds it or what does it feed?
4. What breaks if it fails or is stale?
5. What should support check first?
6. How strong is the evidence?
