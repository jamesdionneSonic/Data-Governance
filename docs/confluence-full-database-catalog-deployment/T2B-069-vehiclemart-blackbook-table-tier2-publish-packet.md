# T2B-069 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-069`     |
| Platform/Product      | `SQL Server`  |
| Database              | `VehicleMart` |
| Schema                | `BlackBook`   |
| Object type scope     | `table`       |
| Object pages          | 4             |
| Link refresh pages    | 2             |
| Total planned entries | 8             |
| Validation status     | `passed`      |

## Object Pages

| Object                | Type  | Tags                                     | Downstream | Columns | Confidence | Path                                                                                                 |
| --------------------- | ----- | ---------------------------------------- | ---------- | ------- | ---------- | ---------------------------------------------------------------------------------------------------- |
| `AutoTraderOutputStg` | table | profiled, lineage-hotspot, review-needed | 0          | 46      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / BlackBook / AutoTraderOutputStg` |
| `CarfaxOutputStg`     | table | profiled, review-needed                  | 0          | 46      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / BlackBook / CarfaxOutputStg`     |
| `DimMMY`              | table | profiled, review-needed                  | 0          | 13      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / BlackBook / DimMMY`              |
| `DimUVC`              | table | high-use, profiled, review-needed        | 0          | 21      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / BlackBook / DimUVC`              |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-069:publish
```
