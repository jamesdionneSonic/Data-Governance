# T2B-050 Tier 2 Batch Publish Packet

## Purpose

This packet prepares a dry-run publish package for the next queued Tier 2 batch
from `docs/DATABASE_CATALOG_TIER2_BATCH_STRATEGY.md`.

It does not publish to Confluence and it does not clean up, archive, delete, or
move pages.

## Recommendation

Ready for review. Live publish requires explicit approval.

## Scope

| Signal                | Value        |
| --------------------- | ------------ |
| Batch                 | `T2B-050`    |
| Platform/Product      | `SQL Server` |
| Database              | `DMS`        |
| Schema                | `dbo`        |
| Object type scope     | `table`      |
| Object pages          | 38           |
| Link refresh pages    | 2            |
| Total planned entries | 42           |
| Validation status     | `passed`     |

## Object Pages

| Object                                | Type  | Tags                                               | Downstream | Columns | Confidence | Path                                                                                                   |
| ------------------------------------- | ----- | -------------------------------------------------- | ---------- | ------- | ---------- | ------------------------------------------------------------------------------------------------------ |
| `appointments`                        | table | profiled, review-needed                            | 0          | 45      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / DMS / dbo / appointments`                        |
| `dm_cora_account`                     | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / DMS / dbo / dm_cora_account`                     |
| `gldept`                              | table | profiled, review-needed                            | 0          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / DMS / dbo / gldept`                              |
| `gljedetail_cur`                      | table | profiled, review-needed                            | 0          | 6       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / DMS / dbo / gljedetail_cur`                      |
| `glschedule`                          | table | profiled, review-needed                            | 0          | 6       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / DMS / dbo / glschedule`                          |
| `glschedulesetupreload`               | table | profiled, review-needed                            | 0          | 51      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / DMS / dbo / glschedulesetupreload`               |
| `labortype`                           | table | profiled, review-needed                            | 0          | 91      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / DMS / dbo / labortype`                           |
| `manufacturer`                        | table | profiled, review-needed                            | 0          | 45      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / DMS / dbo / manufacturer`                        |
| `opcodes`                             | table | high-use, profiled, review-needed                  | 0          | 50      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / DMS / dbo / opcodes`                             |
| `orgname`                             | table | profiled, review-needed                            | 0          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / DMS / dbo / orgname`                             |
| `partssales`                          | table | profiled, review-needed                            | 0          | 30      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / DMS / dbo / partssales`                          |
| `servicesalesclosed`                  | table | profiled, review-needed                            | 0          | 6       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / DMS / dbo / servicesalesclosed`                  |
| `servicesalesopen`                    | table | profiled, review-needed                            | 0          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / DMS / dbo / servicesalesopen`                    |
| `servicesalespartsclosed`             | table | profiled, review-needed                            | 0          | 48      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / DMS / dbo / servicesalespartsclosed`             |
| `ServiceVins_Staging`                 | table | profiled, review-needed                            | 0          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / DMS / dbo / ServiceVins_Staging`                 |
| `stg_WeOwe`                           | table | profiled, review-needed                            | 0          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / DMS / dbo / stg_WeOwe`                           |
| `tblperformance`                      | table | profiled, review-needed                            | 0          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / DMS / dbo / tblperformance`                      |
| `tblstatus`                           | table | profiled, review-needed                            | 0          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / DMS / dbo / tblstatus`                           |
| `technician`                          | table | profiled, review-needed                            | 0          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / DMS / dbo / technician`                          |
| `vehicle`                             | table | profiled, review-needed                            | 0          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / DMS / dbo / vehicle`                             |
| `vehiclesalescurrent`                 | table | high-use, profiled, review-needed                  | 0          | 271     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / DMS / dbo / vehiclesalescurrent`                 |
| `vsc_fiproducts_union_stage`          | table | profiled, review-needed                            | 0          | 222     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / DMS / dbo / vsc_fiproducts_union_stage`          |
| `vw_Dim_DMSCstImport_update_Inc`      | table | profiled, review-needed                            | 0          | 92      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / DMS / dbo / vw_Dim_DMSCstImport_update_Inc`      |
| `vw_Dim_Inventory_Vehicle_Staging`    | table | profiled, review-needed                            | 0          | 84      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / DMS / dbo / vw_Dim_Inventory_Vehicle_Staging`    |
| `vw_Dim_Sales_Vehicle_Staging_hist`   | table | profiled, review-needed                            | 0          | 32      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / DMS / dbo / vw_Dim_Sales_Vehicle_Staging_hist`   |
| `vw_Dim_Service_Vehicle_Staging_hist` | table | profiled, review-needed                            | 0          | 32      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / DMS / dbo / vw_Dim_Service_Vehicle_Staging_hist` |
| `vw_DMSVendor_Import`                 | table | profiled, review-needed                            | 0          | 61      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / DMS / dbo / vw_DMSVendor_Import`                 |
| `vw_Essbase_HR_OT_Stage`              | table | profiled, review-needed                            | 0          | 33      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / DMS / dbo / vw_Essbase_HR_OT_Stage`              |
| `vw_FactService_staging`              | table | profiled, review-needed                            | 0          | 38      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / DMS / dbo / vw_FactService_staging`              |
| `vw_Fuel_II_glaccountledger_INC`      | table | profiled, review-needed                            | 0          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / DMS / dbo / vw_Fuel_II_glaccountledger_INC`      |
| `vw_GPA_RateCap_SRC`                  | table | profiled, review-needed                            | 0          | 65      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / DMS / dbo / vw_GPA_RateCap_SRC`                  |
| `vw_PricingGrid_staging`              | table | profiled, review-needed                            | 0          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / DMS / dbo / vw_PricingGrid_staging`              |
| `vw_vsc_All`                          | table | profiled, review-needed                            | 0          | 65      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / DMS / dbo / vw_vsc_All`                          |
| `vw_vsc_fiproducts_union`             | table | profiled, review-needed                            | 0          | 222     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / DMS / dbo / vw_vsc_fiproducts_union`             |
| `vw_vscLender`                        | table | profiled, review-needed                            | 0          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / DMS / dbo / vw_vscLender`                        |
| `vwFireSummaryVSC`                    | table | profiled, review-needed                            | 0          | 63      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / DMS / dbo / vwFireSummaryVSC`                    |
| `vwFloorPlanDetailACV`                | table | profiled, review-needed                            | 0          | 35      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / DMS / dbo / vwFloorPlanDetailACV`                |
| `vwTitleTrackingVSC`                  | table | profiled, review-needed                            | 0          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / DMS / dbo / vwTitleTrackingVSC`                  |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-050:publish
```
