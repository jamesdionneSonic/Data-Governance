# T2B-083 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-083`    |
| Platform/Product      | `SQL Server` |
| Database              | `VendorData` |
| Schema                | `dbo`        |
| Object type scope     | `table`      |
| Object pages          | 71           |
| Link refresh pages    | 2            |
| Total planned entries | 75           |
| Validation status     | `passed`     |

## Object Pages

| Object                                         | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                                   |
| ---------------------------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | ---------------------------------------------------------------------------------------------------------------------- |
| `an`                                           | table | profiled, review-needed | 1          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / an`                                           |
| `CallRevuInvalidRows`                          | table | profiled, review-needed | 0          | 35      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / CallRevuInvalidRows`                          |
| `callsource`                                   | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / callsource`                                   |
| `CallSourceData`                               | table | profiled, review-needed | 1          | 38      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / CallSourceData`                               |
| `CallSourceData_bk_202106`                     | table | profiled, review-needed | 0          | 38      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / CallSourceData_bk_202106`                     |
| `CallSourceData_EP`                            | table | profiled, review-needed | 0          | 38      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / CallSourceData_EP`                            |
| `CallSourceRekeyLkp_CallRevu`                  | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / CallSourceRekeyLkp_CallRevu`                  |
| `CarGurusDealRatingMapping`                    | table | profiled, review-needed | 1          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / CarGurusDealRatingMapping`                    |
| `CarGurusIDVinMapping`                         | table | profiled, review-needed | 4          | 141     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / CarGurusIDVinMapping`                         |
| `cargurusidvinmapping_dealer_temp`             | table | profiled, review-needed | 1          | 141     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / cargurusidvinmapping_dealer_temp`             |
| `CarGurusRelatedInventoryInput`                | table | profiled, review-needed | 1          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / CarGurusRelatedInventoryInput`                |
| `CarGurusRelatedInventoryListing`              | table | profiled, review-needed | 4          | 95      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / CarGurusRelatedInventoryListing`              |
| `CarGurusRelatedInventorySource`               | table | profiled, review-needed | 4          | 93      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / CarGurusRelatedInventorySource`               |
| `CargurusSellerReviews`                        | table | profiled, review-needed | 0          | 25      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / CargurusSellerReviews`                        |
| `CarGurusVehicleDetails`                       | table | profiled, review-needed | 5          | 97      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / CarGurusVehicleDetails`                       |
| `CarGurusVinScrapingControlTable`              | table | profiled, review-needed | 0          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / CarGurusVinScrapingControlTable`              |
| `caroffer_30_day_performance`                  | table | profiled, review-needed | 0          | 67      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / caroffer_30_day_performance`                  |
| `CensusBuildingPermitsData`                    | table | profiled, review-needed | 2          | 36      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / CensusBuildingPermitsData`                    |
| `CensusEmplWages`                              | table | profiled, review-needed | 0          | 47      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / CensusEmplWages`                              |
| `CensusZIPCrossWalk`                           | table | profiled, review-needed | 0          | 14      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / CensusZIPCrossWalk`                           |
| `CentralDispatchStatusRanking`                 | table | profiled, review-needed | 1          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / CentralDispatchStatusRanking`                 |
| `CentralDispatchVehicles`                      | table | profiled, review-needed | 1          | 53      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / CentralDispatchVehicles`                      |
| `DDCWebstatsAdv`                               | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / DDCWebstatsAdv`                               |
| `DDCWebstatsByReferrer`                        | table | profiled, review-needed | 0          | 19      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / DDCWebstatsByReferrer`                        |
| `DDCWebstatsLeadsBySource`                     | table | profiled, review-needed | 0          | 17      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / DDCWebstatsLeadsBySource`                     |
| `DDCWebstatsPageView`                          | table | profiled, review-needed | 0          | 17      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / DDCWebstatsPageView`                          |
| `DealerwareAdvisors`                           | table | profiled, review-needed | 1          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / DealerwareAdvisors`                           |
| `DealerwareCarIssues`                          | table | profiled, review-needed | 0          | 25      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / DealerwareCarIssues`                          |
| `DealerwareCars`                               | table | profiled, review-needed | 0          | 47      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / DealerwareCars`                               |
| `DealerwareCompanies`                          | table | profiled, review-needed | 0          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / DealerwareCompanies`                          |
| `DealerwareContracts`                          | table | profiled, review-needed | 0          | 43      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / DealerwareContracts`                          |
| `DealerwareCustomerAddress`                    | table | profiled, review-needed | 1          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / DealerwareCustomerAddress`                    |
| `DealerwareCustomers`                          | table | profiled, review-needed | 1          | 20      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / DealerwareCustomers`                          |
| `DealerwareLocations`                          | table | profiled, review-needed | 0          | 36      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / DealerwareLocations`                          |
| `DealerwareReservations`                       | table | profiled, review-needed | 0          | 79      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / DealerwareReservations`                       |
| `DriversSelectCurrentInventory`                | table | profiled, review-needed | 2          | 95      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / DriversSelectCurrentInventory`                |
| `DriversSelectLeads`                           | table | profiled, review-needed | 2          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / DriversSelectLeads`                           |
| `DriversSelectWebHits`                         | table | profiled, review-needed | 1          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / DriversSelectWebHits`                         |
| `EchoparkAppraisals`                           | table | profiled, review-needed | 0          | 40      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / EchoparkAppraisals`                           |
| `EP_Buyers_CompetitorAppraisals`               | table | profiled, review-needed | 0          | 54      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / EP_Buyers_CompetitorAppraisals`               |
| `FactCallSourceDeletes_CallRevu`               | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / FactCallSourceDeletes_CallRevu`               |
| `GoogleAdsSegmentGroupMapping`                 | table | profiled, review-needed | 1          | 6       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / GoogleAdsSegmentGroupMapping`                 |
| `GoogleAnalyticsThirdPartyMapping`             | table | profiled, review-needed | 3          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / GoogleAnalyticsThirdPartyMapping`             |
| `ReconInspectionQuestions`                     | table | profiled, review-needed | 1          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / ReconInspectionQuestions`                     |
| `ReconInspectionServices`                      | table | profiled, review-needed | 1          | 32      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / ReconInspectionServices`                      |
| `ReconInspectionVehicles`                      | table | profiled, review-needed | 1          | 56      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / ReconInspectionVehicles`                      |
| `ReconOrderLogs`                               | table | profiled, review-needed | 1          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / ReconOrderLogs`                               |
| `ReconOrderPhases`                             | table | profiled, review-needed | 1          | 21      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / ReconOrderPhases`                             |
| `ReconOrderQuestions`                          | table | profiled, review-needed | 1          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / ReconOrderQuestions`                          |
| `ReconOrderServiceEmployees`                   | table | profiled, review-needed | 1          | 23      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / ReconOrderServiceEmployees`                   |
| `ReconOrderServices`                           | table | profiled, review-needed | 1          | 38      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / ReconOrderServices`                           |
| `ReconOrderVehicles`                           | table | profiled, review-needed | 1          | 61      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / ReconOrderVehicles`                           |
| `ReconServiceReq`                              | table | profiled, review-needed | 1          | 45      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / ReconServiceReq`                              |
| `ReconServiceReqQuestions`                     | table | profiled, review-needed | 1          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / ReconServiceReqQuestions`                     |
| `ReconServiceReqService`                       | table | profiled, review-needed | 1          | 19      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / ReconServiceReqService`                       |
| `RemedyTicketData`                             | table | profiled, review-needed | 2          | 78      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / RemedyTicketData`                             |
| `SonicGECAgentSTLLookup`                       | table | profiled, review-needed | 0          | 19      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / SonicGECAgentSTLLookup`                       |
| `SonicGECAgentSTLLookup_bk`                    | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / SonicGECAgentSTLLookup_bk`                    |
| `StgCargurusDealer`                            | table | profiled, review-needed | 1          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / StgCargurusDealer`                            |
| `StgCarGurusRelatedInventorySourceZipAddition` | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / StgCarGurusRelatedInventorySourceZipAddition` |
| `Template`                                     | table | profiled, review-needed | 2          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / Template`                                     |
| `TSDSubsidyMetrics`                            | table | profiled, review-needed | 0          | 21      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / TSDSubsidyMetrics`                            |
| `UpdateCallRevuDepartmentKey`                  | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / UpdateCallRevuDepartmentKey`                  |
| `vw_facebook_metricsdaily_social`              | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / vw_facebook_metricsdaily_social`              |
| `vw_GA_Combined`                               | table | profiled, review-needed | 1          | 33      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / vw_GA_Combined`                               |
| `vw_GA_Service_Combined`                       | table | profiled, review-needed | 1          | 33      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / vw_GA_Service_Combined`                       |
| `vw_GA_Social_Combined`                        | table | profiled, review-needed | 1          | 33      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / vw_GA_Social_Combined`                        |
| `vw_GA_WebPerformance_Segments`                | table | profiled, review-needed | 0          | 34      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / vw_GA_WebPerformance_Segments`                |
| `vw_GoogleAds`                                 | table | profiled, review-needed | 0          | 17      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / vw_GoogleAds`                                 |
| `vw_GoogleAds_Advertising`                     | table | profiled, review-needed | 0          | 19      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / vw_GoogleAds_Advertising`                     |
| `vw_GoogleAds_StoreVisits`                     | table | profiled, review-needed | 0          | 8       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo / vw_GoogleAds_StoreVisits`                     |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-083:publish
```
