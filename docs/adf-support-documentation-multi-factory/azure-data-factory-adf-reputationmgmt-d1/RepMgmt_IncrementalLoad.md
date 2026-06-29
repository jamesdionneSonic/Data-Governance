# RepMgmt_IncrementalLoad

Generated: 2026-06-29T10:58:57.792Z
ADF factory: `adf-reputationmgmt-d1`
Saved connector: `azure-data-factory-adf-reputationmgmt-d1`
Source profile artifact: `data/markdown/_runtime/profile-runs/azure-data-factory-adf-reputationmgmt-d1/2026-06-29T10-16-34-166Z-e6bc6e30-cbf6-451f-bf23-2f2942845302.json`

## Plain-English Summary

RepMgmt_IncrementalLoad is an ADF child pipeline in adf-reputationmgmt-d1. If RepMgmt_IncrementalLoad fails or becomes stale, dependent ADF loads, files, datasets, or downstream reporting may be incomplete until the failed run is diagnosed and rerun through the approved parent path. Start troubleshooting by checking the parent pipeline that called RepMgmt_IncrementalLoad; do not start the child with blank operational parameters.

## At a Glance

| Field                 | Value                                                                                                                                                                                         |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | ADF                                                                                                                                                                                           |
| Asset type            | Pipeline                                                                                                                                                                                      |
| Native path           | `/subscriptions/bee9b611-da99-4cfc-9fb7-50f1359e5ca2/resourceGroups/rg-data-warehouse-prod/providers/Microsoft.DataFactory/factories/adf-ReputationMgmt-D1/pipelines/RepMgmt_IncrementalLoad` |
| Support role          | child pipeline                                                                                                                                                                                |
| Business process      | adf-reputationmgmt-d1 pipeline execution                                                                                                                                                      |
| Primary source        | not surfaced in metadata                                                                                                                                                                      |
| Primary target/output | not surfaced in metadata                                                                                                                                                                      |
| Schedule or trigger   | not directly triggered                                                                                                                                                                        |
| Runtime/usage signal  | Metadata profiled at 2026-06-29T10:16:34.135Z                                                                                                                                                 |
| Status signal         | metadata available                                                                                                                                                                            |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-reputationmgmt-d1/2026-06-29T10-16-34-166Z-e6bc6e30-cbf6-451f-bf23-2f2942845302.json`                                             |

## Business Use

This pipeline supports the adf-reputationmgmt-d1 ADF process. Its available metadata shows 15 activity step(s), 0 child pipeline call(s), 0 source dataset reference(s), and 0 target dataset reference(s).

## Support Checks

1. Check the parent pipeline that called RepMgmt_IncrementalLoad; do not start the child with blank operational parameters.
2. Confirm parameters are supplied by the parent, trigger, or documented default path: MetaSourceSystemName, UserName, ETLExecutionID, MetaLoadDate, MetaUserId, MetaSrcSysID, RelationshipTypeGuid, MetaComputerName, EmailList.
3. Confirm source datasets are available: not surfaced in metadata.
4. Confirm target datasets or child pipelines completed: not surfaced in metadata.
5. If stored procedures are involved, validate process/audit logs before rerunning.

## Lineage And Dependencies

| Dependency type   | Values                                                        |
| ----------------- | ------------------------------------------------------------- |
| Parent pipelines  | ReputationManagement_Master                                   |
| Child pipelines   | none surfaced                                                 |
| Source datasets   | not surfaced in metadata                                      |
| Target datasets   | not surfaced in metadata                                      |
| Stored procedures | [dbo].[usp_insert_audit_load_details], [dbo].[sp_send_dbmail] |

## Runtime Or Usage Signals

Use ADF run history for live status. This page is generated from metadata-profile evidence and should not be treated as a current run monitor.

## Technical Details

| Activity                            | Type                     | Inputs                   | Outputs                  |
| ----------------------------------- | ------------------------ | ------------------------ | ------------------------ |
| ForEachFile                         | ForEach                  | not surfaced in metadata | not surfaced in metadata |
| CheckEmptyFiles                     | ForEach                  | not surfaced in metadata | not surfaced in metadata |
| SendMailForEmptyFiles               | IfCondition              | not surfaced in metadata | not surfaced in metadata |
| CheckLogsToProcessFiles             | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| CheckStatus                         | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| GetAuditInfoPhase1                  | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| InsertAuditDetailsPhase1            | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |
| RMSuccessMailAlertPhase1            | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |
| GetFileListsPhase1                  | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| Phase2Load                          | Switch                   | not surfaced in metadata | not surfaced in metadata |
| NewlyInsertedStores                 | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| IsNonMatchingStores                 | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| SendMailForNewAndNon-MatchingStores | Switch                   | not surfaced in metadata | not surfaced in metadata |
| Phase1Load                          | Switch                   | not surfaced in metadata | not surfaced in metadata |
| IsPipelineEnabled                   | IfCondition              | not surfaced in metadata | not surfaced in metadata |

## Evidence And Caveats

- Generated from saved ADF connector metadata.
- Linked-service secret details and raw activity output are intentionally not published.
- Missing source or target detail means the value was not surfaced in metadata, not that no dependency exists.
