# adf-reconpro-d1

Generated: 2026-06-29T10:58:58.096Z
Saved connector: `azure-data-factory-adf-reconpro-d1`
Source profile artifact: `data/markdown/_runtime/profile-runs/azure-data-factory-adf-reconpro-d1/2026-06-29T10-36-22-878Z-99482e31-df3e-4e9d-a5f0-9226a03807f7.json`

## Plain-English Summary

adf-reconpro-d1 is an Azure Data Factory captured by the saved connector runtime. It contains 26 pipeline(s), 3 trigger(s), 46 dataset(s), and 8 linked-service connection record(s). If adf-reconpro-d1 fails or becomes stale, dependent ADF loads, files, datasets, or downstream reporting may be incomplete until the failed run is diagnosed and rerun through the approved parent path. Start troubleshooting by checking active triggers, then the latest root or orchestrator pipeline run.

## At a Glance

| Field                 | Value                                                                                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | ADF                                                                                                                                         |
| Asset type            | Factory                                                                                                                                     |
| Native path           | `adf-reconpro-d1`                                                                                                                           |
| Support role          | Factory / support section root                                                                                                              |
| Business process      | adf-reconpro-d1 ADF data movement and orchestration                                                                                         |
| Primary source        | DS_BLB_DeleteFile, DS_ABLB_ReconPro_Files_Archive, DS_ABLB_ReconPro_Files_Lookup_Src, DS_ABLB_ReconPro_Files_Src, DS_SQL_StageStagingDB     |
| Primary target/output | not fully surfaced in metadata; inspect pipeline pages                                                                                      |
| Schedule or trigger   | TRG_StoreLocationHours, TRG_ReconPro                                                                                                        |
| Runtime/usage signal  | Metadata profiled at 2026-06-29T10:36:22.840Z                                                                                               |
| Status signal         | active trigger surfaced                                                                                                                     |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-reconpro-d1/2026-06-29T10-36-22-878Z-99482e31-df3e-4e9d-a5f0-9226a03807f7.json` |

## Business Use

Use this page as the support entry point for adf-reconpro-d1. Pipeline pages below explain orchestrators, child loads, source/target datasets, linked service boundaries, and concrete first checks.

## Support Checks

1. Confirm whether an active trigger should have started the pipeline.
2. Check the latest parent or orchestrator pipeline run.
3. Identify the first failed activity or child pipeline.
4. Confirm source datasets, target datasets, and linked-service availability.
5. Do not change triggers, schedules, retries, linked services, or credentials from documentation work.

## Lineage And Dependencies

| Asset type      | Count |
| --------------- | ----: |
| Pipelines       |    26 |
| Triggers        |     3 |
| Datasets        |    46 |
| Linked services |     8 |
| Lineage edges   |   525 |

## Runtime Or Usage Signals

The support cache uses a bounded metadata-profile lookback. It is not a live monitor. Check ADF directly before operational reruns.

## Technical Details

| Pipeline                    | Folder                    | Activities | Child pipelines                        |
| --------------------------- | ------------------------- | ---------: | -------------------------------------- |
| ACT_LKP_PackageLoadDateSync | root                      |          0 | none                                   |
| ACT_LKP_PackageLoadDateSync | root                      |          0 | none                                   |
| ACT_LKP_PackageLoadDateSync | root                      |          0 | none                                   |
| ACT_LKP_PackageLoadDateSync | root                      |          0 | none                                   |
| ACT_LKP_PackageLoadDateSync | root                      |          0 | none                                   |
| Hist_Vendordata tables      | History                   |          8 | none                                   |
| PL_Inspections              | Reconpro Incremental Load |          2 | none                                   |
| PL_Inspections_old          | Reconpro Incremental Load |          2 | none                                   |
| PL_Meta_InsertLogs          | Reconpro Incremental Load |          3 | none                                   |
| PL_Meta_InsertLogs_copy1    | ReconPro_Fix              |          3 | none                                   |
| PL_Orders                   | Reconpro Incremental Load |          4 | none                                   |
| PL_Orders_copy1             | ReconPro_Fix              |          2 | none                                   |
| PL_Orders_old               | Reconpro Incremental Load |          4 | none                                   |
| PL_Recon_DirtReportWIP      | DirtReport_Metrics        |          5 | none                                   |
| PL_Recon_DirtReportWIP2     | DirtReport_Metrics        |          5 | none                                   |
| PL_Recon_DirtReportWIP21    | DirtReport_Metrics        |          5 | none                                   |
| PL_ReconPro_Child           | Reconpro Incremental Load |         14 | PL_Orders, PL_Inspections, PL_Services |
| PL_ReconPro_Child_copy1     | ReconPro_Fix              |         15 | none                                   |
| PL_ReconPro_Master          | Reconpro Incremental Load |         12 | PL_ReconPro_Child                      |
| PL_ReconPro_Master_copy1    | ReconPro_Fix              |         11 | PL_ReconPro_Child_copy1                |
| PL_Services                 | Reconpro Incremental Load |          2 | none                                   |
| PL_Services_old             | Reconpro Incremental Load |          2 | none                                   |
| PL_SSISTables               | History                   |          1 | none                                   |
| PL_StoreWorkingHours_Child  | StoreHours                |         11 | none                                   |
| PL_StoreWorkingHours_Master | StoreHours                |         11 | PL_StoreWorkingHours_Child             |
| VendorData_Tables           | History                   |         11 | none                                   |

## Evidence And Caveats

- Generated from saved ADF connector metadata.
- Raw activity output, sample rows, secrets, tokens, and connection strings are not published.
- Missing facts are marked as not surfaced in metadata.
