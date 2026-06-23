# T2B-005 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-005`    |
| Platform/Product      | `SQL Server` |
| Database              | `Sonic_DW`   |
| Schema                | `dbo`        |
| Object type scope     | `table`      |
| Object pages          | 75           |
| Link refresh pages    | 2            |
| Total planned entries | 79           |
| Validation status     | `passed`     |

## Object Pages

| Object                             | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                     |
| ---------------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | -------------------------------------------------------------------------------------------------------- |
| `BT_ChecklistDimQuestions`         | table | profiled, review-needed | 2          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / BT_ChecklistDimQuestions`         |
| `BT_ChecklistFact`                 | table | profiled, review-needed | 2          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / BT_ChecklistFact`                 |
| `CallSourceThirdPartyMapping`      | table | profiled, review-needed | 2          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / CallSourceThirdPartyMapping`      |
| `Corp_Report_Permissions`          | table | profiled, review-needed | 2          | 4       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Corp_Report_Permissions`          |
| `corporate_variances`              | table | profiled, review-needed | 2          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / corporate_variances`              |
| `Dim_CBNumber`                     | table | profiled, review-needed | 2          | 33      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_CBNumber`                     |
| `Dim_DaysAligned`                  | table | profiled, review-needed | 2          | 6       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_DaysAligned`                  |
| `Dim_EPOpCodeBucket_Transact`      | table | profiled, review-needed | 2          | 6       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_EPOpCodeBucket_Transact`      |
| `Dim_Expense`                      | table | profiled, review-needed | 2          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Expense`                      |
| `Dim_HFMBrand`                     | table | profiled, review-needed | 2          | 33      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_HFMBrand`                     |
| `DIM_JMA_DEALER_TBL`               | table | profiled, review-needed | 2          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DIM_JMA_DEALER_TBL`               |
| `DIM_JMA_DEBIT_CREDIT_TBL`         | table | profiled, review-needed | 2          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DIM_JMA_DEBIT_CREDIT_TBL`         |
| `DIM_JMA_PRODUCT_TYPE_TBL`         | table | profiled, review-needed | 2          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DIM_JMA_PRODUCT_TYPE_TBL`         |
| `Dim_KeyWord`                      | table | profiled, review-needed | 2          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_KeyWord`                      |
| `Dim_LaborType_Transact`           | table | profiled, review-needed | 2          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_LaborType_Transact`           |
| `Dim_ScheduleType`                 | table | profiled, review-needed | 2          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_ScheduleType`                 |
| `Dim_Status`                       | table | profiled, review-needed | 2          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Status`                       |
| `Dim_StockSource`                  | table | profiled, review-needed | 3          | 4       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_StockSource`                  |
| `Dim_StockType`                    | table | profiled, review-needed | 2          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_StockType`                    |
| `DimAuctionSource`                 | table | profiled, review-needed | 2          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimAuctionSource`                 |
| `DimCallRevuDepartment`            | table | profiled, review-needed | 2          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimCallRevuDepartment`            |
| `DimFBAdName`                      | table | profiled, review-needed | 2          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimFBAdName`                      |
| `DimGSCAppearance`                 | table | profiled, review-needed | 2          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimGSCAppearance`                 |
| `DimGSCCountry`                    | table | profiled, review-needed | 2          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimGSCCountry`                    |
| `DimGSCDevice`                     | table | profiled, review-needed | 2          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimGSCDevice`                     |
| `DimGSCLandingPage`                | table | profiled, review-needed | 2          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimGSCLandingPage`                |
| `DimGSCSearchQuery`                | table | profiled, review-needed | 2          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimGSCSearchQuery`                |
| `DimLeadSourceTier`                | table | profiled, review-needed | 2          | 6       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimLeadSourceTier`                |
| `DimPurchaseMethod`                | table | profiled, review-needed | 2          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimPurchaseMethod`                |
| `DimRegion`                        | table | profiled, review-needed | 2          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimRegion`                        |
| `DimRMSource`                      | table | profiled, review-needed | 2          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimRMSource`                      |
| `DimRMStoreNames`                  | table | profiled, review-needed | 2          | 43      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimRMStoreNames`                  |
| `DimStandardLeadSource`            | table | profiled, review-needed | 3          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimStandardLeadSource`            |
| `DimTransportCompany`              | table | profiled, review-needed | 2          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimTransportCompany`              |
| `DM_FORCE_Summary_short`           | table | profiled, review-needed | 2          | 91      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DM_FORCE_Summary_short`           |
| `DM_MileageMeetsModel`             | table | profiled, review-needed | 2          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DM_MileageMeetsModel`             |
| `Doc_Actual_Summary`               | table | profiled, review-needed | 2          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Doc_Actual_Summary`               |
| `Doc_Booked`                       | table | profiled, review-needed | 2          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Doc_Booked`                       |
| `Doc_Budget_Dev`                   | table | profiled, review-needed | 2          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Doc_Budget_Dev`                   |
| `Doc_BudgetPS`                     | table | profiled, review-needed | 2          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Doc_BudgetPS`                     |
| `Doc_RVPRecord`                    | table | profiled, review-needed | 2          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Doc_RVPRecord`                    |
| `Doc_short`                        | table | profiled, review-needed | 2          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Doc_short`                        |
| `Doc_shortPS`                      | table | profiled, review-needed | 2          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Doc_shortPS`                      |
| `dwFullTextConversation`           | table | profiled, review-needed | 0          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / dwFullTextConversation`           |
| `dwFullTextConversationElement`    | table | profiled, review-needed | 0          | 21      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / dwFullTextConversationElement`    |
| `dwFullTextConversationMessage`    | table | profiled, review-needed | 0          | 22      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / dwFullTextConversationMessage`    |
| `dwFullTextCustomerNumber`         | table | profiled, review-needed | 0          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / dwFullTextCustomerNumber`         |
| `dwFullTextOptInStatus`            | table | profiled, review-needed | 0          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / dwFullTextOptInStatus`            |
| `eleadsThirdPartyMapping`          | table | profiled, review-needed | 3          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / eleadsThirdPartyMapping`          |
| `Fact_AccountingPS`                | table | profiled, review-needed | 3          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_AccountingPS`                |
| `Fact_ASI`                         | table | profiled, review-needed | 2          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_ASI`                         |
| `Fact_AutoTraderVINLevel`          | table | profiled, review-needed | 1          | 31      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_AutoTraderVINLevel`          |
| `Fact_CustomerSatisfactionIndex`   | table | profiled, review-needed | 2          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_CustomerSatisfactionIndex`   |
| `Fact_DataLoad`                    | table | profiled, review-needed | 2          | 27      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_DataLoad`                    |
| `Fact_DQValidation`                | table | profiled, review-needed | 3          | 20      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_DQValidation`                |
| `Fact_FixedOps`                    | table | profiled, review-needed | 2          | 13      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_FixedOps`                    |
| `Fact_FranchiseBudgetBreakout`     | table | profiled, review-needed | 3          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_FranchiseBudgetBreakout`     |
| `Fact_GridPenentration`            | table | profiled, review-needed | 2          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_GridPenentration`            |
| `Fact_HROverTime`                  | table | profiled, review-needed | 2          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_HROverTime`                  |
| `Fact_HRTurnOver`                  | table | profiled, review-needed | 2          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_HRTurnOver`                  |
| `Fact_MenuOpportunity`             | table | profiled, review-needed | 2          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_MenuOpportunity`             |
| `Fact_StopSale`                    | table | profiled, review-needed | 2          | 13      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_StopSale`                    |
| `FactFBCampaignDaily`              | table | profiled, review-needed | 2          | 23      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactFBCampaignDaily`              |
| `FactFBCampaignMonthly`            | table | profiled, review-needed | 2          | 22      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactFBCampaignMonthly`            |
| `FactFBOfflineMetrices`            | table | profiled, review-needed | 2          | 19      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactFBOfflineMetrices`            |
| `FactGSCDevicesCountryDaily`       | table | profiled, review-needed | 2          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactGSCDevicesCountryDaily`       |
| `FactMSCTasks`                     | table | profiled, review-needed | 2          | 29      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactMSCTasks`                     |
| `FactSurveyAuditDetail`            | table | profiled, review-needed | 2          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactSurveyAuditDetail`            |
| `SalesTranAso_FI_Chargeback`       | table | profiled, review-needed | 1          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / SalesTranAso_FI_Chargeback`       |
| `SalesTranAso_FI_ChargebackFinal`  | table | profiled, review-needed | 1          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / SalesTranAso_FI_ChargebackFinal`  |
| `SalesTranAso_FI_Individual`       | table | profiled, review-needed | 1          | 51      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / SalesTranAso_FI_Individual`       |
| `SoxReviewResult`                  | table | profiled, review-needed | 2          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / SoxReviewResult`                  |
| `StartTotalMORMetrics`             | table | profiled, review-needed | 2          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / StartTotalMORMetrics`             |
| `Syndicate_Floorplan_Payoff`       | table | profiled, review-needed | 2          | 43      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Syndicate_Floorplan_Payoff`       |
| `Syndicate_Floorplan_Payoffs_Skip` | table | profiled, review-needed | 2          | 4       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Syndicate_Floorplan_Payoffs_Skip` |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-005:publish
```
