# adf-mci-d1

Generated: 2026-06-29T10:58:58.310Z
Saved connector: `azure-data-factory-adf-mci-d1`
Source profile artifact: `data/markdown/_runtime/profile-runs/azure-data-factory-adf-mci-d1/2026-06-29T10-38-55-091Z-34f3170a-d1ea-4186-b53f-3f09641fbeae.json`

## Plain-English Summary

adf-mci-d1 is an Azure Data Factory captured by the saved connector runtime. It contains 18 pipeline(s), 4 trigger(s), 22 dataset(s), and 15 linked-service connection record(s). If adf-mci-d1 fails or becomes stale, dependent ADF loads, files, datasets, or downstream reporting may be incomplete until the failed run is diagnosed and rerun through the approved parent path. Start troubleshooting by checking active triggers, then the latest root or orchestrator pipeline run.

## At a Glance

| Field                 | Value                                                                                                                                  |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | ADF                                                                                                                                    |
| Asset type            | Factory                                                                                                                                |
| Native path           | `adf-mci-d1`                                                                                                                           |
| Support role          | Factory / support section root                                                                                                         |
| Business process      | adf-mci-d1 ADF data movement and orchestration                                                                                         |
| Primary source        | DS_SFTP_EPLeadSale, DS_SFTP_EPCallsource, DS_SQL_EPLeadSale, DS_SQL_SSIS_Meta, DS_SQL_EPCallSource                                     |
| Primary target/output | not fully surfaced in metadata; inspect pipeline pages                                                                                 |
| Schedule or trigger   | Tr_LeadSale_Daily, Tr_CallSource_Daily, Tr_CarGurusDaily, Tr_Acquisition_Daily                                                         |
| Runtime/usage signal  | Metadata profiled at 2026-06-29T10:38:55.070Z                                                                                          |
| Status signal         | active trigger surfaced                                                                                                                |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-mci-d1/2026-06-29T10-38-55-091Z-34f3170a-d1ea-4186-b53f-3f09641fbeae.json` |

## Business Use

Use this page as the support entry point for adf-mci-d1. Pipeline pages below explain orchestrators, child loads, source/target datasets, linked service boundaries, and concrete first checks.

## Support Checks

1. Confirm whether an active trigger should have started the pipeline.
2. Check the latest parent or orchestrator pipeline run.
3. Identify the first failed activity or child pipeline.
4. Confirm source datasets, target datasets, and linked-service availability.
5. Do not change triggers, schedules, retries, linked services, or credentials from documentation work.

## Lineage And Dependencies

| Asset type      | Count |
| --------------- | ----: |
| Pipelines       |    18 |
| Triggers        |     4 |
| Datasets        |    22 |
| Linked services |    15 |
| Lineage edges   |   398 |

## Runtime Or Usage Signals

The support cache uses a bounded metadata-profile lookback. It is not a live monitor. Check ADF directly before operational reruns.

## Technical Details

| Pipeline                               | Folder               | Activities | Child pipelines            |
| -------------------------------------- | -------------------- | ---------: | -------------------------- |
| PL_MCI_Acquisition                     | Acquisition          |          9 | none                       |
| PL_MCI_Acquisition_Incremental         | Acquisition          |          9 | PL_MCI_Acquisition         |
| PL_MCI_Acquisition_Master              | Acquisition          |          6 | none                       |
| PL_MCI_CarGurus                        | MCI CarGurus         |         10 | none                       |
| PL_MCI_CarGurus_Incremental            | MCI CarGurus         |          9 | PL_MCI_CarGurus            |
| PL_MCI_CarGurus_Master                 | MCI CarGurus         |          6 | none                       |
| PL_MCI_EPCallSource                    | CallSource           |          9 | none                       |
| PL_MCI_EPCallSource_Incremental        | CallSource           |          9 | PL_MCI_EPCallSource        |
| PL_MCI_EPCallSource_Master             | CallSource           |          6 | none                       |
| PL_MCI_EPLeadSale                      | LeadSale             |          9 | none                       |
| PL_MCI_EPLeadSale_Incremental          | LeadSale             |          9 | PL_MCI_EPLeadSale          |
| PL_MCI_EPLeadSale_Master               | LeadSale             |          6 | none                       |
| PL_MCI_EPTrafficLeadSale               | EP TrafficLeadSale   |         10 | none                       |
| PL_MCI_EPTrafficLeadSale_Incremental   | EP TrafficLeadSale   |          9 | PL_MCI_EPTrafficLeadSale   |
| PL_MCI_EPTrafficLeadSale_Master        | EP TrafficLeadSale   |          6 | none                       |
| PL_MCI_NWMSTrafficLeadSale             | NWMS TrafficLeadSale |         10 | none                       |
| PL_MCI_NWMSTrafficLeadSale_Incremental | NWMS TrafficLeadSale |          9 | PL_MCI_NWMSTrafficLeadSale |
| PL_MCI_NWMSTrafficLeadSale_Master      | NWMS TrafficLeadSale |          6 | none                       |

## Evidence And Caveats

- Generated from saved ADF connector metadata.
- Raw activity output, sample rows, secrets, tokens, and connection strings are not published.
- Missing facts are marked as not surfaced in metadata.
