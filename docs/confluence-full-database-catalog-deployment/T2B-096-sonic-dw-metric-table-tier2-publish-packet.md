# T2B-096 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-096`    |
| Platform/Product      | `SQL Server` |
| Database              | `Sonic_DW`   |
| Schema                | `Metric`     |
| Object type scope     | `table`      |
| Object pages          | 11           |
| Link refresh pages    | 2            |
| Total planned entries | 15           |
| Validation status     | `passed`     |

## Object Pages

| Object                        | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                   |
| ----------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | ------------------------------------------------------------------------------------------------------ |
| `DIM_DATE_TBL`                | table | profiled, review-needed | 5          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / Metric / DIM_DATE_TBL`                |
| `DIM_DEALERSHIP_GROUPING_TBL` | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / Metric / DIM_DEALERSHIP_GROUPING_TBL` |
| `DIM_DEALERSHIP_TBL`          | table | profiled, review-needed | 6          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / Metric / DIM_DEALERSHIP_TBL`          |
| `DIM_METRIC_ATTRIBUTE_TBL`    | table | profiled, review-needed | 6          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / Metric / DIM_METRIC_ATTRIBUTE_TBL`    |
| `DIM_METRIC_TBL`              | table | profiled, review-needed | 8          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / Metric / DIM_METRIC_TBL`              |
| `DIM_NOTIFICATION_TYPE_TBL`   | table | profiled, review-needed | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / Metric / DIM_NOTIFICATION_TYPE_TBL`   |
| `EDWH_METRIC_TBL`             | table | profiled, review-needed | 6          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / Metric / EDWH_METRIC_TBL`             |
| `EDWH_NOTIFICATION_LOG_TBL`   | table | profiled, review-needed | 0          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / Metric / EDWH_NOTIFICATION_LOG_TBL`   |
| `KPI_QUERY_CONFIGURATION`     | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / Metric / KPI_QUERY_CONFIGURATION`     |
| `KPI_SOURCE_CONFIGURATION`    | table | profiled, review-needed | 0          | 11      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / Metric / KPI_SOURCE_CONFIGURATION`    |
| `XREF_DEALERSHIP_TBL`         | table | profiled, review-needed | 1          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / Metric / XREF_DEALERSHIP_TBL`         |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-096:publish
```
