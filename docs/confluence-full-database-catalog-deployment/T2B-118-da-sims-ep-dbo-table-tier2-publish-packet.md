# T2B-118 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-118`    |
| Platform/Product      | `SQL Server` |
| Database              | `DA_SIMS_EP` |
| Schema                | `dbo`        |
| Object type scope     | `table`      |
| Object pages          | 4            |
| Link refresh pages    | 2            |
| Total planned entries | 8            |
| Validation status     | `passed`     |

## Object Pages

| Object                               | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                         |
| ------------------------------------ | ----- | ----------------------- | ---------- | ------- | ---------- | ------------------------------------------------------------------------------------------------------------ |
| `EP_DA_PRICING`                      | table | profiled, review-needed | 1          | 48      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / DA_SIMS_EP / dbo / EP_DA_PRICING`                      |
| `Price_Recommendations_DuplicateRpt` | table | profiled, review-needed | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / DA_SIMS_EP / dbo / Price_Recommendations_DuplicateRpt` |
| `VehicleClassList`                   | table | profiled, review-needed | 1          | 4       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / DA_SIMS_EP / dbo / VehicleClassList`                   |
| `VW_AT_DMA_TO_DMA_DIST`              | table | profiled, review-needed | 0          | 4       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / DA_SIMS_EP / dbo / VW_AT_DMA_TO_DMA_DIST`              |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-118:publish
```
