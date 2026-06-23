# T2B-140 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-140`     |
| Platform/Product      | `SQL Server`  |
| Database              | `ETL_Staging` |
| Schema                | `Security`    |
| Object type scope     | `table`       |
| Object pages          | 6             |
| Link refresh pages    | 2             |
| Total planned entries | 10            |
| Validation status     | `passed`      |

## Object Pages

| Object                    | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                    |
| ------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | ------------------------------------------------------------------------------------------------------- |
| `Security_Awareness`      | table | profiled, review-needed | 1          | 13      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / Security / Security_Awareness`      |
| `SEIM_Offenses`           | table | profiled, review-needed | 1          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / Security / SEIM_Offenses`           |
| `Symantec_Events`         | table | profiled, review-needed | 1          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / Security / Symantec_Events`         |
| `TSC_Vulnerabilities`     | table | profiled, review-needed | 1          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / Security / TSC_Vulnerabilities`     |
| `TSC_Vulnerabilities_old` | table | profiled, review-needed | 0          | 15      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / Security / TSC_Vulnerabilities_old` |
| `WHITEHAT_Events`         | table | profiled, review-needed | 1          | 24      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / Security / WHITEHAT_Events`         |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-140:publish
```
