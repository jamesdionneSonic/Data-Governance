# T2B-217 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-217`     |
| Platform/Product      | `SQL Server`  |
| Database              | `ETL_Staging` |
| Schema                | `pgc`         |
| Object type scope     | `table`       |
| Object pages          | 3             |
| Link refresh pages    | 2             |
| Total planned entries | 7             |
| Validation status     | `passed`      |

## Object Pages

| Object              | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                         |
| ------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | -------------------------------------------------------------------------------------------- |
| `err_glcoa_staging` | table | profiled, review-needed | 0          | 32      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / pgc / err_glcoa_staging` |
| `glcoa_staging`     | table | profiled, review-needed | 0          | 32      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / pgc / glcoa_staging`     |
| `opcodes_staging`   | table | profiled, review-needed | 0          | 26      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / pgc / opcodes_staging`   |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-217:publish
```
