# pl_Marketing_AWS_Export_history

Generated: 2026-06-19T08:45:26.969Z
ADF factory: `adf-dw-marketing-prod`
Source profile artifact: `data/markdown/_runtime/profile-runs/azure-data-factory-adf-dw-marketing-prod/2026-06-18T19-30-26-484Z-c5fd7f11-4eb8-4b3f-82e8-047dd0dead46.json`

## Plain-English Summary

pl_Marketing_AWS_Export_history is an ADF orchestrator in history. Use this workflow for the Marketing AWS export process. It creates operational process-log identifiers, coordinates child mapping and MDP export steps, and keeps the scheduled export path moving. If it fails, downstream marketing export or mapping data may be stale or incomplete. Start troubleshooting by checking the latest ADF pipeline run for pl_Marketing_AWS_Export_history and confirm source and target datasets are available.

## At a Glance

| Field                 | Value                                                                                                                                                                                                 |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | ADF                                                                                                                                                                                                   |
| Asset type            | Pipeline                                                                                                                                                                                              |
| Native path           | `/subscriptions/bee9b611-da99-4cfc-9fb7-50f1359e5ca2/resourceGroups/rg-data-warehouse-prod/providers/Microsoft.DataFactory/factories/adf-dw-marketing-prod/pipelines/pl_Marketing_AWS_Export_history` |
| Support role          | orchestrator                                                                                                                                                                                          |
| Business process      | Use this workflow for the Marketing AWS export process. It creates operational process-log identifiers, coordinates child mapping and MDP export steps, and keeps the scheduled export path moving.   |
| Primary source        | not surfaced in metadata                                                                                                                                                                              |
| Primary target/output | pl_eLead_Org_Mappings_history, pl_DMS_Org_Mappings_history, pl_mdp_dms_individual_history, pl_mdp_dms_purchaseinfo_history, pl_mdp_eLead_activity_history                                             |
| Schedule or trigger   | not directly triggered                                                                                                                                                                                |
| Runtime/usage signal  | Metadata profiled at 2026-06-18T19:30:11.914Z                                                                                                                                                         |
| Status signal         | history/backfill candidate                                                                                                                                                                            |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-dw-marketing-prod/2026-06-18T19-30-26-484Z-c5fd7f11-4eb8-4b3f-82e8-047dd0dead46.json`                                                     |

## Business Use

Use this workflow for the Marketing AWS export process. It creates operational process-log identifiers, coordinates child mapping and MDP export steps, and keeps the scheduled export path moving.

## Support Checks

1. Check the latest ADF pipeline run for pl_Marketing_AWS_Export_history and confirm source and target datasets are available.
2. Confirm the pipeline parameters are supplied by the parent, trigger, or documented default path.
3. Confirm source datasets are available: `not surfaced in metadata`.
4. Confirm target datasets or child pipelines completed: `pl_eLead_Org_Mappings_history`, `pl_DMS_Org_Mappings_history`, `pl_mdp_dms_individual_history`, `pl_mdp_dms_purchaseinfo_history`, `pl_mdp_eLead_activity_history`, `pl_mdp_elead_individual_history`, `pl_mdp_elead_vehicleinterest_history`.
5. If process-log procedures are involved, validate the process execution log before rerunning child steps.

## Lineage And Dependencies

| Dependency type   | Values                                                                                                                                                                                                                           |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Parent pipelines  | not surfaced in metadata                                                                                                                                                                                                         |
| Child pipelines   | pl_eLead_Org_Mappings_history, pl_DMS_Org_Mappings_history, pl_mdp_dms_individual_history, pl_mdp_dms_purchaseinfo_history, pl_mdp_eLead_activity_history, pl_mdp_elead_individual_history, pl_mdp_elead_vehicleinterest_history |
| Source datasets   | not surfaced in metadata                                                                                                                                                                                                         |
| Target datasets   | not surfaced in metadata                                                                                                                                                                                                         |
| Stored procedures | [dbo].[usp_ADFInsertMasterProcessExecutionLog], [dbo].[usp_CloseOutProcessExecutionLog], [dbo].[usp_UpdateProcessExecutionLogStatus], [dbo].[usp_UpdateMasterProcessExecutionLog]                                                |

## Runtime Or Usage Signals

The current support cache is metadata-based. Use ADF run history for live status before operational decisions. For the scheduled Marketing AWS export, recent metadata showed the parent orchestrator pattern creates process execution IDs before child pipelines run.

## Technical Details

| Activity                               | Type                     | Inputs                   | Outputs                  |
| -------------------------------------- | ------------------------ | ------------------------ | ------------------------ |
| Execute ELead Org Mappings History     | ExecutePipeline          | not surfaced in metadata | not surfaced in metadata |
| Execute DMS Org Mappings History       | ExecutePipeline          | not surfaced in metadata | not surfaced in metadata |
| Get Master Process Parameters          | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| Set OpProcessExecutionID variable      | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| Set OpBatchID variable                 | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| Set OpProcessExecutionStatusID         | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| Close out master pipeline process      | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |
| Set Elead Org Failure                  | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |
| Set DMS Org Failure                    | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |
| Set Master Pipeline Metrics            | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |
| Execute DMS Individual history         | ExecutePipeline          | not surfaced in metadata | not surfaced in metadata |
| Set DMS Individual Failure             | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |
| Execute DMS purchase info history      | ExecutePipeline          | not surfaced in metadata | not surfaced in metadata |
| Execute eLead activity history         | ExecutePipeline          | not surfaced in metadata | not surfaced in metadata |
| Execute elead individual history       | ExecutePipeline          | not surfaced in metadata | not surfaced in metadata |
| Execute elead vehicle interest history | ExecutePipeline          | not surfaced in metadata | not surfaced in metadata |
| Set DMS Purchase Info Failure          | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |
| Set elead activity Failure             | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |
| Set elead individual Failure           | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |
| Set elead vehicle interest Failure     | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |

## Evidence And Caveats

- This page is generated from the saved ADF connector profile, not from raw business data.
- Linked-service secret details and raw activity output are intentionally not published.
- Missing source or target detail means the value was not surfaced in metadata, not that no dependency exists.
