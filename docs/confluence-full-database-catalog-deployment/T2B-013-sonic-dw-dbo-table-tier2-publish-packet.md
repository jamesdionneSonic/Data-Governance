# T2B-013 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-013`    |
| Platform/Product      | `SQL Server` |
| Database              | `Sonic_DW`   |
| Schema                | `dbo`        |
| Object type scope     | `table`      |
| Object pages          | 21           |
| Link refresh pages    | 2            |
| Total planned entries | 25           |
| Validation status     | `passed`     |

## Object Pages

| Object                                       | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                               |
| -------------------------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | ------------------------------------------------------------------------------------------------------------------ |
| `vw_Sales_Goal_daily`                        | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / vw_Sales_Goal_daily`                        |
| `vw_Sales_NewUsed`                           | table | profiled, review-needed | 0          | 15      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / vw_Sales_NewUsed`                           |
| `vw_Sales_ProjectionGoal`                    | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / vw_Sales_ProjectionGoal`                    |
| `WorldData`                                  | table | profiled, review-needed | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / WorldData`                                  |
| `wrk_Dim_HFMBrand`                           | table | profiled, review-needed | 0          | 25      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / wrk_Dim_HFMBrand`                           |
| `xCustomerXREF_KeyLU`                        | table | profiled, review-needed | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / xCustomerXREF_KeyLU`                        |
| `xDim_Customer`                              | table | profiled, review-needed | 0          | 64      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / xDim_Customer`                              |
| `xrf_FIRE_related_acctg_cora_acct_id_ignore` | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / xrf_FIRE_related_acctg_cora_acct_id_ignore` |
| `xrf_RENT_Contribution`                      | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / xrf_RENT_Contribution`                      |
| `xrf_RENT_Escalation`                        | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / xrf_RENT_Escalation`                        |
| `xrf_RENT_LIBORGroup`                        | table | profiled, review-needed | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / xrf_RENT_LIBORGroup`                        |
| `xrf_RENT_LIBORPropertyRates`                | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / xrf_RENT_LIBORPropertyRates`                |
| `xrf_RENT_LIBORRate`                         | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / xrf_RENT_LIBORRate`                         |
| `xrfGLSchedule_SchedAccounts`                | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / xrfGLSchedule_SchedAccounts`                |
| `xrfGLSchedule_SchedGroups`                  | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / xrfGLSchedule_SchedGroups`                  |
| `xrfGLSchedule_SchedNames`                   | table | profiled, review-needed | 0          | 8       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / xrfGLSchedule_SchedNames`                   |
| `xrfGLSchedule_SchedNames2`                  | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / xrfGLSchedule_SchedNames2`                  |
| `YTD_DATE`                                   | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / YTD_DATE`                                   |
| `zzCallRevuLkp`                              | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / zzCallRevuLkp`                              |
| `zzzDim_Associate`                           | table | profiled, review-needed | 0          | 47      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / zzzDim_Associate`                           |
| `zzzzDimAssociate`                           | table | profiled, review-needed | 0          | 71      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / zzzzDimAssociate`                           |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-013:publish
```
