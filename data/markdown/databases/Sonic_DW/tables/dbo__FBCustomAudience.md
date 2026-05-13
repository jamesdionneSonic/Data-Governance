---
name: FBCustomAudience
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - FBAudienceUnsoldShowroom
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
  - FactRMReviewMonthly
  - FBAudienceUnsoldShowroom
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
  - FactRMReviewMonthly
  - DimTextPerformance
  - FBAudienceUnsoldShowroom
  - FBAudienceUnsoldShowroom
  - FBAudienceUnsoldShowroom
row_count: 0
size_kb: 0
column_count: 24
index_count: 3
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

| Name                   | Type          | Nullable | Identity | Default | Description |
| ---------------------- | ------------- | -------- | -------- | ------- | ----------- |
| `AudienceID`           | bigint        | ✓        |          |         |             |
| `CustomerID`           | varchar       | ✓        |          |         |             |
| `FirstName`            | varchar       | ✓        |          |         |             |
| `LastName`             | varchar       | ✓        |          |         |             |
| `Email`                | varchar       | ✓        |          |         |             |
| `lChildCompanyID`      | int           | ✓        |          |         |             |
| `lCompanyID`           | int           | ✓        |          |         |             |
| `TransactionDate`      | smalldatetime | ✓        |          |         |             |
| `AudienceType`         | varchar       | ✓        |          |         |             |
| `EntityKey`            | int           | ✓        |          |         |             |
| `EntDealerLvl1`        | varchar       | ✓        |          |         |             |
| `ErrorCode`            | int           | ✓        |          |         |             |
| `LoadStatus`           | char          | ✓        |          |         |             |
| `MetaDataDate`         | datetime      | ✓        |          |         |             |
| `MetaLoadDate`         | datetime      |          |          |         |             |
| `MetaComputerName`     | varchar       |          |          |         |             |
| `MetaUserId`           | varchar       |          |          |         |             |
| `MetaSourceSystemName` | varchar       |          |          |         |             |
| `MetaSrcSysID`         | int           |          |          |         |             |
| `ETLExecutionID`       | varchar       |          |          |         |             |
| `CustomAudienceID`     | int           |          | ✓        |         |             |
| `PhoneNumber`          | varchar       | ✓        |          |         |             |
| `ZipCode`              | varchar       | ✓        |          |         |             |
| `City`                 | varchar       | ✓        |          |         |             |

## Indexes

- **INX_CustomAudienceID** (CLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: CustomAudienceID ASC
- **IX_FBCustomAudience_AudienceType** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: AudienceType ASC
  - Included Columns: ETLExecutionID
- **IX_FBCustomAudience_MetaDataDate** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: MetaDataDate ASC
  - Included Columns: AudienceID, CustomerID, FirstName, LastName, Email, AudienceType

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.FBAudienceUnsoldShowroom → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecutionid" in both tables
  - Column: `ETLExecutionID` → `ETLExecutionID`
- **column_match**: dbo.DimFBAdName → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.DimFBCampaign → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.DimGSCAppearance → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserId`
- **column_match**: dbo.DimGSCCountry → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserId`
- **column_match**: dbo.DimGSCDevice → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserId`
- **column_match**: dbo.DimGSCLandingPage → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserId`
- **column_match**: dbo.DimGSCSearchQuery → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserId`
- **column_match**: dbo.DimGSCSearchType → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserId`
- **column_match**: dbo.DimGSCSite → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserId`
- **column_match**: dbo.DimRMDepartment → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.DimRMSource → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.DimRMStoreNames → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.FacebookCustomerExport → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.FactFBCampaignDaily → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.FactFBCampaignMonthly → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.FactFBOfflineMetrices → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.FactGSCAppearanceDaily → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserId`
- **column_match**: dbo.FactGSCDevicesCountryDaily → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserId`
- **column_match**: dbo.FactGSCPagesDaily → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserId`
- **column_match**: dbo.FactGSCQueryDaily → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserID` → `MetaUserId`
- **column_match**: dbo.FactRMReviewMetrics → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.FactRMReviewMonthly → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.FBAudienceUnsoldShowroom → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.FBCustomAudience → dbo.QuartileOpportunityMart
  - Confidence: 80%
  - Evidence: Exact column name match: "metauserid" in both tables
  - Column: `MetaUserId` → `MetaUserId`
- **column_match**: dbo.DimFBAdName → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimFBCampaign → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimGSCAppearance → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimGSCCountry → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimGSCDevice → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimGSCLandingPage → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimGSCSearchQuery → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimGSCSearchType → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimGSCSite → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimRMDepartment → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimRMSource → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.DimRMStoreNames → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.FactFBCampaignDaily → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.FactFBCampaignMonthly → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.FactFBOfflineMetrices → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.FactGSCAppearanceDaily → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.FactGSCDevicesCountryDaily → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.FactGSCPagesDaily → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.FactGSCQueryDaily → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.FactRMReviewMetrics → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.FactRMReviewMonthly → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysID`
- **column_match**: dbo.FBCustomAudience → dbo.QuartileOpportunityMart
  - Confidence: 80%
  - Evidence: Exact column name match: "metasrcsysid" in both tables
  - Column: `MetaSrcSysID` → `MetaSrcSysId`
- **column_match**: dbo.DimTextPerformance → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "lcompanyid" in both tables
  - Column: `lCompanyID` → `lCompanyID`
- **column_match**: dbo.FBAudienceUnsoldShowroom → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "lcompanyid" in both tables
  - Column: `lCompanyID` → `lCompanyID`
- **column_match**: dbo.FBAudienceUnsoldShowroom → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "audienceid" in both tables
  - Column: `AudienceID` → `AudienceID`
- **column_match**: dbo.FBAudienceUnsoldShowroom → dbo.FBCustomAudience
  - Confidence: 80%
  - Evidence: Exact column name match: "lchildcompanyid" in both tables
  - Column: `lChildCompanyID` → `lChildCompanyID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
