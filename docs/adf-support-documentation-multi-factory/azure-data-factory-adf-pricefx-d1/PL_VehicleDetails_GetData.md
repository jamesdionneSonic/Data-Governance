# PL_VehicleDetails_GetData

Generated: 2026-06-29T10:58:59.611Z
ADF factory: `adf-pricefx-d1`
Saved connector: `azure-data-factory-adf-pricefx-d1`
Source profile artifact: `data/markdown/_runtime/profile-runs/azure-data-factory-adf-pricefx-d1/2026-06-29T10-49-10-481Z-ea190808-2542-4272-b648-bcc818870f5e.json`

## Plain-English Summary

PL_VehicleDetails_GetData is an ADF child pipeline in adf-pricefx-d1. If PL_VehicleDetails_GetData fails or becomes stale, dependent ADF loads, files, datasets, or downstream reporting may be incomplete until the failed run is diagnosed and rerun through the approved parent path. Start troubleshooting by checking the parent pipeline that called PL_VehicleDetails_GetData; do not start the child with blank operational parameters.

## At a Glance

| Field                 | Value                                                                                                                                                                                    |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | ADF                                                                                                                                                                                      |
| Asset type            | Pipeline                                                                                                                                                                                 |
| Native path           | `/subscriptions/bee9b611-da99-4cfc-9fb7-50f1359e5ca2/resourceGroups/rg-data-warehouse-prod/providers/Microsoft.DataFactory/factories/adf-PriceFx-D1/pipelines/PL_VehicleDetails_GetData` |
| Support role          | child pipeline                                                                                                                                                                           |
| Business process      | adf-pricefx-d1 pipeline execution                                                                                                                                                        |
| Primary source        | DS_SQL_SIMS_EP, DS_SQL_DAGroup, DS_SQL_PriceFX, DS_SQL_vehiclemart                                                                                                                       |
| Primary target/output | DS_pricefx_tmp_vehciledetails_sims, DS_pricefx_tmp_vehicledetails_dagroup, DS_pricefx_vehicledetails, DS_pricefx_tmp_vehicledetails_vmart_blackbook_dimuvc                               |
| Schedule or trigger   | not directly triggered                                                                                                                                                                   |
| Runtime/usage signal  | Metadata profiled at 2026-06-29T10:49:10.426Z                                                                                                                                            |
| Status signal         | metadata available                                                                                                                                                                       |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-pricefx-d1/2026-06-29T10-49-10-481Z-ea190808-2542-4272-b648-bcc818870f5e.json`                                               |

## Business Use

This pipeline supports the adf-pricefx-d1 ADF process. Its available metadata shows 27 activity step(s), 0 child pipeline call(s), 4 source dataset reference(s), and 4 target dataset reference(s).

## Support Checks

1. Check the parent pipeline that called PL_VehicleDetails_GetData; do not start the child with blank operational parameters.
2. Confirm parameters are supplied by the parent, trigger, or documented default path: OpProcessExecutionID, OpBatchID, OpProcessExecutionStatusID, UserName.
3. Confirm source datasets are available: DS_SQL_SIMS_EP, DS_SQL_DAGroup, DS_SQL_PriceFX, DS_SQL_vehiclemart.
4. Confirm target datasets or child pipelines completed: DS_pricefx_tmp_vehciledetails_sims, DS_pricefx_tmp_vehicledetails_dagroup, DS_pricefx_vehicledetails, DS_pricefx_tmp_vehicledetails_vmart_blackbook_dimuvc.
5. If stored procedures are involved, validate process/audit logs before rerunning.

## Lineage And Dependencies

| Dependency type   | Values                                                                                                                                                                                                                 |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Parent pipelines  | PL_VehicleDetails_Master                                                                                                                                                                                               |
| Child pipelines   | none surfaced                                                                                                                                                                                                          |
| Source datasets   | DS_SQL_SIMS_EP, DS_SQL_DAGroup, DS_SQL_PriceFX, DS_SQL_vehiclemart                                                                                                                                                     |
| Target datasets   | DS_pricefx_tmp_vehciledetails_sims, DS_pricefx_tmp_vehicledetails_dagroup, DS_pricefx_vehicledetails, DS_pricefx_tmp_vehicledetails_vmart_blackbook_dimuvc                                                             |
| Stored procedures | [dbo].[usp_ADFInsertChildProcessExecutionLog], [dbo].[usp_UpdateProcessExecutionLogStatus], [dbo].[usp_CloseOutProcessExecutionLog], [dbo].[usp_UpdateProcessExecutionLog], [dbo].[usp_InsertProcessExecutionLogError] |

## Runtime Or Usage Signals

Use ADF run history for live status. This page is generated from metadata-profile evidence and should not be treated as a current run monitor.

## Technical Details

| Activity                                 | Type                     | Inputs                   | Outputs                                              |
| ---------------------------------------- | ------------------------ | ------------------------ | ---------------------------------------------------- |
| Get Child Process Parameters             | Lookup                   | not surfaced in metadata | not surfaced in metadata                             |
| If Incremental or historical load        | IfCondition              | not surfaced in metadata | not surfaced in metadata                             |
| Set vProcessExecutionID                  | SetVariable              | not surfaced in metadata | not surfaced in metadata                             |
| Set vProcessExecutionStatusID            | SetVariable              | not surfaced in metadata | not surfaced in metadata                             |
| Log Failure Status                       | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata                             |
| Set Process Complete Status              | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata                             |
| IncrementalDate                          | SetVariable              | not surfaced in metadata | not surfaced in metadata                             |
| IsHistoricalDataLoad                     | SetVariable              | not surfaced in metadata | not surfaced in metadata                             |
| LKP_GetConfigValues                      | Lookup                   | not surfaced in metadata | not surfaced in metadata                             |
| LKP_GetIncrementalDate                   | Lookup                   | not surfaced in metadata | not surfaced in metadata                             |
| update process execution log metrics     | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata                             |
| update failure information               | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata                             |
| cp_pricefx_vehicle_details_SIMS          | Copy                     | DS_SQL_SIMS_EP           | DS_pricefx_tmp_vehciledetails_sims                   |
| cp_pricefx_vehicle_details_DAGroup       | Copy                     | DS_SQL_DAGroup           | DS_pricefx_tmp_vehicledetails_dagroup                |
| cp_pricefx_vehicle_details               | Copy                     | DS_SQL_PriceFX           | DS_pricefx_vehicledetails                            |
| get vin sets                             | Lookup                   | not surfaced in metadata | not surfaced in metadata                             |
| For Each Batch of vins                   | ForEach                  | not surfaced in metadata | not surfaced in metadata                             |
| update failure information_truncates     | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata                             |
| update failure information tmp_sims      | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata                             |
| update failure information tmp_eppricing | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata                             |
| update failure information tmp_dagrp     | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata                             |
| update failure information vin lookup    | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata                             |
| cp_pricefx_vmart_blackbook_dimuvc        | Copy                     | DS_SQL_vehiclemart       | DS_pricefx_tmp_vehicledetails_vmart_blackbook_dimuvc |
| update failure information tmp_vmart_uvc | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata                             |
| Delete Old dbo table rows                | Script                   | not surfaced in metadata | not surfaced in metadata                             |
| TableCleanUpAge                          | SetVariable              | not surfaced in metadata | not surfaced in metadata                             |
| update failure information dbo cleanup   | SqlServerStoredProcedure | not surfaced in metadata | not surfaced in metadata                             |

## Evidence And Caveats

- Generated from saved ADF connector metadata.
- Linked-service secret details and raw activity output are intentionally not published.
- Missing source or target detail means the value was not surfaced in metadata, not that no dependency exists.
