# T2B-028 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-028`     |
| Platform/Product      | `SQL Server`  |
| Database              | `ETL_Staging` |
| Schema                | `dbo`         |
| Object type scope     | `table`       |
| Object pages          | 75            |
| Link refresh pages    | 2             |
| Total planned entries | 79            |
| Validation status     | `passed`      |

## Object Pages

| Object                                       | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                                  |
| -------------------------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | --------------------------------------------------------------------------------------------------------------------- |
| `2013Playbook9`                              | table | profiled, review-needed | 0          | 13      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / 2013Playbook9`                              |
| `2016PlaybookQuestions`                      | table | profiled, review-needed | 0          | 13      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / 2016PlaybookQuestions`                      |
| `202050224_NullFuelType`                     | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / 202050224_NullFuelType`                     |
| `20250303_FuelTypeUpdate`                    | table | profiled, review-needed | 0          | 8       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / 20250303_FuelTypeUpdate`                    |
| `AdSource3Inserts20221227`                   | table | profiled, review-needed | 0          | 13      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / AdSource3Inserts20221227`                   |
| `AdSource3Unique20221216`                    | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / AdSource3Unique20221216`                    |
| `AdSource3Updates20221222`                   | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / AdSource3Updates20221222`                   |
| `AdSource3Updates20221227`                   | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / AdSource3Updates20221227`                   |
| `AdSource4DistinctKeys20221216`              | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / AdSource4DistinctKeys20221216`              |
| `AdSourceKeyUpdate20221227`                  | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / AdSourceKeyUpdate20221227`                  |
| `AdSourceMissingAdSource3`                   | table | profiled, review-needed | 0          | 8       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / AdSourceMissingAdSource3`                   |
| `AdSourceNonUnique20221216`                  | table | profiled, review-needed | 0          | 15      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / AdSourceNonUnique20221216`                  |
| `AdSourceUpdates20221212`                    | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / AdSourceUpdates20221212`                    |
| `AdSourceUpdates20221216`                    | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / AdSourceUpdates20221216`                    |
| `BoAFileList`                                | table | profiled, review-needed | 0          | 1       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / BoAFileList`                                |
| `CallIDsWithAdSource4`                       | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / CallIDsWithAdSource4`                       |
| `CallRevu_TrackingNumberTarget`              | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / CallRevu_TrackingNumberTarget`              |
| `CallRevuAdSource3Update20221216`            | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / CallRevuAdSource3Update20221216`            |
| `CallRevuAdSource3Update20221222`            | table | profiled, review-needed | 0          | 13      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / CallRevuAdSource3Update20221222`            |
| `CallRevuAdSourceTargetNumberUpdate20221220` | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / CallRevuAdSourceTargetNumberUpdate20221220` |
| `CallRevuMissingLocationID`                  | table | profiled, review-needed | 0          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / CallRevuMissingLocationID`                  |
| `dwFullAudit`                                | table | profiled, review-needed | 0          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwFullAudit`                                |
| `dwFullEmailOptOut`                          | table | profiled, review-needed | 0          | 6       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwFullEmailOptOut`                          |
| `dwFullMessages`                             | table | profiled, review-needed | 0          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwFullMessages`                             |
| `dwFullPhone`                                | table | profiled, review-needed | 0          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwFullPhone`                                |
| `dwFullPosition`                             | table | profiled, review-needed | 0          | 6       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwFullPosition`                             |
| `dwFullRelationship`                         | table | profiled, review-needed | 0          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwFullRelationship`                         |
| `dwFullUserPositionMap`                      | table | profiled, review-needed | 0          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwFullUserPositionMap`                      |
| `eLeadsOpportunityDiffKeys`                  | table | profiled, review-needed | 0          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / eLeadsOpportunityDiffKeys`                  |
| `FORCE_Loads`                                | table | profiled, review-needed | 0          | 4       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / FORCE_Loads`                                |
| `GPA_TheNetworkCallEntitySource`             | table | profiled, review-needed | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / GPA_TheNetworkCallEntitySource`             |
| `KPI_SIMS_Inventory_Source`                  | table | profiled, review-needed | 0          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / KPI_SIMS_Inventory_Source`                  |
| `SCORES_DealershipLoad`                      | table | profiled, review-needed | 2          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_DealershipLoad`                      |
| `SIMSEPBook`                                 | table | profiled, review-needed | 0          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SIMSEPBook`                                 |
| `SIMSEPBookValueResponse`                    | table | profiled, review-needed | 0          | 40      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SIMSEPBookValueResponse`                    |
| `SIMSEPPhotoImport_VehicleUrls`              | table | profiled, review-needed | 0          | 25      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SIMSEPPhotoImport_VehicleUrls`              |
| `SimsEPPriceHistory`                         | table | profiled, review-needed | 0          | 21      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SimsEPPriceHistory`                         |
| `SimsEPPriceType`                            | table | profiled, review-needed | 0          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SimsEPPriceType`                            |
| `SIMSEPStatus`                               | table | profiled, review-needed | 0          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SIMSEPStatus`                               |
| `SimsEPStatusCat`                            | table | profiled, review-needed | 0          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SimsEPStatusCat`                            |
| `SIMSEPStatusRollup`                         | table | profiled, review-needed | 0          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SIMSEPStatusRollup`                         |
| `SimsEPVehicleSource`                        | table | profiled, review-needed | 0          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SimsEPVehicleSource`                        |
| `SIMSEPVehicleStatusLog`                     | table | profiled, review-needed | 0          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SIMSEPVehicleStatusLog`                     |
| `SIMSRTBook`                                 | table | profiled, review-needed | 0          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SIMSRTBook`                                 |
| `SIMSRTBookValueResponse`                    | table | profiled, review-needed | 0          | 40      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SIMSRTBookValueResponse`                    |
| `SIMSRTOrganization`                         | table | profiled, review-needed | 0          | 24      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SIMSRTOrganization`                         |
| `SIMSRTPhotoImport_VehicleUrls`              | table | profiled, review-needed | 0          | 25      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SIMSRTPhotoImport_VehicleUrls`              |
| `SimsRTPriceHistory`                         | table | profiled, review-needed | 0          | 19      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SimsRTPriceHistory`                         |
| `SimsRTPriceType`                            | table | profiled, review-needed | 0          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SimsRTPriceType`                            |
| `SIMSRTStatus`                               | table | profiled, review-needed | 0          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SIMSRTStatus`                               |
| `SimsRTStatusCat`                            | table | profiled, review-needed | 0          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SimsRTStatusCat`                            |
| `SIMSRTStatusRollup`                         | table | profiled, review-needed | 0          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SIMSRTStatusRollup`                         |
| `SimsRTVehicleSource`                        | table | profiled, review-needed | 0          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SimsRTVehicleSource`                        |
| `SIMSRTVehicleStatusLog`                     | table | profiled, review-needed | 0          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SIMSRTVehicleStatusLog`                     |
| `SonicTMRExportFileDate`                     | table | profiled, review-needed | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SonicTMRExportFileDate`                     |
| `stg_Dim_Vehicle_sales`                      | table | profiled, review-needed | 0          | 33      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / stg_Dim_Vehicle_sales`                      |
| `stg_GPA_AcctsWithFewBalances`               | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / stg_GPA_AcctsWithFewBalances`               |
| `StgBOACashProLine`                          | table | profiled, review-needed | 0          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgBOACashProLine`                          |
| `stgDimLeadStatus`                           | table | profiled, review-needed | 1          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / stgDimLeadStatus`                           |
| `StgDimOpportunitySource`                    | table | profiled, review-needed | 1          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgDimOpportunitySource`                    |
| `StgDimVehicleSoughtXref`                    | table | profiled, review-needed | 1          | 19      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgDimVehicleSoughtXref`                    |
| `stgEleadVehicleServiceExport`               | table | profiled, review-needed | 0          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / stgEleadVehicleServiceExport`               |
| `StgFacebookUpload`                          | table | profiled, review-needed | 1          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFacebookUpload`                          |
| `StgFactInventorySims`                       | table | profiled, review-needed | 0          | 57      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFactInventorySims`                       |
| `StgFBAudienceCarCashWebSoldAudience`        | table | profiled, review-needed | 1          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFBAudienceCarCashWebSoldAudience`        |
| `StgFBAudienceDeclinedService`               | table | profiled, review-needed | 1          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFBAudienceDeclinedService`               |
| `StgFBAudienceUnsoldShowroom`                | table | profiled, review-needed | 1          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFBAudienceUnsoldShowroom`                |
| `StgFBCarCashAppSoldAudience`                | table | profiled, review-needed | 1          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFBCarCashAppSoldAudience`                |
| `StgFBCarCashUnSoldAudience`                 | table | profiled, review-needed | 1          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFBCarCashUnSoldAudience`                 |
| `StgFBCarCashWebSoldAudience`                | table | profiled, review-needed | 1          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgFBCarCashWebSoldAudience`                |
| `StgNewUsedMap`                              | table | profiled, review-needed | 1          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / StgNewUsedMap`                              |
| `sysssislog`                                 | table | profiled, review-needed | 0          | 0       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / sysssislog`                                 |
| `TPdwFullCompany`                            | table | profiled, review-needed | 1          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / TPdwFullCompany`                            |
| `TrafficManagementDateQuery_Runs`            | table | profiled, review-needed | 0          | 19      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / TrafficManagementDateQuery_Runs`            |
| `zzzzz_dbo.GPA_MissingProfitCap20181012`     | table | profiled, review-needed | 0          | 20      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / zzzzz_dbo.GPA_MissingProfitCap20181012`     |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-028:publish
```
