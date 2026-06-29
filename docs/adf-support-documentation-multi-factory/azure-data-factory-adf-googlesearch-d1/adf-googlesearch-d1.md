# adf-googlesearch-d1

Generated: 2026-06-29T10:58:57.471Z
Saved connector: `azure-data-factory-adf-googlesearch-d1`
Source profile artifact: `data/markdown/_runtime/profile-runs/azure-data-factory-adf-googlesearch-d1/2026-06-29T10-13-07-708Z-7a609b5f-65c7-491c-bb59-b36c758eb21b.json`

## Plain-English Summary

adf-googlesearch-d1 is an Azure Data Factory captured by the saved connector runtime. It contains 8 pipeline(s), 2 trigger(s), 7 dataset(s), and 9 linked-service connection record(s). If adf-googlesearch-d1 fails or becomes stale, dependent ADF loads, files, datasets, or downstream reporting may be incomplete until the failed run is diagnosed and rerun through the approved parent path. Start troubleshooting by checking active triggers, then the latest root or orchestrator pipeline run.

## At a Glance

| Field                 | Value                                                                                                                                           |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | ADF                                                                                                                                             |
| Asset type            | Factory                                                                                                                                         |
| Native path           | `adf-googlesearch-d1`                                                                                                                           |
| Support role          | Factory / support section root                                                                                                                  |
| Business process      | adf-googlesearch-d1 ADF data movement and orchestration                                                                                         |
| Primary source        | DS_ABLB_GSC_Files_Lookup_Src, DS_SQL_GSC_StgTables, DS_SQL_GSC_SonicDW, DS_SQL_SSIS, DS_SQL_GSC_ETLStaging                                      |
| Primary target/output | not fully surfaced in metadata; inspect pipeline pages                                                                                          |
| Schedule or trigger   | no active triggers surfaced                                                                                                                     |
| Runtime/usage signal  | Metadata profiled at 2026-06-29T10:13:07.704Z                                                                                                   |
| Status signal         | metadata available                                                                                                                              |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-googlesearch-d1/2026-06-29T10-13-07-708Z-7a609b5f-65c7-491c-bb59-b36c758eb21b.json` |

## Business Use

Use this page as the support entry point for adf-googlesearch-d1. Pipeline pages below explain orchestrators, child loads, source/target datasets, linked service boundaries, and concrete first checks.

## Support Checks

1. Confirm whether an active trigger should have started the pipeline.
2. Check the latest parent or orchestrator pipeline run.
3. Identify the first failed activity or child pipeline.
4. Confirm source datasets, target datasets, and linked-service availability.
5. Do not change triggers, schedules, retries, linked services, or credentials from documentation work.

## Lineage And Dependencies

| Asset type      | Count |
| --------------- | ----: |
| Pipelines       |     8 |
| Triggers        |     2 |
| Datasets        |     7 |
| Linked services |     9 |
| Lineage edges   |   169 |

## Runtime Or Usage Signals

The support cache uses a bounded metadata-profile lookback. It is not a live monitor. Check ADF directly before operational reruns.

## Technical Details

| Pipeline                              | Folder                | Activities | Child pipelines                                                                                                    |
| ------------------------------------- | --------------------- | ---------: | ------------------------------------------------------------------------------------------------------------------ |
| ACT_FAIL_PipelineDisabled             | root                  |          0 | none                                                                                                               |
| ACT_IF_IsPipelineEnabled              | root                  |          0 | none                                                                                                               |
| ACT_SCR_UpdateMetaPackageLoadDateSync | root                  |          0 | none                                                                                                               |
| GoogleSearchConsole_Master            | Google_Search_Console |          9 | GSC_Incremental_Load                                                                                               |
| GSC_Incremental_Load                  | Google_Search_Console |         22 | GSC_Load_Phase1DailyFiles, GSC_Load_Phase2StagingTables, GSC_Load_Phase2DimensionTables, GSC_Load_Phase2FactTables |
| GSC_Load_Phase2DimensionTables        | Google_Search_Console |          2 | none                                                                                                               |
| GSC_Load_Phase2FactTables             | Google_Search_Console |          3 | none                                                                                                               |
| SelfHosted-IR-D1-SSIS-02              | root                  |          0 | none                                                                                                               |

## Evidence And Caveats

- Generated from saved ADF connector metadata.
- Raw activity output, sample rows, secrets, tokens, and connection strings are not published.
- Missing facts are marked as not surfaced in metadata.
