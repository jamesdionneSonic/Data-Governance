# T2B-131 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-131`    |
| Platform/Product      | `SQL Server` |
| Database              | `Sonic_DW`   |
| Schema                | `wrk`        |
| Object type scope     | `table`      |
| Object pages          | 33           |
| Link refresh pages    | 2            |
| Total planned entries | 37           |
| Validation status     | `passed`     |

## Object Pages

| Object                            | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                    |
| --------------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | ------------------------------------------------------------------------------------------------------- |
| `Dim_DMSCustomer_newdata`         | table | profiled, review-needed | 0          | 68      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / wrk / Dim_DMSCustomer_newdata`         |
| `Dim_Journal`                     | table | profiled, review-needed | 0          | 27      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / wrk / Dim_Journal`                     |
| `Dim_Journal_old`                 | table | profiled, review-needed | 0          | 27      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / wrk / Dim_Journal_old`                 |
| `Dim_Vehicle`                     | table | profiled, review-needed | 0          | 46      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / wrk / Dim_Vehicle`                     |
| `eLead_TaskItem`                  | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / wrk / eLead_TaskItem`                  |
| `Fact_KPIMetricActual_Calc`       | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / wrk / Fact_KPIMetricActual_Calc`       |
| `FactCallsource_stg`              | table | profiled, review-needed | 0          | 19      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / wrk / FactCallsource_stg`              |
| `FactCallsource_stg_new`          | table | profiled, review-needed | 0          | 17      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / wrk / FactCallsource_stg_new`          |
| `OpportunitySourceMap`            | table | profiled, review-needed | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / wrk / OpportunitySourceMap`            |
| `SalesTranAssociate_Outbound`     | table | profiled, review-needed | 0          | 32      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / wrk / SalesTranAssociate_Outbound`     |
| `SalesTranAssociate_Outbound_stg` | table | profiled, review-needed | 0          | 32      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / wrk / SalesTranAssociate_Outbound_stg` |
| `SalesTransaction_Detail`         | table | profiled, review-needed | 1          | 50      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / wrk / SalesTransaction_Detail`         |
| `SalesTransaction_Final_New`      | table | profiled, review-needed | 0          | 52      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / wrk / SalesTransaction_Final_New`      |
| `SalesTransaction_VSC`            | table | profiled, review-needed | 1          | 28      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / wrk / SalesTransaction_VSC`            |
| `servicedata`                     | table | profiled, review-needed | 0          | 56      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / wrk / servicedata`                     |
| `ServicedataAppointment`          | table | profiled, review-needed | 0          | 44      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / wrk / ServicedataAppointment`          |
| `ServicedataSales`                | table | profiled, review-needed | 0          | 180     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / wrk / ServicedataSales`                |
| `servicedatavisit`                | table | profiled, review-needed | 0          | 55      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / wrk / servicedatavisit`                |
| `test12`                          | table | profiled, review-needed | 0          | 51      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / wrk / test12`                          |
| `update_Aso_data`                 | table | profiled, review-needed | 0          | 67      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / wrk / update_Aso_data`                 |
| `wk_CustomerXREF_KeyLU`           | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / wrk / wk_CustomerXREF_KeyLU`           |
| `wk_Dim_Customer`                 | table | profiled, review-needed | 0          | 65      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / wrk / wk_Dim_Customer`                 |
| `wk_Dim_DMSCustomer`              | table | profiled, review-needed | 1          | 66      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / wrk / wk_Dim_DMSCustomer`              |
| `wk_Dim_Entity`                   | table | profiled, review-needed | 0          | 66      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / wrk / wk_Dim_Entity`                   |
| `wk_Dim_VehicleGeneral`           | table | profiled, review-needed | 0          | 23      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / wrk / wk_Dim_VehicleGeneral`           |
| `wk_Dim_Vendor`                   | table | profiled, review-needed | 0          | 42      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / wrk / wk_Dim_Vendor`                   |
| `wk_VenddorXREF_MR`               | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / wrk / wk_VenddorXREF_MR`               |
| `wrk_Dim_DMSVendor`               | table | profiled, review-needed | 0          | 46      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / wrk / wrk_Dim_DMSVendor`               |
| `wrk_Dim_HFM`                     | table | profiled, review-needed | 0          | 25      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / wrk / wrk_Dim_HFM`                     |
| `wrk_Dim_Scenario`                | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / wrk / wrk_Dim_Scenario`                |
| `wrkDim_GLDetail`                 | table | profiled, review-needed | 1          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / wrk / wrkDim_GLDetail`                 |
| `wrkFactopp_rows`                 | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / wrk / wrkFactopp_rows`                 |
| `wrkFactoppdelete`                | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / wrk / wrkFactoppdelete`                |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-131:publish
```
