# T2B-062 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-062`    |
| Platform/Product      | `SQL Server` |
| Database              | `CBS`        |
| Schema                | `dbo`        |
| Object type scope     | `table`      |
| Object pages          | 3            |
| Link refresh pages    | 2            |
| Total planned entries | 7            |
| Validation status     | `passed`     |

## Object Pages

| Object               | Type  | Tags                                               | Downstream | Columns | Confidence | Path                                                                                  |
| -------------------- | ----- | -------------------------------------------------- | ---------- | ------- | ---------- | ------------------------------------------------------------------------------------- |
| `DealerDMSMapping`   | table | profiled, review-needed                            | 0          | 4       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / CBS / dbo / DealerDMSMapping`   |
| `ManheimPurchaseLog` | table | profiled, review-needed                            | 0          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / CBS / dbo / ManheimPurchaseLog` |
| `Template`           | table | high-use, profiled, lineage-hotspot, review-needed | 12         | 116     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / CBS / dbo / Template`           |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-062:publish
```
