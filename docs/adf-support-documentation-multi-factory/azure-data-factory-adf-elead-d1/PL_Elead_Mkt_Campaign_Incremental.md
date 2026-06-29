# PL_Elead_Mkt_Campaign_Incremental

Generated: 2026-06-29T10:58:58.724Z
ADF factory: `adf-elead-d1`
Saved connector: `azure-data-factory-adf-elead-d1`
Source profile artifact: `data/markdown/_runtime/profile-runs/azure-data-factory-adf-elead-d1/2026-06-29T10-44-01-752Z-338405aa-fbbd-4157-a7ed-ad8c0fb8bdc3.json`

## Plain-English Summary

PL_Elead_Mkt_Campaign_Incremental is an ADF orchestrator in adf-elead-d1. If PL_Elead_Mkt_Campaign_Incremental fails or becomes stale, dependent ADF loads, files, datasets, or downstream reporting may be incomplete until the failed run is diagnosed and rerun through the approved parent path. Start troubleshooting by checking the latest PL_Elead_Mkt_Campaign_Incremental parent run and identify the first failed child activity.

## At a Glance

| Field                 | Value                                                                                                                                                                                          |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | ADF                                                                                                                                                                                            |
| Asset type            | Pipeline                                                                                                                                                                                       |
| Native path           | `/subscriptions/bee9b611-da99-4cfc-9fb7-50f1359e5ca2/resourceGroups/rg-data-warehouse-prod/providers/Microsoft.DataFactory/factories/adf-eLead-D1/pipelines/PL_Elead_Mkt_Campaign_Incremental` |
| Support role          | orchestrator                                                                                                                                                                                   |
| Business process      | adf-elead-d1 pipeline execution                                                                                                                                                                |
| Primary source        | not surfaced in metadata                                                                                                                                                                       |
| Primary target/output | PL_Mkt_Campaign_Insert_Logs                                                                                                                                                                    |
| Schedule or trigger   | not directly triggered                                                                                                                                                                         |
| Runtime/usage signal  | Metadata profiled at 2026-06-29T10:44:01.731Z                                                                                                                                                  |
| Status signal         | metadata available                                                                                                                                                                             |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-elead-d1/2026-06-29T10-44-01-752Z-338405aa-fbbd-4157-a7ed-ad8c0fb8bdc3.json`                                                       |

## Business Use

This pipeline supports the adf-elead-d1 ADF process. Its available metadata shows 15 activity step(s), 1 child pipeline call(s), 0 source dataset reference(s), and 0 target dataset reference(s).

## Support Checks

1. Check the latest PL_Elead_Mkt_Campaign_Incremental parent run and identify the first failed child activity.
2. Confirm parameters are supplied by the parent, trigger, or documented default path: ETLExecID, MetaLoadDate, MetaSourceSystemName, MetaSrcSysID, MetaUserId, UserName, LastLoadDate, HistoricalPipelineName.
3. Confirm source datasets are available: not surfaced in metadata.
4. Confirm target datasets or child pipelines completed: PL_Mkt_Campaign_Insert_Logs.
5. If stored procedures are involved, validate process/audit logs before rerunning.

## Lineage And Dependencies

| Dependency type   | Values                                                        |
| ----------------- | ------------------------------------------------------------- |
| Parent pipelines  | not surfaced in metadata                                      |
| Child pipelines   | PL_Mkt_Campaign_Insert_Logs                                   |
| Source datasets   | not surfaced in metadata                                      |
| Target datasets   | not surfaced in metadata                                      |
| Stored procedures | [dbo].[usp_insert_audit_load_details], [dbo].[sp_send_dbmail] |

## Runtime Or Usage Signals

Use ADF run history for live status. This page is generated from metadata-profile evidence and should not be treated as a current run monitor.

## Technical Details

| Activity                              | Type                     | Inputs                   | Outputs                  |
| ------------------------------------- | ------------------------ | ------------------------ | ------------------------ |
| PackageLoadDateSync                   | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| Set StartDate                         | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| Get Files                             | GetMetadata              | not surfaced in metadata | not surfaced in metadata |
| FilterFiles                           | Filter                   | not surfaced in metadata | not surfaced in metadata |
| PL_Mkt_Campaign_Insert_Logs           | ExecutePipeline          | not surfaced in metadata | not surfaced in metadata |
| Get FileLogs                          | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| FEC-AvailableFiles                    | ForEach                  | not surfaced in metadata | not surfaced in metadata |
| SendMailForEmptyFiles                 | IfCondition              | not surfaced in metadata | not surfaced in metadata |
| FEC-NonEmptyFile                      | ForEach                  | not surfaced in metadata | not surfaced in metadata |
| Get AuditInfo                         | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| InsertAuditDetails                    | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |
| GetFileLoadDetails                    | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| SendMailOnSuccess                     | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |
| Update Dim_ETLExecution               | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| ACT_LKP_GetSuccessAndFailureEmailList | Lookup                   | not surfaced in metadata | not surfaced in metadata |

## Evidence And Caveats

- Generated from saved ADF connector metadata.
- Linked-service secret details and raw activity output are intentionally not published.
- Missing source or target detail means the value was not surfaced in metadata, not that no dependency exists.
