# T2B-171 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-171`    |
| Platform/Product      | `SQL Server` |
| Database              | `StagingDB`  |
| Schema                | `wrk`        |
| Object type scope     | `table`      |
| Object pages          | 2            |
| Link refresh pages    | 2            |
| Total planned entries | 6            |
| Validation status     | `passed`     |

## Object Pages

| Object                            | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                     |
| --------------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | -------------------------------------------------------------------------------------------------------- |
| `Domain_Missing_VINS_DIM_Vehicle` | table | profiled, review-needed | 1          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / wrk / Domain_Missing_VINS_DIM_Vehicle` |
| `Missing_VINS_Vehicles`           | table | profiled, review-needed | 0          | 33      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / wrk / Missing_VINS_Vehicles`           |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-171:publish
```
