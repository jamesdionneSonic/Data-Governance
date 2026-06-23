# T2B-066 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-066`    |
| Platform/Product      | `SQL Server` |
| Database              | `VendorData` |
| Schema                | `ga`         |
| Object type scope     | `table`      |
| Object pages          | 6            |
| Link refresh pages    | 2            |
| Total planned entries | 10           |
| Validation status     | `passed`     |

## Object Pages

| Object                              | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                       |
| ----------------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | ---------------------------------------------------------------------------------------------------------- |
| `GoogleAnalyticsReport_delete`      | table | profiled, review-needed | 0          | 27      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / ga / GoogleAnalyticsReport_delete`      |
| `GoogleAnalyticsReport_new`         | table | profiled, review-needed | 0          | 27      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / ga / GoogleAnalyticsReport_new`         |
| `GoogleAnalyticsReportHistorical`   | table | profiled, review-needed | 0          | 28      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / ga / GoogleAnalyticsReportHistorical`   |
| `GoogleAnalyticsRequest_BK`         | table | profiled, review-needed | 0          | 34      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / ga / GoogleAnalyticsRequest_BK`         |
| `GoogleAnalyticsRequestbkp20221113` | table | profiled, review-needed | 0          | 34      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / ga / GoogleAnalyticsRequestbkp20221113` |
| `GoogleAnalyticsRequestHistorical`  | table | profiled, review-needed | 0          | 34      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / ga / GoogleAnalyticsRequestHistorical`  |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-066:publish
```
