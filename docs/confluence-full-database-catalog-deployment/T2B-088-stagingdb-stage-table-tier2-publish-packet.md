# T2B-088 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-088`    |
| Platform/Product      | `SQL Server` |
| Database              | `StagingDB`  |
| Schema                | `stage`      |
| Object type scope     | `table`      |
| Object pages          | 19           |
| Link refresh pages    | 2            |
| Total planned entries | 23           |
| Validation status     | `passed`     |

## Object Pages

| Object                      | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                 |
| --------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | ---------------------------------------------------------------------------------------------------- |
| `CollisionCSI`              | table | profiled, review-needed | 0          | 31      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / CollisionCSI`              |
| `DealerwareAdvisors`        | table | profiled, review-needed | 0          | 13      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / DealerwareAdvisors`        |
| `DealerwareCarIssues`       | table | profiled, review-needed | 0          | 24      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / DealerwareCarIssues`       |
| `DealerwareCars`            | table | profiled, review-needed | 0          | 46      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / DealerwareCars`            |
| `DealerwareCompanies`       | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / DealerwareCompanies`       |
| `DealerwareContracts`       | table | profiled, review-needed | 0          | 42      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / DealerwareContracts`       |
| `DealerwareCustomerAddress` | table | profiled, review-needed | 0          | 15      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / DealerwareCustomerAddress` |
| `DealerwareCustomers`       | table | profiled, review-needed | 0          | 19      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / DealerwareCustomers`       |
| `DealerwareLocations`       | table | profiled, review-needed | 0          | 34      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / DealerwareLocations`       |
| `DealerwareReservations`    | table | profiled, review-needed | 0          | 78      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / DealerwareReservations`    |
| `DMSCustomerKeys`           | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / DMSCustomerKeys`           |
| `DMSCustomerKeys_exst`      | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / DMSCustomerKeys_exst`      |
| `JDPower_New`               | table | profiled, review-needed | 0          | 59      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / JDPower_New`               |
| `JDPower_New_Matched`       | table | profiled, review-needed | 0          | 59      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / JDPower_New_Matched`       |
| `NewCustomersKeys`          | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / NewCustomersKeys`          |
| `RemedyLoadSync`            | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / RemedyLoadSync`            |
| `RemedyTicketData_Matched`  | table | profiled, review-needed | 0          | 78      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / RemedyTicketData_Matched`  |
| `TSDSubsidyMetrics`         | table | profiled, review-needed | 0          | 20      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / TSDSubsidyMetrics`         |
| `TSDSubsidyMetrics_Matched` | table | profiled, review-needed | 0          | 19      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / TSDSubsidyMetrics_Matched` |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-088:publish
```
