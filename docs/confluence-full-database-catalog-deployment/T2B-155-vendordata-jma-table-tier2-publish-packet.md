# T2B-155 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-155`    |
| Platform/Product      | `SQL Server` |
| Database              | `VendorData` |
| Schema                | `JMA`        |
| Object type scope     | `table`      |
| Object pages          | 4            |
| Link refresh pages    | 2            |
| Total planned entries | 8            |
| Validation status     | `passed`     |

## Object Pages

| Object                                        | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                                  |
| --------------------------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | --------------------------------------------------------------------------------------------------------------------- |
| `ERR_JMA_CLAIMS_FINANCIAL_TRANSACTIONS_TBL`   | table | profiled, review-needed | 0          | 25      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / JMA / ERR_JMA_CLAIMS_FINANCIAL_TRANSACTIONS_TBL`   |
| `ERR_JMA_CONTRACT_FINANCIAL_TRANSACTIONS_TBL` | table | profiled, review-needed | 0          | 63      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / JMA / ERR_JMA_CONTRACT_FINANCIAL_TRANSACTIONS_TBL` |
| `JMA_CLAIMS_FINANCIAL_TRANSACTIONS_TBL`       | table | profiled, review-needed | 1          | 24      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / JMA / JMA_CLAIMS_FINANCIAL_TRANSACTIONS_TBL`       |
| `JMA_CONTRACT_FINANCIAL_TRANSACTIONS_TBL`     | table | profiled, review-needed | 1          | 62      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / JMA / JMA_CONTRACT_FINANCIAL_TRANSACTIONS_TBL`     |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-155:publish
```
