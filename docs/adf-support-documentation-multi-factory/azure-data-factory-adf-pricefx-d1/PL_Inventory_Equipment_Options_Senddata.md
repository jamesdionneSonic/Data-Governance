# PL_Inventory_Equipment_Options_Senddata

Generated: 2026-06-29T10:58:59.579Z
ADF factory: `adf-pricefx-d1`
Saved connector: `azure-data-factory-adf-pricefx-d1`
Source profile artifact: `data/markdown/_runtime/profile-runs/azure-data-factory-adf-pricefx-d1/2026-06-29T10-49-10-481Z-ea190808-2542-4272-b648-bcc818870f5e.json`

## Plain-English Summary

PL_Inventory_Equipment_Options_Senddata is an ADF child pipeline in adf-pricefx-d1. If PL_Inventory_Equipment_Options_Senddata fails or becomes stale, dependent ADF loads, files, datasets, or downstream reporting may be incomplete until the failed run is diagnosed and rerun through the approved parent path. Start troubleshooting by checking the parent pipeline that called PL_Inventory_Equipment_Options_Senddata; do not start the child with blank operational parameters.

## At a Glance

| Field                 | Value                                                                                                                                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Platform              | ADF                                                                                                                                                                                                    |
| Asset type            | Pipeline                                                                                                                                                                                               |
| Native path           | `/subscriptions/bee9b611-da99-4cfc-9fb7-50f1359e5ca2/resourceGroups/rg-data-warehouse-prod/providers/Microsoft.DataFactory/factories/adf-PriceFx-D1/pipelines/PL_Inventory_Equipment_Options_Senddata` |
| Support role          | child pipeline                                                                                                                                                                                         |
| Business process      | adf-pricefx-d1 pipeline execution                                                                                                                                                                      |
| Primary source        | DS_SQL_PriceFX                                                                                                                                                                                         |
| Primary target/output | DS_SFTP_US_EAST_1                                                                                                                                                                                      |
| Schedule or trigger   | not directly triggered                                                                                                                                                                                 |
| Runtime/usage signal  | Metadata profiled at 2026-06-29T10:49:10.426Z                                                                                                                                                          |
| Status signal         | metadata available                                                                                                                                                                                     |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-pricefx-d1/2026-06-29T10-49-10-481Z-ea190808-2542-4272-b648-bcc818870f5e.json`                                                             |

## Business Use

This pipeline supports the adf-pricefx-d1 ADF process. Its available metadata shows 9 activity step(s), 0 child pipeline call(s), 1 source dataset reference(s), and 1 target dataset reference(s).

## Support Checks

1. Check the parent pipeline that called PL_Inventory_Equipment_Options_Senddata; do not start the child with blank operational parameters.
2. Confirm parameters are supplied by the parent, trigger, or documented default path: OpProcessExecutionID, OpBatchID, OpProcessExecutionStatusID, UserName.
3. Confirm source datasets are available: DS_SQL_PriceFX.
4. Confirm target datasets or child pipelines completed: DS_SFTP_US_EAST_1.
5. If stored procedures are involved, validate process/audit logs before rerunning.

## Lineage And Dependencies

| Dependency type   | Values                                                                                                                                                                                                                 |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Parent pipelines  | PL_Inventory_Equipment_Options_Master                                                                                                                                                                                  |
| Child pipelines   | none surfaced                                                                                                                                                                                                          |
| Source datasets   | DS_SQL_PriceFX                                                                                                                                                                                                         |
| Target datasets   | DS_SFTP_US_EAST_1                                                                                                                                                                                                      |
| Stored procedures | [dbo].[usp_ADFInsertChildProcessExecutionLog], [dbo].[usp_CloseOutProcessExecutionLog], [dbo].[usp_UpdateProcessExecutionLogStatus], [dbo].[usp_UpdateProcessExecutionLog], [dbo].[usp_InsertProcessExecutionLogError] |

## Runtime Or Usage Signals

Use ADF run history for live status. This page is generated from metadata-profile evidence and should not be treated as a current run monitor.

## Technical Details

| Activity                             | Type                     | Inputs                   | Outputs                  |
| ------------------------------------ | ------------------------ | ------------------------ | ------------------------ |
| Get Child Process Parameters         | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| Set vProcessExecutionID              | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| Set vProcessExecutionStatusID        | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| Set Process Complete Status          | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |
| Log Failure Status                   | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |
| ACT_SETVAR_SetUserNameForSFTP        | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| update process execution log metrics | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |
| update failure information           | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |
| InvEquipmentOptions PRICEFX TO SFTP  | Copy                     | DS_SQL_PriceFX           | DS_SFTP_US_EAST_1        |

## Evidence And Caveats

- Generated from saved ADF connector metadata.
- Linked-service secret details and raw activity output are intentionally not published.
- Missing source or target detail means the value was not surfaced in metadata, not that no dependency exists.
