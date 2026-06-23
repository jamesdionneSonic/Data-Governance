# T2B-170 Tier 2 Batch Publish Packet

## Purpose

This packet prepares a dry-run publish package for the next queued Tier 2 batch
from `docs/DATABASE_CATALOG_TIER2_BATCH_STRATEGY.md`.

It does not publish to Confluence and it does not clean up, archive, delete, or
move pages.

## Recommendation

Ready for review. Live publish requires explicit approval.

## Scope

| Signal                | Value         |
| --------------------- | ------------- |
| Batch                 | `T2B-170`     |
| Platform/Product      | `SQL Server`  |
| Database              | `ETL_Staging` |
| Schema                | `permsup`     |
| Object type scope     | `table`       |
| Object pages          | 13            |
| Link refresh pages    | 2             |
| Total planned entries | 17            |
| Validation status     | `passed`      |

## Object Pages

| Object               | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                              |
| -------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | ------------------------------------------------------------------------------------------------- |
| `veh_acquired_by`    | table | profiled, review-needed | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / permsup / veh_acquired_by`    |
| `veh_acquired_type`  | table | profiled, review-needed | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / permsup / veh_acquired_type`  |
| `veh_exterior_color` | table | profiled, review-needed | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / permsup / veh_exterior_color` |
| `veh_interior_color` | table | profiled, review-needed | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / permsup / veh_interior_color` |
| `veh_inventory`      | table | profiled, review-needed | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / permsup / veh_inventory`      |
| `veh_loc_make`       | table | profiled, review-needed | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / permsup / veh_loc_make`       |
| `veh_loc_model`      | table | profiled, review-needed | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / permsup / veh_loc_model`      |
| `veh_loc_series`     | table | profiled, review-needed | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / permsup / veh_loc_series`     |
| `veh_order`          | table | profiled, review-needed | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / permsup / veh_order`          |
| `veh_process_code`   | table | profiled, review-needed | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / permsup / veh_process_code`   |
| `veh_segment`        | table | profiled, review-needed | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / permsup / veh_segment`        |
| `veh_source`         | table | profiled, review-needed | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / permsup / veh_source`         |
| `veh_vehicle`        | table | profiled, review-needed | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / permsup / veh_vehicle`        |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-170:publish
```
