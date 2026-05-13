---
name: StartTotalMORMetrics
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - ControllerPoints
  - CustomerMatchResult
  - CustomerMatchResult_bak
  - Dim_Lender_Additions
  - Dim_Lender_Categories
  - Dim_Lender_FICO_Tiers
  - Dim_Lender_Type
  - Dim_Operator
  - DimTextPerformance
  - Fact_ASI
  - Fact_CustomerSatisfactionIndex
  - Fact_FixedOps
  - Fact_GridPenentration
  - Fact_HROverTime
  - Fact_HRTurnOver
  - Fact_StopSale
  - Fact_StopSaleUsed
  - Fact_TemplateData
  - Fact_TradeAppraisal
  - Fact_TrafficManagement
  - Fact_TrafficManagementATIM
  - factFIRE
  - factFIRE_BMWMini
  - GLDetail_ MissingAcctInfo
  - Dim_DMSVendor
  - Dim_GLDetail
  - Dim_GLDetail_arch
  - Dim_GLDetail_ToBeDeleted
  - Dim_Vendor
  - DimFBAdName
  - DimFBCampaign
  - DimGSCAppearance
  - DimGSCCountry
  - DimGSCDevice
  - DimGSCLandingPage
  - DimGSCSearchQuery
  - DimGSCSearchType
  - DimGSCSite
  - DimMarket
  - DimRegion
  - DimRMDepartment
  - DimRMSource
  - DimRMStoreNames
  - DimSurveyAudit
  - DimTextPerformance
  - FacebookCustomerExport
  - Fact_AccountingDetail
  - Fact_AccountingDetail_arch
  - Fact_AccountingDetail_ToBeDeleted
  - Fact_AccountingDetailCurrent
  - Fact_AccountingSummary
  - Fact_AdvertisingExpense
  - Fact_ASI
  - Fact_CarsImpression
  - Fact_CarsLeads
  - Fact_CustomerSatisfactionIndex
  - Fact_EPTNotification
  - Fact_GridPenentration
  - Fact_HROverTime
  - Fact_HRTurnOver
  - Fact_Opportunity
  - Fact_RetailUnits
  - Fact_SAAR
  - Fact_StopSaleUsed
  - Fact_TemplateData
  - Fact_TradeAppraisal
  - Fact_TrafficManagement
  - Fact_TrafficManagementATIM
  - Fact_WebPageViews
  - Fact_WebStats
  - FactCBAMarketTarget
  - FactFBCampaignDaily
  - FactFBCampaignMonthly
  - FactFBOfflineMetrices
  - FactGMB
  - FactGSCAppearanceDaily
  - FactGSCDevicesCountryDaily
  - FactGSCPagesDaily
  - FactGSCQueryDaily
  - FactRMReviewMetrics
  - FactRMReviewMonthly
  - QuartileOpportunityMart
  - RegionAssociate
row_count: 0
size_kb: 0
column_count: 17
index_count: 2
check_constraint_count: 0
extraction_warnings:
  - MISSING_VIEW_DATABASE_STATE
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: table
- **Schema**: dbo
- **Row Count**: 0
- **Size**: 0 KB

## Columns

| Name                  | Type     | Nullable | Identity | Default | Description |
| --------------------- | -------- | -------- | -------- | ------- | ----------- |
| `StartMORMetricsKey`  | int      |          | ✓        |         |             |
| `StartMetricsKey`     | int      |          |          |         |             |
| `SourceMetricsKey`    | int      |          |          |         |             |
| `EntityKey`           | int      |          |          |         |             |
| `FiscalDateKey`       | int      |          |          |         |             |
| `FiscalMonthKey`      | int      |          |          |         |             |
| `AccountMgmtKey`      | int      | ✓        |          |         |             |
| `DepartmentKey`       | int      | ✓        |          |         |             |
| `ScenarioKey`         | int      | ✓        |          |         |             |
| `Amount`              | decimal  | ✓        |          |         |             |
| `StatCount`           | decimal  | ✓        |          |         |             |
| `Meta_LoadDate`       | datetime | ✓        |          |         |             |
| `UserID`              | varchar  | ✓        |          |         |             |
| `Meta_ComputerName`   | varchar  | ✓        |          |         |             |
| `Meta_LastUpdateDate` | datetime | ✓        |          |         |             |
| `Meta_LastDMLAction`  | char     | ✓        |          |         |             |
| `ETLExecutionID`      | int      | ✓        |          |         |             |

## Constraints

- **Primary Key**: pk_START_MOR_Metrics_Total
  - Columns: StartMORMetricsKey

## Indexes

- **IDX_AccountMgmtKey** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: AccountMgmtKey ASC
  - Included Columns: EntityKey, FiscalMonthKey, DepartmentKey, ScenarioKey, Amount, StatCount
- **pk_START_MOR_Metrics_Total** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: StartMORMetricsKey ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.ControllerPoints → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.CustomerMatchResult → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.CustomerMatchResult_bak → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Dim_Lender_Additions → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Dim_Lender_Categories → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Dim_Lender_FICO_Tiers → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Dim_Lender_Type → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Dim_Operator → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `Userid` → `UserID`
- **column_match**: dbo.DimTextPerformance → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Fact_ASI → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Fact_CustomerSatisfactionIndex → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Fact_FixedOps → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Fact_GridPenentration → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Fact_HROverTime → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Fact_HRTurnOver → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Fact_StopSale → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Fact_StopSaleUsed → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Fact_TemplateData → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Fact_TradeAppraisal → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Fact_TrafficManagement → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Fact_TrafficManagementATIM → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.factFIRE → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `userid` → `UserID`
- **column_match**: dbo.factFIRE_BMWMini → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `userid` → `UserID`
- **column_match**: dbo.GLDetail\_ MissingAcctInfo → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `userid` → `UserID`
- **column_match**: dbo.StartTotalMORMetrics → dbo.Syndicate_BoA_Dashboard
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `userID`
- **column_match**: dbo.Dim_DMSVendor → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Dim_GLDetail → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Dim_GLDetail_arch → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Dim_GLDetail_ToBeDeleted → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Dim_Vendor → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimFBAdName → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimFBCampaign → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimGSCAppearance → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimGSCCountry → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimGSCDevice → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimGSCLandingPage → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimGSCSearchQuery → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimGSCSearchType → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimGSCSite → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimMarket → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimRegion → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimRMDepartment → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimRMSource → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimRMStoreNames → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimSurveyAudit → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimTextPerformance → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FacebookCustomerExport → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_AccountingDetail → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_AccountingDetail_arch → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_AccountingDetail_ToBeDeleted → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_AccountingDetailCurrent → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_AccountingSummary → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_AdvertisingExpense → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_ASI → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_CarsImpression → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_CarsLeads → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_CustomerSatisfactionIndex → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_EPTNotification → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_GridPenentration → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_HROverTime → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_HRTurnOver → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_Opportunity → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_RetailUnits → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_SAAR → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_StopSaleUsed → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_TemplateData → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_TradeAppraisal → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_TrafficManagement → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_TrafficManagementATIM → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_WebPageViews → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_WebStats → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactCBAMarketTarget → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactFBCampaignDaily → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactFBCampaignMonthly → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactFBOfflineMetrices → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactGMB → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactGSCAppearanceDaily → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactGSCDevicesCountryDaily → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactGSCPagesDaily → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactGSCQueryDaily → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactRMReviewMetrics → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactRMReviewMonthly → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.QuartileOpportunityMart → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionId` → `ETLExecutionID`
- **column_match**: dbo.RegionAssociate → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.StartTotalMORMetrics → dbo.wrk_Dim_HFMBrand
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
