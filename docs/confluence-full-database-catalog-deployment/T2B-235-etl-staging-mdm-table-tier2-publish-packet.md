# T2B-235 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-235`     |
| Platform/Product      | `SQL Server`  |
| Database              | `ETL_Staging` |
| Schema                | `mdm`         |
| Object type scope     | `table`       |
| Object pages          | 1             |
| Link refresh pages    | 2             |
| Total planned entries | 5             |
| Validation status     | `passed`      |

## Object Pages

| Object              | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                         |
| ------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | -------------------------------------------------------------------------------------------- |
| `SonicCustAll_Ver2` | table | profiled, review-needed | 0          | 307     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / mdm / SonicCustAll_Ver2` |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-235:publish
```
