---
name: FactFBOfflineMetrices
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
row_count: 0
size_kb: 0
column_count: 19
index_count: 1
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

| Name                      | Type     | Nullable | Identity | Default | Description |
| ------------------------- | -------- | -------- | -------- | ------- | ----------- |
| `FactFBOfflineMetricesID` | int      |          | ✓        |         |             |
| `EntityKey`               | int      | ✓        |          |         |             |
| `AdKey`                   | int      | ✓        |          |         |             |
| `CampaignKey`             | int      | ✓        |          |         |             |
| `OfflineAddsToCart`       | int      | ✓        |          |         |             |
| `UniqueAddsToWishlist`    | int      | ✓        |          |         |             |
| `OfflinePurchases`        | int      | ✓        |          |         |             |
| `FileDate`                | date     | ✓        |          |         |             |
| `DataDate`                | date     | ✓        |          |         |             |
| `MetaNaturalKey`          | varchar  |          |          |         |             |
| `MetaSourceFileName`      | varchar  | ✓        |          |         |             |
| `MetaFileModifiedDate`    | datetime |          |          |         |             |
| `MetaLoadDate`            | datetime |          |          |         |             |
| `MetaComputerName`        | varchar  | ✓        |          |         |             |
| `MetaUserId`              | varchar  | ✓        |          |         |             |
| `MetaSourceSystemName`    | varchar  | ✓        |          |         |             |
| `MetaSrcSysID`            | int      | ✓        |          |         |             |
| `ETLExecutionID`          | int      | ✓        |          |         |             |
| `DateKey`                 | int      | ✓        |          |         |             |

## Constraints

- **Primary Key**: PK**FactFBOf**97907BE8C1F0F6D6
  - Columns: FactFBOfflineMetricesID

## Indexes

- **PK**FactFBOf**97907BE8C1F0F6D6** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: FactFBOfflineMetricesID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.Dim_DMSVendor → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Dim_GLDetail → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Dim_GLDetail_arch → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Dim_GLDetail_ToBeDeleted → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Dim_Vendor → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimFBAdName → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimFBCampaign → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimGSCAppearance → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimGSCCountry → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimGSCDevice → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimGSCLandingPage → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimGSCSearchQuery → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimGSCSearchType → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimGSCSite → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimMarket → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimRegion → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimRMDepartment → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimRMSource → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimRMStoreNames → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimSurveyAudit → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimTextPerformance → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FacebookCustomerExport → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_AccountingDetail → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_AccountingDetail_arch → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_AccountingDetail_ToBeDeleted → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_AccountingDetailCurrent → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_AccountingSummary → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_AdvertisingExpense → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_ASI → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_CarsImpression → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_CarsLeads → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_CustomerSatisfactionIndex → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_EPTNotification → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_GridPenentration → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_HROverTime → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_HRTurnOver → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_Opportunity → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_RetailUnits → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_SAAR → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_StopSaleUsed → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_TemplateData → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_TradeAppraisal → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_TrafficManagement → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_TrafficManagementATIM → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_WebPageViews → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_WebStats → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactCBAMarketTarget → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactFBCampaignDaily → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactFBCampaignMonthly → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactFBOfflineMetrices → dbo.FactGMB
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactFBOfflineMetrices → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactFBOfflineMetrices → dbo.FactGSCDevicesCountryDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactFBOfflineMetrices → dbo.FactGSCPagesDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactFBOfflineMetrices → dbo.FactGSCQueryDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactFBOfflineMetrices → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactFBOfflineMetrices → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactFBOfflineMetrices → dbo.QuartileOpportunityMart
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionId`
- **column_match**: dbo.FactFBOfflineMetrices → dbo.RegionAssociate
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactFBOfflineMetrices → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactFBOfflineMetrices → dbo.wrk_Dim_HFMBrand
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimFBAdName → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.DimFBCampaign → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.DimGSCAppearance → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserId`
- **column_match**: dbo.DimGSCCountry → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserId`
- **column_match**: dbo.DimGSCDevice → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserId`
- **column_match**: dbo.DimGSCLandingPage → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserId`
- **column_match**: dbo.DimGSCSearchQuery → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserId`
- **column_match**: dbo.DimGSCSearchType → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserId`
- **column_match**: dbo.DimGSCSite → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserId`
- **column_match**: dbo.DimRMDepartment → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.DimRMSource → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.DimRMStoreNames → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.FacebookCustomerExport → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.FactFBCampaignDaily → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.FactFBCampaignMonthly → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.FactFBOfflineMetrices → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserID`
- **column_match**: dbo.FactFBOfflineMetrices → dbo.FactGSCDevicesCountryDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserID`
- **column_match**: dbo.FactFBOfflineMetrices → dbo.FactGSCPagesDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserID`
- **column_match**: dbo.FactFBOfflineMetrices → dbo.FactGSCQueryDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserID`
- **column_match**: dbo.FactFBOfflineMetrices → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.FactFBOfflineMetrices → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.FactFBOfflineMetrices → dbo.FBAudienceUnsoldShowroom
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.FactFBOfflineMetrices → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.FactFBOfflineMetrices → dbo.QuartileOpportunityMart
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.DimFBAdName → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimFBCampaign → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimGSCAppearance → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimGSCCountry → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimGSCDevice → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimGSCLandingPage → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimGSCSearchQuery → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimGSCSearchType → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimGSCSite → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimRMDepartment → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimRMSource → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimRMStoreNames → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.FactFBCampaignDaily → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.FactFBCampaignMonthly → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.FactFBOfflineMetrices → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.FactFBOfflineMetrices → dbo.FactGSCDevicesCountryDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.FactFBOfflineMetrices → dbo.FactGSCPagesDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.FactFBOfflineMetrices → dbo.FactGSCQueryDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.FactFBOfflineMetrices → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.FactFBOfflineMetrices → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.FactFBOfflineMetrices → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.FactFBOfflineMetrices → dbo.QuartileOpportunityMart
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysId`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
