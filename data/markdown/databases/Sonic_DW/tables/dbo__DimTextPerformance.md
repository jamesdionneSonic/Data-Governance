---
name: DimTextPerformance
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
  - CustomerXREF_KeyLU
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
row_count: 0
size_kb: 0
column_count: 32
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

| Name                     | Type      | Nullable | Identity | Default | Description |
| ------------------------ | --------- | -------- | -------- | ------- | ----------- |
| `DimTextPerformanceID`   | bigint    |          | ✓        |         |             |
| `EntityKey`              | int       | ✓        |          |         |             |
| `DateKey`                | int       |          |          |         |             |
| `szNewUsed`              | varchar   | ✓        |          |         |             |
| `szUpType`               | varchar   | ✓        |          |         |             |
| `Customer`               | varchar   | ✓        |          |         |             |
| `PhoneNumber`            | varchar   | ✓        |          |         |             |
| `ProspectInDate`         | datetime2 | ✓        |          |         |             |
| `OptInSentDate`          | datetime2 | ✓        |          |         |             |
| `MaxEndDate`             | date      | ✓        |          |         |             |
| `Leadinfo`               | int       | ✓        |          |         |             |
| `TextLeadCount`          | int       | ✓        |          |         |             |
| `TextOptInRequest`       | int       | ✓        |          |         |             |
| `TextNoOptInRequest`     | int       | ✓        |          |         |             |
| `TextOptIn`              | int       | ✓        |          |         |             |
| `TextOptOut`             | int       | ✓        |          |         |             |
| `TextSent`               | int       | ✓        |          |         |             |
| `TextReceived`           | int       | ✓        |          |         |             |
| `TextAppt`               | int       | ✓        |          |         |             |
| `TextSold`               | int       | ✓        |          |         |             |
| `Meta_LoadDate`          | datetime  | ✓        |          |         |             |
| `Meta_RowLastChangeDate` | datetime  | ✓        |          |         |             |
| `Meta_ComputerName`      | varchar   | ✓        |          |         |             |
| `UserID`                 | varchar   | ✓        |          |         |             |
| `ETLExecutionID`         | int       | ✓        |          |         |             |
| `MetaNaturalKey`         | varchar   | ✓        |          |         |             |
| `Receiveddt`             | datetime2 | ✓        |          |         |             |
| `lCompanyID`             | int       | ✓        |          |         |             |
| `lPersonID`              | int       | ✓        |          |         |             |
| `lDealID`                | int       | ✓        |          |         |             |
| `Active`                 | bit       | ✓        |          |         |             |
| `DateHash`               | bigint    |          |          |         |             |

## Constraints

