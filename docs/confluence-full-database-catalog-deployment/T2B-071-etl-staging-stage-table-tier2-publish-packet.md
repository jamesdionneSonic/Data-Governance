# T2B-071 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-071`     |
| Platform/Product      | `SQL Server`  |
| Database              | `ETL_Staging` |
| Schema                | `stage`       |
| Object type scope     | `table`       |
| Object pages          | 75            |
| Link refresh pages    | 2             |
| Total planned entries | 79            |
| Validation status     | `passed`      |

## Object Pages

| Object                                        | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                                     |
| --------------------------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | ------------------------------------------------------------------------------------------------------------------------ |
| `CBAMarketKeyMapping`                         | table | profiled, review-needed | 2          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / CBAMarketKeyMapping`                         |
| `CustomerIMAMMergeStaging`                    | table | profiled, review-needed | 1          | 36      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / CustomerIMAMMergeStaging`                    |
| `CustomerMatchStaging`                        | table | profiled, review-needed | 2          | 36      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / CustomerMatchStaging`                        |
| `CustomerMatchStaging_AdditionalMatch`        | table | profiled, review-needed | 2          | 31      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / CustomerMatchStaging_AdditionalMatch`        |
| `CustomerMatchStaging_AllUnMatchedFields`     | table | profiled, review-needed | 2          | 35      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / CustomerMatchStaging_AllUnMatchedFields`     |
| `CustomerMatchStaging_InitialMatch`           | table | profiled, review-needed | 2          | 29      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / CustomerMatchStaging_InitialMatch`           |
| `CustomerMatchStaging_MatchPoints`            | table | profiled, review-needed | 2          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / CustomerMatchStaging_MatchPoints`            |
| `CustomerMatchStagingAddress_FZYResults`      | table | profiled, review-needed | 1          | 21      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / CustomerMatchStagingAddress_FZYResults`      |
| `DimAdSource`                                 | table | profiled, review-needed | 1          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / DimAdSource`                                 |
| `DimAuctionSourceStaging`                     | table | profiled, review-needed | 3          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / DimAuctionSourceStaging`                     |
| `DimDMSDealXREFStaging`                       | table | profiled, review-needed | 1          | 24      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / DimDMSDealXREFStaging`                       |
| `DimLineOfBusinessStaging`                    | table | profiled, review-needed | 1          | 6       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / DimLineOfBusinessStaging`                    |
| `DimMarketStaging`                            | table | profiled, review-needed | 1          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / DimMarketStaging`                            |
| `DimOpportunityPositionStaging`               | table | profiled, review-needed | 3          | 25      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / DimOpportunityPositionStaging`               |
| `DimPositionStaging`                          | table | profiled, review-needed | 1          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / DimPositionStaging`                          |
| `DimPurchaseMethodStaging`                    | table | profiled, review-needed | 2          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / DimPurchaseMethodStaging`                    |
| `DimTransportCompanyStaging`                  | table | profiled, review-needed | 2          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / DimTransportCompanyStaging`                  |
| `dwFullOpportunity`                           | table | profiled, review-needed | 2          | 77      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / dwFullOpportunity`                           |
| `dwFullVehicle`                               | table | profiled, review-needed | 2          | 92      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / dwFullVehicle`                               |
| `eLead_Other_Opportunity_Activities`          | table | profiled, review-needed | 2          | 38      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / eLead_Other_Opportunity_Activities`          |
| `eLeadDupeMergeStaging`                       | table | profiled, review-needed | 1          | 6       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / eLeadDupeMergeStaging`                       |
| `ExportShopperAttribution`                    | table | profiled, review-needed | 1          | 40      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / ExportShopperAttribution`                    |
| `FactCBABuyerTargetStaging`                   | table | profiled, review-needed | 2          | 21      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / FactCBABuyerTargetStaging`                   |
| `FactCBAMarketTargetStaging`                  | table | profiled, review-needed | 2          | 22      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / FactCBAMarketTargetStaging`                  |
| `FactRemedyTicketData`                        | table | profiled, review-needed | 2          | 78      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / FactRemedyTicketData`                        |
| `FactVehiclePurchaseStaging`                  | table | profiled, review-needed | 2          | 71      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / FactVehiclePurchaseStaging`                  |
| `FactVehiclePurchaseStaging_HISTEntityKeyFix` | table | profiled, review-needed | 1          | 71      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / FactVehiclePurchaseStaging_HISTEntityKeyFix` |
| `FactVehiclePurchaseStagingNoVehMatch`        | table | profiled, review-needed | 1          | 69      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / FactVehiclePurchaseStagingNoVehMatch`        |
| `GPA_ActivityInRarelyusedLiabilities`         | table | profiled, review-needed | 0          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / GPA_ActivityInRarelyusedLiabilities`         |
| `GPA_AgedCustDeposits`                        | table | profiled, review-needed | 0          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / GPA_AgedCustDeposits`                        |
| `GPA_BalancesInRarelyUsedAccounts`            | table | profiled, review-needed | 1          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / GPA_BalancesInRarelyUsedAccounts`            |
| `GPA_ChecksToSelf`                            | table | profiled, review-needed | 1          | 13      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / GPA_ChecksToSelf`                            |
| `GPA_CRMComplaint`                            | table | profiled, review-needed | 1          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / GPA_CRMComplaint`                            |
| `GPA_EmpAROver300`                            | table | profiled, review-needed | 1          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / GPA_EmpAROver300`                            |
| `GPA_IncomeAlteration`                        | table | profiled, review-needed | 1          | 48      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / GPA_IncomeAlteration`                        |
| `GPA_Legal`                                   | table | profiled, review-needed | 2          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / GPA_Legal`                                   |
| `GPA_NetworkCalls`                            | table | profiled, review-needed | 3          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / GPA_NetworkCalls`                            |
| `GPA_ProfitCap`                               | table | profiled, review-needed | 1          | 22      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / GPA_ProfitCap`                               |
| `GPA_profitcap_bmwExceptions`                 | table | profiled, review-needed | 1          | 21      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / GPA_profitcap_bmwExceptions`                 |
| `GPA_RiskManagementClaims`                    | table | profiled, review-needed | 5          | 25      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / GPA_RiskManagementClaims`                    |
| `GPA_RiskManagementClaims_RAW`                | table | profiled, review-needed | 1          | 20      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / GPA_RiskManagementClaims_RAW`                |
| `GPA_UnNaturalBalances`                       | table | profiled, review-needed | 1          | 13      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / GPA_UnNaturalBalances`                       |
| `IBEXQuestions`                               | table | profiled, review-needed | 1          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / IBEXQuestions`                               |
| `IBEXSurveyResponse`                          | table | profiled, review-needed | 2          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / IBEXSurveyResponse`                          |
| `IBEXSurveyResponseAudit`                     | table | profiled, review-needed | 2          | 35      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / IBEXSurveyResponseAudit`                     |
| `KPI_AverageACV`                              | table | profiled, review-needed | 1          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / KPI_AverageACV`                              |
| `KPI_DailyPurchasesAndTransportation`         | table | profiled, review-needed | 2          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / KPI_DailyPurchasesAndTransportation`         |
| `KPI_DailyReconOverTenDays`                   | table | profiled, review-needed | 2          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / KPI_DailyReconOverTenDays`                   |
| `KPI_DailyReconProduction`                    | table | profiled, review-needed | 1          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / KPI_DailyReconProduction`                    |
| `KPI_DailyReconRolling30`                     | table | profiled, review-needed | 2          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / KPI_DailyReconRolling30`                     |
| `KPI_Elead`                                   | table | profiled, review-needed | 2          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / KPI_Elead`                                   |
| `KPI_EleadGEC`                                | table | profiled, review-needed | 2          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / KPI_EleadGEC`                                |
| `KPI_FIRE`                                    | table | profiled, review-needed | 2          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / KPI_FIRE`                                    |
| `KPI_Headcount`                               | table | profiled, review-needed | 1          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / KPI_Headcount`                               |
| `KPI_NPS`                                     | table | profiled, review-needed | 2          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / KPI_NPS`                                     |
| `KPI_SIMSInventory`                           | table | profiled, review-needed | 1          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / KPI_SIMSInventory`                           |
| `KPI_TotalRev`                                | table | profiled, review-needed | 2          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / KPI_TotalRev`                                |
| `OpportunityMatchStaging`                     | table | profiled, review-needed | 1          | 34      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / OpportunityMatchStaging`                     |
| `ProcOutput_Sonic_TextPerformance`            | table | profiled, review-needed | 3          | 36      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / ProcOutput_Sonic_TextPerformance`            |
| `Sonic_MSC_Tasks`                             | table | profiled, review-needed | 1          | 36      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / Sonic_MSC_Tasks`                             |
| `Sonic_MSC_Tasks_Department`                  | table | profiled, review-needed | 3          | 39      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / Sonic_MSC_Tasks_Department`                  |
| `StartCustomerSatisFactionIndex`              | table | profiled, review-needed | 1          | 20      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / StartCustomerSatisFactionIndex`              |
| `StartHROverTime`                             | table | profiled, review-needed | 1          | 20      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / StartHROverTime`                             |
| `StartHRTurnOver`                             | table | profiled, review-needed | 1          | 51      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / StartHRTurnOver`                             |
| `StartTemplateData`                           | table | profiled, review-needed | 1          | 193     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / StartTemplateData`                           |
| `StgDimRMStoreNames`                          | table | profiled, review-needed | 4          | 65      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / StgDimRMStoreNames`                          |
| `StgFBAdsByCampaignDaily`                     | table | profiled, review-needed | 3          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / StgFBAdsByCampaignDaily`                     |
| `StgFBAdsByCampaignMonthly`                   | table | profiled, review-needed | 3          | 21      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / StgFBAdsByCampaignMonthly`                   |
| `StgFBAdsOfflineMetrices`                     | table | profiled, review-needed | 4          | 13      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / StgFBAdsOfflineMetrices`                     |
| `stgGSCAppearanceDaily`                       | table | profiled, review-needed | 2          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / stgGSCAppearanceDaily`                       |
| `stgGSCDevicesCountryDaily`                   | table | profiled, review-needed | 6          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / stgGSCDevicesCountryDaily`                   |
| `stgGSCPagesDaily`                            | table | profiled, review-needed | 2          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / stgGSCPagesDaily`                            |
| `stgGSCQueryDaily`                            | table | profiled, review-needed | 2          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / stgGSCQueryDaily`                            |
| `StgRMReviewMetrics`                          | table | profiled, review-needed | 1          | 25      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / StgRMReviewMetrics`                          |
| `StgRMReviewMonthly`                          | table | profiled, review-needed | 2          | 31      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / StgRMReviewMonthly`                          |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-071:publish
```
