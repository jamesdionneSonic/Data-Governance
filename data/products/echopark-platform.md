---
name: EchoPark Platform
product_id: product-echopark-platform
version: 1.0.0
status: published
domain: EchoPark Retail Platform
owner: Data Engineering
steward: Data Engineering
assets:
  - V1-SSIS25-01,
    11040.SSISDB.EPBlackBookandChrome.OnDemandRun.EPChrome_OnDemand.dtsx
  - V1-SSIS25-01, 11040.SSISDB.EPPricingDataLoad.EPChrome.EPChrome.dtsx
  - V1-SSIS25-01,
    11040.SSISDB.EPVehicleNewDataLoad.EPNewVehicle.EPNewVehicle_Chrome.dtsx
  - V1-SSIS25-01, 11040.SSISDB.EPPricingDataLoad.EPMaster.EPMaster.dtsx
  - V1-SQL-03.SIMSEP.dbo.Book
  - L1-5FSQL-01.ETL_Staging.dbo.SIMSEPVehicleInventory
  - 206.22.183.248.echoparkwebv_veh.dbo.veh_inventory
  - L1-DWASQL-02,12010.StagingDB.stage.webVEP_veh_inventory
  - V1-SSIS25-01,
    11040.SSISDB.EPPricingDataLoad.SourceFileImport.SourceFileImport.dtsx
  - V1-SQL-03.SIMS6200_EP.dbo.Vehicle_Pricing
  - L1-DWASQL-02,12010.StagingDB.dbo.StgSIMSEPVehicleInventory
  - V1-SQL-03.SIMS6200_EP.dbo.Vehicle_Inventory
  - V1-SQL-03.SIMS6200_EP.dbo.Vehicle
  - V1-SQL-03.SIMS6200_EP.dbo.STATUS
  - V1-SSIS25-01, 11040.SSISDB.WebV.Daily - WebV -
    Inventory_Group.WebV_EP_Veh_Inventory.dtsx
sla: {}
tags:
  - echopark
  - ep
  - inventory
  - pricing
  - platform
certified: false
certified_by: null
certification_date: null
trust_level: lineage-documented
consumers:
  - EchoPark operations
  - EchoPark sales reporting
  - Inventory/pricing users
  - GEC reporting
output_port:
  type: lineage-documented asset bundle
  location: StagingDB, ETL_Staging, webvEP, echoparkwebv_veh, SIMS6200_EP
  format: SQL Server / SSIS metadata
created_at: 2026-06-17
last_updated: 2026-06-17
---

# EchoPark Platform

## Plain-English Summary

EchoPark Platform groups EchoPark vehicle, inventory, pricing, web, CRM, and GEC reporting evidence. The lineage package shows EchoPark-specific databases/tables plus SSIS folders for EP vehicle, pricing, and GEC data movement.

If EchoPark Platform data is unavailable or stale, EchoPark inventory, pricing, vehicle, CRM, and GEC reporting can be impacted.

## Product Domain

| Field                     | Value                    |
| ------------------------- | ------------------------ |
| Product                   | EchoPark Platform        |
| Domain                    | EchoPark Retail Platform |
| Evidence strength         | Strong catalog evidence  |
| Catalog objects matched   | 528                      |
| SSIS packages matched     | 107                      |
| Runtime package version   | 2026.6.13-1              |
| Runtime package generated | 2026-06-13T23:31:32.400Z |

## What This Product Appears To Do

EchoPark Platform groups EchoPark vehicle, inventory, pricing, web, CRM, and GEC reporting evidence. The lineage package shows EchoPark-specific databases/tables plus SSIS folders for EP vehicle, pricing, and GEC data movement.

For support and upgrade planning, treat this product as a bundle of warehouse tables/views/procedures, SSIS packages, and external-feed artifacts rather than a single table. The highest-impact assets below are prioritized by lineage connectivity and available column metadata.

## Lineage Scope

### Object Types

| Type      | Count |
| --------- | ----- |
| table     | 257   |
| dataset   | 148   |
| package   | 107   |
| procedure | 13    |
| synonym   | 2     |
| view      | 1     |

### Main Databases

| Database         | Matched Objects |
| ---------------- | --------------- |
| StagingDB        | 116             |
| ETL_Staging      | 45              |
| webvEP           | 30              |
| echoparkwebv_veh | 29              |
| SIMS6200_EP      | 24              |
| VendorData       | 15              |
| DA_SIMS_EP       | 7               |
| Sonic_DW         | 5               |
| SIMSEP           | 1               |
| VehicleMart      | 1               |

