# T2B-059 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-059`    |
| Platform/Product      | `SQL Server` |
| Database              | `Sonic_DW`   |
| Schema                | `kpi`        |
| Object type scope     | `table`      |
| Object pages          | 6            |
| Link refresh pages    | 2            |
| Total planned entries | 10           |
| Validation status     | `passed`     |

## Object Pages

| Object                           | Type  | Tags                                               | Downstream | Columns | Confidence | Path                                                                                                   |
| -------------------------------- | ----- | -------------------------------------------------- | ---------- | ------- | ---------- | ------------------------------------------------------------------------------------------------------ |
| `Dim_KPIMetrics`                 | table | high-use, profiled, lineage-hotspot, review-needed | 20         | 13      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / kpi / Dim_KPIMetrics`                 |
| `Dim_MetricClass`                | table | profiled, review-needed                            | 2          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / kpi / Dim_MetricClass`                |
| `Fact_KPIMetricActual_Calc`      | table | profiled, lineage-hotspot, review-needed           | 1          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / kpi / Fact_KPIMetricActual_Calc`      |
| `Fact_KPIMetricActual_Calc_test` | table | profiled, review-needed                            | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / kpi / Fact_KPIMetricActual_Calc_test` |
| `Fact_KPIMetricActual_TXN`       | table | profiled, review-needed                            | 1          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / kpi / Fact_KPIMetricActual_TXN`       |
| `Fact_KPIMetricTarget_TXN`       | table | profiled, review-needed                            | 1          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / kpi / Fact_KPIMetricTarget_TXN`       |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-059:publish
```
