# T2B-121 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-121`     |
| Platform/Product      | `SQL Server`  |
| Database              | `ETL_Staging` |
| Schema                | `JMA`         |
| Object type scope     | `table`       |
| Object pages          | 2             |
| Link refresh pages    | 2             |
| Total planned entries | 6             |
| Validation status     | `passed`      |

## Object Pages

| Object                                            | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                                       |
| ------------------------------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | -------------------------------------------------------------------------------------------------------------------------- |
| `ETL_STG_JMA_CLAIMS_FINANCIAL_TRANSACTIONS_TBL`   | table | profiled, review-needed | 1          | 25      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / JMA / ETL_STG_JMA_CLAIMS_FINANCIAL_TRANSACTIONS_TBL`   |
| `ETL_STG_JMA_CONTRACT_FINANCIAL_TRANSACTIONS_TBL` | table | profiled, review-needed | 1          | 63      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / JMA / ETL_STG_JMA_CONTRACT_FINANCIAL_TRANSACTIONS_TBL` |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-121:publish
```
