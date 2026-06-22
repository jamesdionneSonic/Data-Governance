# ADF Marketing AWS Export Metadata

## Scope

Factory: `adf-dw-marketing-prod`

Saved connector: `azure-data-factory-adf-dw-marketing-prod`

As of: 2026-06-18

## Operational Root

The operational root for the current scheduled process is
`pl_Marketing_AWS_Export`.

Do not manually start the child pipelines with blank parameters. The child
pipelines require operational IDs that are created by the parent orchestrator.

## Triggers

| Trigger             | Target pipeline           | State   | Schedule                         |
| ------------------- | ------------------------- | ------- | -------------------------------- |
| `trigger_dailyload` | `pl_Marketing_AWS_Export` | Started | Monday-Saturday, 8:30 AM Eastern |
| `trigger_sunday`    | `pl_Marketing_AWS_Export` | Started | Sunday, 2:30 PM Eastern          |

Both triggers pass an empty parameter object. The parent pipeline creates the
operational IDs internally.

## Operational ID Pattern

`pl_Marketing_AWS_Export` starts with lookup activity
`Get Master Process Parameters`, which calls:

`[dbo].[usp_ADFInsertMasterProcessExecutionLog]`

The lookup returns:

- `OpBatchID`
- `OpProcessExecutionID`
- `OpProcessExecutionStatusID`

The parent stores these in pipeline variables, then passes them to child
pipelines with `ExecutePipeline` activities.

The parent later calls:

- `[dbo].[usp_UpdateMasterProcessExecutionLog]`
- `[dbo].[usp_CloseOutProcessExecutionLog]`
- `[dbo].[usp_UpdateProcessExecutionLogStatus]` for child failure paths

## Current Parent Pipeline

Pipeline: `pl_Marketing_AWS_Export`

Last published: 2026-01-22T17:35:29Z

Variables:

- `OpBatchID`
- `OpProcessExecutionID`
- `OpProcessExecutionStatusID`

Child pipelines:

| Activity                         | Child pipeline                 | Dependency                                  |
| -------------------------------- | ------------------------------ | ------------------------------------------- |
| `Execute ELead Org Mappings`     | `pl_eLead_Org_Mappings`        | After operational IDs are set               |
| `Execute DMS Org Mappings`       | `pl_DMS_Org_Mappings`          | After operational IDs are set               |
| `Execute eLead activity`         | `pl_mdp_eLead_activity`        | After `Execute ELead Org Mappings` succeeds |
| `Execute elead individual`       | `pl_mdp_elead_individual`      | After `Execute ELead Org Mappings` succeeds |
| `Execute elead vehicle interest` | `pl_mdp_elead_vehicleinterest` | After `Execute ELead Org Mappings` succeeds |
| `Execute DMS Individual`         | `pl_mdp_dms_individual`        | After `Execute DMS Org Mappings` succeeds   |
| `Execute DMS purchase info`      | `pl_mdp_dms_purchaseinfo`      | After `Execute DMS Org Mappings` succeeds   |

## History Parent Pipeline

Pipeline: `pl_Marketing_AWS_Export_history`

Last published: 2026-02-02T18:11:19Z

This pipeline follows the same operational ID pattern, but some DMS history
branches are inactive and marked as succeeded:

- `Execute DMS Org Mappings History`
- `Execute DMS Individual history`
- `Execute DMS purchase info history`

Active history child pipelines:

| Activity                                 | Child pipeline                         |
| ---------------------------------------- | -------------------------------------- |
| `Execute ELead Org Mappings History`     | `pl_eLead_Org_Mappings_history`        |
| `Execute eLead activity history`         | `pl_mdp_eLead_activity_history`        |
| `Execute elead individual history`       | `pl_mdp_elead_individual_history`      |
| `Execute elead vehicle interest history` | `pl_mdp_elead_vehicleinterest_history` |

## Recent Runtime Evidence

Recent scheduled runs of `pl_Marketing_AWS_Export` from 2026-06-11 through
2026-06-18 all succeeded.

Latest observed scheduled run:

- parent run id: `2a99fad7-fed9-4975-8276-78c83ee7ae3e`
- trigger: `trigger_dailyload`
- started: 2026-06-18T12:30:01Z
- ended: 2026-06-18T12:40:30Z
- status: `Succeeded`

The latest observed child runs received:

- `OpBatchID`: `53288`
- `OpProcessExecutionID`: `214019`
- `OpProcessExecutionStatusID`: `3`

These values are runtime evidence from one successful scheduled run. Do not
reuse them for a new manual run.

## Correct Manual Operation

To run the current process manually, start `pl_Marketing_AWS_Export`, not the
child pipelines.

Start `pl_Marketing_AWS_Export_history` only when the user explicitly requests
the history process.

After starting a parent pipeline:

1. Capture parent `runId`.
2. Poll parent status.
3. Query child runs in the parent run window.
4. Report child statuses and any failures.
5. Stop on failure or cancellation.
