# T2B-184 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-184`    |
| Platform/Product      | `SQL Server` |
| Database              | `VendorData` |
| Schema                | `ibex`       |
| Object type scope     | `table`      |
| Object pages          | 4            |
| Link refresh pages    | 2            |
| Total planned entries | 8            |
| Validation status     | `passed`     |

## Object Pages

| Object             | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                        |
| ------------------ | ----- | ----------------------- | ---------- | ------- | ---------- | ------------------------------------------------------------------------------------------- |
| `Answer`           | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / ibex / Answer`           |
| `Questions`        | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / ibex / Questions`        |
| `SurveyInvitation` | table | profiled, review-needed | 0          | 37      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / ibex / SurveyInvitation` |
| `SurveyResponse`   | table | profiled, review-needed | 0          | 76      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / ibex / SurveyResponse`   |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-184:publish
```
