# T2B-076 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-076`    |
| Platform/Product      | `SQL Server` |
| Database              | `StagingDB`  |
| Schema                | `dbo`        |
| Object type scope     | `table`      |
| Object pages          | 75           |
| Link refresh pages    | 2            |
| Total planned entries | 79           |
| Validation status     | `passed`     |

## Object Pages

| Object                                     | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                              |
| ------------------------------------------ | ----- | ----------------------- | ---------- | ------- | ---------- | ----------------------------------------------------------------------------------------------------------------- |
| `AUTOCHECK_TRACKING_Daily`                 | table | profiled, review-needed | 0          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / AUTOCHECK_TRACKING_Daily`                 |
| `AutoTrader_new`                           | table | profiled, review-needed | 0          | 36      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / AutoTrader_new`                           |
| `BlackBookAPIOutput_Staging`               | table | profiled, review-needed | 0          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / BlackBookAPIOutput_Staging`               |
| `CarFaxFailedVINs`                         | table | profiled, review-needed | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / CarFaxFailedVINs`                         |
| `CarFaxInvalidVINs`                        | table | profiled, review-needed | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / CarFaxInvalidVINs`                        |
| `CarGurusFileList`                         | table | profiled, review-needed | 0          | 1       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / CarGurusFileList`                         |
| `CarGurusInventoryDataFileList`            | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / CarGurusInventoryDataFileList`            |
| `CarGurusInventoryURLFileList`             | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / CarGurusInventoryURLFileList`             |
| `CarGurusScrapingExpiredListingsFileNames` | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / CarGurusScrapingExpiredListingsFileNames` |
| `CarGurusScrapingListingOutputFileNames`   | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / CarGurusScrapingListingOutputFileNames`   |
| `CarGurusScrapingSellerReviewFileNames`    | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / CarGurusScrapingSellerReviewFileNames`    |
| `CarvanaAdditionalFeaturesData`            | table | profiled, review-needed | 0          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / CarvanaAdditionalFeaturesData`            |
| `CarvanaOutputFileData`                    | table | profiled, review-needed | 0          | 6       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / CarvanaOutputFileData`                    |
| `CentralDispatchFileList`                  | table | profiled, review-needed | 0          | 4       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / CentralDispatchFileList`                  |
| `commongrouperroroutput`                   | table | profiled, review-needed | 0          | 360     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / commongrouperroroutput`                   |
| `CouponDiscount`                           | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / CouponDiscount`                           |
| `gljedetail_curLoadHist`                   | table | profiled, review-needed | 0          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / gljedetail_curLoadHist`                   |
| `OffRentalCarFaxFailedVINs`                | table | profiled, review-needed | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / OffRentalCarFaxFailedVINs`                |
| `OffRentalCarFaxInvalidVINs`               | table | profiled, review-needed | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / OffRentalCarFaxInvalidVINs`               |
| `PalsValidationToggleLog`                  | table | profiled, review-needed | 0          | 6       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / PalsValidationToggleLog`                  |
| `StageDimstyle`                            | table | profiled, review-needed | 0          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StageDimstyle`                            |
| `StageTrafficSummary_TMR_Export`           | table | profiled, review-needed | 0          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StageTrafficSummary_TMR_Export`           |
| `Stg_AtDMAMiles`                           | table | profiled, review-needed | 0          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / Stg_AtDMAMiles`                           |
| `StgAutoCheckVehicleEvents`                | table | profiled, review-needed | 0          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgAutoCheckVehicleEvents`                |
| `StgAutoCheckVehicleScore`                 | table | profiled, review-needed | 0          | 24      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgAutoCheckVehicleScore`                 |
| `StgAutoTraderArchive`                     | table | profiled, review-needed | 0          | 63      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgAutoTraderArchive`                     |
| `StgCarfaxVehicleScore`                    | table | profiled, review-needed | 0          | 33      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgCarfaxVehicleScore`                    |
| `StgCargurusDealer`                        | table | profiled, review-needed | 0          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgCargurusDealer`                        |
| `StgCarmaxAccidentCount`                   | table | profiled, review-needed | 0          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgCarmaxAccidentCount`                   |
| `StgCarmaxAuctionData`                     | table | profiled, review-needed | 0          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgCarmaxAuctionData`                     |
| `StgGeoCodeAddress`                        | table | profiled, review-needed | 0          | 30      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgGeoCodeAddress`                        |
| `StgJDPowerVehicleFeatures`                | table | profiled, review-needed | 0          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgJDPowerVehicleFeatures`                |
| `StgJDPowerVehicleFeatures_Nodata`         | table | profiled, review-needed | 0          | 1       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgJDPowerVehicleFeatures_Nodata`         |
| `StgManheimAuctionLocations`               | table | profiled, review-needed | 0          | 22      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgManheimAuctionLocations`               |
| `StgManheimAuctionTransactions`            | table | profiled, review-needed | 0          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgManheimAuctionTransactions`            |
| `StgOffRentalAutoCheckVehicleEvents`       | table | profiled, review-needed | 0          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgOffRentalAutoCheckVehicleEvents`       |
| `StgOffRentalAutoCheckVehicleScore`        | table | profiled, review-needed | 0          | 20      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgOffRentalAutoCheckVehicleScore`        |
| `StgOffRentalCarfaxVehicleScore`           | table | profiled, review-needed | 0          | 35      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgOffRentalCarfaxVehicleScore`           |
| `StgSIMS_EP_DA_Pricing`                    | table | profiled, review-needed | 0          | 50      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMS_EP_DA_Pricing`                    |
| `StgSIMS_EP_DA_VehicleClassList`           | table | profiled, review-needed | 0          | 6       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMS_EP_DA_VehicleClassList`           |
| `StgSIMSEP_DA_AutoTrader_DMA_TO_ZIP`       | table | profiled, review-needed | 0          | 4       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSEP_DA_AutoTrader_DMA_TO_ZIP`       |
| `StgSIMSEPADPDealershipMapping`            | table | profiled, review-needed | 0          | 22      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSEPADPDealershipMapping`            |
| `StgSIMSEPBookValueRequest`                | table | profiled, review-needed | 0          | 25      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSEPBookValueRequest`                |
| `StgSIMSEPCustomer`                        | table | profiled, review-needed | 0          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSEPCustomer`                        |
| `StgSIMSEPOrganization`                    | table | profiled, review-needed | 0          | 24      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSEPOrganization`                    |
| `StgSIMSEPOrganizationAddress`             | table | profiled, review-needed | 0          | 20      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSEPOrganizationAddress`             |
| `StgSIMSEPOrganizationAssociation`         | table | profiled, review-needed | 0          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSEPOrganizationAssociation`         |
| `StgSIMSEPPhotoImportVehicleUrls`          | table | profiled, review-needed | 0          | 22      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSEPPhotoImportVehicleUrls`          |
| `StgSimsEPPriceType`                       | table | profiled, review-needed | 0          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSimsEPPriceType`                       |
| `StgSIMSEPStatusCat`                       | table | profiled, review-needed | 0          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSEPStatusCat`                       |
| `StgSIMSEPStatusRollup`                    | table | profiled, review-needed | 0          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSEPStatusRollup`                    |
| `StgSIMSEPVehicleSource`                   | table | profiled, review-needed | 0          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSEPVehicleSource`                   |
| `StgSIMSRTADPDealershipMapping`            | table | profiled, review-needed | 0          | 21      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSRTADPDealershipMapping`            |
| `StgSIMSRTBOOKValueRequest`                | table | profiled, review-needed | 0          | 25      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSRTBOOKValueRequest`                |
| `StgSIMSRTCustomer`                        | table | profiled, review-needed | 0          | 13      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSRTCustomer`                        |
| `StgSIMSRTOrganization`                    | table | profiled, review-needed | 0          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSRTOrganization`                    |
| `StgSIMSRTOrganizationAddress`             | table | profiled, review-needed | 0          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSRTOrganizationAddress`             |
| `StgSIMSRTOrganizationAssociation`         | table | profiled, review-needed | 0          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSRTOrganizationAssociation`         |
| `StgSIMSRTPhotoImportVehicleUrls`          | table | profiled, review-needed | 0          | 22      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSRTPhotoImportVehicleUrls`          |
| `StgSimsRTPriceType`                       | table | profiled, review-needed | 0          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSimsRTPriceType`                       |
| `StgSIMSRTStatus`                          | table | profiled, review-needed | 0          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSRTStatus`                          |
| `StgSIMSRTStatus_Rollup`                   | table | profiled, review-needed | 0          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSRTStatus_Rollup`                   |
| `StgSIMSRTStatusCat`                       | table | profiled, review-needed | 0          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSRTStatusCat`                       |
| `StgSIMSRTVehicle`                         | table | profiled, review-needed | 0          | 24      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSRTVehicle`                         |
| `StgSIMSRTVehiclePricing`                  | table | profiled, review-needed | 0          | 47      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSRTVehiclePricing`                  |
| `StgSIMSRTVehicleSource`                   | table | profiled, review-needed | 0          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSRTVehicleSource`                   |
| `StgSIMSRTVehicleStatusLog`                | table | profiled, review-needed | 0          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSIMSRTVehicleStatusLog`                |
| `StgSmartAuctionData`                      | table | profiled, review-needed | 0          | 52      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgSmartAuctionData`                      |
| `StgUVCStandardEquipment`                  | table | profiled, review-needed | 0          | 4       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / StgUVCStandardEquipment`                  |
| `Syndicate_Floorplan_Payoff`               | table | profiled, review-needed | 0          | 35      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / Syndicate_Floorplan_Payoff`               |
| `sysssislog`                               | table | profiled, review-needed | 0          | 0       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / sysssislog`                               |
| `VehicleMart_DimUVC_Staging`               | table | profiled, review-needed | 0          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / VehicleMart_DimUVC_Staging`               |
| `VehicleVINUVC_Staging`                    | table | profiled, review-needed | 0          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / VehicleVINUVC_Staging`                    |
| `WS_STG_AutoCheck_Tracking`                | table | profiled, review-needed | 0          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / WS_STG_AutoCheck_Tracking`                |
| `WS_STG_SrcControl`                        | table | profiled, review-needed | 0          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo / WS_STG_SrcControl`                        |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-076:publish
```
