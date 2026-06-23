# T2B-209 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-209`    |
| Platform/Product      | `SQL Server` |
| Database              | `StagingDB`  |
| Schema                | `easy`       |
| Object type scope     | `table`      |
| Object pages          | 5            |
| Link refresh pages    | 2            |
| Total planned entries | 9            |
| Validation status     | `passed`     |

## Object Pages

| Object                                | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                          |
| ------------------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | ------------------------------------------------------------------------------------------------------------- |
| `Mailings_staging`                    | table | profiled, review-needed | 0          | 58      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / easy / Mailings_staging`                    |
| `PhoneEmailText_Campaign_Staging`     | table | profiled, review-needed | 0          | 51      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / easy / PhoneEmailText_Campaign_Staging`     |
| `PhoneEmailText_Coupons_staging`      | table | profiled, review-needed | 0          | 43      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / easy / PhoneEmailText_Coupons_staging`      |
| `PhoneEmailText_Notification_staging` | table | profiled, review-needed | 0          | 51      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / easy / PhoneEmailText_Notification_staging` |
| `PhoneEmailText_staging`              | table | profiled, review-needed | 0          | 65      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / easy / PhoneEmailText_staging`              |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-209:publish
```
