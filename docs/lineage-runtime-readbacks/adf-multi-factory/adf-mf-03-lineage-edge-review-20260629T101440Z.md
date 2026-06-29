# ADF-MF-03 Lineage Edge Review

Generated: 2026-06-29T10:14:40.034Z

Source readback: `C:\projects\Data Governence\docs\lineage-runtime-readbacks\adf-multi-factory\adf-mf-02-run-20260629T101327Z.json`

## Summary

| Signal                   | Value |
| ------------------------ | ----: |
| Connectors reviewed      |     6 |
| Accepted connectors      |     5 |
| Review-needed connectors |     1 |
| Blocked connectors       |     0 |
| Pipelines                |    11 |
| Tasks/activities         |    67 |
| Datasets                 |    12 |
| Connections              |    16 |
| Schedules/triggers       |     3 |
| Lineage edges            |   253 |

## Connector Review

| Connector                                   | Profile status | Pipelines | Tasks | Datasets | Connections | Schedules | Edges | Review        | Reason                                                                          |
| ------------------------------------------- | -------------- | --------: | ----: | -------: | ----------: | --------: | ----: | ------------- | ------------------------------------------------------------------------------- |
| `azure-data-factory-adf-admin-d1`           | succeeded      |         0 |     0 |        0 |           0 |         0 |     0 | accepted      | No pipelines were surfaced, so zero lineage edges are expected.                 |
| `azure-data-factory-adf-dw-caroffer-prod`   | succeeded      |         0 |     0 |        0 |           0 |         0 |     0 | accepted      | No pipelines were surfaced, so zero lineage edges are expected.                 |
| `azure-data-factory-adf-dw-lightspeed-prod` | succeeded      |         0 |     0 |        0 |           0 |         0 |     0 | accepted      | No pipelines were surfaced, so zero lineage edges are expected.                 |
| `azure-data-factory-adf-dw-postgres-prod`   | succeeded      |         1 |     0 |        0 |           0 |         0 |     0 | review-needed | Pipeline inventory exists but no deterministic ADF lineage edges were surfaced. |
| `azure-data-factory-adf-googlesearch-d1`    | succeeded      |         8 |    48 |        7 |           9 |         2 |   169 | accepted      | Deterministic lineage edges were surfaced by the connector profile.             |
| `azure-data-factory-adf-xtime-d1`           | succeeded      |         2 |    19 |        5 |           7 |         1 |    84 | accepted      | Deterministic lineage edges were surfaced by the connector profile.             |

## Object And Edge Types

| Connector                                   | Inventory by role                                                         | Lineage by type   |
| ------------------------------------------- | ------------------------------------------------------------------------- | ----------------- |
| `azure-data-factory-adf-admin-d1`           | object: 2                                                                 | none              |
| `azure-data-factory-adf-dw-caroffer-prod`   | object: 1                                                                 | none              |
| `azure-data-factory-adf-dw-lightspeed-prod` | object: 1                                                                 | none              |
| `azure-data-factory-adf-dw-postgres-prod`   | object: 1, pipeline: 1                                                    | none              |
| `azure-data-factory-adf-googlesearch-d1`    | connection: 9, dataset: 7, object: 33, pipeline: 8, schedule: 2, task: 48 | lineage_edge: 169 |
| `azure-data-factory-adf-xtime-d1`           | connection: 7, dataset: 5, object: 21, pipeline: 2, schedule: 1, task: 19 | lineage_edge: 84  |

## Sample Edges

