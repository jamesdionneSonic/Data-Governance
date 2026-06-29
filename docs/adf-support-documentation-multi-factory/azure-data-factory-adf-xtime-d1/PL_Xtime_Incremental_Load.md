# PL_Xtime_Incremental_Load

Generated: 2026-06-29T10:58:57.519Z
ADF factory: `adf-xtime-d1`
Saved connector: `azure-data-factory-adf-xtime-d1`
Source profile artifact: `data/markdown/_runtime/profile-runs/azure-data-factory-adf-xtime-d1/2026-06-29T10-13-27-065Z-22cec896-d7e0-42fe-b489-d705857e7fcf.json`

## Plain-English Summary

PL_Xtime_Incremental_Load is an ADF child pipeline in adf-xtime-d1. If PL_Xtime_Incremental_Load fails or becomes stale, dependent ADF loads, files, datasets, or downstream reporting may be incomplete until the failed run is diagnosed and rerun through the approved parent path. Start troubleshooting by checking the parent pipeline that called PL_Xtime_Incremental_Load; do not start the child with blank operational parameters.

## At a Glance

| Field                 | Value                                                                                                                                                                                  |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | ADF                                                                                                                                                                                    |
| Asset type            | Pipeline                                                                                                                                                                               |
| Native path           | `/subscriptions/bee9b611-da99-4cfc-9fb7-50f1359e5ca2/resourceGroups/rg-data-warehouse-prod/providers/Microsoft.DataFactory/factories/adf-XTime-D1/pipelines/PL_Xtime_Incremental_Load` |
| Support role          | child pipeline                                                                                                                                                                         |
| Business process      | adf-xtime-d1 pipeline execution                                                                                                                                                        |
| Primary source        | not surfaced in metadata                                                                                                                                                               |
| Primary target/output | not surfaced in metadata                                                                                                                                                               |
| Schedule or trigger   | not directly triggered                                                                                                                                                                 |
| Runtime/usage signal  | Metadata profiled at 2026-06-29T10:13:27.063Z                                                                                                                                          |
| Status signal         | metadata available                                                                                                                                                                     |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-xtime-d1/2026-06-29T10-13-27-065Z-22cec896-d7e0-42fe-b489-d705857e7fcf.json`                                               |

## Business Use

This pipeline supports the adf-xtime-d1 ADF process. Its available metadata shows 13 activity step(s), 0 child pipeline call(s), 0 source dataset reference(s), and 0 target dataset reference(s).

## Support Checks

1. Check the parent pipeline that called PL_Xtime_Incremental_Load; do not start the child with blank operational parameters.
2. Confirm parameters are supplied by the parent, trigger, or documented default path: ETLExecID, MetaLoadDate, MetaSourceSystemName, MetaSrcSysID, MetaUserId, UserName, TargetTableName.
3. Confirm source datasets are available: not surfaced in metadata.
4. Confirm target datasets or child pipelines completed: not surfaced in metadata.
5. If stored procedures are involved, validate process/audit logs before rerunning.

## Lineage And Dependencies

| Dependency type   | Values                                                        |
| ----------------- | ------------------------------------------------------------- |
| Parent pipelines  | PL_Xtime_Master                                               |
| Child pipelines   | none surfaced                                                 |
| Source datasets   | not surfaced in metadata                                      |
| Target datasets   | not surfaced in metadata                                      |
| Stored procedures | [dbo].[usp_insert_audit_load_details], [dbo].[sp_send_dbmail] |

## Runtime Or Usage Signals

Use ADF run history for live status. This page is generated from metadata-profile evidence and should not be treated as a current run monitor.

## Technical Details

| Activity                       | Type                     | Inputs                   | Outputs                  |
| ------------------------------ | ------------------------ | ------------------------ | ------------------------ |
| Get_FilesSFTP                  | GetMetadata              | not surfaced in metadata | not surfaced in metadata |
| Set StartDate                  | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| FEC-CheckEmptyFiles            | ForEach                  | not surfaced in metadata | not surfaced in metadata |
| ACT_LKP_GetFileLogs            | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| FEC-InsertLogs                 | ForEach                  | not surfaced in metadata | not surfaced in metadata |
| Filter Files                   | Filter                   | not surfaced in metadata | not surfaced in metadata |
| ACT_LKP_GetEmailList           | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| ACT_LKP_GetAuditInformation    | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| FEC-NonEmptyFiles              | ForEach                  | not surfaced in metadata | not surfaced in metadata |
| ACT_LKP_UpdateDim_ETLExecution | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| ACT_LKP_GetFileLoad_Details    | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| SP_InsertAuditDetails          | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |
| SP_SendSuccessMail             | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |

## Evidence And Caveats

- Generated from saved ADF connector metadata.
- Linked-service secret details and raw activity output are intentionally not published.
- Missing source or target detail means the value was not surfaced in metadata, not that no dependency exists.
