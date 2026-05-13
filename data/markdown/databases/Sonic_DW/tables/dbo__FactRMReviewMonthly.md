---
name: FactRMReviewMonthly
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
  - FactGSCAppearanceDaily
  - FactGSCDevicesCountryDaily
  - FactGSCPagesDaily
  - FactGSCQueryDaily
  - FactRMReviewMetrics
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
  - FactGSCAppearanceDaily
  - FactGSCDevicesCountryDaily
  - FactGSCPagesDaily
  - FactGSCQueryDaily
  - FactRMReviewMetrics
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
  - FactGSCAppearanceDaily
  - FactGSCDevicesCountryDaily
  - FactGSCPagesDaily
  - FactGSCQueryDaily
  - FactRMReviewMetrics
row_count: 0
size_kb: 0
column_count: 26
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

| Name                    | Type     | Nullable | Identity | Default | Description |
| ----------------------- | -------- | -------- | -------- | ------- | ----------- |
| `FactRMReviewMonthlyID` | int      |          | ✓        |         |             |
| `RMStoreKey`            | int      |          |          |         |             |
| `EventDateKey`          | int      |          |          |         |             |
| `RMSourceKey`           | int      |          |          |         |             |
| `ReviewDateTime`        | datetime | ✓        |          |         |             |
| `URL`                   | varchar  | ✓        |          |         |             |
| `ReviewerName`          | varchar  | ✓        |          |         |             |
| `Rating`                | decimal  | ✓        |          |         |             |
| `NormalizedRating`      | decimal  | ✓        |          |         |             |
| `Sentiment`             | varchar  | ✓        |          |         |             |
| `CommentTitle`          | nvarchar | ✓        |          |         |             |
| `Comment`               | nvarchar | ✓        |          |         |             |
| `Published`             | varchar  | ✓        |          |         |             |
| `CanRespond`            | varchar  | ✓        |          |         |             |
| `HasResponses`          | varchar  | ✓        |          |         |             |
| `ResponseURL`           | varchar  | ✓        |          |         |             |
| `ReviewURL`             | varchar  | ✓        |          |         |             |
| `Categories`            | varchar  | ✓        |          |         |             |
| `Updated`               | varchar  | ✓        |          |         |             |
| `MetaNaturalKey`        | varchar  |          |          |         |             |
| `MetaLoadDate`          | datetime |          |          |         |             |
| `MetaComputerName`      | varchar  |          |          |         |             |
| `MetaUserId`            | varchar  |          |          |         |             |
| `MetaSourceSystemName`  | varchar  |          |          |         |             |
| `MetaSrcSysID`          | int      |          |          |         |             |
| `ETLExecutionID`        | int      |          |          |         |             |

## Constraints

- **Primary Key**: PK**FactRMRe**F0AD5440A8B4E912
  - Columns: FactRMReviewMonthlyID

## Indexes

- **PK**FactRMRe**F0AD5440A8B4E912** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: FactRMReviewMonthlyID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.Dim_DMSVendor → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Dim_GLDetail → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Dim_GLDetail_arch → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Dim_GLDetail_ToBeDeleted → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Dim_Vendor → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimFBAdName → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimFBCampaign → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimGSCAppearance → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimGSCCountry → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimGSCDevice → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimGSCLandingPage → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimGSCSearchQuery → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimGSCSearchType → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimGSCSite → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimMarket → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimRegion → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimRMDepartment → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimRMSource → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimRMStoreNames → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimSurveyAudit → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimTextPerformance → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FacebookCustomerExport → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_AccountingDetail → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_AccountingDetail_arch → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_AccountingDetail_ToBeDeleted → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_AccountingDetailCurrent → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_AccountingSummary → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_AdvertisingExpense → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_ASI → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_CarsImpression → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_CarsLeads → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_CustomerSatisfactionIndex → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_EPTNotification → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_GridPenentration → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_HROverTime → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_HRTurnOver → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_Opportunity → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_RetailUnits → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_SAAR → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_StopSaleUsed → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_TemplateData → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_TradeAppraisal → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_TrafficManagement → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_TrafficManagementATIM → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_WebPageViews → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_WebStats → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactCBAMarketTarget → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactFBCampaignDaily → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactFBCampaignMonthly → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactFBOfflineMetrices → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactGMB → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactGSCAppearanceDaily → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactGSCDevicesCountryDaily → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactGSCPagesDaily → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactGSCQueryDaily → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactRMReviewMetrics → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactRMReviewMonthly → dbo.QuartileOpportunityMart
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionId`
- **column_match**: dbo.FactRMReviewMonthly → dbo.RegionAssociate
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactRMReviewMonthly → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactRMReviewMonthly → dbo.wrk_Dim_HFMBrand
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimFBAdName → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.DimFBCampaign → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.DimGSCAppearance → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserId`
- **column_match**: dbo.DimGSCCountry → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserId`
- **column_match**: dbo.DimGSCDevice → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserId`
- **column_match**: dbo.DimGSCLandingPage → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserId`
- **column_match**: dbo.DimGSCSearchQuery → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserId`
- **column_match**: dbo.DimGSCSearchType → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserId`
- **column_match**: dbo.DimGSCSite → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserId`
- **column_match**: dbo.DimRMDepartment → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.DimRMSource → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.DimRMStoreNames → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.FacebookCustomerExport → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.FactFBCampaignDaily → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.FactFBCampaignMonthly → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.FactFBOfflineMetrices → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.FactGSCAppearanceDaily → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserId`
- **column_match**: dbo.FactGSCDevicesCountryDaily → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserId`
- **column_match**: dbo.FactGSCPagesDaily → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserId`
- **column_match**: dbo.FactGSCQueryDaily → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserId`
- **column_match**: dbo.FactRMReviewMetrics → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.FactRMReviewMonthly → dbo.FBAudienceUnsoldShowroom
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.FactRMReviewMonthly → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.FactRMReviewMonthly → dbo.QuartileOpportunityMart
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.DimFBAdName → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimFBCampaign → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimGSCAppearance → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimGSCCountry → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimGSCDevice → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimGSCLandingPage → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimGSCSearchQuery → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimGSCSearchType → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimGSCSite → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimRMDepartment → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimRMSource → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimRMStoreNames → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.FactFBCampaignDaily → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.FactFBCampaignMonthly → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.FactFBOfflineMetrices → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.FactGSCAppearanceDaily → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.FactGSCDevicesCountryDaily → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.FactGSCPagesDaily → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.FactGSCQueryDaily → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.FactRMReviewMetrics → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.FactRMReviewMonthly → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.FactRMReviewMonthly → dbo.QuartileOpportunityMart
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysId`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
