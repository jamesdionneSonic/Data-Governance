# T2B-070 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-070`    |
| Platform/Product      | `SQL Server` |
| Database              | `VendorData` |
| Schema                | `callrevu`   |
| Object type scope     | `table`      |
| Object pages          | 3            |
| Link refresh pages    | 2            |
| Total planned entries | 7            |
| Validation status     | `passed`     |

## Object Pages

| Object                        | Type  | Tags                              | Downstream | Columns | Confidence | Path                                                                                                       |
| ----------------------------- | ----- | --------------------------------- | ---------- | ------- | ---------- | ---------------------------------------------------------------------------------------------------------- |
| `CallRevuCallDetail`          | table | high-use, profiled, review-needed | 6          | 70      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / callrevu / CallRevuCallDetail`          |
| `CallRevuDeptUpdate`          | table | profiled, review-needed           | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / callrevu / CallRevuDeptUpdate`          |
| `CallRevuDeptUpdate_20230831` | table | profiled, review-needed           | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / callrevu / CallRevuDeptUpdate_20230831` |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-070:publish
```
