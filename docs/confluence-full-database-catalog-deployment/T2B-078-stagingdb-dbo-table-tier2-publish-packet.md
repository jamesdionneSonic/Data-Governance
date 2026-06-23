# T2B-078 Tier 2 Batch Publish Packet

## Purpose

This packet prepares a dry-run publish package for the next queued Tier 2 batch
from `docs/DATABASE_CATALOG_TIER2_BATCH_STRATEGY.md`.

It does not publish to Confluence and it does not clean up, archive, delete, or
move pages.

## Recommendation

Ready for review. Live publish requires explicit approval.

## Scope

| Signal                | Value        |
| --------------------- | ------------ |
| Batch                 | `T2B-078`    |
| Platform/Product      | `SQL Server` |
| Database              | `StagingDB`  |
| Schema                | `dbo`        |
| Object type scope     | `table`      |
| Object pages          | 54           |
| Link refresh pages    | 2            |
| Total planned entries | 58           |
| Validation status     | `passed`     |

## Object Pages

| Object                              | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                       |
| ----------------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | ---------------------------------------------------------------------------------------------------------- |
| `StgReconProDocuments`              | table | profiled, review-needed | 0          | 17      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgReconProDocuments`              |
| `StgReconProInspectionVehicles`     | table | profiled, review-needed | 0          | 51      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgReconProInspectionVehicles`     |
| `StgReconProNetWorkPeriods`         | table | profiled, review-needed | 0          | 12      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgReconProNetWorkPeriods`         |
| `StgReconProOrderLogs`              | table | profiled, review-needed | 0          | 10      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgReconProOrderLogs`              |
| `StgReconProOrderPhases`            | table | profiled, review-needed | 0          | 27      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgReconProOrderPhases`            |
| `StgReconProOrderServices`          | table | profiled, review-needed | 0          | 80      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgReconProOrderServices`          |
| `StgReconProOrderVehicles`          | table | profiled, review-needed | 0          | 66      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgReconProOrderVehicles`          |
| `StgReconProServiceOrderQuestions`  | table | profiled, review-needed | 0          | 20      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgReconProServiceOrderQuestions`  |
| `StgReconProServiceReqServices`     | table | profiled, review-needed | 0          | 17      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgReconProServiceReqServices`     |
| `StgReconProTechnicianDetails`      | table | profiled, review-needed | 0          | 12      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgReconProTechnicianDetails`      |
| `StgSIMSEPAutoTrader_DMA_TO_ZIP`    | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSEPAutoTrader_DMA_TO_ZIP`    |
| `StgSIMSEPBookValueResponse_Temp`   | table | profiled, review-needed | 0          | 40      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSEPBookValueResponse_Temp`   |
| `StgSIMSEPFactoryOptions_Temp`      | table | profiled, review-needed | 0          | 26      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSEPFactoryOptions_Temp`      |
| `StgSIMSEPPhotoMarkeyReady`         | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSEPPhotoMarkeyReady`         |
| `StgSIMSEPPriceChangeHistory_Temp`  | table | profiled, review-needed | 0          | 31      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSEPPriceChangeHistory_Temp`  |
| `StgSIMSEPVehicleInventory_temp`    | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSEPVehicleInventory_temp`    |
| `StgSIMSRTBookValueResponse_Temp`   | table | profiled, review-needed | 0          | 40      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSRTBookValueResponse_Temp`   |
| `StgSIMSRTFactoryOptions_Temp`      | table | profiled, review-needed | 0          | 26      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSRTFactoryOptions_Temp`      |
| `StgSIMSRTPhotoMarkeyReady`         | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSRTPhotoMarkeyReady`         |
| `StgSIMSRTPriceChangeHistory_Temp`  | table | profiled, review-needed | 0          | 28      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSRTPriceChangeHistory_Temp`  |
| `StgSIMSRTVehicleInventory_temp`    | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSRTVehicleInventory_temp`    |
| `stgSonicAdv`                       | table | profiled, review-needed | 0          | 11      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / stgSonicAdv`                       |
| `StgSonicLeadsBySource`             | table | profiled, review-needed | 0          | 12      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSonicLeadsBySource`             |
| `StgSonicPageView`                  | table | profiled, review-needed | 0          | 12      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSonicPageView`                  |
| `StgSonicWebstatsByReferrer`        | table | profiled, review-needed | 0          | 14      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSonicWebstatsByReferrer`        |
| `StgWebStatsFTPFile`                | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgWebStatsFTPFile`                |
| `StgWebStatsFTPFile_20220209`       | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgWebStatsFTPFile_20220209`       |
| `tbl_ConnXGroupLocations`           | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / tbl_ConnXGroupLocations`           |
| `temp_Fact_gld`                     | table | profiled, review-needed | 0          | 43      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / temp_Fact_gld`                     |
| `tempkpi`                           | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / tempkpi`                           |
| `test`                              | table | profiled, review-needed | 1          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / test`                              |
| `Test_Fact_gllh`                    | table | profiled, review-needed | 0          | 38      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / Test_Fact_gllh`                    |
| `test_glschedule_staging`           | table | profiled, review-needed | 0          | 13      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / test_glschedule_staging`           |
| `test_load`                         | table | profiled, review-needed | 0          | 358     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / test_load`                         |
| `test_load_1`                       | table | profiled, review-needed | 0          | 358     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / test_load_1`                       |
| `test_load_bad`                     | table | profiled, review-needed | 0          | 360     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / test_load_bad`                     |
| `test_load_bad1`                    | table | profiled, review-needed | 0          | 360     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / test_load_bad1`                    |
| `test_load1`                        | table | profiled, review-needed | 0          | 356     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / test_load1`                        |
| `test_partsinventory_staging`       | table | profiled, review-needed | 0          | 120     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / test_partsinventory_staging`       |
| `test_staging_error_out`            | table | profiled, review-needed | 0          | 137     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / test_staging_error_out`            |
| `test2`                             | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / test2`                             |
| `test3`                             | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / test3`                             |
| `TruncateRecords`                   | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / TruncateRecords`                   |
| `Truncrecords`                      | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / Truncrecords`                      |
| `veh_process_code_staging`          | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / veh_process_code_staging`          |
| `veh_vehicle_stagingII`             | table | profiled, review-needed | 0          | 32      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / veh_vehicle_stagingII`             |
| `Vehicle_Error`                     | table | profiled, review-needed | 0          | 137     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / Vehicle_Error`                     |
| `vehicle_stg_error_sims`            | table | profiled, review-needed | 0          | 251     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / vehicle_stg_error_sims`            |
| `VinSolutionFileList`               | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / VinSolutionFileList`               |
| `WebstatsFileList`                  | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / WebstatsFileList`                  |
| `ZIP_CrossWalkFileList`             | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / ZIP_CrossWalkFileList`             |
| `zzzzz_dbo.boa_tmp_20111109`        | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / zzzzz_dbo.boa_tmp_20111109`        |
| `zzzzz_dbo.GPA_Legal082017`         | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / zzzzz_dbo.GPA_Legal082017`         |
| `zzzzzetl.entity_other_active_lkUp` | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / zzzzzetl.entity_other_active_lkUp` |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-078:publish
```
