# ADF-MF-03 Lineage Edge Review

Generated: 2026-06-29T10:50:18.803Z

Source readback: `C:\projects\Data Governence\docs\lineage-runtime-readbacks\adf-multi-factory\adf-mf-02-run-20260629T105013Z.json`

## Summary

| Signal                   | Value |
| ------------------------ | ----: |
| Connectors reviewed      |     1 |
| Accepted connectors      |     1 |
| Review-needed connectors |     0 |
| Blocked connectors       |     0 |
| Pipelines                |    19 |
| Tasks/activities         |   119 |
| Datasets                 |   152 |
| Connections              |    31 |
| Schedules/triggers       |     6 |
| Lineage edges            |   579 |

## Connector Review

| Connector                                 | Profile status | Pipelines | Tasks | Datasets | Connections | Schedules | Edges | Review   | Reason                                                              |
| ----------------------------------------- | -------------- | --------: | ----: | -------: | ----------: | --------: | ----: | -------- | ------------------------------------------------------------------- |
| `azure-data-factory-adf-vehiclemart-prod` | succeeded      |        19 |   119 |      152 |          31 |         6 |   579 | accepted | Deterministic lineage edges were surfaced by the connector profile. |

## Object And Edge Types

| Connector                                 | Inventory by role                                                              | Lineage by type   |
| ----------------------------------------- | ------------------------------------------------------------------------------ | ----------------- |
| `azure-data-factory-adf-vehiclemart-prod` | connection: 31, dataset: 152, object: 84, pipeline: 19, schedule: 6, task: 119 | lineage_edge: 579 |

## Sample Edges

| Connector                                 | From                                    | To                                     | Type         | Confidence |
| ----------------------------------------- | --------------------------------------- | -------------------------------------- | ------------ | ---------: |
| `azure-data-factory-adf-vehiclemart-prod` | `linkedService:Sonic_Shared_folder`     | `dataset:AT_Src_Binary_SharedFolder`   | lineage_edge |       0.78 |
| `azure-data-factory-adf-vehiclemart-prod` | `linkedService:Sonic_Shared_folder`     | `dataset:AT_Src_SharedFolder`          | lineage_edge |       0.78 |
| `azure-data-factory-adf-vehiclemart-prod` | `linkedService:BlobStorage`             | `dataset:AT_Blob_Archive`              | lineage_edge |       0.78 |
| `azure-data-factory-adf-vehiclemart-prod` | `linkedService:LS_Hyp_Prod_Vehiclemart` | `dataset:AT_Hyp_Test_StageTable`       | lineage_edge |       0.78 |
| `azure-data-factory-adf-vehiclemart-prod` | `linkedService:Sonic_Shared_folder`     | `dataset:AT_Sonic_Input`               | lineage_edge |       0.78 |
| `azure-data-factory-adf-vehiclemart-prod` | `linkedService:Sonic_Shared_folder`     | `dataset:AT_Sonic_SharedFolder_Binary` | lineage_edge |       0.78 |
| `azure-data-factory-adf-vehiclemart-prod` | `linkedService:AT_AWS_Source`           | `dataset:AWS_FTP_file_Param_woFN`      | lineage_edge |       0.78 |
| `azure-data-factory-adf-vehiclemart-prod` | `linkedService:AT_AWS_Source`           | `dataset:AWS_Src_DAY_Param`            | lineage_edge |       0.78 |
| `azure-data-factory-adf-vehiclemart-prod` | `linkedService:LS_OnPrem_D1_SSIS_01`    | `dataset:AT_Meta_FileLoaded`           | lineage_edge |       0.78 |
| `azure-data-factory-adf-vehiclemart-prod` | `linkedService:LS_Hyp_Prod_Vehiclemart` | `dataset:AT_Hyp_Test_StageTable_Auto`  | lineage_edge |       0.78 |

## Gate Decision

- No connector is blocked by failed metadata profile.
- No missing-edge caveats were detected for connectors with pipeline inventory.
- No ADF pipelines were started.
- No trigger, schedule, retry, linked-service, credential, or permission settings were changed.
- Raw source payload values, secrets, tokens, and connection strings are not included in this readback.
