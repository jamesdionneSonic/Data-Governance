# ADF-MF-03 Lineage Edge Review

Generated: 2026-06-29T10:16:44.278Z

Source readback: `C:\projects\Data Governence\docs\lineage-runtime-readbacks\adf-multi-factory\adf-mf-02-run-20260629T101634Z.json`

## Summary

| Signal                   | Value |
| ------------------------ | ----: |
| Connectors reviewed      |     1 |
| Accepted connectors      |     1 |
| Review-needed connectors |     0 |
| Blocked connectors       |     0 |
| Pipelines                |    12 |
| Tasks/activities         |    44 |
| Datasets                 |     7 |
| Connections              |    13 |
| Schedules/triggers       |     2 |
| Lineage edges            |   225 |

## Connector Review

| Connector                                  | Profile status | Pipelines | Tasks | Datasets | Connections | Schedules | Edges | Review   | Reason                                                              |
| ------------------------------------------ | -------------- | --------: | ----: | -------: | ----------: | --------: | ----: | -------- | ------------------------------------------------------------------- |
| `azure-data-factory-adf-reputationmgmt-d1` | succeeded      |        12 |    44 |        7 |          13 |         2 |   225 | accepted | Deterministic lineage edges were surfaced by the connector profile. |

## Object And Edge Types

| Connector                                  | Inventory by role                                                           | Lineage by type   |
| ------------------------------------------ | --------------------------------------------------------------------------- | ----------------- |
| `azure-data-factory-adf-reputationmgmt-d1` | connection: 13, dataset: 7, object: 51, pipeline: 12, schedule: 2, task: 44 | lineage_edge: 225 |

## Sample Edges

| Connector                                  | From                                            | To                                                  | Type         | Confidence |
| ------------------------------------------ | ----------------------------------------------- | --------------------------------------------------- | ------------ | ---------: |
| `azure-data-factory-adf-reputationmgmt-d1` | `linkedService:LS_ABLB_InboundSocialMedia`      | `dataset:DS_ABLB_RM_Files`                          | lineage_edge |       0.78 |
| `azure-data-factory-adf-reputationmgmt-d1` | `linkedService:LS_ABLB_InboundSocialMedia`      | `dataset:DS_ABLB_RM_Files_Src`                      | lineage_edge |       0.78 |
| `azure-data-factory-adf-reputationmgmt-d1` | `linkedService:LS_SQL_SSIS_02`                  | `dataset:DS_SQL_RM_SSIS_ProcessedFiles`             | lineage_edge |       0.78 |
| `azure-data-factory-adf-reputationmgmt-d1` | `linkedService:LS_SQL_VendorData`               | `dataset:DS_SQL_RM_VendorData`                      | lineage_edge |       0.78 |
| `azure-data-factory-adf-reputationmgmt-d1` | `linkedService:LS_SQL_Sonic_DW`                 | `dataset:DS_SQL_RM_SonicDW`                         | lineage_edge |       0.78 |
| `azure-data-factory-adf-reputationmgmt-d1` | `linkedService:LS_SQL_ETL_Staging`              | `dataset:DS_SQL_RM_ETLStaging`                      | lineage_edge |       0.78 |
| `azure-data-factory-adf-reputationmgmt-d1` | `linkedService:LS_SQL_StagingDb`                | `dataset:DS_SQL_RM_Staging`                         | lineage_edge |       0.78 |
| `azure-data-factory-adf-reputationmgmt-d1` | `pipeline:RepMgmt_InsertFileLogs`               | `activity:RepMgmt_InsertFileLogs/FilterFiles`       | lineage_edge |       0.78 |
| `azure-data-factory-adf-reputationmgmt-d1` | `activity:RepMgmt_InsertFileLogs/GetTodayFiles` | `activity:RepMgmt_InsertFileLogs/FilterFiles`       | lineage_edge |       0.78 |
| `azure-data-factory-adf-reputationmgmt-d1` | `pipeline:RepMgmt_InsertFileLogs`               | `activity:RepMgmt_InsertFileLogs/LogAvailableFiles` | lineage_edge |       0.78 |

## Gate Decision

- No connector is blocked by failed metadata profile.
- No missing-edge caveats were detected for connectors with pipeline inventory.
- No ADF pipelines were started.
- No trigger, schedule, retry, linked-service, credential, or permission settings were changed.
- Raw source payload values, secrets, tokens, and connection strings are not included in this readback.
