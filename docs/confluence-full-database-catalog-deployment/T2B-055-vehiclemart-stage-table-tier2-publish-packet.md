# T2B-055 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-055`     |
| Platform/Product      | `SQL Server`  |
| Database              | `VehicleMart` |
| Schema                | `Stage`       |
| Object type scope     | `table`       |
| Object pages          | 4             |
| Link refresh pages    | 2             |
| Total planned entries | 8             |
| Validation status     | `passed`      |

## Object Pages

| Object                    | Type  | Tags                              | Downstream | Columns | Confidence | Path                                                                                                 |
| ------------------------- | ----- | --------------------------------- | ---------- | ------- | ---------- | ---------------------------------------------------------------------------------------------------- |
| `AutoTrader_BBVinProList` | table | high-use, profiled, review-needed | 0          | 13      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / Stage / AutoTrader_BBVinProList` |
| `CarMaxSF_StagingOutput`  | table | profiled, review-needed           | 0          | 31      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / Stage / CarMaxSF_StagingOutput`  |
| `DimVehicle_VehicleMart`  | table | profiled, review-needed           | 0          | 6       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / Stage / DimVehicle_VehicleMart`  |
| `Vehicle`                 | table | high-use, profiled, review-needed | 2          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / Stage / Vehicle`                 |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-055:publish
```
