# adf-admin-d1

Generated: 2026-06-29T10:58:57.425Z
Saved connector: `azure-data-factory-adf-admin-d1`
Source profile artifact: `data/markdown/_runtime/profile-runs/azure-data-factory-adf-admin-d1/2026-06-29T10-11-48-578Z-11741f90-76f8-47ce-ab4c-f5d6fa3faf27.json`

## Plain-English Summary

adf-admin-d1 is an Azure Data Factory captured by the saved connector runtime. It contains 0 pipeline(s), 0 trigger(s), 0 dataset(s), and 0 linked-service connection record(s). If adf-admin-d1 fails or becomes stale, dependent ADF loads, files, datasets, or downstream reporting may be incomplete until the failed run is diagnosed and rerun through the approved parent path. Start troubleshooting by checking active triggers, then the latest root or orchestrator pipeline run.

## At a Glance

| Field                 | Value                                                                                                                                    |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | ADF                                                                                                                                      |
| Asset type            | Factory                                                                                                                                  |
| Native path           | `adf-admin-d1`                                                                                                                           |
| Support role          | Factory / support section root                                                                                                           |
| Business process      | adf-admin-d1 ADF data movement and orchestration                                                                                         |
| Primary source        | not surfaced in metadata                                                                                                                 |
| Primary target/output | not fully surfaced in metadata; inspect pipeline pages                                                                                   |
| Schedule or trigger   | no active triggers surfaced                                                                                                              |
| Runtime/usage signal  | Metadata profiled at 2026-06-29T10:11:48.576Z                                                                                            |
| Status signal         | metadata available                                                                                                                       |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-admin-d1/2026-06-29T10-11-48-578Z-11741f90-76f8-47ce-ab4c-f5d6fa3faf27.json` |

## Business Use

Use this page as the support entry point for adf-admin-d1. Pipeline pages below explain orchestrators, child loads, source/target datasets, linked service boundaries, and concrete first checks.

## Support Checks

1. Confirm whether an active trigger should have started the pipeline.
2. Check the latest parent or orchestrator pipeline run.
3. Identify the first failed activity or child pipeline.
4. Confirm source datasets, target datasets, and linked-service availability.
5. Do not change triggers, schedules, retries, linked services, or credentials from documentation work.

## Lineage And Dependencies

| Asset type      | Count |
| --------------- | ----: |
| Pipelines       |     0 |
| Triggers        |     0 |
| Datasets        |     0 |
| Linked services |     0 |
| Lineage edges   |     0 |

## Runtime Or Usage Signals

The support cache uses a bounded metadata-profile lookback. It is not a live monitor. Check ADF directly before operational reruns.

## Technical Details

| Pipeline      | Folder | Activities | Child pipelines |
| ------------- | ------ | ---------: | --------------- |
| none surfaced |        |            |                 |

## Evidence And Caveats

- Generated from saved ADF connector metadata.
- Raw activity output, sample rows, secrets, tokens, and connection strings are not published.
- Missing facts are marked as not surfaced in metadata.
