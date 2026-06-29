# ADF-MF-03 Lineage Edge Review

Generated: 2026-06-29T10:39:03.039Z

Source readback: `C:\projects\Data Governence\docs\lineage-runtime-readbacks\adf-multi-factory\adf-mf-02-run-20260629T103855Z.json`

## Summary

| Signal                   | Value |
| ------------------------ | ----: |
| Connectors reviewed      |     3 |
| Accepted connectors      |     3 |
| Review-needed connectors |     0 |
| Blocked connectors       |     0 |
| Pipelines                |    57 |
| Tasks/activities         |   423 |
| Datasets                 |    79 |
| Connections              |    33 |
| Schedules/triggers       |    11 |
| Lineage edges            |  1272 |

## Connector Review

| Connector                               | Profile status | Pipelines | Tasks | Datasets | Connections | Schedules | Edges | Review   | Reason                                                              |
| --------------------------------------- | -------------- | --------: | ----: | -------: | ----------: | --------: | ----: | -------- | ------------------------------------------------------------------- |
| `azure-data-factory-adf-facebookads-d1` | succeeded      |        13 |    99 |       11 |          10 |         4 |   349 | accepted | Deterministic lineage edges were surfaced by the connector profile. |
| `azure-data-factory-adf-reconpro-d1`    | succeeded      |        26 |   149 |       46 |           8 |         3 |   525 | accepted | Deterministic lineage edges were surfaced by the connector profile. |
| `azure-data-factory-adf-mci-d1`         | succeeded      |        18 |   175 |       22 |          15 |         4 |   398 | accepted | Deterministic lineage edges were surfaced by the connector profile. |

## Object And Edge Types

| Connector                               | Inventory by role                                                             | Lineage by type   |
| --------------------------------------- | ----------------------------------------------------------------------------- | ----------------- |
| `azure-data-factory-adf-facebookads-d1` | connection: 10, dataset: 11, object: 62, pipeline: 13, schedule: 4, task: 99  | lineage_edge: 349 |
| `azure-data-factory-adf-reconpro-d1`    | connection: 8, dataset: 46, object: 61, pipeline: 26, schedule: 3, task: 149  | lineage_edge: 525 |
| `azure-data-factory-adf-mci-d1`         | connection: 15, dataset: 22, object: 16, pipeline: 18, schedule: 4, task: 175 | lineage_edge: 398 |

## Sample Edges

