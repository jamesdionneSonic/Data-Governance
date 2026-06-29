# ReputationManagement_Master

Generated: 2026-06-29T10:58:57.798Z
ADF factory: `adf-reputationmgmt-d1`
Saved connector: `azure-data-factory-adf-reputationmgmt-d1`
Source profile artifact: `data/markdown/_runtime/profile-runs/azure-data-factory-adf-reputationmgmt-d1/2026-06-29T10-16-34-166Z-e6bc6e30-cbf6-451f-bf23-2f2942845302.json`

## Plain-English Summary

ReputationManagement_Master is an ADF orchestrator in adf-reputationmgmt-d1. If ReputationManagement_Master fails or becomes stale, dependent ADF loads, files, datasets, or downstream reporting may be incomplete until the failed run is diagnosed and rerun through the approved parent path. Start troubleshooting by checking the latest ReputationManagement_Master parent run and identify the first failed child activity.

## At a Glance

| Field                 | Value                                                                                                                                                                                             |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | ADF                                                                                                                                                                                               |
| Asset type            | Pipeline                                                                                                                                                                                          |
| Native path           | `/subscriptions/bee9b611-da99-4cfc-9fb7-50f1359e5ca2/resourceGroups/rg-data-warehouse-prod/providers/Microsoft.DataFactory/factories/adf-ReputationMgmt-D1/pipelines/ReputationManagement_Master` |
| Support role          | orchestrator                                                                                                                                                                                      |
| Business process      | adf-reputationmgmt-d1 pipeline execution                                                                                                                                                          |
| Primary source        | not surfaced in metadata                                                                                                                                                                          |
| Primary target/output | RepMgmt_IncrementalLoad                                                                                                                                                                           |
| Schedule or trigger   | RMLoadDaily                                                                                                                                                                                       |
| Runtime/usage signal  | Metadata profiled at 2026-06-29T10:16:34.135Z                                                                                                                                                     |
| Status signal         | triggered pipeline                                                                                                                                                                                |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-reputationmgmt-d1/2026-06-29T10-16-34-166Z-e6bc6e30-cbf6-451f-bf23-2f2942845302.json`                                                 |

## Business Use

This pipeline supports the adf-reputationmgmt-d1 ADF process. Its available metadata shows 14 activity step(s), 1 child pipeline call(s), 0 source dataset reference(s), and 0 target dataset reference(s).

## Support Checks

1. Check the latest ReputationManagement_Master parent run and identify the first failed child activity.
2. Confirm parameters are supplied by the parent, trigger, or documented default path: not surfaced in metadata.
3. Confirm source datasets are available: not surfaced in metadata.
4. Confirm target datasets or child pipelines completed: RepMgmt_IncrementalLoad.
5. If stored procedures are involved, validate process/audit logs before rerunning.

## Lineage And Dependencies

| Dependency type   | Values                                                   |
| ----------------- | -------------------------------------------------------- |
| Parent pipelines  | not surfaced in metadata                                 |
| Child pipelines   | RepMgmt_IncrementalLoad                                  |
| Source datasets   | not surfaced in metadata                                 |
| Target datasets   | not surfaced in metadata                                 |
| Stored procedures | [Audit].[usp_LogExecutionErrors], [dbo].[sp_send_dbmail] |

## Runtime Or Usage Signals

Use ADF run history for live status. This page is generated from metadata-profile evidence and should not be treated as a current run monitor.

## Technical Details

| Activity                              | Type                     | Inputs                   | Outputs                  |
| ------------------------------------- | ------------------------ | ------------------------ | ------------------------ |
| SetUserNameForLS                      | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| CreateETLExecID                       | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| SetETLExecID                          | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| SetMetaSrcSysID                       | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| SetMetaLoadDate                       | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| SetMetaSourceSystemName               | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| ExecuteRMLoad                         | ExecutePipeline          | not surfaced in metadata | not surfaced in metadata |
| RMLogFailureDetails                   | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |
| RMFailureMailAlert                    | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |
| UpdateDimETLExecution                 | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| GetErrorFileListsPhase1               | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| CreateRelationshipTypeGuid            | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| SetRelationshipTypeGuid               | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| ACT_LKP_GetSuccessAndFailureEmailList | Lookup                   | not surfaced in metadata | not surfaced in metadata |

## Evidence And Caveats

- Generated from saved ADF connector metadata.
- Linked-service secret details and raw activity output are intentionally not published.
- Missing source or target detail means the value was not surfaced in metadata, not that no dependency exists.
