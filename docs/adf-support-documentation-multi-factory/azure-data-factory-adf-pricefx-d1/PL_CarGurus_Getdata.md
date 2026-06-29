# PL_CarGurus_Getdata

Generated: 2026-06-29T10:58:59.551Z
ADF factory: `adf-pricefx-d1`
Saved connector: `azure-data-factory-adf-pricefx-d1`
Source profile artifact: `data/markdown/_runtime/profile-runs/azure-data-factory-adf-pricefx-d1/2026-06-29T10-49-10-481Z-ea190808-2542-4272-b648-bcc818870f5e.json`

## Plain-English Summary

PL_CarGurus_Getdata is an ADF child pipeline in adf-pricefx-d1. If PL_CarGurus_Getdata fails or becomes stale, dependent ADF loads, files, datasets, or downstream reporting may be incomplete until the failed run is diagnosed and rerun through the approved parent path. Start troubleshooting by checking the parent pipeline that called PL_CarGurus_Getdata; do not start the child with blank operational parameters.

## At a Glance

| Field                 | Value                                                                                                                                                                              |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | ADF                                                                                                                                                                                |
| Asset type            | Pipeline                                                                                                                                                                           |
| Native path           | `/subscriptions/bee9b611-da99-4cfc-9fb7-50f1359e5ca2/resourceGroups/rg-data-warehouse-prod/providers/Microsoft.DataFactory/factories/adf-PriceFx-D1/pipelines/PL_CarGurus_Getdata` |
| Support role          | child pipeline                                                                                                                                                                     |
| Business process      | adf-pricefx-d1 pipeline execution                                                                                                                                                  |
| Primary source        | not surfaced in metadata                                                                                                                                                           |
| Primary target/output | not surfaced in metadata                                                                                                                                                           |
| Schedule or trigger   | not directly triggered                                                                                                                                                             |
| Runtime/usage signal  | Metadata profiled at 2026-06-29T10:49:10.426Z                                                                                                                                      |
| Status signal         | metadata available                                                                                                                                                                 |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-pricefx-d1/2026-06-29T10-49-10-481Z-ea190808-2542-4272-b648-bcc818870f5e.json`                                         |

## Business Use

This pipeline supports the adf-pricefx-d1 ADF process. Its available metadata shows 13 activity step(s), 0 child pipeline call(s), 0 source dataset reference(s), and 0 target dataset reference(s).

## Support Checks

1. Check the parent pipeline that called PL_CarGurus_Getdata; do not start the child with blank operational parameters.
2. Confirm parameters are supplied by the parent, trigger, or documented default path: UserName, OpProcessExecutionID, OpBatchID, OpProcessExecutionStatusID.
3. Confirm source datasets are available: not surfaced in metadata.
4. Confirm target datasets or child pipelines completed: not surfaced in metadata.
5. If stored procedures are involved, validate process/audit logs before rerunning.

## Lineage And Dependencies

| Dependency type   | Values                                                                                                                                                                          |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Parent pipelines  | PL_PriceFx_CarGurus_Master                                                                                                                                                      |
| Child pipelines   | none surfaced                                                                                                                                                                   |
| Source datasets   | not surfaced in metadata                                                                                                                                                        |
| Target datasets   | not surfaced in metadata                                                                                                                                                        |
| Stored procedures | [dbo].[usp_ADFInsertChildProcessExecutionLog], [dbo].[usp_UpdateProcessExecutionLogStatus], [dbo].[usp_CloseOutProcessExecutionLog], [dbo].[usp_InsertProcessExecutionLogError] |

## Runtime Or Usage Signals

Use ADF run history for live status. This page is generated from metadata-profile evidence and should not be treated as a current run monitor.

## Technical Details

| Activity                                | Type                     | Inputs                   | Outputs                  |
| --------------------------------------- | ------------------------ | ------------------------ | ------------------------ |
| LKP_GetIncrementalDate                  | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| IncrementalDate                         | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| LKP_GetConfigValues                     | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| If Incremental or historical load       | IfCondition              | not surfaced in metadata | not surfaced in metadata |
| IsHistoricalDataLoad                    | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| Get Child Process Parameters            | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| Set vProcessExecutionID                 | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| Set vProcessExecutionStatusID           | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| Log Failure Status                      | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |
| Set Process Complete Status             | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |
| Delete Old dbo table rows               | Script                   | not surfaced in metadata | not surfaced in metadata |
| TableCleanUpAge                         | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| update failure information cleaning dbo | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |

## Evidence And Caveats

- Generated from saved ADF connector metadata.
- Linked-service secret details and raw activity output are intentionally not published.
- Missing source or target detail means the value was not surfaced in metadata, not that no dependency exists.
