# Ep_Sales_PriceFxDB

Generated: 2026-06-29T10:58:59.536Z
ADF factory: `adf-pricefx-d1`
Saved connector: `azure-data-factory-adf-pricefx-d1`
Source profile artifact: `data/markdown/_runtime/profile-runs/azure-data-factory-adf-pricefx-d1/2026-06-29T10-49-10-481Z-ea190808-2542-4272-b648-bcc818870f5e.json`

## Plain-English Summary

Ep_Sales_PriceFxDB is an ADF child pipeline in adf-pricefx-d1. If Ep_Sales_PriceFxDB fails or becomes stale, dependent ADF loads, files, datasets, or downstream reporting may be incomplete until the failed run is diagnosed and rerun through the approved parent path. Start troubleshooting by checking the parent pipeline that called Ep_Sales_PriceFxDB; do not start the child with blank operational parameters.

## At a Glance

| Field                 | Value                                                                                                                                                                             |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | ADF                                                                                                                                                                               |
| Asset type            | Pipeline                                                                                                                                                                          |
| Native path           | `/subscriptions/bee9b611-da99-4cfc-9fb7-50f1359e5ca2/resourceGroups/rg-data-warehouse-prod/providers/Microsoft.DataFactory/factories/adf-PriceFx-D1/pipelines/Ep_Sales_PriceFxDB` |
| Support role          | child pipeline                                                                                                                                                                    |
| Business process      | adf-pricefx-d1 pipeline execution                                                                                                                                                 |
| Primary source        | DS_SQL_DAGroup                                                                                                                                                                    |
| Primary target/output | EP_Sales_Tracker_PriceFXDB                                                                                                                                                        |
| Schedule or trigger   | not directly triggered                                                                                                                                                            |
| Runtime/usage signal  | Metadata profiled at 2026-06-29T10:49:10.426Z                                                                                                                                     |
| Status signal         | metadata available                                                                                                                                                                |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-pricefx-d1/2026-06-29T10-49-10-481Z-ea190808-2542-4272-b648-bcc818870f5e.json`                                        |

## Business Use

This pipeline supports the adf-pricefx-d1 ADF process. Its available metadata shows 11 activity step(s), 0 child pipeline call(s), 1 source dataset reference(s), and 1 target dataset reference(s).

## Support Checks

1. Check the parent pipeline that called Ep_Sales_PriceFxDB; do not start the child with blank operational parameters.
2. Confirm parameters are supplied by the parent, trigger, or documented default path: UserName, OpProcessExecutionID, OpBatchID, OpProcessExecutionStatusID.
3. Confirm source datasets are available: DS_SQL_DAGroup.
4. Confirm target datasets or child pipelines completed: EP_Sales_Tracker_PriceFXDB.
5. If stored procedures are involved, validate process/audit logs before rerunning.

## Lineage And Dependencies

| Dependency type   | Values                                                                                                                                                                                                                 |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Parent pipelines  | Ep_salesTracker_Master                                                                                                                                                                                                 |
| Child pipelines   | none surfaced                                                                                                                                                                                                          |
| Source datasets   | DS_SQL_DAGroup                                                                                                                                                                                                         |
| Target datasets   | EP_Sales_Tracker_PriceFXDB                                                                                                                                                                                             |
| Stored procedures | [dbo].[usp_ADFInsertChildProcessExecutionLog], [dbo].[usp_CloseOutProcessExecutionLog], [dbo].[usp_UpdateProcessExecutionLogStatus], [dbo].[usp_UpdateProcessExecutionLog], [dbo].[usp_InsertProcessExecutionLogError] |

## Runtime Or Usage Signals

Use ADF run history for live status. This page is generated from metadata-profile evidence and should not be treated as a current run monitor.

## Technical Details

| Activity                             | Type                     | Inputs                   | Outputs                    |
| ------------------------------------ | ------------------------ | ------------------------ | -------------------------- |
| Get Child Process Parameters         | Lookup                   | not surfaced in metadata | not surfaced in metadata   |
| Set vProcessExecutionID              | SetVariable              | not surfaced in metadata | not surfaced in metadata   |
| Set vProcessExecutionStatusID        | SetVariable              | not surfaced in metadata | not surfaced in metadata   |
| Set Process Complete Status          | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata   |
| Log Failure Status                   | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata   |
| GET DATA FROM EPST                   | Copy                     | DS_SQL_DAGroup           | EP_Sales_Tracker_PriceFXDB |
| update process execution log metrics | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata   |
| update failure information           | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata   |
| LKP_GetConfigValues                  | Lookup                   | not surfaced in metadata | not surfaced in metadata   |
| Delete Old dbo table rows            | Script                   | not surfaced in metadata | not surfaced in metadata   |
| TableCleanUpAge                      | SetVariable              | not surfaced in metadata | not surfaced in metadata   |

## Evidence And Caveats

- Generated from saved ADF connector metadata.
- Linked-service secret details and raw activity output are intentionally not published.
- Missing source or target detail means the value was not surfaced in metadata, not that no dependency exists.