- **Primary Key**: PK\_[DimTextPerformance
  - Columns: DimTextPerformanceID

## Indexes

- **PK\_[DimTextPerformance** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: DimTextPerformanceID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.ControllerPoints → dbo.DimTextPerformance
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.CustomerMatchResult → dbo.DimTextPerformance
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.CustomerMatchResult_bak → dbo.DimTextPerformance
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Dim_Lender_Additions → dbo.DimTextPerformance
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Dim_Lender_Categories → dbo.DimTextPerformance
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Dim_Lender_FICO_Tiers → dbo.DimTextPerformance
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Dim_Lender_Type → dbo.DimTextPerformance
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.Dim_Operator → dbo.DimTextPerformance
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `Userid` → `UserID`
- **column_match**: dbo.DimTextPerformance → dbo.Fact_ASI
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.DimTextPerformance → dbo.Fact_CustomerSatisfactionIndex
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.DimTextPerformance → dbo.Fact_FixedOps
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.DimTextPerformance → dbo.Fact_GridPenentration
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.DimTextPerformance → dbo.Fact_HROverTime
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.DimTextPerformance → dbo.Fact_HRTurnOver
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.DimTextPerformance → dbo.Fact_StopSale
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.DimTextPerformance → dbo.Fact_StopSaleUsed
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.DimTextPerformance → dbo.Fact_TemplateData
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.DimTextPerformance → dbo.Fact_TradeAppraisal
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.DimTextPerformance → dbo.Fact_TrafficManagement
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.DimTextPerformance → dbo.Fact_TrafficManagementATIM
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.DimTextPerformance → dbo.factFIRE
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `userid`
- **column_match**: dbo.DimTextPerformance → dbo.factFIRE_BMWMini
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `userid`
- **column_match**: dbo.DimTextPerformance → dbo.GLDetail\_ MissingAcctInfo
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `userid`
- **column_match**: dbo.DimTextPerformance → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `UserID`
- **column_match**: dbo.DimTextPerformance → dbo.Syndicate_BoA_Dashboard
  - Confidence: 80%
  - Evidence: Exact column name match: "userid" in both tables
  - Column: `UserID` → `userID`
- **column_match**: dbo.CustomerXREF_KeyLU → dbo.DimTextPerformance
  - Confidence: 80%
  - Evidence: Exact column name match: "lpersonid" in both tables
  - Column: `lPersonID` → `lPersonID`
- **column_match**: dbo.DimTextPerformance → dbo.Fact_Opportunity
  - Confidence: 80%
  - Evidence: Exact column name match: "lpersonid" in both tables
  - Column: `lPersonID` → `lpersonid`
- **column_match**: dbo.Dim_DMSVendor → dbo.DimTextPerformance
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Dim_GLDetail → dbo.DimTextPerformance
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Dim_GLDetail_arch → dbo.DimTextPerformance
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Dim_GLDetail_ToBeDeleted → dbo.DimTextPerformance
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.Dim_Vendor → dbo.DimTextPerformance
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimFBAdName → dbo.DimTextPerformance
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimFBCampaign → dbo.DimTextPerformance
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimGSCAppearance → dbo.DimTextPerformance
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimGSCCountry → dbo.DimTextPerformance
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimGSCDevice → dbo.DimTextPerformance
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimGSCLandingPage → dbo.DimTextPerformance
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimGSCSearchQuery → dbo.DimTextPerformance
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimGSCSearchType → dbo.DimTextPerformance
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimGSCSite → dbo.DimTextPerformance
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimMarket → dbo.DimTextPerformance
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimRegion → dbo.DimTextPerformance
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimRMDepartment → dbo.DimTextPerformance
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimRMSource → dbo.DimTextPerformance
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimRMStoreNames → dbo.DimTextPerformance
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimSurveyAudit → dbo.DimTextPerformance
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimTextPerformance → dbo.FacebookCustomerExport
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimTextPerformance → dbo.Fact_AccountingDetail
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimTextPerformance → dbo.Fact_AccountingDetail_arch
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimTextPerformance → dbo.Fact_AccountingDetail_ToBeDeleted
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimTextPerformance → dbo.Fact_AccountingDetailCurrent
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimTextPerformance → dbo.Fact_AccountingSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimTextPerformance → dbo.Fact_AdvertisingExpense
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimTextPerformance → dbo.Fact_ASI
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimTextPerformance → dbo.Fact_CarsImpression
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimTextPerformance → dbo.Fact_CarsLeads
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimTextPerformance → dbo.Fact_CustomerSatisfactionIndex
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimTextPerformance → dbo.Fact_EPTNotification
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimTextPerformance → dbo.Fact_GridPenentration
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimTextPerformance → dbo.Fact_HROverTime
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimTextPerformance → dbo.Fact_HRTurnOver
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimTextPerformance → dbo.Fact_Opportunity
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimTextPerformance → dbo.Fact_RetailUnits
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimTextPerformance → dbo.Fact_SAAR
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimTextPerformance → dbo.Fact_StopSaleUsed
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimTextPerformance → dbo.Fact_TemplateData
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimTextPerformance → dbo.Fact_TradeAppraisal
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimTextPerformance → dbo.Fact_TrafficManagement
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimTextPerformance → dbo.Fact_TrafficManagementATIM
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimTextPerformance → dbo.Fact_WebPageViews
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimTextPerformance → dbo.Fact_WebStats
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimTextPerformance → dbo.FactCBAMarketTarget
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimTextPerformance → dbo.FactFBCampaignDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimTextPerformance → dbo.FactFBCampaignMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimTextPerformance → dbo.FactFBOfflineMetrices
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimTextPerformance → dbo.FactGMB
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimTextPerformance → dbo.FactGSCAppearanceDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimTextPerformance → dbo.FactGSCDevicesCountryDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimTextPerformance → dbo.FactGSCPagesDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimTextPerformance → dbo.FactGSCQueryDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimTextPerformance → dbo.FactRMReviewMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimTextPerformance → dbo.FactRMReviewMonthly
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimTextPerformance → dbo.QuartileOpportunityMart
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionId`
- **column_match**: dbo.DimTextPerformance → dbo.RegionAssociate
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimTextPerformance → dbo.StartTotalMORMetrics
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimTextPerformance → dbo.wrk_Dim_HFMBrand
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimTextPerformance → dbo.FBAudienceUnsoldShowroom
  - Confidence: 80%
  - Evidence: Exact column name match: "lcompanyid" in both tables
  - Column: `lCompanyID` → `lCompanyID`
- **column_match**: dbo.DimTextPerformance → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "lcompanyid" in both tables
  - Column: `lCompanyID` → `lCompanyID`
- **column_match**: dbo.DimTextPerformance → dbo.Fact_Opportunity
  - Confidence: 80%
  - Evidence: Exact column name match: "ldealid" in both tables
  - Column: `lDealID` → `ldealID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
