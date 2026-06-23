# T2B-141 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-141`    |
| Platform/Product      | `SQL Server` |
| Database              | `StagingDB`  |
| Schema                | `JMA`        |
| Object type scope     | `table`      |
| Object pages          | 3            |
| Link refresh pages    | 2            |
| Total planned entries | 7            |
| Validation status     | `passed`     |

## Object Pages

| Object                                        | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                                 |
| --------------------------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | -------------------------------------------------------------------------------------------------------------------- |
| `STG_JMA_CLAIMS_FINANCIAL_TRANSACTIONS_TBL`   | table | profiled, review-needed | 2          | 24      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / JMA / STG_JMA_CLAIMS_FINANCIAL_TRANSACTIONS_TBL`   |
| `STG_JMA_CONTRACT_FINANCIAL_TRANSACTIONS_TBL` | table | profiled, review-needed | 2          | 62      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / JMA / STG_JMA_CONTRACT_FINANCIAL_TRANSACTIONS_TBL` |
| `StgDOWC_DownloadedFiles`                     | table | profiled, review-needed | 0          | 1       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / JMA / StgDOWC_DownloadedFiles`                     |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-141:publish
```
