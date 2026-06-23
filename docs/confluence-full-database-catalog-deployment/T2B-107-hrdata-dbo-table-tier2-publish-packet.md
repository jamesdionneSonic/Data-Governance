# T2B-107 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-107`    |
| Platform/Product      | `SQL Server` |
| Database              | `HRData`     |
| Schema                | `dbo`        |
| Object type scope     | `table`      |
| Object pages          | 6            |
| Link refresh pages    | 2            |
| Total planned entries | 10           |
| Validation status     | `passed`     |

## Object Pages

| Object                                | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                      |
| ------------------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | --------------------------------------------------------------------------------------------------------- |
| `SmartRecruiterActivationResponse`    | table | profiled, review-needed | 0          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / HRData / dbo / SmartRecruiterActivationResponse`    |
| `SmartRecruiterChange`                | table | profiled, review-needed | 0          | 19      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / HRData / dbo / SmartRecruiterChange`                |
| `SmartRecruiterChangeResponse`        | table | profiled, review-needed | 0          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / HRData / dbo / SmartRecruiterChangeResponse`        |
| `SmartRecruiterConfiguration`         | table | profiled, review-needed | 0          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / HRData / dbo / SmartRecruiterConfiguration`         |
| `SmartRecruiterConfigurationResponse` | table | profiled, review-needed | 0          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / HRData / dbo / SmartRecruiterConfigurationResponse` |
| `SmartRecruiterUser`                  | table | profiled, review-needed | 0          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / HRData / dbo / SmartRecruiterUser`                  |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-107:publish
```
