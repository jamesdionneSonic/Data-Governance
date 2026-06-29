# adf-elead-d1

Generated: 2026-06-29T10:58:58.648Z
Saved connector: `azure-data-factory-adf-elead-d1`
Source profile artifact: `data/markdown/_runtime/profile-runs/azure-data-factory-adf-elead-d1/2026-06-29T10-44-01-752Z-338405aa-fbbd-4157-a7ed-ad8c0fb8bdc3.json`

## Plain-English Summary

adf-elead-d1 is an Azure Data Factory captured by the saved connector runtime. It contains 34 pipeline(s), 6 trigger(s), 10 dataset(s), and 11 linked-service connection record(s). If adf-elead-d1 fails or becomes stale, dependent ADF loads, files, datasets, or downstream reporting may be incomplete until the failed run is diagnosed and rerun through the approved parent path. Start troubleshooting by checking active triggers, then the latest root or orchestrator pipeline run.

## At a Glance

| Field                 | Value                                                                                                                                    |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | ADF                                                                                                                                      |
| Asset type            | Factory                                                                                                                                  |
| Native path           | `adf-elead-d1`                                                                                                                           |
| Support role          | Factory / support section root                                                                                                           |
| Business process      | adf-elead-d1 ADF data movement and orchestration                                                                                         |
| Primary source        | DS_SFTP_TEXT_AutoTrader, DS_SFTP_Elead_Files_Src_New, DS_SFTP_TEXT_Carmax_zip, DS_SFTP_Elead_Files_Dest, DS_ABLB_Elead_Files_Src         |
| Primary target/output | not fully surfaced in metadata; inspect pipeline pages                                                                                   |
| Schedule or trigger   | Elead_StoreRegionMapping, Elead_Data_Validation, Elead_Daily, Elead_Mkt_Campaign_Monthly                                                 |
| Runtime/usage signal  | Metadata profiled at 2026-06-29T10:44:01.731Z                                                                                            |
| Status signal         | active trigger surfaced                                                                                                                  |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-elead-d1/2026-06-29T10-44-01-752Z-338405aa-fbbd-4157-a7ed-ad8c0fb8bdc3.json` |

## Business Use

Use this page as the support entry point for adf-elead-d1. Pipeline pages below explain orchestrators, child loads, source/target datasets, linked service boundaries, and concrete first checks.

## Support Checks

1. Confirm whether an active trigger should have started the pipeline.
2. Check the latest parent or orchestrator pipeline run.
3. Identify the first failed activity or child pipeline.
4. Confirm source datasets, target datasets, and linked-service availability.
5. Do not change triggers, schedules, retries, linked services, or credentials from documentation work.

## Lineage And Dependencies

| Asset type      | Count |
| --------------- | ----: |
| Pipelines       |    34 |
| Triggers        |     6 |
| Datasets        |    10 |
| Linked services |    11 |
| Lineage edges   |   520 |

## Runtime Or Usage Signals

The support cache uses a bounded metadata-profile lookback. It is not a live monitor. Check ADF directly before operational reruns.

## Technical Details

| Pipeline                                 | Folder                                                       | Activities | Child pipelines                               |
| ---------------------------------------- | ------------------------------------------------------------ | ---------: | --------------------------------------------- |
| ACT_IF_IsPipelineEnabled                 | root                                                         |          0 | none                                          |
| ACT_LKP_UpdatePackageLoadDateSync        | root                                                         |          0 | none                                          |
| PackageLoadDateSync                      | root                                                         |          0 | none                                          |
| PackageLoadDateSync                      | root                                                         |          0 | none                                          |
| PackageLoadDateSync                      | root                                                         |          0 | none                                          |
| PackageLoadDateSync                      | root                                                         |          0 | none                                          |
| PackageLoadDateSync                      | root                                                         |          0 | none                                          |
| PL_Adhoc_UpdatePackageLoadDateSync       | 04_ETL_Mkt_Campaign_Monthly_Reports_Workload/05_Elead_Adhocs |          2 | none                                          |
| PL_Adhoc_UpdatePackageLoadDateSync_copy1 | 04_ETL_Mkt_Campaign_Monthly_Reports_Workload/05_Elead_Adhocs |          2 | none                                          |
| PL_Elead_Data_Validation_Master          | 02_Sanity_Check                                              |         11 | none                                          |
| PL_Elead_GEC_Active_Stores_Review        | 02_Sanity_Check                                              |         12 | none                                          |
| PL_Elead_Historical_Load                 | 01_ETL_Workload                                              |          4 | none                                          |
| PL_Elead_Incremental_Load                | 01_ETL_Workload                                              |         16 | PL_Elead_EAPS_Files, PL_Elead_GECReport_Files |
| PL_Elead_Insert_Logs                     | 03_Daily_Copy_Files_To_Amplifai                              |          1 | none                                          |
| PL_Elead_LoadDimStoreRegionMapping       | 06_Region_Mapping                                            |          5 | none                                          |
| PL_Elead_Master                          | 01_ETL_Workload                                              |         11 | PL_Elead_Incremental_Load                     |
| PL_Elead_Mkt_Campaign_Historical_Support | 04_ETL_Mkt_Campaign_Monthly_Reports_Workload                 |          6 | none                                          |
| PL_Elead_Mkt_Campaign_Incremental        | 04_ETL_Mkt_Campaign_Monthly_Reports_Workload                 |         15 | PL_Mkt_Campaign_Insert_Logs                   |
| PL_Elead_Mkt_Campaign_Master             | 04_ETL_Mkt_Campaign_Monthly_Reports_Workload                 |         12 | none                                          |
| PL_Elead_MTD_Leads_Comparison            | 02_Sanity_Check                                              |          9 | none                                          |
| PL_Elead_RegionMappingMaster             | 06_Region_Mapping                                            |          8 | PL_Elead_LoadDimStoreRegionMapping            |
| PL_Elead_Report_Generator                | 01_ETL_Workload                                              |          2 | none                                          |
| PL_Elead_Summary_Report_Generator        | 01_ETL_Workload                                              |         10 | none                                          |
| PL_Meta_InsertLogs                       | 01_ETL_Workload                                              |          1 | none                                          |
| PL_Mkt_Campaign_Insert_Logs              | 04_ETL_Mkt_Campaign_Monthly_Reports_Workload                 |          1 | none                                          |
| SelfHosted-IR-D1-SSIS-02                 | root                                                         |          0 | none                                          |
| Update PackageLoadDateSync               | root                                                         |          0 | none                                          |
| Update PackageLoadDateSync               | root                                                         |          0 | none                                          |
| Update PackageLoadDateSync               | root                                                         |          0 | none                                          |
| Update_PackageLoadDateSync               | root                                                         |          0 | none                                          |
| Update_PackageLoadDateSync               | root                                                         |          0 | none                                          |
| UpdatePackageLoadDateSync                | root                                                         |          0 | none                                          |
| UpdatePackageLoadDateSync                | root                                                         |          0 | none                                          |
| UpsertLogsPackageLoadDateSync            | root                                                         |          0 | none                                          |

## Evidence And Caveats

- Generated from saved ADF connector metadata.
- Raw activity output, sample rows, secrets, tokens, and connection strings are not published.
- Missing facts are marked as not surfaced in metadata.
