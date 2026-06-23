# T2B-147 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-147`    |
| Platform/Product      | `SQL Server` |
| Database              | `VendorData` |
| Schema                | `gad`        |
| Object type scope     | `table`      |
| Object pages          | 4            |
| Link refresh pages    | 2            |
| Total planned entries | 8            |
| Validation status     | `passed`     |

## Object Pages

| Object                     | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                               |
| -------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | -------------------------------------------------------------------------------------------------- |
| `Campaign`                 | table | profiled, review-needed | 3          | 33      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / gad / Campaign`                 |
| `Campaign_Backup_06012021` | table | profiled, review-needed | 0          | 30      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / gad / Campaign_Backup_06012021` |
| `Campaign_delete`          | table | profiled, review-needed | 0          | 30      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / gad / Campaign_delete`          |
| `Conversion`               | table | profiled, review-needed | 1          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / gad / Conversion`               |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-147:publish
```
