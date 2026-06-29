# adf-reputationmgmt-d1

Generated: 2026-06-29T10:58:57.766Z
Saved connector: `azure-data-factory-adf-reputationmgmt-d1`
Source profile artifact: `data/markdown/_runtime/profile-runs/azure-data-factory-adf-reputationmgmt-d1/2026-06-29T10-16-34-166Z-e6bc6e30-cbf6-451f-bf23-2f2942845302.json`

## Plain-English Summary

adf-reputationmgmt-d1 is an Azure Data Factory captured by the saved connector runtime. It contains 12 pipeline(s), 2 trigger(s), 7 dataset(s), and 13 linked-service connection record(s). If adf-reputationmgmt-d1 fails or becomes stale, dependent ADF loads, files, datasets, or downstream reporting may be incomplete until the failed run is diagnosed and rerun through the approved parent path. Start troubleshooting by checking active triggers, then the latest root or orchestrator pipeline run.

## At a Glance

| Field                 | Value                                                                                                                                             |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | ADF                                                                                                                                               |
| Asset type            | Factory                                                                                                                                           |
| Native path           | `adf-reputationmgmt-d1`                                                                                                                           |
| Support role          | Factory / support section root                                                                                                                    |
| Business process      | adf-reputationmgmt-d1 ADF data movement and orchestration                                                                                         |
| Primary source        | DS_ABLB_RM_Files, DS_ABLB_RM_Files_Src, DS_SQL_RM_SSIS_ProcessedFiles, DS_SQL_RM_VendorData, DS_SQL_RM_SonicDW                                    |
| Primary target/output | not fully surfaced in metadata; inspect pipeline pages                                                                                            |
| Schedule or trigger   | RMLoadDaily                                                                                                                                       |
| Runtime/usage signal  | Metadata profiled at 2026-06-29T10:16:34.135Z                                                                                                     |
| Status signal         | active trigger surfaced                                                                                                                           |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-reputationmgmt-d1/2026-06-29T10-16-34-166Z-e6bc6e30-cbf6-451f-bf23-2f2942845302.json` |

## Business Use

Use this page as the support entry point for adf-reputationmgmt-d1. Pipeline pages below explain orchestrators, child loads, source/target datasets, linked service boundaries, and concrete first checks.

## Support Checks

1. Confirm whether an active trigger should have started the pipeline.
2. Check the latest parent or orchestrator pipeline run.
3. Identify the first failed activity or child pipeline.
4. Confirm source datasets, target datasets, and linked-service availability.
5. Do not change triggers, schedules, retries, linked services, or credentials from documentation work.

## Lineage And Dependencies

| Asset type      | Count |
| --------------- | ----: |
| Pipelines       |    12 |
| Triggers        |     2 |
| Datasets        |     7 |
| Linked services |    13 |
| Lineage edges   |   225 |

## Runtime Or Usage Signals

The support cache uses a bounded metadata-profile lookback. It is not a live monitor. Check ADF directly before operational reruns.

## Technical Details

| Pipeline                         | Folder | Activities | Child pipelines         |
| -------------------------------- | ------ | ---------: | ----------------------- |
| IsPipelineEnabled                | root   |          0 | none                    |
| PipelineDisabled                 | root   |          0 | none                    |
| PipelineEnabled                  | root   |          0 | none                    |
| RepMgmt_IncrementalLoad          | root   |         15 | none                    |
| RepMgmt_Load_Phase2Dimension     | root   |          6 | none                    |
| RepMgmt_Load_Phase2Fact          | root   |          5 | none                    |
| ReputationManagement_Master      | root   |         14 | RepMgmt_IncrementalLoad |
| UpdatePackageLoadDateSyncMetrics | root   |          0 | none                    |
| UpdatePackageLoadDateSyncMetrics | root   |          0 | none                    |
| UpdatePackageLoadDateSyncMonthly | root   |          0 | none                    |
| UpdatePackageLoadDateSyncReviews | root   |          0 | none                    |
| UpdatePackageLoadDateSyncStores  | root   |          0 | none                    |

## Evidence And Caveats

- Generated from saved ADF connector metadata.
- Raw activity output, sample rows, secrets, tokens, and connection strings are not published.
- Missing facts are marked as not surfaced in metadata.
