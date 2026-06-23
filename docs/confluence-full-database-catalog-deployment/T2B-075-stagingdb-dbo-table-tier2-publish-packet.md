# T2B-075 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-075`    |
| Platform/Product      | `SQL Server` |
| Database              | `StagingDB`  |
| Schema                | `dbo`        |
| Object type scope     | `table`      |
| Object pages          | 75           |
| Link refresh pages    | 2            |
| Total planned entries | 79           |
| Validation status     | `passed`     |

## Object Pages

| Object                                | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                         |
| ------------------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | ------------------------------------------------------------------------------------------------------------ |
| `autocheck_tracking`                  | table | profiled, review-needed | 0          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / autocheck_tracking`                  |
| `Autotrader_SF_Staging`               | table | profiled, review-needed | 1          | 34      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / Autotrader_SF_Staging`               |
| `AutoTraderDealerListingID_Archive`   | table | profiled, review-needed | 0          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / AutoTraderDealerListingID_Archive`   |
| `AutotraderNewInventoryStaging`       | table | profiled, review-needed | 0          | 77      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / AutotraderNewInventoryStaging`       |
| `Carmax_SF_New_Staging`               | table | profiled, review-needed | 0          | 64      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / Carmax_SF_New_Staging`               |
| `DimCarMaxDealer`                     | table | profiled, review-needed | 0          | 25      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / DimCarMaxDealer`                     |
| `InventoryVehicle`                    | table | profiled, review-needed | 0          | 86      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / InventoryVehicle`                    |
| `JDPowerVehicleFeatures_Tracking`     | table | profiled, review-needed | 0          | 1       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / JDPowerVehicleFeatures_Tracking`     |
| `JDPowerVehicleFeatures_TrackingHist` | table | profiled, review-needed | 0          | 1       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / JDPowerVehicleFeatures_TrackingHist` |
| `KBBSalesStaging`                     | table | profiled, review-needed | 1          | 104     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / KBBSalesStaging`                     |
| `PalsValidationToggle`                | table | profiled, review-needed | 1          | 6       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / PalsValidationToggle`                |
| `RouteOne_Staging`                    | table | profiled, review-needed | 1          | 118     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / RouteOne_Staging`                    |
| `StageTrafficSummary`                 | table | profiled, review-needed | 1          | 29      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StageTrafficSummary`                 |
| `StageTrafficSummary_EntUnmatched`    | table | profiled, review-needed | 3          | 29      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StageTrafficSummary_EntUnmatched`    |
| `Stg_BuildingPermitByMonth`           | table | profiled, review-needed | 4          | 33      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / Stg_BuildingPermitByMonth`           |
| `Stg_BuildingPermitByMonthVM`         | table | profiled, review-needed | 0          | 33      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / Stg_BuildingPermitByMonthVM`         |
| `StgAdesaAuctionDataFull`             | table | profiled, review-needed | 0          | 141     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgAdesaAuctionDataFull`             |
| `StgAdesaAuctionDataInc`              | table | profiled, review-needed | 0          | 142     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgAdesaAuctionDataInc`              |
| `StgCarGurusInventoryData`            | table | profiled, review-needed | 2          | 88      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgCarGurusInventoryData`            |
| `StgCarGurusInventoryURLData`         | table | profiled, review-needed | 1          | 6       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgCarGurusInventoryURLData`         |
| `StgCarGurusOutputListings`           | table | profiled, review-needed | 1          | 135     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgCarGurusOutputListings`           |
| `STGCarGurusPriceDetails`             | table | profiled, review-needed | 2          | 114     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / STGCarGurusPriceDetails`             |
| `STGCarguruVehicleDetails`            | table | profiled, review-needed | 2          | 24      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / STGCarguruVehicleDetails`            |
| `StgCensusEmplWages`                  | table | profiled, review-needed | 1          | 44      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgCensusEmplWages`                  |
| `StgCentralDispatchListedVehicle`     | table | profiled, review-needed | 2          | 48      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgCentralDispatchListedVehicle`     |
| `StgCentralDispatchVehicleDetails`    | table | profiled, review-needed | 2          | 38      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgCentralDispatchVehicleDetails`    |
| `StgDriversSelectCurrentInventory`    | table | profiled, review-needed | 3          | 83      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgDriversSelectCurrentInventory`    |
| `StgDriversSelectLeads`               | table | profiled, review-needed | 3          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgDriversSelectLeads`               |
| `StgDriversSelectWebHits`             | table | profiled, review-needed | 3          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgDriversSelectWebHits`             |
| `StgEchoParkGECReportWTD`             | table | profiled, review-needed | 1          | 30      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgEchoParkGECReportWTD`             |
| `StgGetVINsforCarFaxChunks`           | table | profiled, review-needed | 0          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgGetVINsforCarFaxChunks`           |
| `StgManheimAPISearchesColor`          | table | profiled, review-needed | 0          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgManheimAPISearchesColor`          |
| `StgManheimAPISearchesOption`         | table | profiled, review-needed | 0          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgManheimAPISearchesOption`         |
| `StgManheimAPISearchesPackage`        | table | profiled, review-needed | 0          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgManheimAPISearchesPackage`        |
| `stgManheimMMRInput`                  | table | profiled, review-needed | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / stgManheimMMRInput`                  |
| `StgManheimVehicleListing`            | table | profiled, review-needed | 0          | 99      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgManheimVehicleListing`            |
| `StgReconInspectionQuestions`         | table | profiled, review-needed | 1          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgReconInspectionQuestions`         |
| `StgReconInspectionServices`          | table | profiled, review-needed | 1          | 27      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgReconInspectionServices`          |
| `StgReconInspectionVehicles`          | table | profiled, review-needed | 1          | 51      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgReconInspectionVehicles`          |
| `StgReconOrderLogs`                   | table | profiled, review-needed | 1          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgReconOrderLogs`                   |
| `StgReconOrderPhases`                 | table | profiled, review-needed | 1          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgReconOrderPhases`                 |
| `StgReconOrderQuestions`              | table | profiled, review-needed | 1          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgReconOrderQuestions`              |
| `StgReconOrderServiceEmployees`       | table | profiled, review-needed | 1          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgReconOrderServiceEmployees`       |
| `StgReconOrderServices`               | table | profiled, review-needed | 1          | 33      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgReconOrderServices`               |
| `StgReconOrderVehicles`               | table | profiled, review-needed | 1          | 56      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgReconOrderVehicles`               |
| `StgReconServiceReq`                  | table | profiled, review-needed | 1          | 40      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgReconServiceReq`                  |
| `StgReconServiceReqQuestions`         | table | profiled, review-needed | 1          | 13      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgReconServiceReqQuestions`         |
| `StgReconServiceReqService`           | table | profiled, review-needed | 1          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgReconServiceReqService`           |
| `StgSims_EP_DA_DimUVC`                | table | profiled, review-needed | 0          | 24      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSims_EP_DA_DimUVC`                |
| `StgSIMSEPAppraisal`                  | table | profiled, review-needed | 0          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSEPAppraisal`                  |
| `StgSIMSEPBook`                       | table | profiled, review-needed | 0          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSEPBook`                       |
| `StgSIMSEPBookValueResponse`          | table | profiled, review-needed | 0          | 35      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSEPBookValueResponse`          |
| `StgSIMSEPExternalReportIcon`         | table | profiled, review-needed | 0          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSEPExternalReportIcon`         |
| `StgSIMSEPExternalVehicleData`        | table | profiled, review-needed | 0          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSEPExternalVehicleData`        |
| `StgSIMSEPFactoryOptions`             | table | profiled, review-needed | 0          | 21      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSEPFactoryOptions`             |
| `StgSIMSEPPriceChangeHistory`         | table | profiled, review-needed | 0          | 26      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSEPPriceChangeHistory`         |
| `StgSIMSEPSonicAppraisalCenter`       | table | profiled, review-needed | 0          | 27      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSEPSonicAppraisalCenter`       |
| `StgSIMSEPStatus`                     | table | profiled, review-needed | 0          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSEPStatus`                     |
| `StgSIMSEPVehicle`                    | table | profiled, review-needed | 0          | 24      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSEPVehicle`                    |
| `StgSIMSEPVehicleInventory`           | table | profiled, review-needed | 0          | 129     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSEPVehicleInventory`           |
| `StgSIMSEPVehiclePricing`             | table | profiled, review-needed | 0          | 40      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSEPVehiclePricing`             |
| `StgSIMSEPVehicleStatusLog`           | table | profiled, review-needed | 0          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSEPVehicleStatusLog`           |
| `StgSIMSRTAppraisal`                  | table | profiled, review-needed | 0          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSRTAppraisal`                  |
| `StgSIMSRTBook`                       | table | profiled, review-needed | 0          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSRTBook`                       |
| `StgSIMSRTBookValueResponse`          | table | profiled, review-needed | 0          | 35      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSRTBookValueResponse`          |
| `StgSIMSRTExternalReportIcon`         | table | profiled, review-needed | 0          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSRTExternalReportIcon`         |
| `StgSIMSRTExternalVehicleData`        | table | profiled, review-needed | 0          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSRTExternalVehicleData`        |
| `StgSIMSRTFactoryOptions`             | table | profiled, review-needed | 0          | 21      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSRTFactoryOptions`             |
| `StgSIMSRTPriceChangeHistory`         | table | profiled, review-needed | 0          | 23      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSRTPriceChangeHistory`         |
| `StgSIMSRTSonicAppraisalCenter`       | table | profiled, review-needed | 0          | 25      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSRTSonicAppraisalCenter`       |
| `StgSIMSRTVehicleInventory`           | table | profiled, review-needed | 0          | 131     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSRTVehicleInventory`           |
| `StgZipCodesUSA`                      | table | profiled, review-needed | 1          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgZipCodesUSA`                      |
| `sysdiagrams`                         | table | profiled, review-needed | 6          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / sysdiagrams`                         |
| `WS_SrcControl`                       | table | profiled, review-needed | 0          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / WS_SrcControl`                       |
| `WS_STG_AutoCheck_Tracking_Test`      | table | profiled, review-needed | 0          | 13      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / WS_STG_AutoCheck_Tracking_Test`      |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-075:publish
```
