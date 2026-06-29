# PL_Xtime_Master

Generated: 2026-06-29T10:58:57.521Z
ADF factory: `adf-xtime-d1`
Saved connector: `azure-data-factory-adf-xtime-d1`
Source profile artifact: `data/markdown/_runtime/profile-runs/azure-data-factory-adf-xtime-d1/2026-06-29T10-13-27-065Z-22cec896-d7e0-42fe-b489-d705857e7fcf.json`

## Plain-English Summary

PL_Xtime_Master is an ADF orchestrator in adf-xtime-d1. If PL_Xtime_Master fails or becomes stale, dependent ADF loads, files, datasets, or downstream reporting may be incomplete until the failed run is diagnosed and rerun through the approved parent path. Start troubleshooting by checking the latest PL_Xtime_Master parent run and identify the first failed child activity.

## At a Glance

| Field                 | Value                                                                                                                                                                        |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | ADF                                                                                                                                                                          |
| Asset type            | Pipeline                                                                                                                                                                     |
| Native path           | `/subscriptions/bee9b611-da99-4cfc-9fb7-50f1359e5ca2/resourceGroups/rg-data-warehouse-prod/providers/Microsoft.DataFactory/factories/adf-XTime-D1/pipelines/PL_Xtime_Master` |
| Support role          | orchestrator                                                                                                                                                                 |
| Business process      | adf-xtime-d1 pipeline execution                                                                                                                                              |
| Primary source        | not surfaced in metadata                                                                                                                                                     |
| Primary target/output | PL_Xtime_Incremental_Load                                                                                                                                                    |
| Schedule or trigger   | Tr_xTime_Monthly                                                                                                                                                             |
| Runtime/usage signal  | Metadata profiled at 2026-06-29T10:13:27.063Z                                                                                                                                |
| Status signal         | triggered pipeline                                                                                                                                                           |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-xtime-d1/2026-06-29T10-13-27-065Z-22cec896-d7e0-42fe-b489-d705857e7fcf.json`                                     |

## Business Use

This pipeline supports the adf-xtime-d1 ADF process. Its available metadata shows 10 activity step(s), 1 child pipeline call(s), 0 source dataset reference(s), and 0 target dataset reference(s).

## Support Checks

1. Check the latest PL_Xtime_Master parent run and identify the first failed child activity.
2. Confirm parameters are supplied by the parent, trigger, or documented default path: not surfaced in metadata.
3. Confirm source datasets are available: not surfaced in metadata.
4. Confirm target datasets or child pipelines completed: PL_Xtime_Incremental_Load.
5. If stored procedures are involved, validate process/audit logs before rerunning.

## Lineage And Dependencies

| Dependency type   | Values                    |
| ----------------- | ------------------------- |
| Parent pipelines  | not surfaced in metadata  |
| Child pipelines   | PL_Xtime_Incremental_Load |
| Source datasets   | not surfaced in metadata  |
| Target datasets   | not surfaced in metadata  |
| Stored procedures | [dbo].[sp_send_dbmail]    |

## Runtime Or Usage Signals

Use ADF run history for live status. This page is generated from metadata-profile evidence and should not be treated as a current run monitor.

## Technical Details

| Activity                  | Type                     | Inputs                   | Outputs                  |
| ------------------------- | ------------------------ | ------------------------ | ------------------------ |
| Set Username for LS       | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| Create EtlExecID          | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| ACT_LKP_GetEmailList      | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| Set ETL ExecID            | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| Set MetaSourceSystemName  | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| Set MetaSrcSysID          | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| Set MetaLoadDate          | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| ACT_LKP_GetErrorFileLists | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| SP_SendFailureMail        | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |
| PL_Xtime_Incremental_Load | ExecutePipeline          | not surfaced in metadata | not surfaced in metadata |

## Evidence And Caveats

- Generated from saved ADF connector metadata.
- Linked-service secret details and raw activity output are intentionally not published.
- Missing source or target detail means the value was not surfaced in metadata, not that no dependency exists.