### SSIS Folders

| SSIS Folder               | Matched Objects |
| ------------------------- | --------------- |
| EPPricingDataLoad         | 59              |
| Decode                    | 17              |
| Vehicle                   | 17              |
| SimsInventory             | 14              |
| Location                  | 13              |
| EPVehicleNewDataLoad      | 11              |
| Order                     | 10              |
| Inventory                 | 9               |
| EPBlackBookandChrome      | 6               |
| FUEL                      | 4               |
| WebV                      | 4               |
| EleadEchoParkGECReportWTD | 3               |

### Folder Catalog Matches

| Folder                    | Packages | Supporting Context Records | Evidence Path                 |
| ------------------------- | -------- | -------------------------- | ----------------------------- |
| EPVehicleNewDataLoad      | 6        | 5                          | ssis/f/f-58af3d3f1c/README.md |
| EleadEchoParkGECReportWTD | 2        | 1                          | ssis/f/f-5a9029217e/README.md |
| EPBlackBookandChrome      | 3        | 3                          | ssis/f/f-72204210bc/README.md |
| EPPricingDataLoad         | 45       | 14                         | ssis/f/f-7f3ea690f9/README.md |

## Important Assets To Start With

| Asset                                                                                       | Type    | Upstream | Downstream | Columns | Confidence |
| ------------------------------------------------------------------------------------------- | ------- | -------- | ---------- | ------- | ---------- |
| `V1-SSIS25-01, 11040.SSISDB.EPBlackBookandChrome.OnDemandRun.EPChrome_OnDemand.dtsx`        | package | 34       | 32         | 0       | high       |
| `V1-SSIS25-01, 11040.SSISDB.EPPricingDataLoad.EPChrome.EPChrome.dtsx`                       | package | 34       | 32         | 0       | high       |
| `V1-SSIS25-01, 11040.SSISDB.EPVehicleNewDataLoad.EPNewVehicle.EPNewVehicle_Chrome.dtsx`     | package | 34       | 32         | 0       | high       |
| `V1-SSIS25-01, 11040.SSISDB.EPPricingDataLoad.EPMaster.EPMaster.dtsx`                       | package | 0        | 34         | 0       | very_high  |
| `V1-SQL-03.SIMSEP.dbo.Book`                                                                 | table   | 0        | 24         | 30      | very_high  |
| `L1-5FSQL-01.ETL_Staging.dbo.SIMSEPVehicleInventory`                                        | table   | 12       | 1          | 80      | very_high  |
| `206.22.183.248.echoparkwebv_veh.dbo.veh_inventory`                                         | table   | 0        | 12         | 11      | very_high  |
| `L1-DWASQL-02,12010.StagingDB.stage.webVEP_veh_inventory`                                   | table   | 4        | 4          | 165     | very_high  |
| `V1-SSIS25-01, 11040.SSISDB.EPPricingDataLoad.SourceFileImport.SourceFileImport.dtsx`       | package | 5        | 6          | 0       | high       |
| `V1-SQL-03.SIMS6200_EP.dbo.Vehicle_Pricing`                                                 | table   | 0        | 10         | 38      | very_high  |
| `L1-DWASQL-02,12010.StagingDB.dbo.StgSIMSEPVehicleInventory`                                | table   | 8        | 0          | 129     | very_high  |
| `V1-SQL-03.SIMS6200_EP.dbo.Vehicle_Inventory`                                               | table   | 0        | 8          | 127     | very_high  |
| `V1-SQL-03.SIMS6200_EP.dbo.Vehicle`                                                         | table   | 0        | 10         | 22      | very_high  |
| `V1-SQL-03.SIMS6200_EP.dbo.STATUS`                                                          | table   | 0        | 10         | 10      | very_high  |
| `V1-SSIS25-01, 11040.SSISDB.WebV.Daily - WebV - Inventory_Group.WebV_EP_Veh_Inventory.dtsx` | package | 3        | 7          | 0       | very_high  |

## SSIS / Orchestration Evidence

