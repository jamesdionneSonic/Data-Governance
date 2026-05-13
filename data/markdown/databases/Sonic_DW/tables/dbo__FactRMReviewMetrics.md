---
name: FactRMReviewMetrics
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
row_count: 0
size_kb: 0
column_count: 24
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

| Name                   | Type     | Nullable | Identity | Default | Description |
| ---------------------- | -------- | -------- | -------- | ------- | ----------- |
| `FactRMMetricID`       | int      |          | ✓        |         |             |
| `RMStoreKey`           | int      |          |          |         |             |
| `EventDateKey`         | int      |          |          |         |             |
| `Failures`             | int      | ✓        |          |         |             |
| `Unsubscribes`         | int      | ✓        |          |         |             |
| `Dropped`              | int      | ✓        |          |         |             |
| `Delivered`            | int      | ✓        |          |         |             |
| `Opened`               | int      | ✓        |          |         |             |
| `Received`             | int      | ✓        |          |         |             |
| `UniqueOpened`         | int      | ✓        |          |         |             |
| `Bounced`              | int      | ✓        |          |         |             |
| `Clicked`              | int      | ✓        |          |         |             |
| `Sent`                 | int      | ✓        |          |         |             |
| `Unsubscribed`         | int      | ✓        |          |         |             |
| `Spammed`              | int      | ✓        |          |         |             |
| `UniqueClicked`        | int      | ✓        |          |         |             |
| `Deduped`              | int      | ✓        |          |         |             |
| `MetaNaturalKey`       | varchar  |          |          |         |             |
| `MetaLoadDate`         | datetime |          |          |         |             |
| `MetaComputerName`     | varchar  |          |          |         |             |
| `MetaUserId`           | varchar  |          |          |         |             |
| `MetaSourceSystemName` | varchar  |          |          |         |             |
| `MetaSrcSysID`         | int      |          |          |         |             |
| `ETLExecutionID`       | int      |          |          |         |             |

## Constraints

- **Primary Key**: PK**FactRMRe**CF05337E5BDD028E
  - Columns: FactRMMetricID

## Indexes

- **PK**FactRMRe**CF05337E5BDD028E** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: FactRMMetricID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.Dim_DMSVendor → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Dim_GLDetail → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Dim_GLDetail_arch → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Dim_GLDetail_ToBeDeleted → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Dim_Vendor → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimFBAdName → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimFBCampaign → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimGSCAppearance → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimGSCCountry → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimGSCDevice → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimGSCLandingPage → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimGSCSearchQuery → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimGSCSearchType → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimGSCSite → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimMarket → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimRegion → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimRMDepartment → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimRMSource → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimRMStoreNames → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimSurveyAudit → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimTextPerformance → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FacebookCustomerExport → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_AccountingDetail → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_AccountingDetail_arch → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_AccountingDetail_ToBeDeleted → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_AccountingDetailCurrent → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_AccountingSummary → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_AdvertisingExpense → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_ASI → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_CarsImpression → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_CarsLeads → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_CustomerSatisfactionIndex → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_EPTNotification → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_GridPenentration → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_HROverTime → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_HRTurnOver → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_Opportunity → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_RetailUnits → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_SAAR → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_StopSaleUsed → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_TemplateData → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_TradeAppraisal → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_TrafficManagement → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_TrafficManagementATIM → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_WebPageViews → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Fact_WebStats → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactCBAMarketTarget → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactFBCampaignDaily → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactFBCampaignMonthly → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactFBOfflineMetrices → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactGMB → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactGSCAppearanceDaily → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactGSCDevicesCountryDaily → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactGSCPagesDaily → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactGSCQueryDaily → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactRMReviewMetrics → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactRMReviewMetrics → dbo.QuartileOpportunityMart
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionId`
- **column_match**: dbo.FactRMReviewMetrics → dbo.RegionAssociate
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactRMReviewMetrics → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.FactRMReviewMetrics → dbo.wrk_Dim_HFMBrand
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimFBAdName → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.DimFBCampaign → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.DimGSCAppearance → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserId`
- **column_match**: dbo.DimGSCCountry → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserId`
- **column_match**: dbo.DimGSCDevice → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserId`
- **column_match**: dbo.DimGSCLandingPage → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserId`
- **column_match**: dbo.DimGSCSearchQuery → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserId`
- **column_match**: dbo.DimGSCSearchType → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserId`
- **column_match**: dbo.DimGSCSite → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserId`
- **column_match**: dbo.DimRMDepartment → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.DimRMSource → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.DimRMStoreNames → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.FacebookCustomerExport → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.FactFBCampaignDaily → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.FactFBCampaignMonthly → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.FactFBOfflineMetrices → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.FactGSCAppearanceDaily → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserId`
- **column_match**: dbo.FactGSCDevicesCountryDaily → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserId`
- **column_match**: dbo.FactGSCPagesDaily → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserId`
- **column_match**: dbo.FactGSCQueryDaily → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserId`
- **column_match**: dbo.FactRMReviewMetrics → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.FactRMReviewMetrics → dbo.FBAudienceUnsoldShowroom
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.FactRMReviewMetrics → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.FactRMReviewMetrics → dbo.QuartileOpportunityMart
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.DimFBAdName → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimFBCampaign → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimGSCAppearance → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimGSCCountry → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimGSCDevice → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimGSCLandingPage → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimGSCSearchQuery → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimGSCSearchType → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimGSCSite → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimRMDepartment → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimRMSource → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimRMStoreNames → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.FactFBCampaignDaily → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.FactFBCampaignMonthly → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.FactFBOfflineMetrices → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.FactGSCAppearanceDaily → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.FactGSCDevicesCountryDaily → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.FactGSCPagesDaily → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.FactGSCQueryDaily → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.FactRMReviewMetrics → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.FactRMReviewMetrics → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.FactRMReviewMetrics → dbo.QuartileOpportunityMart
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysId`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
