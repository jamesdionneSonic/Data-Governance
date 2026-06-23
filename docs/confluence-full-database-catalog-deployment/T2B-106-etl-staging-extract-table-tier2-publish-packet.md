# T2B-106 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-106`     |
| Platform/Product      | `SQL Server`  |
| Database              | `ETL_Staging` |
| Schema                | `extract`     |
| Object type scope     | `table`       |
| Object pages          | 10            |
| Link refresh pages    | 2             |
| Total planned entries | 14            |
| Validation status     | `passed`      |

## Object Pages

| Object                            | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                           |
| --------------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | -------------------------------------------------------------------------------------------------------------- |
| `ActivityDeletes`                 | table | profiled, review-needed | 0          | 4       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / extract / ActivityDeletes`                 |
| `All_Changes`                     | table | profiled, review-needed | 0          | 56      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / extract / All_Changes`                     |
| `eLead_Opportunity_Activities`    | table | profiled, review-needed | 4          | 104     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / extract / eLead_Opportunity_Activities`    |
| `eLead_Opportunity_Activities_U1` | table | profiled, review-needed | 2          | 91      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / extract / eLead_Opportunity_Activities_U1` |
| `eLead_Opportunity_Fact`          | table | profiled, review-needed | 6          | 47      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / extract / eLead_Opportunity_Fact`          |
| `eLead_Opportunity_Fact_U1`       | table | profiled, review-needed | 1          | 47      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / extract / eLead_Opportunity_Fact_U1`       |
| `EmployeeData_HR`                 | table | profiled, review-needed | 2          | 57      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / extract / EmployeeData_HR`                 |
| `FactFocusBudget`                 | table | profiled, review-needed | 1          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / extract / FactFocusBudget`                 |
| `FOCUS_OpportunityActivityType`   | table | profiled, review-needed | 0          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / extract / FOCUS_OpportunityActivityType`   |
| `OpportunityDeletes`              | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / extract / OpportunityDeletes`              |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-106:publish
```
