# T2B-139 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-139`     |
| Platform/Product      | `SQL Server`  |
| Database              | `VehicleMart` |
| Schema                | `dbo`         |
| Object type scope     | `table`       |
| Object pages          | 3             |
| Link refresh pages    | 2             |
| Total planned entries | 7             |
| Validation status     | `passed`      |

## Object Pages

| Object                             | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                        |
| ---------------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | ----------------------------------------------------------------------------------------------------------- |
| `AutoTrader_SF_New`                | table | profiled, review-needed | 0          | 38      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / dbo / AutoTrader_SF_New`                |
| `Carmax_SF_New`                    | table | profiled, review-needed | 0          | 67      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / dbo / Carmax_SF_New`                    |
| `vw_Dim_Inventory_Vehicle_Staging` | table | profiled, review-needed | 0          | 41      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / dbo / vw_Dim_Inventory_Vehicle_Staging` |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-139:publish
```
