# PL_Inventory_Details_Accounting_Getdata

Generated: 2026-06-29T10:58:59.571Z
ADF factory: `adf-pricefx-d1`
Saved connector: `azure-data-factory-adf-pricefx-d1`
Source profile artifact: `data/markdown/_runtime/profile-runs/azure-data-factory-adf-pricefx-d1/2026-06-29T10-49-10-481Z-ea190808-2542-4272-b648-bcc818870f5e.json`

## Plain-English Summary

PL_Inventory_Details_Accounting_Getdata is an ADF child pipeline in adf-pricefx-d1. If PL_Inventory_Details_Accounting_Getdata fails or becomes stale, dependent ADF loads, files, datasets, or downstream reporting may be incomplete until the failed run is diagnosed and rerun through the approved parent path. Start troubleshooting by checking the parent pipeline that called PL_Inventory_Details_Accounting_Getdata; do not start the child with blank operational parameters.

## At a Glance

| Field                 | Value                                                                                                                                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Platform              | ADF                                                                                                                                                                                                    |
| Asset type            | Pipeline                                                                                                                                                                                               |
| Native path           | `/subscriptions/bee9b611-da99-4cfc-9fb7-50f1359e5ca2/resourceGroups/rg-data-warehouse-prod/providers/Microsoft.DataFactory/factories/adf-PriceFx-D1/pipelines/PL_Inventory_Details_Accounting_Getdata` |
| Support role          | child pipeline                                                                                                                                                                                         |
| Business process      | adf-pricefx-d1 pipeline execution                                                                                                                                                                      |
| Primary source        | DS_SQL_SIMS_EP, DA_SIMS_EP_SQL, DS_SQL_EPPricing_New, DS_SQL_DAGroup, PriceFx_DB                                                                                                                       |
| Primary target/output | DS_ida_sims_details, DS_ida_DaSims_vwDaysonLot, DS_ida_eppricing, DS_ida_da_vwParams, DS_ida_DA_Group_vw_EP_Inventory, DS_ida_Inventory                                                                |
| Schedule or trigger   | not directly triggered                                                                                                                                                                                 |
| Runtime/usage signal  | Metadata profiled at 2026-06-29T10:49:10.426Z                                                                                                                                                          |
| Status signal         | metadata available                                                                                                                                                                                     |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-pricefx-d1/2026-06-29T10-49-10-481Z-ea190808-2542-4272-b648-bcc818870f5e.json`                                                             |

## Business Use

This pipeline supports the adf-pricefx-d1 ADF process. Its available metadata shows 23 activity step(s), 0 child pipeline call(s), 5 source dataset reference(s), and 6 target dataset reference(s).

## Support Checks

1. Check the parent pipeline that called PL_Inventory_Details_Accounting_Getdata; do not start the child with blank operational parameters.
2. Confirm parameters are supplied by the parent, trigger, or documented default path: UserName, OpProcessExecutionID, OpBatchID, OpProcessExecutionStatusID.
3. Confirm source datasets are available: DS_SQL_SIMS_EP, DA_SIMS_EP_SQL, DS_SQL_EPPricing_New, DS_SQL_DAGroup, PriceFx_DB.
4. Confirm target datasets or child pipelines completed: DS_ida_sims_details, DS_ida_DaSims_vwDaysonLot, DS_ida_eppricing, DS_ida_da_vwParams, DS_ida_DA_Group_vw_EP_Inventory, DS_ida_Inventory.
5. If stored procedures are involved, validate process/audit logs before rerunning.

## Lineage And Dependencies

| Dependency type   | Values                                                                                                                                                                                                                 |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Parent pipelines  | PL_Inventory_Details_Accounting_Master                                                                                                                                                                                 |
| Child pipelines   | none surfaced                                                                                                                                                                                                          |
| Source datasets   | DS_SQL_SIMS_EP, DA_SIMS_EP_SQL, DS_SQL_EPPricing_New, DS_SQL_DAGroup, PriceFx_DB                                                                                                                                       |
| Target datasets   | DS_ida_sims_details, DS_ida_DaSims_vwDaysonLot, DS_ida_eppricing, DS_ida_da_vwParams, DS_ida_DA_Group_vw_EP_Inventory, DS_ida_Inventory                                                                                |
| Stored procedures | [dbo].[usp_ADFInsertChildProcessExecutionLog], [dbo].[usp_CloseOutProcessExecutionLog], [dbo].[usp_UpdateProcessExecutionLogStatus], [dbo].[usp_UpdateProcessExecutionLog], [dbo].[usp_InsertProcessExecutionLogError] |

## Runtime Or Usage Signals

Use ADF run history for live status. This page is generated from metadata-profile evidence and should not be treated as a current run monitor.

## Technical Details

| Activity                                | Type                     | Inputs                   | Outputs                         |
| --------------------------------------- | ------------------------ | ------------------------ | ------------------------------- |
| Get Child Process Parameters            | Lookup                   | not surfaced in metadata | not surfaced in metadata        |
| Set vProcessExecutionID                 | SetVariable              | not surfaced in metadata | not surfaced in metadata        |
| Set vProcessExecutionStatusID           | SetVariable              | not surfaced in metadata | not surfaced in metadata        |
| Set Process Complete Status             | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata        |
| Log Failure Status                      | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata        |
| update process execution log metrics    | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata        |
| update failure information              | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata        |
| TRUNCATE Old Data                       | Script                   | not surfaced in metadata | not surfaced in metadata        |
| ida_sims_details                        | Copy                     | DS_SQL_SIMS_EP           | DS_ida_sims_details             |
| ida_vw_DaysonLot                        | Copy                     | DA_SIMS_EP_SQL           | DS_ida_DaSims_vwDaysonLot       |
| ida_eppricing                           | Copy                     | DS_SQL_EPPricing_New     | DS_ida_eppricing                |
| ida_da_vwParams                         | Copy                     | DS_SQL_DAGroup           | DS_ida_da_vwParams              |
| ida_DA_Group_vw_EP_Inventory            | Copy                     | DS_SQL_DAGroup           | DS_ida_DA_Group_vw_EP_Inventory |
| ida_Inventory                           | Copy                     | PriceFx_DB               | DS_ida_Inventory                |
| LKP_GetConfigValues                     | Lookup                   | not surfaced in metadata | not surfaced in metadata        |
| Delete Old dbo table rows               | Script                   | not surfaced in metadata | not surfaced in metadata        |
| TableCleanUpAge                         | SetVariable              | not surfaced in metadata | not surfaced in metadata        |
| update failure information cleaning dbo | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata        |
| update failure information DAGrp Vw     | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata        |
| update failure information DAGrp Params | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata        |
| update failure information eppricing    | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata        |
| update failure information dol          | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata        |
| update failure information sims         | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata        |

## Evidence And Caveats

- Generated from saved ADF connector metadata.
- Linked-service secret details and raw activity output are intentionally not published.
- Missing source or target detail means the value was not surfaced in metadata, not that no dependency exists.
