# ADF-MF-03 Lineage Edge Review

Generated: 2026-06-29T10:44:07.676Z

Source readback: `C:\projects\Data Governence\docs\lineage-runtime-readbacks\adf-multi-factory\adf-mf-02-run-20260629T104402Z.json`

## Summary

| Signal                   | Value |
| ------------------------ | ----: |
| Connectors reviewed      |     2 |
| Accepted connectors      |     2 |
| Review-needed connectors |     0 |
| Blocked connectors       |     0 |
| Pipelines                |    51 |
| Tasks/activities         |   244 |
| Datasets                 |    14 |
| Connections              |    22 |
| Schedules/triggers       |    10 |
| Lineage edges            |   681 |

## Connector Review

| Connector                              | Profile status | Pipelines | Tasks | Datasets | Connections | Schedules | Edges | Review   | Reason                                                              |
| -------------------------------------- | -------------- | --------: | ----: | -------: | ----------: | --------: | ----: | -------- | ------------------------------------------------------------------- |
| `azure-data-factory-adf-ganalytics-d1` | succeeded      |        17 |    78 |        4 |          11 |         4 |   161 | accepted | Deterministic lineage edges were surfaced by the connector profile. |
| `azure-data-factory-adf-elead-d1`      | succeeded      |        34 |   166 |       10 |          11 |         6 |   520 | accepted | Deterministic lineage edges were surfaced by the connector profile. |

## Object And Edge Types

| Connector                              | Inventory by role                                                             | Lineage by type   |
| -------------------------------------- | ----------------------------------------------------------------------------- | ----------------- |
| `azure-data-factory-adf-ganalytics-d1` | connection: 11, dataset: 4, object: 3, pipeline: 17, schedule: 4, task: 78    | lineage_edge: 161 |
| `azure-data-factory-adf-elead-d1`      | connection: 11, dataset: 10, object: 92, pipeline: 34, schedule: 6, task: 166 | lineage_edge: 520 |

## Sample Edges

| Connector                              | From                                                      | To                                                             | Type         | Confidence |
| -------------------------------------- | --------------------------------------------------------- | -------------------------------------------------------------- | ------------ | ---------: |
| `azure-data-factory-adf-ganalytics-d1` | `linkedService:LS_SQL_SSIS_01`                            | `dataset:DS_SQL_AdQ_SSIS`                                      | lineage_edge |       0.78 |
| `azure-data-factory-adf-ganalytics-d1` | `linkedService:LS_SQL_Sonic_DW`                           | `dataset:DS_SQL_AdQ_SonicDW`                                   | lineage_edge |       0.78 |
| `azure-data-factory-adf-ganalytics-d1` | `linkedService:LS_SQL_DynServer`                          | `dataset:DS_SQL_AdQ_DynServer`                                 | lineage_edge |       0.78 |
| `azure-data-factory-adf-ganalytics-d1` | `linkedService:LS_SQL_VendorData`                         | `dataset:DS_SQL_VendorData`                                    | lineage_edge |       0.78 |
| `azure-data-factory-adf-ganalytics-d1` | `pipeline:PL_LoadAQ_RefreshMSTRCubes`                     | `activity:PL_LoadAQ_RefreshMSTRCubes/ACT_LKP_CheckStatus`      | lineage_edge |       0.78 |
| `azure-data-factory-adf-ganalytics-d1` | `pipeline:PL_LoadAQ_RefreshMSTRCubes`                     | `activity:PL_LoadAQ_RefreshMSTRCubes/ACT_IF_IsPipelineEnabled` | lineage_edge |       0.78 |
| `azure-data-factory-adf-ganalytics-d1` | `activity:PL_LoadAQ_RefreshMSTRCubes/ACT_LKP_CheckStatus` | `activity:PL_LoadAQ_RefreshMSTRCubes/ACT_IF_IsPipelineEnabled` | lineage_edge |       0.78 |
| `azure-data-factory-adf-ganalytics-d1` | `pipeline:PL_LoadAQ_RefreshMSTRCubes`                     | `activity:PL_LoadAQ_RefreshMSTRCubes/PipelineEnabled`          | lineage_edge |       0.78 |
| `azure-data-factory-adf-ganalytics-d1` | `pipeline:PL_LoadAQ_RefreshMSTRCubes`                     | `activity:PL_LoadAQ_RefreshMSTRCubes/PipelineDisabled`         | lineage_edge |       0.78 |
| `azure-data-factory-adf-ganalytics-d1` | `pipeline:PL_LoadAQ_RefreshMSTRCubes`                     | `activity:PL_LoadAQ_RefreshMSTRCubes/ACT_LKP_GetTriggers`      | lineage_edge |       0.78 |
| `azure-data-factory-adf-elead-d1`      | `linkedService:LS_SFTP_AutoTrader`                        | `dataset:DS_SFTP_TEXT_AutoTrader`                              | lineage_edge |       0.78 |
| `azure-data-factory-adf-elead-d1`      | `linkedService:LS_SFTP_Elead_New`                         | `dataset:DS_SFTP_Elead_Files_Src_New`                          | lineage_edge |       0.78 |
| `azure-data-factory-adf-elead-d1`      | `linkedService:LS_SFTP_CarMax`                            | `dataset:DS_SFTP_TEXT_Carmax_zip`                              | lineage_edge |       0.78 |
| `azure-data-factory-adf-elead-d1`      | `linkedService:LS_SFTP_Elead_New`                         | `dataset:DS_SFTP_Elead_Files_Dest`                             | lineage_edge |       0.78 |
| `azure-data-factory-adf-elead-d1`      | `linkedService:LS_ABLB_Elead`                             | `dataset:DS_ABLB_Elead_Files_Src`                              | lineage_edge |       0.78 |
| `azure-data-factory-adf-elead-d1`      | `linkedService:LS_SQL_SSIS`                               | `dataset:DS_SQL_SSIS_Elead_ProcessedFiles`                     | lineage_edge |       0.78 |
| `azure-data-factory-adf-elead-d1`      | `linkedService:LS_SQL_StagingDb`                          | `dataset:DS_SQL_Elead_Stage_Data`                              | lineage_edge |       0.78 |
| `azure-data-factory-adf-elead-d1`      | `linkedService:LS_SQL_SourceStageVendordataSQL`           | `dataset:DS_SQL_Elead_Historical_Data_Src`                     | lineage_edge |       0.78 |
| `azure-data-factory-adf-elead-d1`      | `linkedService:LS_ABLB_Elead`                             | `dataset:DS_ABLB_Elead_Files_Archive`                          | lineage_edge |       0.78 |
| `azure-data-factory-adf-elead-d1`      | `linkedService:LS_SQL_VendorData`                         | `dataset:DS_SQL_Elead_ProcessedData`                           | lineage_edge |       0.78 |

## Gate Decision

- No connector is blocked by failed metadata profile.
- No missing-edge caveats were detected for connectors with pipeline inventory.
- No ADF pipelines were started.
- No trigger, schedule, retry, linked-service, credential, or permission settings were changed.
- Raw source payload values, secrets, tokens, and connection strings are not included in this readback.
