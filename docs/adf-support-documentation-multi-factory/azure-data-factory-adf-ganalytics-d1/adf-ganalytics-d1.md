# adf-ganalytics-d1

Generated: 2026-06-29T10:58:58.458Z
Saved connector: `azure-data-factory-adf-ganalytics-d1`
Source profile artifact: `data/markdown/_runtime/profile-runs/azure-data-factory-adf-ganalytics-d1/2026-06-29T10-42-03-682Z-594902fe-3591-404d-b693-88159eebfa46.json`

## Plain-English Summary

adf-ganalytics-d1 is an Azure Data Factory captured by the saved connector runtime. It contains 17 pipeline(s), 4 trigger(s), 4 dataset(s), and 11 linked-service connection record(s). If adf-ganalytics-d1 fails or becomes stale, dependent ADF loads, files, datasets, or downstream reporting may be incomplete until the failed run is diagnosed and rerun through the approved parent path. Start troubleshooting by checking active triggers, then the latest root or orchestrator pipeline run.

## At a Glance

| Field                 | Value                                                                                                                                         |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | ADF                                                                                                                                           |
| Asset type            | Factory                                                                                                                                       |
| Native path           | `adf-ganalytics-d1`                                                                                                                           |
| Support role          | Factory / support section root                                                                                                                |
| Business process      | adf-ganalytics-d1 ADF data movement and orchestration                                                                                         |
| Primary source        | DS_SQL_AdQ_SSIS, DS_SQL_AdQ_SonicDW, DS_SQL_AdQ_DynServer, DS_SQL_VendorData                                                                  |
| Primary target/output | not fully surfaced in metadata; inspect pipeline pages                                                                                        |
| Schedule or trigger   | TGR_LoadViewsToTables_Daily, copyDimEntityTables, TGR_LoadViewsToTables_FirstRun_Daily, TGR_LoadViewsToTables_LastRun_Daily                   |
| Runtime/usage signal  | Metadata profiled at 2026-06-29T10:42:03.665Z                                                                                                 |
| Status signal         | active trigger surfaced                                                                                                                       |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-ganalytics-d1/2026-06-29T10-42-03-682Z-594902fe-3591-404d-b693-88159eebfa46.json` |

## Business Use

Use this page as the support entry point for adf-ganalytics-d1. Pipeline pages below explain orchestrators, child loads, source/target datasets, linked service boundaries, and concrete first checks.

## Support Checks

1. Confirm whether an active trigger should have started the pipeline.
2. Check the latest parent or orchestrator pipeline run.
3. Identify the first failed activity or child pipeline.
4. Confirm source datasets, target datasets, and linked-service availability.
5. Do not change triggers, schedules, retries, linked services, or credentials from documentation work.

## Lineage And Dependencies

| Asset type      | Count |
| --------------- | ----: |
| Pipelines       |    17 |
| Triggers        |     4 |
| Datasets        |     4 |
| Linked services |    11 |
| Lineage edges   |   161 |

## Runtime Or Usage Signals

The support cache uses a bounded metadata-profile lookback. It is not a live monitor. Check ADF directly before operational reruns.

## Technical Details

| Pipeline                          | Folder              | Activities | Child pipelines                                         |
| --------------------------------- | ------------------- | ---------: | ------------------------------------------------------- |
| ACT_IF_IsPipelineEnabled          | root                |          0 | none                                                    |
| ACT_IF_IsPipelineEnabled          | root                |          0 | none                                                    |
| ACT_IF_IsPipelineEnabled          | root                |          0 | none                                                    |
| Load_AQ_Adhoc                     | root                |          1 | none                                                    |
| PipelineDisabled                  | root                |          0 | none                                                    |
| PipelineDisabled                  | root                |          0 | none                                                    |
| PipelineDisabled                  | root                |          0 | none                                                    |
| PipelineEnabled                   | root                |          0 | none                                                    |
| PipelineEnabled                   | root                |          0 | none                                                    |
| PipelineEnabled                   | root                |          0 | none                                                    |
| PL_Copy_DimEntity_Child           | CopyEntityTables    |          1 | none                                                    |
| PL_Copy_DimEntity_Master          | CopyEntityTables    |          9 | PL_Copy_DimEntity_Child                                 |
| PL_Load_AdvertisingQueries_Master | Advertising Queries |          9 | none                                                    |
| PL_LoadAQ_CheckParentProcesses    | Advertising Queries |          5 | none                                                    |
| PL_LoadAQ_Full                    | Advertising Queries |          2 | PL_LoadAQ_CheckParentProcesses, PL_LoadAQ_ViewsToTables |
| PL_LoadAQ_RefreshMSTRCubes        | Advertising Queries |          7 | none                                                    |
| PL_LoadAQ_ViewsToTables           | Advertising Queries |          9 | none                                                    |

## Evidence And Caveats

- Generated from saved ADF connector metadata.
- Raw activity output, sample rows, secrets, tokens, and connection strings are not published.
- Missing facts are marked as not surfaced in metadata.
