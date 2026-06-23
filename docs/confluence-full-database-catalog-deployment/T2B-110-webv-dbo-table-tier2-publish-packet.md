# T2B-110 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-110`    |
| Platform/Product      | `SQL Server` |
| Database              | `WebV`       |
| Schema                | `dbo`        |
| Object type scope     | `table`      |
| Object pages          | 39           |
| Link refresh pages    | 2            |
| Total planned entries | 43           |
| Validation status     | `passed`     |

## Object Pages

| Object                                          | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                              |
| ----------------------------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | ----------------------------------------------------------------------------------------------------------------- |
| `Locations`                                     | table | profiled, review-needed | 0          | 49      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / WebV / dbo / Locations`                                     |
| `Locations_postStagingMerge`                    | table | profiled, review-needed | 0          | 49      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / WebV / dbo / Locations_postStagingMerge`                    |
| `mps_decode_vehtype`                            | table | profiled, review-needed | 0          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / WebV / dbo / mps_decode_vehtype`                            |
| `mps_decode_vinattribute`                       | table | profiled, review-needed | 0          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / WebV / dbo / mps_decode_vinattribute`                       |
| `mps_decode_vinbody`                            | table | profiled, review-needed | 0          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / WebV / dbo / mps_decode_vinbody`                            |
| `mps_decode_vinbody_stage`                      | table | profiled, review-needed | 0          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / WebV / dbo / mps_decode_vinbody_stage`                      |
| `mps_decode_vinmake`                            | table | profiled, review-needed | 0          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / WebV / dbo / mps_decode_vinmake`                            |
| `mps_decode_vinmfr`                             | table | profiled, review-needed | 0          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / WebV / dbo / mps_decode_vinmfr`                             |
| `mps_decode_vinmodel`                           | table | profiled, review-needed | 0          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / WebV / dbo / mps_decode_vinmodel`                           |
| `mps_decode_vintrim`                            | table | profiled, review-needed | 0          | 13      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / WebV / dbo / mps_decode_vintrim`                            |
| `veh_acquired_by`                               | table | profiled, review-needed | 0          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / WebV / dbo / veh_acquired_by`                               |
| `veh_exterior_color`                            | table | profiled, review-needed | 0          | 23      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / WebV / dbo / veh_exterior_color`                            |
| `veh_fuel_type`                                 | table | profiled, review-needed | 0          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / WebV / dbo / veh_fuel_type`                                 |
| `veh_interior_color`                            | table | profiled, review-needed | 0          | 22      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / WebV / dbo / veh_interior_color`                            |
| `veh_inventory`                                 | table | profiled, review-needed | 0          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / WebV / dbo / veh_inventory`                                 |
| `veh_inventory_release`                         | table | profiled, review-needed | 0          | 32      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / WebV / dbo / veh_inventory_release`                         |
| `veh_inventory_status`                          | table | profiled, review-needed | 0          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / WebV / dbo / veh_inventory_status`                          |
| `veh_Loc_Account`                               | table | profiled, review-needed | 0          | 22      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / WebV / dbo / veh_Loc_Account`                               |
| `veh_Loc_Account_postStagingMerge`              | table | profiled, review-needed | 0          | 22      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / WebV / dbo / veh_Loc_Account_postStagingMerge`              |
| `veh_Loc_Make`                                  | table | profiled, review-needed | 0          | 21      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / WebV / dbo / veh_Loc_Make`                                  |
| `veh_Loc_Make_postStagingMerge`                 | table | profiled, review-needed | 0          | 21      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / WebV / dbo / veh_Loc_Make_postStagingMerge`                 |
| `veh_Loc_Model`                                 | table | profiled, review-needed | 0          | 22      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / WebV / dbo / veh_Loc_Model`                                 |
| `veh_Loc_Model_Number`                          | table | profiled, review-needed | 0          | 24      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / WebV / dbo / veh_Loc_Model_Number`                          |
| `veh_Loc_Model_Number_postStagingMerge`         | table | profiled, review-needed | 0          | 24      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / WebV / dbo / veh_Loc_Model_Number_postStagingMerge`         |
| `veh_Loc_Model_postStagingMerge`                | table | profiled, review-needed | 0          | 22      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / WebV / dbo / veh_Loc_Model_postStagingMerge`                |
| `veh_Loc_Series`                                | table | profiled, review-needed | 0          | 21      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / WebV / dbo / veh_Loc_Series`                                |
| `veh_Loc_Series_postStagingMerge`               | table | profiled, review-needed | 0          | 21      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / WebV / dbo / veh_Loc_Series_postStagingMerge`               |
| `veh_order`                                     | table | profiled, review-needed | 0          | 117     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / WebV / dbo / veh_order`                                     |
| `veh_order_addtl_invoice_item`                  | table | profiled, review-needed | 0          | 19      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / WebV / dbo / veh_order_addtl_invoice_item`                  |
| `veh_order_addtl_invoice_item_postStagingMerge` | table | profiled, review-needed | 0          | 19      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / WebV / dbo / veh_order_addtl_invoice_item_postStagingMerge` |
| `veh_order_dealer_add`                          | table | profiled, review-needed | 0          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / WebV / dbo / veh_order_dealer_add`                          |
| `veh_order_dealer_add_postStagingMerge`         | table | profiled, review-needed | 0          | 25      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / WebV / dbo / veh_order_dealer_add_postStagingMerge`         |
| `veh_order_option`                              | table | profiled, review-needed | 0          | 24      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / WebV / dbo / veh_order_option`                              |
| `veh_order_option_postStagingMerge`             | table | profiled, review-needed | 0          | 24      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / WebV / dbo / veh_order_option_postStagingMerge`             |
| `veh_order_postStagingMerge`                    | table | profiled, review-needed | 0          | 117     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / WebV / dbo / veh_order_postStagingMerge`                    |
| `veh_process_code`                              | table | profiled, review-needed | 0          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / WebV / dbo / veh_process_code`                              |
| `veh_source`                                    | table | profiled, review-needed | 0          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / WebV / dbo / veh_source`                                    |
| `veh_trim`                                      | table | profiled, review-needed | 0          | 20      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / WebV / dbo / veh_trim`                                      |
| `vw_Dim_Inventory_Vehicle_Staging`              | table | profiled, review-needed | 0          | 71      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / WebV / dbo / vw_Dim_Inventory_Vehicle_Staging`              |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-110:publish
```
