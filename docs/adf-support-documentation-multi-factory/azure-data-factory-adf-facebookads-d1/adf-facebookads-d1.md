# adf-facebookads-d1

Generated: 2026-06-29T10:58:57.854Z
Saved connector: `azure-data-factory-adf-facebookads-d1`
Source profile artifact: `data/markdown/_runtime/profile-runs/azure-data-factory-adf-facebookads-d1/2026-06-29T10-33-50-098Z-594847ac-c07a-4c43-9ce6-d0688eb80812.json`

## Plain-English Summary

adf-facebookads-d1 is an Azure Data Factory captured by the saved connector runtime. It contains 13 pipeline(s), 4 trigger(s), 11 dataset(s), and 10 linked-service connection record(s). If adf-facebookads-d1 fails or becomes stale, dependent ADF loads, files, datasets, or downstream reporting may be incomplete until the failed run is diagnosed and rerun through the approved parent path. Start troubleshooting by checking active triggers, then the latest root or orchestrator pipeline run.

## At a Glance

| Field                 | Value                                                                                                                                          |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | ADF                                                                                                                                            |
| Asset type            | Factory                                                                                                                                        |
| Native path           | `adf-facebookads-d1`                                                                                                                           |
| Support role          | Factory / support section root                                                                                                                 |
| Business process      | adf-facebookads-d1 ADF data movement and orchestration                                                                                         |
| Primary source        | DS_ABLB_FBAds_Files_Archive, DS_ABLB_FBAds_Files, DS_ABLB_FBAds_Files_Src, DS_SQL_FB_SM_SSIS_ProcessedFiles, DS_SQL_FBAds_ETLStaging           |
| Primary target/output | not fully surfaced in metadata; inspect pipeline pages                                                                                         |
| Schedule or trigger   | FacebookAdsDaily, FacebookAdsMonthly                                                                                                           |
| Runtime/usage signal  | Metadata profiled at 2026-06-29T10:33:50.083Z                                                                                                  |
| Status signal         | active trigger surfaced                                                                                                                        |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-facebookads-d1/2026-06-29T10-33-50-098Z-594847ac-c07a-4c43-9ce6-d0688eb80812.json` |

## Business Use

Use this page as the support entry point for adf-facebookads-d1. Pipeline pages below explain orchestrators, child loads, source/target datasets, linked service boundaries, and concrete first checks.

## Support Checks

1. Confirm whether an active trigger should have started the pipeline.
2. Check the latest parent or orchestrator pipeline run.
3. Identify the first failed activity or child pipeline.
4. Confirm source datasets, target datasets, and linked-service availability.
5. Do not change triggers, schedules, retries, linked services, or credentials from documentation work.

## Lineage And Dependencies

| Asset type      | Count |
| --------------- | ----: |
| Pipelines       |    13 |
| Triggers        |     4 |
| Datasets        |    11 |
| Linked services |    10 |
| Lineage edges   |   349 |

## Runtime Or Usage Signals

The support cache uses a bounded metadata-profile lookback. It is not a live monitor. Check ADF directly before operational reruns.

## Technical Details

| Pipeline                                      | Folder               | Activities | Child pipelines                          |
| --------------------------------------------- | -------------------- | ---------: | ---------------------------------------- |
| ACT_FAIL_PipelineDisabled                     | root                 |          0 | none                                     |
| ACT_FAIL_PipelineDisabled                     | root                 |          0 | none                                     |
| ACT_IF_IsPipelineEnabled                      | root                 |          0 | none                                     |
| ACT_IF_IsPipelineEnabled                      | root                 |          0 | none                                     |
| ACT_WAIT_PipelineEnabled                      | root                 |          0 | none                                     |
| ACT_WAIT_PipelineEnabled                      | root                 |          0 | none                                     |
| PL_FacebookAds_Master                         | FBAdsCampaign        |         14 | PL_FBAds_IncrementalLoad                 |
| PL_FBAds_IncrementalLoad                      | FBAdsCampaign        |         15 | none                                     |
| PL_FBAds_Load_Phase2DailyData                 | FBAdsCampaign        |          8 | none                                     |
| PL_FBAds_Load_Phase2MonthlyData               | FBAdsCampaign        |          8 | none                                     |
| PL_FBAds_OfflineMetrices_IncrementalLoad      | FBAdsOfflineMetrices |         17 | none                                     |
| PL_FBAds_OfflineMetrices_Load_Phase2DailyData | FBAdsOfflineMetrices |          9 | none                                     |
| PL_FBAds_OfflineMetrices_Master               | FBAdsOfflineMetrices |         14 | PL_FBAds_OfflineMetrices_IncrementalLoad |

## Evidence And Caveats

- Generated from saved ADF connector metadata.
- Raw activity output, sample rows, secrets, tokens, and connection strings are not published.
- Missing facts are marked as not surfaced in metadata.
