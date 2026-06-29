# adf-vehiclemart-prod

Generated: 2026-06-29T10:58:57.606Z
Saved connector: `azure-data-factory-adf-vehiclemart-prod`
Source profile artifact: `data/markdown/_runtime/profile-runs/azure-data-factory-adf-vehiclemart-prod/2026-06-29T10-50-13-472Z-a59436b0-d570-4f84-beb9-99db50a52663.json`

## Plain-English Summary

adf-vehiclemart-prod is an Azure Data Factory captured by the saved connector runtime. It contains 19 pipeline(s), 6 trigger(s), 152 dataset(s), and 31 linked-service connection record(s). If adf-vehiclemart-prod fails or becomes stale, dependent ADF loads, files, datasets, or downstream reporting may be incomplete until the failed run is diagnosed and rerun through the approved parent path. Start troubleshooting by checking active triggers, then the latest root or orchestrator pipeline run.

## At a Glance

| Field                 | Value                                                                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Platform              | ADF                                                                                                                                              |
| Asset type            | Factory                                                                                                                                          |
| Native path           | `adf-vehiclemart-prod`                                                                                                                           |
| Support role          | Factory / support section root                                                                                                                   |
| Business process      | adf-vehiclemart-prod ADF data movement and orchestration                                                                                         |
| Primary source        | AT_Src_Binary_SharedFolder, AT_Src_SharedFolder, AT_Blob_Archive, AT_Hyp_Test_StageTable, AT_Sonic_Input                                         |
| Primary target/output | not fully surfaced in metadata; inspect pipeline pages                                                                                           |
| Schedule or trigger   | no active triggers surfaced                                                                                                                      |
| Runtime/usage signal  | Metadata profiled at 2026-06-29T10:50:13.458Z                                                                                                    |
| Status signal         | metadata available                                                                                                                               |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-vehiclemart-prod/2026-06-29T10-50-13-472Z-a59436b0-d570-4f84-beb9-99db50a52663.json` |

## Business Use

Use this page as the support entry point for adf-vehiclemart-prod. Pipeline pages below explain orchestrators, child loads, source/target datasets, linked service boundaries, and concrete first checks.

## Support Checks

1. Confirm whether an active trigger should have started the pipeline.
2. Check the latest parent or orchestrator pipeline run.
3. Identify the first failed activity or child pipeline.
4. Confirm source datasets, target datasets, and linked-service availability.
5. Do not change triggers, schedules, retries, linked services, or credentials from documentation work.

## Lineage And Dependencies

| Asset type      | Count |
| --------------- | ----: |
| Pipelines       |    19 |
| Triggers        |     6 |
| Datasets        |   152 |
| Linked services |    31 |
| Lineage edges   |   579 |

## Runtime Or Usage Signals

The support cache uses a bounded metadata-profile lookback. It is not a live monitor. Check ADF directly before operational reruns.

## Technical Details

| Pipeline                      | Folder                                           | Activities | Child pipelines |
| ----------------------------- | ------------------------------------------------ | ---------: | --------------- |
| activityMonitor               | POC/Debasish                                     |          2 | none            |
| activityMonitor_all_list      | POC/Debasish                                     |          2 | none            |
| AT_Auto_Trigger_ManualRun     | AT_Source                                        |          7 | none            |
| Check Pipeline Status         | root                                             |          0 | none            |
| check_elead_sp                | root                                             |          1 | none            |
| Exec AT Manual Pipeline       | root                                             |          0 | none            |
| FB_SM_Ads_DailyLoad_v1_2      | Facebook/FB SM Incremental/SM v1_2 - Recent Data |         13 | none            |
| FB_SM_Ads_Master_v1_2         | Facebook/FB SM Incremental/SM v1_2 - Recent Data |          6 | none            |
| FB_SM_Ads_MonthlyLoad_v1_2    | Facebook/FB SM Incremental/SM v1_2 - Recent Data |         12 | none            |
| HistoricalData_Movement       | AT_Source                                        |          3 | none            |
| Mail From Prod                | root                                             |          1 | none            |
| MailFromDServer               | POC/Soundarya                                    |          1 | none            |
| SharedSelfHostedIR-D1-SSIS-01 | root                                             |          0 | none            |
| SharedSelfHostedIR-D1-SSIS-02 | root                                             |          0 | none            |
| SSIS_AuditTable               | root                                             |          0 | none            |
| Update Pipeline Status        | root                                             |          0 | none            |
| Update Pipeline Status        | root                                             |          0 | none            |
| Update Pipeline Status        | root                                             |          0 | none            |
| Update Pipeline Status        | root                                             |          0 | none            |

## Evidence And Caveats

- Generated from saved ADF connector metadata.
- Raw activity output, sample rows, secrets, tokens, and connection strings are not published.
- Missing facts are marked as not surfaced in metadata.
