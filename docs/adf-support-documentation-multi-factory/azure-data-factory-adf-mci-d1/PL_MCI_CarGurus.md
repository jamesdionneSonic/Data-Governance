# PL_MCI_CarGurus

Generated: 2026-06-29T10:58:58.329Z
ADF factory: `adf-mci-d1`
Saved connector: `azure-data-factory-adf-mci-d1`
Source profile artifact: `data/markdown/_runtime/profile-runs/azure-data-factory-adf-mci-d1/2026-06-29T10-38-55-091Z-34f3170a-d1ea-4186-b53f-3f09641fbeae.json`

## Plain-English Summary

PL_MCI_CarGurus is an ADF child pipeline in adf-mci-d1. If PL_MCI_CarGurus fails or becomes stale, dependent ADF loads, files, datasets, or downstream reporting may be incomplete until the failed run is diagnosed and rerun through the approved parent path. Start troubleshooting by checking the parent pipeline that called PL_MCI_CarGurus; do not start the child with blank operational parameters.

## At a Glance

| Field                 | Value                                                                                                                                                                      |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | ADF                                                                                                                                                                        |
| Asset type            | Pipeline                                                                                                                                                                   |
| Native path           | `/subscriptions/bee9b611-da99-4cfc-9fb7-50f1359e5ca2/resourceGroups/rg-data-warehouse-prod/providers/Microsoft.DataFactory/factories/adf-MCI-D1/pipelines/PL_MCI_CarGurus` |
| Support role          | child pipeline                                                                                                                                                             |
| Business process      | adf-mci-d1 pipeline execution                                                                                                                                              |
| Primary source        | DS_SQL_MCICarGurus                                                                                                                                                         |
| Primary target/output | DS_SFTP_CarGurus_copy1, DS_SFTP_CarGurus                                                                                                                                   |
| Schedule or trigger   | not directly triggered                                                                                                                                                     |
| Runtime/usage signal  | Metadata profiled at 2026-06-29T10:38:55.070Z                                                                                                                              |
| Status signal         | metadata available                                                                                                                                                         |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-mci-d1/2026-06-29T10-38-55-091Z-34f3170a-d1ea-4186-b53f-3f09641fbeae.json`                                     |

## Business Use

This pipeline supports the adf-mci-d1 ADF process. Its available metadata shows 10 activity step(s), 0 child pipeline call(s), 1 source dataset reference(s), and 2 target dataset reference(s).

## Support Checks

1. Check the parent pipeline that called PL_MCI_CarGurus; do not start the child with blank operational parameters.
2. Confirm parameters are supplied by the parent, trigger, or documented default path: ETLExecID, UserName, SourcePKGLastLoadDate.
3. Confirm source datasets are available: DS_SQL_MCICarGurus.
4. Confirm target datasets or child pipelines completed: DS_SFTP_CarGurus_copy1, DS_SFTP_CarGurus.
5. If stored procedures are involved, validate process/audit logs before rerunning.

## Lineage And Dependencies

| Dependency type   | Values                                   |
| ----------------- | ---------------------------------------- |
| Parent pipelines  | PL_MCI_CarGurus_Incremental              |
| Child pipelines   | none surfaced                            |
| Source datasets   | DS_SQL_MCICarGurus                       |
| Target datasets   | DS_SFTP_CarGurus_copy1, DS_SFTP_CarGurus |
| Stored procedures | [dbo].[usp_insert_audit_load_details]    |

## Runtime Or Usage Signals

Use ADF run history for live status. This page is generated from metadata-profile evidence and should not be treated as a current run monitor.

## Technical Details

| Activity                          | Type                     | Inputs                   | Outputs                  |
| --------------------------------- | ------------------------ | ------------------------ | ------------------------ |
| SET MCI CarGurus Count            | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| SP_InsertAuditLog                 | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |
| SET StartDateTime                 | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| LKP_GET_SFTPDetails               | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| SET HostName                      | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| SET SFTPUserName                  | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| SET FileName                      | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| Test                              | Copy                     | DS_SQL_MCICarGurus       | DS_SFTP_CarGurus_copy1   |
| Update Sync Table                 | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| Load MCICarGurus File_SQL To SFTP | Copy                     | DS_SQL_MCICarGurus       | DS_SFTP_CarGurus         |

## Evidence And Caveats

- Generated from saved ADF connector metadata.
- Linked-service secret details and raw activity output are intentionally not published.
- Missing source or target detail means the value was not surfaced in metadata, not that no dependency exists.