| Connector                               | From                                            | To                                                   | Type         | Confidence |
| --------------------------------------- | ----------------------------------------------- | ---------------------------------------------------- | ------------ | ---------: |
| `azure-data-factory-adf-facebookads-d1` | `linkedService:LS_ABLB_InboundSocialMedia`      | `dataset:DS_ABLB_FBAds_Files_Archive`                | lineage_edge |       0.78 |
| `azure-data-factory-adf-facebookads-d1` | `linkedService:LS_ABLB_InboundSocialMedia`      | `dataset:DS_ABLB_FBAds_Files`                        | lineage_edge |       0.78 |
| `azure-data-factory-adf-facebookads-d1` | `linkedService:LS_ABLB_InboundSocialMedia`      | `dataset:DS_ABLB_FBAds_Files_Src`                    | lineage_edge |       0.78 |
| `azure-data-factory-adf-facebookads-d1` | `linkedService:LS_SQL_SSIS_02`                  | `dataset:DS_SQL_FB_SM_SSIS_ProcessedFiles`           | lineage_edge |       0.78 |
| `azure-data-factory-adf-facebookads-d1` | `linkedService:LS_SQL_ETL_Staging`              | `dataset:DS_SQL_FBAds_ETLStaging`                    | lineage_edge |       0.78 |
| `azure-data-factory-adf-facebookads-d1` | `linkedService:LS_SQL_VendorData`               | `dataset:DS_SQL_FBAds_VendorData`                    | lineage_edge |       0.78 |
| `azure-data-factory-adf-facebookads-d1` | `linkedService:LS_SQL_Sonic_DW`                 | `dataset:DS_SQL_FBAds_SonicDW`                       | lineage_edge |       0.78 |
| `azure-data-factory-adf-facebookads-d1` | `linkedService:LS_SQL_StagingDb`                | `dataset:DS_SQL_FBAds_Staging`                       | lineage_edge |       0.78 |
| `azure-data-factory-adf-facebookads-d1` | `linkedService:LS_ABLB_InboundSocialMedia`      | `dataset:DS_ABLB_FBAdsOfflineMetrices_Files_Archive` | lineage_edge |       0.78 |
| `azure-data-factory-adf-facebookads-d1` | `linkedService:LS_ABLB_InboundSocialMedia`      | `dataset:DS_ABLB_FBAdsOfflineMetrices_Files_Src`     | lineage_edge |       0.78 |
| `azure-data-factory-adf-reconpro-d1`    | `linkedService:LS_ABLB_ReconPro`                | `dataset:DS_BLB_DeleteFile`                          | lineage_edge |       0.78 |
| `azure-data-factory-adf-reconpro-d1`    | `linkedService:LS_ABLB_ReconPro`                | `dataset:DS_ABLB_ReconPro_Files_Archive`             | lineage_edge |       0.78 |
| `azure-data-factory-adf-reconpro-d1`    | `linkedService:LS_ABLB_ReconPro`                | `dataset:DS_ABLB_ReconPro_Files_Lookup_Src`          | lineage_edge |       0.78 |
| `azure-data-factory-adf-reconpro-d1`    | `linkedService:LS_ABLB_ReconPro`                | `dataset:DS_ABLB_ReconPro_Files_Src`                 | lineage_edge |       0.78 |
| `azure-data-factory-adf-reconpro-d1`    | `linkedService:LS_SQL_StageStagingDbSQL`        | `dataset:DS_SQL_StageStagingDB`                      | lineage_edge |       0.78 |
| `azure-data-factory-adf-reconpro-d1`    | `linkedService:LS_SQL_StageVendorDataSQL`       | `dataset:DS_SQL_StageVendordata`                     | lineage_edge |       0.78 |
| `azure-data-factory-adf-reconpro-d1`    | `linkedService:LS_SQL_SourceStageVendordataSQL` | `dataset:DS_SQL_SourceStageVendordata`               | lineage_edge |       0.78 |
| `azure-data-factory-adf-reconpro-d1`    | `linkedService:LS_SQL_MetaSsisSQL`              | `dataset:DS_SQL_MetaSsis`                            | lineage_edge |       0.78 |
| `azure-data-factory-adf-reconpro-d1`    | `linkedService:LS_SQL_SourceMetaSsisSQL`        | `dataset:DS_SQL_SourceMetaSsis`                      | lineage_edge |       0.78 |
| `azure-data-factory-adf-reconpro-d1`    | `linkedService:LS_SQL_MetaMsdbSQL`              | `dataset:DS_SQL_MetaMsdb`                            | lineage_edge |       0.78 |
| `azure-data-factory-adf-mci-d1`         | `linkedService:LS_SFTP_EPLeadSale`              | `dataset:DS_SFTP_EPLeadSale`                         | lineage_edge |       0.78 |
| `azure-data-factory-adf-mci-d1`         | `linkedService:LS_SFPT_EPCallsource`            | `dataset:DS_SFTP_EPCallsource`                       | lineage_edge |       0.78 |
| `azure-data-factory-adf-mci-d1`         | `linkedService:LS_SQL_SonicDW`                  | `dataset:DS_SQL_EPLeadSale`                          | lineage_edge |       0.78 |
| `azure-data-factory-adf-mci-d1`         | `linkedService:LS_SQL_SSIS`                     | `dataset:DS_SQL_SSIS_Meta`                           | lineage_edge |       0.78 |
| `azure-data-factory-adf-mci-d1`         | `linkedService:LS_SQL_VendorData`               | `dataset:DS_SQL_EPCallSource`                        | lineage_edge |       0.78 |
| `azure-data-factory-adf-mci-d1`         | `linkedService:LS_SQL_SSIS01`                   | `dataset:DS_SQL_SSIS01_Meta`                         | lineage_edge |       0.78 |
| `azure-data-factory-adf-mci-d1`         | `linkedService:LS_SQL_MSDB`                     | `dataset:DS_SQL_MSDB`                                | lineage_edge |       0.78 |
| `azure-data-factory-adf-mci-d1`         | `linkedService:LS_SFTP_Test`                    | `dataset:DS_SFTP_CarGurus_copy1`                     | lineage_edge |       0.78 |
| `azure-data-factory-adf-mci-d1`         | `linkedService:LS_SFTP_MCIAquisition`           | `dataset:DS_SFTP_MCIAquisition`                      | lineage_edge |       0.78 |
| `azure-data-factory-adf-mci-d1`         | `linkedService:LS_SFTP_CarGurus`                | `dataset:DS_SFTP_CarGurus`                           | lineage_edge |       0.78 |

## Gate Decision

- No connector is blocked by failed metadata profile.
- No missing-edge caveats were detected for connectors with pipeline inventory.
- No ADF pipelines were started.
- No trigger, schedule, retry, linked-service, credential, or permission settings were changed.
- Raw source payload values, secrets, tokens, and connection strings are not included in this readback.
