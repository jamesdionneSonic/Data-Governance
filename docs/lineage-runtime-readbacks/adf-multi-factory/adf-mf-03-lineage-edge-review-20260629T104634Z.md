# ADF-MF-03 Lineage Edge Review

Generated: 2026-06-29T10:46:34.945Z

Source readback: `C:\projects\Data Governence\docs\lineage-runtime-readbacks\adf-multi-factory\adf-mf-02-run-20260629T104629Z.json`

## Summary

| Signal                   | Value |
| ------------------------ | ----: |
| Connectors reviewed      |     1 |
| Accepted connectors      |     1 |
| Review-needed connectors |     0 |
| Blocked connectors       |     0 |
| Pipelines                |    82 |
| Tasks/activities         |   236 |
| Datasets                 |   254 |
| Connections              |    32 |
| Schedules/triggers       |     8 |
| Lineage edges            |  1578 |

## Connector Review

| Connector                                    | Profile status | Pipelines | Tasks | Datasets | Connections | Schedules | Edges | Review   | Reason                                                              |
| -------------------------------------------- | -------------- | --------: | ----: | -------: | ----------: | --------: | ----: | -------- | ------------------------------------------------------------------- |
| `azure-data-factory-adf-inbounddataetl-prod` | succeeded      |        82 |   236 |      254 |          32 |         8 |  1578 | accepted | Deterministic lineage edges were surfaced by the connector profile. |

## Object And Edge Types

| Connector                                    | Inventory by role                                                                                    | Lineage by type    |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------ |
| `azure-data-factory-adf-inbounddataetl-prod` | connection: 32, dataset: 254, object: 374, pipeline: 82, schedule: 8, storage_location: 1, task: 236 | lineage_edge: 1578 |

## Sample Edges

| Connector                                    | From                                        | To                                                   | Type         | Confidence |
| -------------------------------------------- | ------------------------------------------- | ---------------------------------------------------- | ------------ | ---------: |
| `azure-data-factory-adf-inbounddataetl-prod` | `linkedService:L1DWASQL02_StagingDb`        | `dataset:SqlWrkGadCampaign`                          | lineage_edge |       0.78 |
| `azure-data-factory-adf-inbounddataetl-prod` | `linkedService:DataLake_inboundsocialmedia` | `dataset:AdlsSupermetricsDataFolder`                 | lineage_edge |       0.78 |
| `azure-data-factory-adf-inbounddataetl-prod` | `linkedService:DataLake_inboundsocialmedia` | `dataset:AdlsGoogleAdsDataLoadFile`                  | lineage_edge |       0.78 |
| `azure-data-factory-adf-inbounddataetl-prod` | `linkedService:DataLake_inboundsocialmedia` | `dataset:AdlsGoogleAdsDataLoadArchiveFile`           | lineage_edge |       0.78 |
| `azure-data-factory-adf-inbounddataetl-prod` | `linkedService:L1DWASQL02_StagingDb`        | `dataset:SqlWrkGadConversion`                        | lineage_edge |       0.78 |
| `azure-data-factory-adf-inbounddataetl-prod` | `linkedService:DataLake_inboundsocialmedia` | `dataset:AdlsGoogleAdsDataLoadConversionArchiveFile` | lineage_edge |       0.78 |
| `azure-data-factory-adf-inbounddataetl-prod` | `linkedService:DataLake_inboundsocialmedia` | `dataset:AdlsSupermetricsDataConversionFolder`       | lineage_edge |       0.78 |
| `azure-data-factory-adf-inbounddataetl-prod` | `linkedService:DataLake_inboundsocialmedia` | `dataset:AdlsGoogleAdsDataLoadConversionFile`        | lineage_edge |       0.78 |
| `azure-data-factory-adf-inbounddataetl-prod` | `linkedService:MktCarNow_SFTP`              | `dataset:SFTP_Archive`                               | lineage_edge |       0.78 |
| `azure-data-factory-adf-inbounddataetl-prod` | `linkedService:L1DWASQL02_VendorData`       | `dataset:ds_SonicChatNow_VendorData`                 | lineage_edge |       0.78 |

## Gate Decision

- No connector is blocked by failed metadata profile.
- No missing-edge caveats were detected for connectors with pipeline inventory.
- No ADF pipelines were started.
- No trigger, schedule, retry, linked-service, credential, or permission settings were changed.
- Raw source payload values, secrets, tokens, and connection strings are not included in this readback.
