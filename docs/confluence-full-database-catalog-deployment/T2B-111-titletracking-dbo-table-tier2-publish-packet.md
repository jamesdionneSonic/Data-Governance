# T2B-111 Tier 2 Batch Publish Packet

## Purpose

This packet prepares a dry-run publish package for the next queued Tier 2 batch
from `docs/DATABASE_CATALOG_TIER2_BATCH_STRATEGY.md`.

It does not publish to Confluence and it does not clean up, archive, delete, or
move pages.

## Recommendation

Ready for review. Live publish requires explicit approval.

## Scope

| Signal                | Value           |
| --------------------- | --------------- |
| Batch                 | `T2B-111`       |
| Platform/Product      | `SQL Server`    |
| Database              | `TitleTracking` |
| Schema                | `dbo`           |
| Object type scope     | `table`         |
| Object pages          | 4               |
| Link refresh pages    | 2               |
| Total planned entries | 8               |
| Validation status     | `passed`        |

## Object Pages

| Object                      | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                   |
| --------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | ------------------------------------------------------------------------------------------------------ |
| `FactInventoryTitle`        | table | profiled, review-needed | 0          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / TitleTracking / dbo / FactInventoryTitle`        |
| `FactTitle`                 | table | profiled, review-needed | 0          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / TitleTracking / dbo / FactTitle`                 |
| `TitleStatus_staging`       | table | profiled, review-needed | 0          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / TitleTracking / dbo / TitleStatus_staging`       |
| `TitleStatus_staging_sonic` | table | profiled, review-needed | 0          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / TitleTracking / dbo / TitleStatus_staging_sonic` |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-111:publish
```
