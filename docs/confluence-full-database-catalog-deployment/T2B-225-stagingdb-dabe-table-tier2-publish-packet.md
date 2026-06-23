# T2B-225 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-225`    |
| Platform/Product      | `SQL Server` |
| Database              | `StagingDB`  |
| Schema                | `dabe`       |
| Object type scope     | `table`      |
| Object pages          | 2            |
| Link refresh pages    | 2            |
| Total planned entries | 6            |
| Validation status     | `passed`     |

## Object Pages

| Object                 | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                           |
| ---------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | ---------------------------------------------------------------------------------------------- |
| `vehiclesales_staging` | table | profiled, review-needed | 0          | 244     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dabe / vehiclesales_staging` |
| `weowe_staging`        | table | profiled, review-needed | 0          | 29      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dabe / weowe_staging`        |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-225:publish
```
