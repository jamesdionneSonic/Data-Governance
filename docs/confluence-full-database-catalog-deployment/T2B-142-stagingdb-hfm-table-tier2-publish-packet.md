# T2B-142 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-142`    |
| Platform/Product      | `SQL Server` |
| Database              | `StagingDB`  |
| Schema                | `HFM`        |
| Object type scope     | `table`      |
| Object pages          | 14           |
| Link refresh pages    | 2            |
| Total planned entries | 18           |
| Validation status     | `passed`     |

## Object Pages

| Object                    | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                             |
| ------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | ------------------------------------------------------------------------------------------------ |
| `HFM_Measures_unmatched`  | table | profiled, review-needed | 0          | 19      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / HFM / HFM_Measures_unmatched`  |
| `STG_Account_CORP_Dim`    | table | profiled, review-needed | 0          | 19      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / HFM / STG_Account_CORP_Dim`    |
| `STG_Account_Dim`         | table | profiled, review-needed | 0          | 19      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / HFM / STG_Account_Dim`         |
| `STG_Account_sec_Dim`     | table | profiled, review-needed | 0          | 19      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / HFM / STG_Account_sec_Dim`     |
| `STG_Brand_Attributes`    | table | profiled, review-needed | 1          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / HFM / STG_Brand_Attributes`    |
| `STG_Brand_Dim`           | table | profiled, review-needed | 1          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / HFM / STG_Brand_Dim`           |
| `STG_Department_Dim`      | table | profiled, review-needed | 0          | 17      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / HFM / STG_Department_Dim`      |
| `STG_Entity_Attributes`   | table | profiled, review-needed | 1          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / HFM / STG_Entity_Attributes`   |
| `STG_Entity_Dim`          | table | profiled, review-needed | 1          | 35      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / HFM / STG_Entity_Dim`          |
| `STG_Excel_Load`          | table | profiled, review-needed | 0          | 21      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / HFM / STG_Excel_Load`          |
| `STG_Scenario_Dim`        | table | profiled, review-needed | 0          | 17      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / HFM / STG_Scenario_Dim`        |
| `STG_Source_Dim`          | table | profiled, review-needed | 0          | 17      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / HFM / STG_Source_Dim`          |
| `STG_SubAccount_Dim`      | table | profiled, review-needed | 0          | 17      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / HFM / STG_SubAccount_Dim`      |
| `SubAcct_Excel_Unmatched` | table | profiled, review-needed | 0          | 10      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / HFM / SubAcct_Excel_Unmatched` |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-142:publish
```
