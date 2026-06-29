# adf-xtime-d1

Generated: 2026-06-29T10:58:57.515Z
Saved connector: `azure-data-factory-adf-xtime-d1`
Source profile artifact: `data/markdown/_runtime/profile-runs/azure-data-factory-adf-xtime-d1/2026-06-29T10-13-27-065Z-22cec896-d7e0-42fe-b489-d705857e7fcf.json`

## Plain-English Summary

adf-xtime-d1 is an Azure Data Factory captured by the saved connector runtime. It contains 2 pipeline(s), 1 trigger(s), 5 dataset(s), and 7 linked-service connection record(s). If adf-xtime-d1 fails or becomes stale, dependent ADF loads, files, datasets, or downstream reporting may be incomplete until the failed run is diagnosed and rerun through the approved parent path. Start troubleshooting by checking active triggers, then the latest root or orchestrator pipeline run.

## At a Glance

| Field                 | Value                                                                                                                                    |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | ADF                                                                                                                                      |
| Asset type            | Factory                                                                                                                                  |
| Native path           | `adf-xtime-d1`                                                                                                                           |
| Support role          | Factory / support section root                                                                                                           |
| Business process      | adf-xtime-d1 ADF data movement and orchestration                                                                                         |
| Primary source        | DS_ABLB_XTime_Archive, DS_SFTP_XTime_src, DS_SQL_VendorData_Xtime, DS_SQL_SSIS_Xtime, DS_SQL_StagingDB_Xtime                             |
| Primary target/output | not fully surfaced in metadata; inspect pipeline pages                                                                                   |
| Schedule or trigger   | no active triggers surfaced                                                                                                              |
| Runtime/usage signal  | Metadata profiled at 2026-06-29T10:13:27.063Z                                                                                            |
| Status signal         | metadata available                                                                                                                       |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-xtime-d1/2026-06-29T10-13-27-065Z-22cec896-d7e0-42fe-b489-d705857e7fcf.json` |

## Business Use

Use this page as the support entry point for adf-xtime-d1. Pipeline pages below explain orchestrators, child loads, source/target datasets, linked service boundaries, and concrete first checks.

## Support Checks

1. Confirm whether an active trigger should have started the pipeline.
2. Check the latest parent or orchestrator pipeline run.
3. Identify the first failed activity or child pipeline.
4. Confirm source datasets, target datasets, and linked-service availability.
5. Do not change triggers, schedules, retries, linked services, or credentials from documentation work.

## Lineage And Dependencies

| Asset type      | Count |
| --------------- | ----: |
| Pipelines       |     2 |
| Triggers        |     1 |
| Datasets        |     5 |
| Linked services |     7 |
| Lineage edges   |    84 |

## Runtime Or Usage Signals

The support cache uses a bounded metadata-profile lookback. It is not a live monitor. Check ADF directly before operational reruns.

## Technical Details

| Pipeline                  | Folder | Activities | Child pipelines           |
| ------------------------- | ------ | ---------: | ------------------------- |
| PL_Xtime_Incremental_Load | root   |         13 | none                      |
| PL_Xtime_Master           | root   |         10 | PL_Xtime_Incremental_Load |

## Evidence And Caveats

- Generated from saved ADF connector metadata.
- Raw activity output, sample rows, secrets, tokens, and connection strings are not published.
- Missing facts are marked as not surfaced in metadata.
