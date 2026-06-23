# T2B-045 Tier 2 Batch Publish Packet

## Purpose

This packet prepares a dry-run publish package for the next queued Tier 2 batch
from `docs/DATABASE_CATALOG_TIER2_BATCH_STRATEGY.md`.

It does not publish to Confluence and it does not clean up, archive, delete, or
move pages.

## Recommendation

Ready for review. Live publish requires explicit approval.

## Scope

| Signal                | Value         |
| --------------------- | ------------- |
| Batch                 | `T2B-045`     |
| Platform/Product      | `SQL Server`  |
| Database              | `ETL_Staging` |
| Schema                | `wrk`         |
| Object type scope     | `table`       |
| Object pages          | 75            |
| Link refresh pages    | 2             |
| Total planned entries | 79            |
| Validation status     | `passed`      |

## Object Pages

| Object                                           | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                                      |
| ------------------------------------------------ | ----- | ----------------------- | ---------- | ------- | ---------- | ------------------------------------------------------------------------------------------------------------------------- |
| `FOCUS_NewUsed`                                  | table | profiled, review-needed | 0          | 8       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / FOCUS_NewUsed`                                  |
| `FOCUS_Opportunity_VehicleSoughtXref`            | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / FOCUS_Opportunity_VehicleSoughtXref`            |
| `FOCUS_SCORES_ActiveDealers`                     | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / FOCUS_SCORES_ActiveDealers`                     |
| `FOCUS_SCORES_to_delete`                         | table | profiled, review-needed | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / FOCUS_SCORES_to_delete`                         |
| `FOCUS_TradeIn`                                  | table | profiled, review-needed | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / FOCUS_TradeIn`                                  |
| `FORCE_pricinggrid_staging`                      | table | profiled, review-needed | 0          | 15      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / FORCE_pricinggrid_staging`                      |
| `Fuel_Incremental_Exists_data_key`               | table | profiled, review-needed | 0          | 45      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / Fuel_Incremental_Exists_data_key`               |
| `FUEL_MissingVin_ToUpdate`                       | table | profiled, review-needed | 0          | 10      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / FUEL_MissingVin_ToUpdate`                       |
| `FUEL_MissingVin_UpdateStatus`                   | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / FUEL_MissingVin_UpdateStatus`                   |
| `FuelMissingKeys`                                | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / FuelMissingKeys`                                |
| `GLSchedule_Step_5_BK_03152017`                  | table | profiled, review-needed | 0          | 34      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / GLSchedule_Step_5_BK_03152017`                  |
| `GLSchedule_Validation`                          | table | profiled, review-needed | 0          | 17      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / GLSchedule_Validation`                          |
| `HFM_Dim_Expense_staging`                        | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / HFM_Dim_Expense_staging`                        |
| `HFM_Staging`                                    | table | profiled, review-needed | 0          | 41      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / HFM_Staging`                                    |
| `HFMBrandKey_mapping`                            | table | profiled, review-needed | 0          | 20      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / HFMBrandKey_mapping`                            |
| `lkpGLDetStat`                                   | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / lkpGLDetStat`                                   |
| `Mail_Coupon_Key`                                | table | profiled, review-needed | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / Mail_Coupon_Key`                                |
| `MDM_ADP_SR_Keys`                                | table | profiled, review-needed | 0          | 13      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / MDM_ADP_SR_Keys`                                |
| `MDM_CRM_SR_Keys`                                | table | profiled, review-needed | 0          | 17      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / MDM_CRM_SR_Keys`                                |
| `MDM_eLead_SR_Keys`                              | table | profiled, review-needed | 0          | 13      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / MDM_eLead_SR_Keys`                              |
| `MDM_EPCRM_SR_Keys`                              | table | profiled, review-needed | 0          | 17      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / MDM_EPCRM_SR_Keys`                              |
| `MDS_VehicleStandard_ModelCode_Cadillac_Staging` | table | profiled, review-needed | 0          | 15      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / MDS_VehicleStandard_ModelCode_Cadillac_Staging` |
| `MissingFactAcctgDetailKeys`                     | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / MissingFactAcctgDetailKeys`                     |
| `PCN_BottleRocket`                               | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / PCN_BottleRocket`                               |
| `PCNBottleRocket`                                | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / PCNBottleRocket`                                |
| `RajSales`                                       | table | profiled, review-needed | 0          | 55      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / RajSales`                                       |
| `RecallMasterInventory`                          | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / RecallMasterInventory`                          |
| `RecallMasterOC`                                 | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / RecallMasterOC`                                 |
| `RecallMasterOpc`                                | table | profiled, review-needed | 0          | 11      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / RecallMasterOpc`                                |
| `RecallMasterOpCBak`                             | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / RecallMasterOpCBak`                             |
| `RecallMasterOpcNew`                             | table | profiled, review-needed | 0          | 11      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / RecallMasterOpcNew`                             |
| `RecallMasterSales`                              | table | profiled, review-needed | 0          | 62      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / RecallMasterSales`                              |
| `RecallMasterSales2`                             | table | profiled, review-needed | 0          | 62      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / RecallMasterSales2`                             |
| `RecallMasterSalesBak`                           | table | profiled, review-needed | 0          | 27      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / RecallMasterSalesBak`                           |
| `RecallMasterSalesI`                             | table | profiled, review-needed | 0          | 62      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / RecallMasterSalesI`                             |
| `RecallMasterService`                            | table | profiled, review-needed | 0          | 23      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / RecallMasterService`                            |
| `RecallMasterService2`                           | table | profiled, review-needed | 0          | 21      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / RecallMasterService2`                           |
| `RecallMasterServiceBak`                         | table | profiled, review-needed | 0          | 28      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / RecallMasterServiceBak`                         |
| `RecallMasterServiceNew`                         | table | profiled, review-needed | 0          | 23      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / RecallMasterServiceNew`                         |
| `SIMSSupplementalFeed`                           | table | profiled, review-needed | 0          | 19      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / SIMSSupplementalFeed`                           |
| `SIMSSupplementalFeed_new`                       | table | profiled, review-needed | 0          | 19      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / SIMSSupplementalFeed_new`                       |
| `SIMSSupplementalFeed_update`                    | table | profiled, review-needed | 0          | 19      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / SIMSSupplementalFeed_update`                    |
| `stgFactServiceDetail`                           | table | profiled, review-needed | 0          | 61      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / stgFactServiceDetail`                           |
| `stgFireFact_BK_827`                             | table | profiled, review-needed | 0          | 29      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / stgFireFact_BK_827`                             |
| `stgFIREGL_BK_827`                               | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / stgFIREGL_BK_827`                               |
| `stgLender`                                      | table | profiled, review-needed | 0          | 22      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / stgLender`                                      |
| `stgServiceGL`                                   | table | profiled, review-needed | 0          | 43      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / stgServiceGL`                                   |
| `stgVSC_ALL_bk_827`                              | table | profiled, review-needed | 0          | 48      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / stgVSC_ALL_bk_827`                              |
| `stgVSC_BK_827`                                  | table | profiled, review-needed | 0          | 48      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / stgVSC_BK_827`                                  |
| `TitleTracking_GLSchdule_VinNoMatch`             | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / TitleTracking_GLSchdule_VinNoMatch`             |
| `TitleTracking_GLVSC_Final_BKP31012024`          | table | profiled, review-needed | 0          | 39      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / TitleTracking_GLVSC_Final_BKP31012024`          |
| `TitleTracking_GLVSC_STG`                        | table | profiled, review-needed | 0          | 38      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / TitleTracking_GLVSC_STG`                        |
| `TitleTracking_VSC_test`                         | table | profiled, review-needed | 0          | 23      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / TitleTracking_VSC_test`                         |
| `tmpServiceSalesClosed`                          | table | profiled, review-needed | 0          | 90      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / tmpServiceSalesClosed`                          |
| `tmpVSC`                                         | table | profiled, review-needed | 0          | 229     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / tmpVSC`                                         |
| `TrueCar1`                                       | table | profiled, review-needed | 0          | 11      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / TrueCar1`                                       |
| `UltiPro_staging`                                | table | profiled, review-needed | 0          | 42      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / UltiPro_staging`                                |
| `veh_acquired_by`                                | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / veh_acquired_by`                                |
| `veh_acquired_type`                              | table | profiled, review-needed | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / veh_acquired_type`                              |
| `veh_exterior_color`                             | table | profiled, review-needed | 0          | 14      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / veh_exterior_color`                             |
| `veh_interior_color`                             | table | profiled, review-needed | 0          | 13      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / veh_interior_color`                             |
| `veh_inventory`                                  | table | profiled, review-needed | 0          | 56      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / veh_inventory`                                  |
| `veh_loc_make`                                   | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / veh_loc_make`                                   |
| `veh_loc_model`                                  | table | profiled, review-needed | 0          | 10      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / veh_loc_model`                                  |
| `veh_loc_model_staging`                          | table | profiled, review-needed | 0          | 10      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / veh_loc_model_staging`                          |
| `veh_loc_series`                                 | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / veh_loc_series`                                 |
| `veh_order`                                      | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / veh_order`                                      |
| `veh_process_code`                               | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / veh_process_code`                               |
| `veh_segment`                                    | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / veh_segment`                                    |
| `veh_source`                                     | table | profiled, review-needed | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / veh_source`                                     |
| `veh_vehicle`                                    | table | profiled, review-needed | 0          | 31      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / veh_vehicle`                                    |
| `Vehicle_InventoryHist`                          | table | profiled, review-needed | 0          | 41      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / Vehicle_InventoryHist`                          |
| `Vehicle_SalesHist`                              | table | profiled, review-needed | 0          | 41      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / Vehicle_SalesHist`                              |
| `Vehicle_ServiceHist`                            | table | profiled, review-needed | 0          | 41      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / Vehicle_ServiceHist`                            |
| `vehicle_staging`                                | table | profiled, review-needed | 0          | 42      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk / vehicle_staging`                                |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-045:publish
```
