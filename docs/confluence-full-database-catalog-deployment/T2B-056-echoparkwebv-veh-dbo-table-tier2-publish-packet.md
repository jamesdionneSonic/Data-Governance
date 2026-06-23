# T2B-056 Tier 2 Batch Publish Packet

## Purpose

This packet prepares a dry-run publish package for the next queued Tier 2 batch
from `docs/DATABASE_CATALOG_TIER2_BATCH_STRATEGY.md`.

It does not publish to Confluence and it does not clean up, archive, delete, or
move pages.

## Recommendation

Ready for review. Live publish requires explicit approval.

## Scope

| Signal                | Value              |
| --------------------- | ------------------ |
| Batch                 | `T2B-056`          |
| Platform/Product      | `SQL Server`       |
| Database              | `echoparkwebv_veh` |
| Schema                | `dbo`              |
| Object type scope     | `table`            |
| Object pages          | 29                 |
| Link refresh pages    | 2                  |
| Total planned entries | 33                 |
| Validation status     | `passed`           |

## Object Pages

| Object                         | Type  | Tags                              | Downstream | Columns | Confidence | Path                                                                                                         |
| ------------------------------ | ----- | --------------------------------- | ---------- | ------- | ---------- | ------------------------------------------------------------------------------------------------------------ |
| `LOCATIONS`                    | table | profiled, review-needed           | 1          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / echoparkwebv_veh / dbo / LOCATIONS`                    |
| `mps_decode_vehtype`           | table | profiled, review-needed           | 0          | 4       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / echoparkwebv_veh / dbo / mps_decode_vehtype`           |
| `mps_decode_vinattribute`      | table | profiled, review-needed           | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / echoparkwebv_veh / dbo / mps_decode_vinattribute`      |
| `mps_decode_vinbody`           | table | profiled, review-needed           | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / echoparkwebv_veh / dbo / mps_decode_vinbody`           |
| `mps_decode_vinbody_stage`     | table | profiled, review-needed           | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / echoparkwebv_veh / dbo / mps_decode_vinbody_stage`     |
| `mps_decode_vinmake`           | table | profiled, review-needed           | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / echoparkwebv_veh / dbo / mps_decode_vinmake`           |
| `mps_decode_vinmfr`            | table | profiled, review-needed           | 0          | 6       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / echoparkwebv_veh / dbo / mps_decode_vinmfr`            |
| `mps_decode_vinmodel`          | table | profiled, review-needed           | 0          | 4       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / echoparkwebv_veh / dbo / mps_decode_vinmodel`          |
| `mps_decode_vintrim`           | table | profiled, review-needed           | 0          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / echoparkwebv_veh / dbo / mps_decode_vintrim`           |
| `veh_acquired_by`              | table | profiled, review-needed           | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / echoparkwebv_veh / dbo / veh_acquired_by`              |
| `veh_exterior_color`           | table | profiled, review-needed           | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / echoparkwebv_veh / dbo / veh_exterior_color`           |
| `veh_fuel_type`                | table | profiled, review-needed           | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / echoparkwebv_veh / dbo / veh_fuel_type`                |
| `veh_interior_color`           | table | profiled, review-needed           | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / echoparkwebv_veh / dbo / veh_interior_color`           |
| `veh_inventory`                | table | high-use, profiled, review-needed | 0          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / echoparkwebv_veh / dbo / veh_inventory`                |
| `veh_inventory_option`         | table | profiled, review-needed           | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / echoparkwebv_veh / dbo / veh_inventory_option`         |
| `veh_loc_account`              | table | profiled, review-needed           | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / echoparkwebv_veh / dbo / veh_loc_account`              |
| `veh_loc_make`                 | table | profiled, review-needed           | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / echoparkwebv_veh / dbo / veh_loc_make`                 |
| `veh_loc_model`                | table | profiled, review-needed           | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / echoparkwebv_veh / dbo / veh_loc_model`                |
| `veh_loc_model_number`         | table | profiled, review-needed           | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / echoparkwebv_veh / dbo / veh_loc_model_number`         |
| `veh_loc_series`               | table | profiled, review-needed           | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / echoparkwebv_veh / dbo / veh_loc_series`               |
| `veh_option`                   | table | profiled, review-needed           | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / echoparkwebv_veh / dbo / veh_option`                   |
| `veh_order`                    | table | profiled, review-needed           | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / echoparkwebv_veh / dbo / veh_order`                    |
| `veh_order_addtl_invoice_item` | table | profiled, review-needed           | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / echoparkwebv_veh / dbo / veh_order_addtl_invoice_item` |
| `veh_order_dealer_add`         | table | profiled, review-needed           | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / echoparkwebv_veh / dbo / veh_order_dealer_add`         |
| `veh_order_option`             | table | profiled, review-needed           | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / echoparkwebv_veh / dbo / veh_order_option`             |
| `veh_process_code`             | table | profiled, review-needed           | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / echoparkwebv_veh / dbo / veh_process_code`             |
| `veh_source`                   | table | profiled, review-needed           | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / echoparkwebv_veh / dbo / veh_source`                   |
| `veh_trim`                     | table | profiled, review-needed           | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / echoparkwebv_veh / dbo / veh_trim`                     |
| `veh_vehicle`                  | table | profiled, review-needed           | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / echoparkwebv_veh / dbo / veh_vehicle`                  |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-056:publish
```
