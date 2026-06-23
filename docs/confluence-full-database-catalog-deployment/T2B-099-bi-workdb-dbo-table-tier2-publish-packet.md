# T2B-099 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-099`    |
| Platform/Product      | `SQL Server` |
| Database              | `BI_WorkDB`  |
| Schema                | `dbo`        |
| Object type scope     | `table`      |
| Object pages          | 21           |
| Link refresh pages    | 2            |
| Total planned entries | 25           |
| Validation status     | `passed`     |

## Object Pages

| Object                                      | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                               |
| ------------------------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | ------------------------------------------------------------------------------------------------------------------ |
| `Error_output`                              | table | profiled, review-needed | 0          | 45      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / BI_WorkDB / dbo / Error_output`                              |
| `GLBalance_Step_1`                          | table | profiled, review-needed | 0          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / BI_WorkDB / dbo / GLBalance_Step_1`                          |
| `GLCheck_Step_1`                            | table | profiled, review-needed | 0          | 28      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / BI_WorkDB / dbo / GLCheck_Step_1`                            |
| `GLJEDetail_Cur_ErrorOutput`                | table | profiled, review-needed | 0          | 47      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / BI_WorkDB / dbo / GLJEDetail_Cur_ErrorOutput`                |
| `GLSchedule_OpenMonths`                     | table | profiled, review-needed | 0          | 36      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / BI_WorkDB / dbo / GLSchedule_OpenMonths`                     |
| `GLSchedule_Step_0`                         | table | profiled, review-needed | 0          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / BI_WorkDB / dbo / GLSchedule_Step_0`                         |
| `GLSchedule_Step_1`                         | table | profiled, review-needed | 0          | 13      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / BI_WorkDB / dbo / GLSchedule_Step_1`                         |
| `GLSchedule_Step_3A`                        | table | profiled, review-needed | 0          | 32      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / BI_WorkDB / dbo / GLSchedule_Step_3A`                        |
| `GLSchedule_Step_4`                         | table | profiled, review-needed | 0          | 33      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / BI_WorkDB / dbo / GLSchedule_Step_4`                         |
| `GLSchedule_Step_6`                         | table | profiled, review-needed | 0          | 35      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / BI_WorkDB / dbo / GLSchedule_Step_6`                         |
| `InventorySnapshot`                         | table | profiled, review-needed | 0          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / BI_WorkDB / dbo / InventorySnapshot`                         |
| `tmpOpCodes`                                | table | profiled, review-needed | 0          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / BI_WorkDB / dbo / tmpOpCodes`                                |
| `vw_Fuel_II_GLSchedule_Step_1_BALANCE`      | table | profiled, review-needed | 0          | 29      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / BI_WorkDB / dbo / vw_Fuel_II_GLSchedule_Step_1_BALANCE`      |
| `vw_Fuel_II_GLSchedule_Step_1_CHANGES`      | table | profiled, review-needed | 0          | 29      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / BI_WorkDB / dbo / vw_Fuel_II_GLSchedule_Step_1_CHANGES`      |
| `vw_Fuel_II_GLSchedule_Step_1_DETAIL_new`   | table | profiled, review-needed | 0          | 29      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / BI_WorkDB / dbo / vw_Fuel_II_GLSchedule_Step_1_DETAIL_new`   |
| `vw_Fuel_II_GLSchedule_Step_3A_ControlType` | table | profiled, review-needed | 0          | 24      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / BI_WorkDB / dbo / vw_Fuel_II_GLSchedule_Step_3A_ControlType` |
| `vw_Fuel_II_GLSchedule_Step_4`              | table | profiled, review-needed | 0          | 29      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / BI_WorkDB / dbo / vw_Fuel_II_GLSchedule_Step_4`              |
| `vw_Fuel_II_GLSchedule_Step_4_Control_1`    | table | profiled, review-needed | 0          | 28      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / BI_WorkDB / dbo / vw_Fuel_II_GLSchedule_Step_4_Control_1`    |
| `vw_Fuel_II_xrfGLSchedule_SchedRef`         | table | profiled, review-needed | 0          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / BI_WorkDB / dbo / vw_Fuel_II_xrfGLSchedule_SchedRef`         |
| `xrfGLSchedule_Plugs`                       | table | profiled, review-needed | 0          | 19      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / BI_WorkDB / dbo / xrfGLSchedule_Plugs`                       |
| `xrfGLSchedule_SchedRef`                    | table | profiled, review-needed | 0          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / BI_WorkDB / dbo / xrfGLSchedule_SchedRef`                    |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-099:publish
```
