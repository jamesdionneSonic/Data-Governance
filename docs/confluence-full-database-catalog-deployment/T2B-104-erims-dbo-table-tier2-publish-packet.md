# T2B-104 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-104`    |
| Platform/Product      | `SQL Server` |
| Database              | `eRIMS`      |
| Schema                | `dbo`        |
| Object type scope     | `table`      |
| Object pages          | 6            |
| Link refresh pages    | 2            |
| Total planned entries | 10           |
| Validation status     | `passed`     |

## Object Pages

| Object                 | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                      |
| ---------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | ----------------------------------------------------------------------------------------- |
| `AL_FR`                | table | profiled, review-needed | 1          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eRIMS / dbo / AL_FR`                |
| `CRM_Customer`         | table | profiled, review-needed | 0          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eRIMS / dbo / CRM_Customer`         |
| `DPD_FR_Vehicle`       | table | profiled, review-needed | 1          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eRIMS / dbo / DPD_FR_Vehicle`       |
| `Premises_Loss_Claims` | table | profiled, review-needed | 0          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eRIMS / dbo / Premises_Loss_Claims` |
| `Property_FR`          | table | profiled, review-needed | 1          | 19      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eRIMS / dbo / Property_FR`          |
| `WC_FR`                | table | profiled, review-needed | 1          | 19      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eRIMS / dbo / WC_FR`                |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-104:publish
```
