# T2B-215 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-215`    |
| Platform/Product      | `SQL Server` |
| Database              | `VendorData` |
| Schema                | `Google`     |
| Object type scope     | `table`      |
| Object pages          | 4            |
| Link refresh pages    | 2            |
| Total planned entries | 8            |
| Validation status     | `passed`     |

## Object Pages

| Object                | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                             |
| --------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | ------------------------------------------------------------------------------------------------ |
| `AppearanceDaily`     | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / Google / AppearanceDaily`     |
| `DevicesCountryDaily` | table | profiled, review-needed | 0          | 20      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / Google / DevicesCountryDaily` |
| `PagesDaily`          | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / Google / PagesDaily`          |
| `QueryDaily`          | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / Google / QueryDaily`          |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-215:publish
```
