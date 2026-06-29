# PL_Copy_DimEntity_Master

Generated: 2026-06-29T10:58:58.492Z
ADF factory: `adf-ganalytics-d1`
Saved connector: `azure-data-factory-adf-ganalytics-d1`
Source profile artifact: `data/markdown/_runtime/profile-runs/azure-data-factory-adf-ganalytics-d1/2026-06-29T10-42-03-682Z-594902fe-3591-404d-b693-88159eebfa46.json`

## Plain-English Summary

PL_Copy_DimEntity_Master is an ADF orchestrator in adf-ganalytics-d1. If PL_Copy_DimEntity_Master fails or becomes stale, dependent ADF loads, files, datasets, or downstream reporting may be incomplete until the failed run is diagnosed and rerun through the approved parent path. Start troubleshooting by checking the latest PL_Copy_DimEntity_Master parent run and identify the first failed child activity.

## At a Glance

| Field                 | Value                                                                                                                                                                                      |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Platform              | ADF                                                                                                                                                                                        |
| Asset type            | Pipeline                                                                                                                                                                                   |
| Native path           | `/subscriptions/bee9b611-da99-4cfc-9fb7-50f1359e5ca2/resourceGroups/rg-data-warehouse-prod/providers/Microsoft.DataFactory/factories/adf-GAnalytics-D1/pipelines/PL_Copy_DimEntity_Master` |
| Support role          | orchestrator                                                                                                                                                                               |
| Business process      | adf-ganalytics-d1 pipeline execution                                                                                                                                                       |
| Primary source        | not surfaced in metadata                                                                                                                                                                   |
| Primary target/output | PL_Copy_DimEntity_Child                                                                                                                                                                    |
| Schedule or trigger   | copyDimEntityTables                                                                                                                                                                        |
| Runtime/usage signal  | Metadata profiled at 2026-06-29T10:42:03.665Z                                                                                                                                              |
| Status signal         | triggered pipeline                                                                                                                                                                         |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-ganalytics-d1/2026-06-29T10-42-03-682Z-594902fe-3591-404d-b693-88159eebfa46.json`                                              |

## Business Use

This pipeline supports the adf-ganalytics-d1 ADF process. Its available metadata shows 9 activity step(s), 1 child pipeline call(s), 0 source dataset reference(s), and 0 target dataset reference(s).

## Support Checks

1. Check the latest PL_Copy_DimEntity_Master parent run and identify the first failed child activity.
2. Confirm parameters are supplied by the parent, trigger, or documented default path: not surfaced in metadata.
3. Confirm source datasets are available: not surfaced in metadata.
4. Confirm target datasets or child pipelines completed: PL_Copy_DimEntity_Child.
5. If stored procedures are involved, validate process/audit logs before rerunning.

## Lineage And Dependencies

| Dependency type   | Values                   |
| ----------------- | ------------------------ |
| Parent pipelines  | not surfaced in metadata |
| Child pipelines   | PL_Copy_DimEntity_Child  |
| Source datasets   | not surfaced in metadata |
| Target datasets   | not surfaced in metadata |
| Stored procedures | [dbo].[sp_send_dbmail]   |

## Runtime Or Usage Signals

Use ADF run history for live status. This page is generated from metadata-profile evidence and should not be treated as a current run monitor.

## Technical Details

| Activity                             | Type                     | Inputs                   | Outputs                  |
| ------------------------------------ | ------------------------ | ------------------------ | ------------------------ |
| ACT_SETVAR_SetUserNameForLS          | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| ACT_LKP_CreateETLExecID              | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| ACT_SCR_UpdateDim_ETLExecution       | Script                   | not surfaced in metadata | not surfaced in metadata |
| ACT_EXECPL_LoadDimEntityTables       | ExecutePipeline          | not surfaced in metadata | not surfaced in metadata |
| ACT_LKP_GetSucessandFailureEmailList | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| ACT_SP_DE_FailureMail                | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |
| ACT_LKP_DE_GetSuccessTableHTML       | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| ACT_SP_DE_SuccessMail                | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |
| ACT_LKP_DE_GetFailureTableHTML       | Lookup                   | not surfaced in metadata | not surfaced in metadata |

## Evidence And Caveats

- Generated from saved ADF connector metadata.
- Linked-service secret details and raw activity output are intentionally not published.
- Missing source or target detail means the value was not surfaced in metadata, not that no dependency exists.
