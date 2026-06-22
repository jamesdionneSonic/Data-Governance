# pl_mdp_elead_vehicleinterest_history

Generated: 2026-06-19T08:45:26.994Z
ADF factory: `adf-dw-marketing-prod`
Source profile artifact: `data/markdown/_runtime/profile-runs/azure-data-factory-adf-dw-marketing-prod/2026-06-18T19-30-26-484Z-c5fd7f11-4eb8-4b3f-82e8-047dd0dead46.json`

## Plain-English Summary

pl_mdp_elead_vehicleinterest_history is an ADF child pipeline in history/elead. Use this pipeline to refresh marketing activity, vehicle interest, or purchase detail used by downstream export and analytics processes. If it fails, downstream marketing export or mapping data may be stale or incomplete. Start troubleshooting by checking whether the parent orchestrator passed operational IDs into pl_mdp_elead_vehicleinterest_history; do not start this child with blank parameters.

## At a Glance

| Field                 | Value                                                                                                                                                                                                      |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | ADF                                                                                                                                                                                                        |
| Asset type            | Pipeline                                                                                                                                                                                                   |
| Native path           | `/subscriptions/bee9b611-da99-4cfc-9fb7-50f1359e5ca2/resourceGroups/rg-data-warehouse-prod/providers/Microsoft.DataFactory/factories/adf-dw-marketing-prod/pipelines/pl_mdp_elead_vehicleinterest_history` |
| Support role          | child pipeline                                                                                                                                                                                             |
| Business process      | Use this pipeline to refresh marketing activity, vehicle interest, or purchase detail used by downstream export and analytics processes.                                                                   |
| Primary source        | not surfaced in metadata                                                                                                                                                                                   |
| Primary target/output | not surfaced in metadata                                                                                                                                                                                   |
| Schedule or trigger   | not directly triggered                                                                                                                                                                                     |
| Runtime/usage signal  | Metadata profiled at 2026-06-18T19:30:11.914Z                                                                                                                                                              |
| Status signal         | history/backfill candidate                                                                                                                                                                                 |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-dw-marketing-prod/2026-06-18T19-30-26-484Z-c5fd7f11-4eb8-4b3f-82e8-047dd0dead46.json`                                                          |

## Business Use

Use this pipeline to refresh marketing activity, vehicle interest, or purchase detail used by downstream export and analytics processes.

## Support Checks

1. Check whether the parent orchestrator passed operational IDs into pl_mdp_elead_vehicleinterest_history; do not start this child with blank parameters.
2. Confirm the pipeline parameters are supplied by the parent, trigger, or documented default path.
3. Confirm source datasets are available: `not surfaced in metadata`.
4. Confirm target datasets or child pipelines completed: `not surfaced in metadata`.
5. If process-log procedures are involved, validate the process execution log before rerunning child steps.

## Lineage And Dependencies

| Dependency type   | Values                                                                                                                              |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Parent pipelines  | pl_Marketing_AWS_Export_history                                                                                                     |
| Child pipelines   | none surfaced                                                                                                                       |
| Source datasets   | not surfaced in metadata                                                                                                            |
| Target datasets   | not surfaced in metadata                                                                                                            |
| Stored procedures | [dbo].[usp_ADFInsertChildProcessExecutionLog], [dbo].[usp_UpdateProcessExecutionLogStatus], [dbo].[usp_CloseOutProcessExecutionLog] |

## Runtime Or Usage Signals

The current support cache is metadata-based. Use ADF run history for live status before operational decisions. For the scheduled Marketing AWS export, recent metadata showed the parent orchestrator pattern creates process execution IDs before child pipelines run.

## Technical Details

| Activity                        | Type                     | Inputs                   | Outputs                  |
| ------------------------------- | ------------------------ | ------------------------ | ------------------------ |
| Get Child Process Parameters    | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| If Execution Status In Progress | IfCondition              | not surfaced in metadata | not surfaced in metadata |
| Set vProcessExecutionID         | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| Set vProcessExecutionStatusID   | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| Log Failure Status              | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |
| Set Process Complete Status     | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |

## Evidence And Caveats

- This page is generated from the saved ADF connector profile, not from raw business data.
- Linked-service secret details and raw activity output are intentionally not published.
- Missing source or target detail means the value was not surfaced in metadata, not that no dependency exists.
