# T2B-052 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-052`    |
| Platform/Product      | `SQL Server` |
| Database              | `GPA`        |
| Schema                | `dbo`        |
| Object type scope     | `table`      |
| Object pages          | 12           |
| Link refresh pages    | 2            |
| Total planned entries | 16           |
| Validation status     | `passed`     |

## Object Pages

| Object                 | Type  | Tags                                               | Downstream | Columns | Confidence | Path                                                                                    |
| ---------------------- | ----- | -------------------------------------------------- | ---------- | ------- | ---------- | --------------------------------------------------------------------------------------- |
| `AccountingDays`       | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / GPA / dbo / AccountingDays`       |
| `CRMComplaint`         | table | profiled, review-needed                            | 0          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / GPA / dbo / CRMComplaint`         |
| `DMSeLeadOptOutExport` | table | profiled, review-needed                            | 0          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / GPA / dbo / DMSeLeadOptOutExport` |
| `IncomeAlteration`     | table | profiled, review-needed                            | 0          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / GPA / dbo / IncomeAlteration`     |
| `Legal`                | table | profiled, review-needed                            | 0          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / GPA / dbo / Legal`                |
| `Metric`               | table | profiled, lineage-hotspot, review-needed           | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / GPA / dbo / Metric`               |
| `NetworkCall`          | table | profiled, review-needed                            | 0          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / GPA / dbo / NetworkCall`          |
| `PettyCashMisuse`      | table | profiled, review-needed                            | 0          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / GPA / dbo / PettyCashMisuse`      |
| `ProfitCap`            | table | profiled, review-needed                            | 0          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / GPA / dbo / ProfitCap`            |
| `RateCap`              | table | profiled, review-needed                            | 0          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / GPA / dbo / RateCap`              |
| `RiskManagementClaims` | table | profiled, review-needed                            | 0          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / GPA / dbo / RiskManagementClaims` |
| `Violation`            | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / GPA / dbo / Violation`            |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-052:publish
```
