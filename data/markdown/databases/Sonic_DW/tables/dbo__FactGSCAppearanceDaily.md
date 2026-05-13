---
name: FactGSCAppearanceDaily
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
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
  - DimFBAdName
  - DimFBCampaign
  - DimGSCAppearance
  - DimGSCCountry
  - DimGSCDevice
  - DimGSCLandingPage
  - DimGSCSearchQuery
  - DimGSCSearchType
  - DimGSCSite
  - DimRMDepartment
  - DimRMSource
  - DimRMStoreNames
  - FacebookCustomerExport
  - FactFBCampaignDaily
  - FactFBCampaignMonthly
  - FactFBOfflineMetrices
  - DimFBAdName
  - DimFBCampaign
  - DimGSCAppearance
  - DimGSCCountry
  - DimGSCDevice
  - DimGSCLandingPage
  - DimGSCSearchQuery
  - DimGSCSearchType
  - DimGSCSite
  - DimRMDepartment
  - DimRMSource
  - DimRMStoreNames
  - FactFBCampaignDaily
  - FactFBCampaignMonthly
  - FactFBOfflineMetrices
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

| Name                       | Type     | Nullable | Identity | Default | Description |
| -------------------------- | -------- | -------- | -------- | ------- | ----------- |
| `FactGSCAppearanceDailyID` | bigint   |          | ✓        |         |             |
| `EntityKey`                | int      |          |          |         |             |
| `DimSiteKey`               | int      |          |          |         |             |
| `DimSearchTypeKey`         | int      |          |          |         |             |
| `DimAppearanceKey`         | int      |          |          |         |             |
| `EventDateKey`             | int      |          |          |         |             |
| `Clicks`                   | int      | ✓        |          |         |             |
| `CTR`                      | decimal  | ✓        |          |         |             |
| `Impressions`              | float    | ✓        |          |         |             |
| `AveragePosition`          | float    | ✓        |          |         |             |
| `MetaNaturalKey`           | bigint   |          |          |         |             |
| `MetaLoadDate`             | datetime |          |          |         |             |
| `MetaComputerName`         | varchar  | ✓        |          |         |             |
| `MetaUserID`               | varchar  | ✓        |          |         |             |
| `MetaSourceSystemName`     | varchar  | ✓        |          |         |             |
| `MetaSrcSysID`             | int      | ✓        |          |         |             |
| `ETLExecutionID`           | int      | ✓        |          |         |             |

## Constraints

- **Primary Key**: IDX_PK_FactGSCAppeaaranceDaily
  - Columns: FactGSCAppearanceDailyID

## Indexes

- **IDX_PK_FactGSCAppeaaranceDaily** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: FactGSCAppearanceDailyID ASC
- **NCI_EntityKey_Appearance** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: EntityKey ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.Dim_DMSVendor → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Dim_GLDetail → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Dim_GLDetail_arch → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Dim_GLDetail_ToBeDeleted → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Dim_Vendor → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimFBAdName → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimFBCampaign → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimGSCAppearance → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimGSCCountry → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimGSCDevice → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimGSCLandingPage → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimGSCSearchQuery → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimGSCSearchType → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimGSCSite → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimMarket → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimRegion → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimRMDepartment → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimRMSource → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimRMStoreNames → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimSurveyAudit → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimTextPerformance → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FacebookCustomerExport → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_AccountingDetail → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_AccountingDetail_arch → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_AccountingDetail_ToBeDeleted → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_AccountingDetailCurrent → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_AccountingSummary → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_AdvertisingExpense → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_ASI → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_CarsImpression → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_CarsLeads → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_CustomerSatisfactionIndex → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_EPTNotification → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_GridPenentration → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_HROverTime → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_HRTurnOver → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_Opportunity → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_RetailUnits → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_SAAR → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_StopSaleUsed → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_TemplateData → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_TradeAppraisal → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_TrafficManagement → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_TrafficManagementATIM → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_WebPageViews → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_WebStats → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactCBAMarketTarget → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactFBCampaignDaily → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactFBCampaignMonthly → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactFBOfflineMetrices → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactGMB → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactGSCAppearanceDaily → dbo.FactGSCDevicesCountryDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactGSCAppearanceDaily → dbo.FactGSCPagesDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactGSCAppearanceDaily → dbo.FactGSCQueryDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactGSCAppearanceDaily → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactGSCAppearanceDaily → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactGSCAppearanceDaily → dbo.QuartileOpportunityMart
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionId`
- **column_match**: dbo.FactGSCAppearanceDaily → dbo.RegionAssociate
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactGSCAppearanceDaily → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactGSCAppearanceDaily → dbo.wrk_Dim_HFMBrand
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimFBAdName → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserID`
- **column_match**: dbo.DimFBCampaign → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserID`
- **column_match**: dbo.DimGSCAppearance → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserID`
- **column_match**: dbo.DimGSCCountry → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserID`
- **column_match**: dbo.DimGSCDevice → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserID`
- **column_match**: dbo.DimGSCLandingPage → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserID`
- **column_match**: dbo.DimGSCSearchQuery → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserID`
- **column_match**: dbo.DimGSCSearchType → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserID`
- **column_match**: dbo.DimGSCSite → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserID`
- **column_match**: dbo.DimRMDepartment → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserID`
- **column_match**: dbo.DimRMSource → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserID`
- **column_match**: dbo.DimRMStoreNames → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserID`
- **column_match**: dbo.FacebookCustomerExport → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserID`
- **column_match**: dbo.FactFBCampaignDaily → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserID`
- **column_match**: dbo.FactFBCampaignMonthly → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserID`
- **column_match**: dbo.FactFBOfflineMetrices → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserID`
- **column_match**: dbo.FactGSCAppearanceDaily → dbo.FactGSCDevicesCountryDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserID`
- **column_match**: dbo.FactGSCAppearanceDaily → dbo.FactGSCPagesDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserID`
- **column_match**: dbo.FactGSCAppearanceDaily → dbo.FactGSCQueryDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserID`
- **column_match**: dbo.FactGSCAppearanceDaily → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserId`
- **column_match**: dbo.FactGSCAppearanceDaily → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserId`
- **column_match**: dbo.FactGSCAppearanceDaily → dbo.FBAudienceUnsoldShowroom
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserId`
- **column_match**: dbo.FactGSCAppearanceDaily → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserId`
- **column_match**: dbo.FactGSCAppearanceDaily → dbo.QuartileOpportunityMart
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserId`
- **column_match**: dbo.DimFBAdName → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimFBCampaign → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimGSCAppearance → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimGSCCountry → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimGSCDevice → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimGSCLandingPage → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimGSCSearchQuery → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimGSCSearchType → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimGSCSite → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimRMDepartment → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimRMSource → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimRMStoreNames → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.FactFBCampaignDaily → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.FactFBCampaignMonthly → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.FactFBOfflineMetrices → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.FactGSCAppearanceDaily → dbo.FactGSCDevicesCountryDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.FactGSCAppearanceDaily → dbo.FactGSCPagesDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.FactGSCAppearanceDaily → dbo.FactGSCQueryDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.FactGSCAppearanceDaily → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.FactGSCAppearanceDaily → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.FactGSCAppearanceDaily → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.FactGSCAppearanceDaily → dbo.QuartileOpportunityMart
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysId`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
