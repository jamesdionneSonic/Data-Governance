# Inventory_FMV_PriceFxDB

Generated: 2026-06-29T10:58:59.544Z
ADF factory: `adf-pricefx-d1`
Saved connector: `azure-data-factory-adf-pricefx-d1`
Source profile artifact: `data/markdown/_runtime/profile-runs/azure-data-factory-adf-pricefx-d1/2026-06-29T10-49-10-481Z-ea190808-2542-4272-b648-bcc818870f5e.json`

## Plain-English Summary

Inventory_FMV_PriceFxDB is an ADF child pipeline in adf-pricefx-d1. If Inventory_FMV_PriceFxDB fails or becomes stale, dependent ADF loads, files, datasets, or downstream reporting may be incomplete until the failed run is diagnosed and rerun through the approved parent path. Start troubleshooting by checking the parent pipeline that called Inventory_FMV_PriceFxDB; do not start the child with blank operational parameters.

## At a Glance

| Field                 | Value                                                                                                                                                                                  |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | ADF                                                                                                                                                                                    |
| Asset type            | Pipeline                                                                                                                                                                               |
| Native path           | `/subscriptions/bee9b611-da99-4cfc-9fb7-50f1359e5ca2/resourceGroups/rg-data-warehouse-prod/providers/Microsoft.DataFactory/factories/adf-PriceFx-D1/pipelines/Inventory_FMV_PriceFxDB` |
| Support role          | child pipeline                                                                                                                                                                         |
| Business process      | adf-pricefx-d1 pipeline execution                                                                                                                                                      |
| Primary source        | DS_SQL_EPPricing_New, InvFMV_to_PriceFxDB                                                                                                                                              |
| Primary target/output | InvFMV_to_PriceFxDB, ds_pricefx_invFMV                                                                                                                                                 |
| Schedule or trigger   | not directly triggered                                                                                                                                                                 |
| Runtime/usage signal  | Metadata profiled at 2026-06-29T10:49:10.426Z                                                                                                                                          |
| Status signal         | metadata available                                                                                                                                                                     |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-pricefx-d1/2026-06-29T10-49-10-481Z-ea190808-2542-4272-b648-bcc818870f5e.json`                                             |

## Business Use

This pipeline supports the adf-pricefx-d1 ADF process. Its available metadata shows 10 activity step(s), 0 child pipeline call(s), 2 source dataset reference(s), and 2 target dataset reference(s).

## Support Checks

1. Check the parent pipeline that called Inventory_FMV_PriceFxDB; do not start the child with blank operational parameters.
2. Confirm parameters are supplied by the parent, trigger, or documented default path: UserName, OpProcessExecutionID, OpBatchID, OpProcessExecutionStatusID, MasterPipelineName, JobQuery.
3. Confirm source datasets are available: DS_SQL_EPPricing_New, InvFMV_to_PriceFxDB.
4. Confirm target datasets or child pipelines completed: InvFMV_to_PriceFxDB, ds_pricefx_invFMV.
5. If stored procedures are involved, validate process/audit logs before rerunning.

## Lineage And Dependencies

| Dependency type   | Values                                                                                                                              |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Parent pipelines  | Inventory_FMV_Master                                                                                                                |
| Child pipelines   | none surfaced                                                                                                                       |
| Source datasets   | DS_SQL_EPPricing_New, InvFMV_to_PriceFxDB                                                                                           |
| Target datasets   | InvFMV_to_PriceFxDB, ds_pricefx_invFMV                                                                                              |
| Stored procedures | [dbo].[usp_ADFInsertChildProcessExecutionLog], [dbo].[usp_CloseOutProcessExecutionLog], [dbo].[usp_UpdateProcessExecutionLogStatus] |

## Runtime Or Usage Signals

Use ADF run history for live status. This page is generated from metadata-profile evidence and should not be treated as a current run monitor.

## Technical Details

| Activity                      | Type                     | Inputs                   | Outputs                  |
| ----------------------------- | ------------------------ | ------------------------ | ------------------------ |
| Get Child Process Parameters  | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| Set vProcessExecutionID       | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| Set vProcessExecutionStatusID | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| Set Process Complete Status   | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |
| Log Failure Status            | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata |
| LKP_GetConfigValues           | Lookup                   | not surfaced in metadata | not surfaced in metadata |
| Delete Old dbo table rows     | Script                   | not surfaced in metadata | not surfaced in metadata |
| TableCleanUpAge               | SetVariable              | not surfaced in metadata | not surfaced in metadata |
| Copy_EPPricing_FMV_To_Tmp     | Copy                     | DS_SQL_EPPricing_New     | InvFMV_to_PriceFxDB      |
| Copy_FMV_Tmp_to_PFXDB         | Copy                     | InvFMV_to_PriceFxDB      | ds_pricefx_invFMV        |

## Evidence And Caveats

- Generated from saved ADF connector metadata.
- Linked-service secret details and raw activity output are intentionally not published.
- Missing source or target detail means the value was not surfaced in metadata, not that no dependency exists.
