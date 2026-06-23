# T2B-072 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-072`     |
| Platform/Product      | `SQL Server`  |
| Database              | `ETL_Staging` |
| Schema                | `stage`       |
| Object type scope     | `table`       |
| Object pages          | 75            |
| Link refresh pages    | 2             |
| Total planned entries | 79            |
| Validation status     | `passed`      |

## Object Pages

| Object                                    | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                                 |
| ----------------------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | -------------------------------------------------------------------------------------------------------------------- |
| `BoA_FP`                                  | table | profiled, review-needed | 0          | 22      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / BoA_FP`                                  |
| `customer_Existing`                       | table | profiled, review-needed | 0          | 97      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / customer_Existing`                       |
| `customer_Identity`                       | table | profiled, review-needed | 0          | 97      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / customer_Identity`                       |
| `customer_New`                            | table | profiled, review-needed | 0          | 97      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / customer_New`                            |
| `customer_tmpUpdate`                      | table | profiled, review-needed | 0          | 97      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / customer_tmpUpdate`                      |
| `customer_Update`                         | table | profiled, review-needed | 0          | 97      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / customer_Update`                         |
| `CustomerFzyLkupResults`                  | table | profiled, review-needed | 0          | 10      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / CustomerFzyLkupResults`                  |
| `customerImportAll_FzyRef`                | table | profiled, review-needed | 0          | 97      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / customerImportAll_FzyRef`                |
| `CustomersImportAll_Inc`                  | table | profiled, review-needed | 0          | 97      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / CustomersImportAll_Inc`                  |
| `DimCBAMarketKPITypeStaging`              | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / DimCBAMarketKPITypeStaging`              |
| `DimCBAMarketParameterStaging`            | table | profiled, review-needed | 0          | 20      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / DimCBAMarketParameterStaging`            |
| `DimRemedyDetail`                         | table | profiled, review-needed | 0          | 12      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / DimRemedyDetail`                         |
| `DimRemedyDetail_Matched`                 | table | profiled, review-needed | 0          | 13      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / DimRemedyDetail_Matched`                 |
| `DMSCoraAcctIDxref_MDP`                   | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / DMSCoraAcctIDxref_MDP`                   |
| `DMSeLeadOrgIDxref_MDP`                   | table | profiled, review-needed | 0          | 14      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / DMSeLeadOrgIDxref_MDP`                   |
| `DOPSalesAssociateUnmatched`              | table | profiled, review-needed | 0          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / DOPSalesAssociateUnmatched`              |
| `eLeadCustomer_Existing`                  | table | profiled, review-needed | 0          | 131     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / eLeadCustomer_Existing`                  |
| `eLeadCustomer_Identity`                  | table | profiled, review-needed | 0          | 131     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / eLeadCustomer_Identity`                  |
| `eLeadCustomer_New`                       | table | profiled, review-needed | 0          | 131     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / eLeadCustomer_New`                       |
| `eLeadCustomer_tmpUpdate`                 | table | profiled, review-needed | 0          | 130     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / eLeadCustomer_tmpUpdate`                 |
| `eLeadCustomer_Update`                    | table | profiled, review-needed | 0          | 131     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / eLeadCustomer_Update`                    |
| `eLeadCustomerAll_FzyRef`                 | table | profiled, review-needed | 0          | 131     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / eLeadCustomerAll_FzyRef`                 |
| `EleadCustomerFzyLkupResults`             | table | profiled, review-needed | 0          | 10      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / EleadCustomerFzyLkupResults`             |
| `eLeadFullCustomer_ImportAll_Inc`         | table | profiled, review-needed | 0          | 136     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / eLeadFullCustomer_ImportAll_Inc`         |
| `EssbasetoDMS`                            | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / EssbasetoDMS`                            |
| `EssbasetoDMS_ASI`                        | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / EssbasetoDMS_ASI`                        |
| `FactRemedyTicketData_Matched`            | table | profiled, review-needed | 0          | 50      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / FactRemedyTicketData_Matched`            |
| `GPA_AccrualExpense`                      | table | profiled, review-needed | 0          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / GPA_AccrualExpense`                      |
| `GPA_AgedLicenseTitle`                    | table | profiled, review-needed | 0          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / GPA_AgedLicenseTitle`                    |
| `GPA_AgedLienPayoffs`                     | table | profiled, review-needed | 0          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / GPA_AgedLienPayoffs`                     |
| `GPA_AgedNPUsedPurchased`                 | table | profiled, review-needed | 0          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / GPA_AgedNPUsedPurchased`                 |
| `GPA_AgedweOwes`                          | table | profiled, review-needed | 0          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / GPA_AgedweOwes`                          |
| `GPA_CashSalesOver7Days`                  | table | profiled, review-needed | 0          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / GPA_CashSalesOver7Days`                  |
| `GPA_CITOver30Days`                       | table | profiled, review-needed | 0          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / GPA_CITOver30Days`                       |
| `GPA_CostOfSaleAdjustment`                | table | profiled, review-needed | 0          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / GPA_CostOfSaleAdjustment`                |
| `GPA_CRMComplaint_RAW`                    | table | profiled, review-needed | 0          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / GPA_CRMComplaint_RAW`                    |
| `GPA_DealerTradeAROver20Days`             | table | profiled, review-needed | 0          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / GPA_DealerTradeAROver20Days`             |
| `GPA_DealerTradeLoss`                     | table | profiled, review-needed | 0          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / GPA_DealerTradeLoss`                     |
| `GPA_EPRegions`                           | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / GPA_EPRegions`                           |
| `GPA_FICancellations`                     | table | profiled, review-needed | 0          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / GPA_FICancellations`                     |
| `GPA_FIPayables`                          | table | profiled, review-needed | 0          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / GPA_FIPayables`                          |
| `GPA_GenericControlNumberUsage`           | table | profiled, review-needed | 0          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / GPA_GenericControlNumberUsage`           |
| `GPA_LiabControlswDebit`                  | table | profiled, review-needed | 0          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / GPA_LiabControlswDebit`                  |
| `GPA_PettyCash`                           | table | profiled, review-needed | 0          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / GPA_PettyCash`                           |
| `GPA_PettyCashAccounting`                 | table | profiled, review-needed | 0          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / GPA_PettyCashAccounting`                 |
| `GPA_PolicyExpense`                       | table | profiled, review-needed | 0          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / GPA_PolicyExpense`                       |
| `GPA_RateCap`                             | table | profiled, review-needed | 0          | 20      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / GPA_RateCap`                             |
| `GPA_SisterStoreTradeLoss`                | table | profiled, review-needed | 0          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / GPA_SisterStoreTradeLoss`                |
| `KPI_SIMS_DW_Inventory`                   | table | profiled, review-needed | 0          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / KPI_SIMS_DW_Inventory`                   |
| `LuSIMSStoreID`                           | table | profiled, review-needed | 0          | 11      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / LuSIMSStoreID`                           |
| `OrganizationXrefOutput_MDP`              | table | profiled, review-needed | 0          | 14      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / OrganizationXrefOutput_MDP`              |
| `RecallMasterSales`                       | table | profiled, review-needed | 0          | 62      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / RecallMasterSales`                       |
| `RecallMasterSales2`                      | table | profiled, review-needed | 0          | 62      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / RecallMasterSales2`                      |
| `RecallMasterSalesI`                      | table | profiled, review-needed | 0          | 62      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / RecallMasterSalesI`                      |
| `RecallMasterService`                     | table | profiled, review-needed | 0          | 25      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / RecallMasterService`                     |
| `StandardLeadSource`                      | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / StandardLeadSource`                      |
| `Start_CSI`                               | table | profiled, review-needed | 0          | 13      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / Start_CSI`                               |
| `START_CSI_Monthly_Source`                | table | profiled, review-needed | 0          | 11      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / START_CSI_Monthly_Source`                |
| `START_CSI_Quarterly_Source`              | table | profiled, review-needed | 0          | 23      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / START_CSI_Quarterly_Source`              |
| `START_MergeLog`                          | table | profiled, review-needed | 0          | 4       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / START_MergeLog`                          |
| `StartASI`                                | table | profiled, review-needed | 0          | 12      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / StartASI`                                |
| `StartASI_Matched`                        | table | profiled, review-needed | 0          | 14      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / StartASI_Matched`                        |
| `StartBudgetTemplate`                     | table | profiled, review-needed | 0          | 193     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / StartBudgetTemplate`                     |
| `StartBudgetTemplate_Matched`             | table | profiled, review-needed | 0          | 14      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / StartBudgetTemplate_Matched`             |
| `StartCSIFileRaw`                         | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / StartCSIFileRaw`                         |
| `StartCSIQuarterlyColumnMap`              | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / StartCSIQuarterlyColumnMap`              |
| `StartCSIQuarterlyFileRaw`                | table | profiled, review-needed | 0          | 23      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / StartCSIQuarterlyFileRaw`                |
| `StartCustomerSatisfactionIndex_Matched`  | table | profiled, review-needed | 0          | 12      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / StartCustomerSatisfactionIndex_Matched`  |
| `StartCustomerSatisFactionIndexQuarterly` | table | profiled, review-needed | 0          | 19      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / StartCustomerSatisFactionIndexQuarterly` |
| `StartGridPenentration`                   | table | profiled, review-needed | 0          | 15      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / StartGridPenentration`                   |
| `StartGridPenentration_Matched`           | table | profiled, review-needed | 0          | 13      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / StartGridPenentration_Matched`           |
| `StartHROverTime_Matched`                 | table | profiled, review-needed | 0          | 15      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / StartHROverTime_Matched`                 |
| `StartHRTurnOver_matched`                 | table | profiled, review-needed | 0          | 15      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / StartHRTurnOver_matched`                 |
| `StartStopSaleUsedEchoPark`               | table | profiled, review-needed | 0          | 12      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / StartStopSaleUsedEchoPark`               |
| `StartStopSaleUsedEchoPark_matched`       | table | profiled, review-needed | 0          | 14      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage / StartStopSaleUsedEchoPark_matched`       |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-072:publish
```
