# T2B-063 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-063`     |
| Platform/Product      | `SQL Server`  |
| Database              | `VehicleMart` |
| Schema                | `Final`       |
| Object type scope     | `table`       |
| Object pages          | 4             |
| Link refresh pages    | 2             |
| Total planned entries | 8             |
| Validation status     | `passed`      |

## Object Pages

| Object                              | Type  | Tags                                               | Downstream | Columns | Confidence | Path                                                                                                           |
| ----------------------------------- | ----- | -------------------------------------------------- | ---------- | ------- | ---------- | -------------------------------------------------------------------------------------------------------------- |
| `DimCarMaxDealer`                   | table | profiled, review-needed                            | 0          | 30      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / Final / DimCarMaxDealer`                   |
| `ManheimVehicleRunList`             | table | profiled, review-needed                            | 0          | 91      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / Final / ManheimVehicleRunList`             |
| `ManheimVehicleRunList_Enhancement` | table | profiled, review-needed                            | 0          | 4       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / Final / ManheimVehicleRunList_Enhancement` |
| `Vehicle`                           | table | high-use, profiled, lineage-hotspot, review-needed | 5          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / Final / Vehicle`                           |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-063:publish
```
