# ADF-MF-03 Lineage Edge Review

Generated: 2026-06-29T10:49:18.412Z

Source readback: `C:\projects\Data Governence\docs\lineage-runtime-readbacks\adf-multi-factory\adf-mf-02-run-20260629T104911Z.json`

## Summary

| Signal                   | Value |
| ------------------------ | ----: |
| Connectors reviewed      |     1 |
| Accepted connectors      |     1 |
| Review-needed connectors |     0 |
| Blocked connectors       |     0 |
| Pipelines                |    98 |
| Tasks/activities         |   699 |
| Datasets                 |    64 |
| Connections              |    19 |
| Schedules/triggers       |    17 |
| Lineage edges            |  1767 |

## Connector Review

| Connector                           | Profile status | Pipelines | Tasks | Datasets | Connections | Schedules | Edges | Review   | Reason                                                              |
| ----------------------------------- | -------------- | --------: | ----: | -------: | ----------: | --------: | ----: | -------- | ------------------------------------------------------------------- |
| `azure-data-factory-adf-pricefx-d1` | succeeded      |        98 |   699 |       64 |          19 |        17 |  1767 | accepted | Deterministic lineage edges were surfaced by the connector profile. |

## Object And Edge Types

| Connector                           | Inventory by role                                                             | Lineage by type    |
| ----------------------------------- | ----------------------------------------------------------------------------- | ------------------ |
| `azure-data-factory-adf-pricefx-d1` | connection: 19, dataset: 64, object: 7, pipeline: 98, schedule: 17, task: 699 | lineage_edge: 1767 |

## Sample Edges

| Connector                           | From                                 | To                                              | Type         | Confidence |
| ----------------------------------- | ------------------------------------ | ----------------------------------------------- | ------------ | ---------: |
| `azure-data-factory-adf-pricefx-d1` | `linkedService:LS_SQL_D1DASQL`       | `dataset:DS_SQL_DAGroup`                        | lineage_edge |       0.78 |
| `azure-data-factory-adf-pricefx-d1` | `linkedService:LS_SQL_Vehiclemart`   | `dataset:DS_SQL_vehiclemart`                    | lineage_edge |       0.78 |
| `azure-data-factory-adf-pricefx-d1` | `linkedService:LS_SQL_SSIS`          | `dataset:DS_SQL_SSIS`                           | lineage_edge |       0.78 |
| `azure-data-factory-adf-pricefx-d1` | `linkedService:LS_SFTP_US_EAST_1`    | `dataset:DS_SFTP_US_EAST_1`                     | lineage_edge |       0.78 |
| `azure-data-factory-adf-pricefx-d1` | `linkedService:LS_ProcessManagement` | `dataset:ds_child_process_params`               | lineage_edge |       0.78 |
| `azure-data-factory-adf-pricefx-d1` | `linkedService:LS_SQL_eLeadDW`       | `dataset:DS_SQL_EleadDW`                        | lineage_edge |       0.78 |
| `azure-data-factory-adf-pricefx-d1` | `linkedService:LS_SQL_PriceFX`       | `dataset:ds_pricefx_eleadvehicle`               | lineage_edge |       0.78 |
| `azure-data-factory-adf-pricefx-d1` | `linkedService:LS_SQL_PriceFX`       | `dataset:ds_pricefx_eleadappointmentactivities` | lineage_edge |       0.78 |
| `azure-data-factory-adf-pricefx-d1` | `linkedService:LS_SQL_PriceFX`       | `dataset:ds_pricefx_eleadopportunity`           | lineage_edge |       0.78 |
| `azure-data-factory-adf-pricefx-d1` | `linkedService:LS_ProcessManagement` | `dataset:ds_Master_Process_Params`              | lineage_edge |       0.78 |

## Gate Decision

- No connector is blocked by failed metadata profile.
- No missing-edge caveats were detected for connectors with pipeline inventory.
- No ADF pipelines were started.
- No trigger, schedule, retry, linked-service, credential, or permission settings were changed.
- Raw source payload values, secrets, tokens, and connection strings are not included in this readback.