| Package                                                          | Upstream | Downstream | Evidence Path                                                                                                |
| ---------------------------------------------------------------- | -------- | ---------- | ------------------------------------------------------------------------------------------------------------ |
| `EPBlackBookandChrome.OnDemandRun.EPChrome_OnDemand.dtsx`        | 34       | 32         | servers/V1-SSIS25-01,\_11040/ssis_packages/EPBlackBookandChrome/OnDemandRun/EPChrome_OnDemand.dtsx.md        |
| `EPPricingDataLoad.EPChrome.EPChrome.dtsx`                       | 34       | 32         | servers/V1-SSIS25-01,\_11040/ssis_packages/EPPricingDataLoad/EPChrome/EPChrome.dtsx.md                       |
| `EPVehicleNewDataLoad.EPNewVehicle.EPNewVehicle_Chrome.dtsx`     | 34       | 32         | servers/V1-SSIS25-01,\_11040/ssis_packages/EPVehicleNewDataLoad/EPNewVehicle/EPNewVehicle_Chrome.dtsx.md     |
| `EPPricingDataLoad.EPMaster.EPMaster.dtsx`                       | 0        | 34         | servers/V1-SSIS25-01,\_11040/ssis_packages/EPPricingDataLoad/EPMaster/EPMaster.dtsx.md                       |
| `EPPricingDataLoad.SourceFileImport.SourceFileImport.dtsx`       | 5        | 6          | servers/V1-SSIS25-01,\_11040/ssis_packages/EPPricingDataLoad/SourceFileImport/SourceFileImport.dtsx.md       |
| `WebV.Daily - WebV - Inventory_Group.WebV_EP_Veh_Inventory.dtsx` | 3        | 7          | servers/V1-SSIS25-01,_11040/ssis_packages/WebV/Daily_-_WebV_-\_Inventory_Group/WebV_EP_Veh_Inventory.dtsx.md |
| `EPPricingDataLoad.EPBlackBookAPI.EPBlackBookAPI.dtsx`           | 4        | 5          | servers/V1-SSIS25-01,\_11040/ssis_packages/EPPricingDataLoad/EPBlackBookAPI/EPBlackBookAPI.dtsx.md           |
| `Inventory.WebVEP.webvEP_Veh_Inventory.dtsx`                     | 3        | 6          | servers/V1-SSIS25-01,\_11040/ssis_packages/Inventory/WebVEP/webvEP_Veh_Inventory.dtsx.md                     |
| `KPI.DataLoad.KPI_EleadGEC.dtsx`                                 | 3        | 6          | servers/V1-SSIS25-01,\_11040/ssis_packages/KPI/DataLoad/KPI_EleadGEC.dtsx.md                                 |
| `Decode.WebVEP.WebVEP_mps_decode_Grp.dtsx`                       | 0        | 8          | servers/V1-SSIS25-01,\_11040/ssis_packages/Decode/WebVEP/WebVEP_mps_decode_Grp.dtsx.md                       |
| `EPBlackBookandChrome.OnDemandRun.EPBlackBook_Ondemand.dtsx`     | 4        | 4          | servers/V1-SSIS25-01,\_11040/ssis_packages/EPBlackBookandChrome/OnDemandRun/EPBlackBook_Ondemand.dtsx.md     |
| `EPPricingDataLoad.EPBlackBook.EPBlackBook.dtsx`                 | 4        | 4          | servers/V1-SSIS25-01,\_11040/ssis_packages/EPPricingDataLoad/EPBlackBook/EPBlackBook.dtsx.md                 |
| `Order.WebVEP.WebVEP_Veh_order.dtsx`                             | 3        | 5          | servers/V1-SSIS25-01,\_11040/ssis_packages/Order/WebVEP/WebVEP_Veh_order.dtsx.md                             |
| `Vehicle.WebVEP.WebVEP_Veh_Vehicle_Grp.dtsx`                     | 0        | 8          | servers/V1-SSIS25-01,\_11040/ssis_packages/Vehicle/WebVEP/WebVEP_Veh_Vehicle_Grp.dtsx.md                     |
| `Decode.WebVEP.WebVEP_mps_decode_vehtype.dtsx`                   | 3        | 4          | servers/V1-SSIS25-01,\_11040/ssis_packages/Decode/WebVEP/WebVEP_mps_decode_vehtype.dtsx.md                   |

## Consumers And Support Impact

- EchoPark operations
- EchoPark sales reporting
- Inventory/pricing users
- GEC reporting

## Known Gaps / Caveats

- Some EchoPark objects are identified by `EP`, `webvEP`, or EchoPark naming rather than one single product prefix.

## Evidence

- Runtime package: `sonic-data-lineage-runtime` version `2026.6.13-1`, hash `514712d9e99a5e3c8e35dcb5f8fb3f74c44e98babcab3585f8a3e1957250aaff`
- Registry: `registry/canonical-objects.jsonl`
- SSIS folder index: `ssis/README.md`
- Generated from local lineage package on 2026-06-17