| Connector                                | From                                                           | To                                                             | Type         | Confidence |
| ---------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------- | ------------ | ---------: |
| `azure-data-factory-adf-googlesearch-d1` | `linkedService:LS_ABLB_InboundSocialMedia`                     | `dataset:DS_ABLB_GSC_Files_Lookup_Src`                         | lineage_edge |       0.78 |
| `azure-data-factory-adf-googlesearch-d1` | `linkedService:LS_SQL_StagingDb`                               | `dataset:DS_SQL_GSC_StgTables`                                 | lineage_edge |       0.78 |
| `azure-data-factory-adf-googlesearch-d1` | `linkedService:LS_SQL_Sonic_DW`                                | `dataset:DS_SQL_GSC_SonicDW`                                   | lineage_edge |       0.78 |
| `azure-data-factory-adf-googlesearch-d1` | `linkedService:LS_SQL_SSIS_02`                                 | `dataset:DS_SQL_SSIS`                                          | lineage_edge |       0.78 |
| `azure-data-factory-adf-googlesearch-d1` | `linkedService:LS_SQL_ETL_Staging`                             | `dataset:DS_SQL_GSC_ETLStaging`                                | lineage_edge |       0.78 |
| `azure-data-factory-adf-googlesearch-d1` | `linkedService:LS_SQL_VendorData`                              | `dataset:DS_SQL_GSC_VendorData`                                | lineage_edge |       0.78 |
| `azure-data-factory-adf-googlesearch-d1` | `linkedService:LS_ABLB_InboundSocialMedia`                     | `dataset:DS_ABLB_GSC_SourceFiles_Raw`                          | lineage_edge |       0.78 |
| `azure-data-factory-adf-googlesearch-d1` | `pipeline:GoogleSearchConsole_Master`                          | `activity:GoogleSearchConsole_Master/ACT_LKP_InitMetaColumns`  | lineage_edge |       0.78 |
| `azure-data-factory-adf-googlesearch-d1` | `activity:GoogleSearchConsole_Master/ACT_LKP_SetUserNameForLS` | `activity:GoogleSearchConsole_Master/ACT_LKP_InitMetaColumns`  | lineage_edge |       0.78 |
| `azure-data-factory-adf-googlesearch-d1` | `pipeline:GoogleSearchConsole_Master`                          | `activity:GoogleSearchConsole_Master/ACT_LKP_SetUserNameForLS` | lineage_edge |       0.78 |
| `azure-data-factory-adf-xtime-d1`        | `linkedService:LS_ABLB_Xtime`                                  | `dataset:DS_ABLB_XTime_Archive`                                | lineage_edge |       0.78 |
| `azure-data-factory-adf-xtime-d1`        | `linkedService:LS_SFTP_Xtimes`                                 | `dataset:DS_SFTP_XTime_src`                                    | lineage_edge |       0.78 |
| `azure-data-factory-adf-xtime-d1`        | `linkedService:LS_SQL_VendorData`                              | `dataset:DS_SQL_VendorData_Xtime`                              | lineage_edge |       0.78 |
| `azure-data-factory-adf-xtime-d1`        | `linkedService:LS_SQL_SSIS`                                    | `dataset:DS_SQL_SSIS_Xtime`                                    | lineage_edge |       0.78 |
| `azure-data-factory-adf-xtime-d1`        | `linkedService:LS_SQL_StagingDB`                               | `dataset:DS_SQL_StagingDB_Xtime`                               | lineage_edge |       0.78 |
| `azure-data-factory-adf-xtime-d1`        | `pipeline:PL_Xtime_Incremental_Load`                           | `activity:PL_Xtime_Incremental_Load/Get_FilesSFTP`             | lineage_edge |       0.78 |
| `azure-data-factory-adf-xtime-d1`        | `activity:PL_Xtime_Incremental_Load/Set StartDate`             | `activity:PL_Xtime_Incremental_Load/Get_FilesSFTP`             | lineage_edge |       0.78 |
| `azure-data-factory-adf-xtime-d1`        | `pipeline:PL_Xtime_Incremental_Load`                           | `activity:PL_Xtime_Incremental_Load/Set StartDate`             | lineage_edge |       0.78 |
| `azure-data-factory-adf-xtime-d1`        | `pipeline:PL_Xtime_Incremental_Load`                           | `activity:PL_Xtime_Incremental_Load/FEC-CheckEmptyFiles`       | lineage_edge |       0.78 |
| `azure-data-factory-adf-xtime-d1`        | `activity:PL_Xtime_Incremental_Load/ACT_LKP_GetFileLogs`       | `activity:PL_Xtime_Incremental_Load/FEC-CheckEmptyFiles`       | lineage_edge |       0.78 |

## Gate Decision

- No connector is blocked by failed metadata profile.
- Review-needed connectors may proceed only after accepting the missing-edge caveat or re-running with deeper source evidence.
- No ADF pipelines were started.
- No trigger, schedule, retry, linked-service, credential, or permission settings were changed.
- Raw source payload values, secrets, tokens, and connection strings are not included in this readback.
