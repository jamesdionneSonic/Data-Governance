# T2B-197 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-197`     |
| Platform/Product      | `SQL Server`  |
| Database              | `ETL_Staging` |
| Schema                | `Cars`        |
| Object type scope     | `table`       |
| Object pages          | 16            |
| Link refresh pages    | 2             |
| Total planned entries | 20            |
| Validation status     | `passed`      |

## Object Pages

| Object                         | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                     |
| ------------------------------ | ----- | ----------------------- | ---------- | ------- | ---------- | -------------------------------------------------------------------------------------------------------- |
| `AdPrintDetails_Staging`       | table | profiled, review-needed | 0          | 13      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / Cars / AdPrintDetails_Staging`       |
| `adPrintSummary_Staging`       | table | profiled, review-needed | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / Cars / adPrintSummary_Staging`       |
| `ChatDetails_Staging`          | table | profiled, review-needed | 0          | 15      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / Cars / ChatDetails_Staging`          |
| `ChatSummary_Staging`          | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / Cars / ChatSummary_Staging`          |
| `ClickThruDetails_Staging`     | table | profiled, review-needed | 0          | 13      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / Cars / ClickThruDetails_Staging`     |
| `clickThruSummary_Staging`     | table | profiled, review-needed | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / Cars / clickThruSummary_Staging`     |
| `Config`                       | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / Cars / Config`                       |
| `ContactSummary_Staging`       | table | profiled, review-needed | 0          | 24      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / Cars / ContactSummary_Staging`       |
| `DealerContactDetails_Staging` | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / Cars / DealerContactDetails_Staging` |
| `DealerInventory_Staging`      | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / Cars / DealerInventory_Staging`      |
| `EmailDetails_Staging`         | table | profiled, review-needed | 0          | 14      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / Cars / EmailDetails_Staging`         |
| `EmailSummary_Staging`         | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / Cars / EmailSummary_Staging`         |
| `MapViewDetails_Staging`       | table | profiled, review-needed | 0          | 13      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / Cars / MapViewDetails_Staging`       |
| `mapViewSummary_Staging`       | table | profiled, review-needed | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / Cars / mapViewSummary_Staging`       |
| `PhoneListing_Staging`         | table | profiled, review-needed | 0          | 8       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / Cars / PhoneListing_Staging`         |
| `PhoneSummary_Staging`         | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / Cars / PhoneSummary_Staging`         |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-197:publish
```
