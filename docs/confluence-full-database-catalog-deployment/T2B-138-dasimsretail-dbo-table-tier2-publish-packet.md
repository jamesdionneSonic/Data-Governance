# T2B-138 Tier 2 Batch Publish Packet

## Purpose

This packet prepares a dry-run publish package for the next queued Tier 2 batch
from `docs/DATABASE_CATALOG_TIER2_BATCH_STRATEGY.md`.

It does not publish to Confluence and it does not clean up, archive, delete, or
move pages.

## Recommendation

Ready for review. Live publish requires explicit approval.

## Scope

| Signal                | Value          |
| --------------------- | -------------- |
| Batch                 | `T2B-138`      |
| Platform/Product      | `SQL Server`   |
| Database              | `DASimsRetail` |
| Schema                | `dbo`          |
| Object type scope     | `table`        |
| Object pages          | 4              |
| Link refresh pages    | 2              |
| Total planned entries | 8              |
| Validation status     | `passed`       |

## Object Pages

| Object                        | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                    |
| ----------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | ------------------------------------------------------------------------------------------------------- |
| `dm_cora_account_staging`     | table | profiled, review-needed | 1          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / DASimsRetail / dbo / dm_cora_account_staging`     |
| `GLJEDetail_Cur_Staging`      | table | profiled, review-needed | 0          | 33      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / DASimsRetail / dbo / GLJEDetail_Cur_Staging`      |
| `vehicle_staging`             | table | profiled, review-needed | 1          | 136     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / DASimsRetail / dbo / vehicle_staging`             |
| `VehicleSalesCurrent_Staging` | table | profiled, review-needed | 0          | 228     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / DASimsRetail / dbo / VehicleSalesCurrent_Staging` |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-138:publish
```
