# PL_Elead_Incremental_Load

Generated: 2026-06-29T10:58:58.714Z
ADF factory: `adf-elead-d1`
Saved connector: `azure-data-factory-adf-elead-d1`
Source profile artifact: `data/markdown/_runtime/profile-runs/azure-data-factory-adf-elead-d1/2026-06-29T10-44-01-752Z-338405aa-fbbd-4157-a7ed-ad8c0fb8bdc3.json`

## Plain-English Summary

PL_Elead_Incremental_Load is an ADF orchestrator in adf-elead-d1. If PL_Elead_Incremental_Load fails or becomes stale, dependent ADF loads, files, datasets, or downstream reporting may be incomplete until the failed run is diagnosed and rerun through the approved parent path. Start troubleshooting by checking the latest PL_Elead_Incremental_Load parent run and identify the first failed child activity.

## At a Glance

| Field                 | Value                                                                                                                                                                                  |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | ADF                                                                                                                                                                                    |
| Asset type            | Pipeline                                                                                                                                                                               |
| Native path           | `/subscriptions/bee9b611-da99-4cfc-9fb7-50f1359e5ca2/resourceGroups/rg-data-warehouse-prod/providers/Microsoft.DataFactory/factories/adf-eLead-D1/pipelines/PL_Elead_Incremental_Load` |
| Support role          | orchestrator                                                                                                                                                                           |
| Business process      | adf-elead-d1 pipeline execution                                                                                                                                                        |
| Primary source        | not surfaced in metadata                                                                                                                                                               |
| Primary target/output | PL_Elead_EAPS_Files, PL_Elead_GECReport_Files                                                                                                                                          |
| Schedule or trigger   | not directly triggered                                                                                                                                                                 |
| Runtime/usage signal  | Metadata profiled at 2026-06-29T10:44:01.731Z                                                                                                                                          |
| Status signal         | metadata available                                                                                                                                                                     |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-elead-d1/2026-06-29T10-44-01-752Z-338405aa-fbbd-4157-a7ed-ad8c0fb8bdc3.json`                                               |

## Business Use

This pipeline supports the adf-elead-d1 ADF process. Its available metadata shows 16 activity step(s), 2 child pipeline call(s), 0 source dataset reference(s), and 0 target dataset reference(s).

## Support Checks

1. Check the latest PL_Elead_Incremental_Load parent run and identify the first failed child activity.
2. Confirm parameters are supplied by the parent, trigger, or documented default path: ETLExecID, MetaLoadDate, MetaSourceSystemName, MetaSrcSysID, MetaUserId, UserName, EmailList.
3. Confirm source datasets are available: not surfaced in metadata.
4. Confirm target datasets or child pipelines completed: PL_Elead_EAPS_Files, PL_Elead_GECReport_Files.
5. If stored procedures are involved, validate process/audit logs before rerunning.

## Lineage And Dependencies

| Dependency type   | Values                                        |
| ----------------- | --------------------------------------------- |
| Parent pipelines  | PL_Elead_Master                               |
| Child pipelines   | PL_Elead_EAPS_Files, PL_Elead_GECReport_Files |
| Source datasets   | not surfaced in metadata                      |
| Target datasets   | not surfaced in metadata                      |
| Stored procedures | [dbo].[usp_insert_audit_load_details]         |

## Runtime Or Usage Signals

Use ADF run history for live status. This page is generated from metadata-profile evidence and should not be treated as a current run monitor.

## Technical Details

| Activity                | Type                     | Inputs                   | Outputs                  |
| ----------------------- | ------------------------ | ------------------------ | ------------------------ |
| InsertLogsForFiles      | ForEach                  | not surfaced in metadata | not surfaced in metadata |
| IterateAvailableFiles   | ForEach                  | not surfaced in metadata | not surfaced in metadata |
| SendMailForEmptyFiles   | IfCondition              | not surfaced in metadata | not surfaced in metadata |
| GetFileLogs             | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| MoveFilesToADLS         | ForEach                  | not surfaced in metadata | not surfaced in metadata |
| LoadStageEAPSFIles      | ExecutePipeline          | not surfaced in metadata | not surfaced in metadata |
| FilterEAPSFiles         | Filter                   | not surfaced in metadata | not surfaced in metadata |
| FilterGECReportFiles    | Filter                   | not surfaced in metadata | not surfaced in metadata |
| LoadStageGECReportFiles | ExecutePipeline          | not surfaced in metadata | not surfaced in metadata |
| Get AuditInfo           | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| Set StartDate           | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| InsertAuditDetails      | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |
| Generate Daily Report   | IfCondition              | not surfaced in metadata | not surfaced in metadata |
| Update Dim_ETLExecution | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| CheckFilesInADLS        | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| PackageLoadDateSync     | Lookup                   | not surfaced in metadata | not surfaced in metadata |

## Evidence And Caveats

- Generated from saved ADF connector metadata.
- Linked-service secret details and raw activity output are intentionally not published.
- Missing source or target detail means the value was not surfaced in metadata, not that no dependency exists.
