# T2B-134 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-134`    |
| Platform/Product      | `SQL Server` |
| Database              | `StagingDB`  |
| Schema                | `gmb`        |
| Object type scope     | `table`      |
| Object pages          | 5            |
| Link refresh pages    | 2            |
| Total planned entries | 9            |
| Validation status     | `passed`     |

## Object Pages

| Object                     | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                              |
| -------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | ------------------------------------------------------------------------------------------------- |
| `GoogleMyBusinessAccount`  | table | profiled, review-needed | 1          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / gmb / GoogleMyBusinessAccount`  |
| `GoogleMyBusinessLocation` | table | profiled, review-needed | 1          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / gmb / GoogleMyBusinessLocation` |
| `GoogleMyBusinessMetric`   | table | profiled, review-needed | 1          | 13      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / gmb / GoogleMyBusinessMetric`   |
| `GoogleMyBusinessReview`   | table | profiled, review-needed | 1          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / gmb / GoogleMyBusinessReview`   |
| `GoogleMyBusinessReviews`  | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / gmb / GoogleMyBusinessReviews`  |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-134:publish
```
