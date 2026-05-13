---
name: DimSurvey
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on: []
row_count: 0
size_kb: 0
column_count: 27
index_count: 0
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

| Name                             | Type      | Nullable | Identity | Default | Description |
| -------------------------------- | --------- | -------- | -------- | ------- | ----------- |
| `EntityKey`                      | int       |          |          |         |             |
| `ReportingSourceKey`             | int       |          |          |         |             |
| `CampaignID`                     | varchar   |          |          |         |             |
| `EmailID`                        | varchar   |          |          |         |             |
| `SurveyID`                       | varchar   |          |          |         |             |
| `LagDays`                        | int       |          |          |         |             |
| `IsRequiredCustomerName`         | bit       |          |          |         |             |
| `IsRequiredCustomerPhone`        | bit       |          |          |         |             |
| `IsRequiredCustomerStreet`       | bit       |          |          |         |             |
| `IsRequiredCustomerCity`         | bit       |          |          |         |             |
| `IsRequiredCustomerState`        | bit       |          |          |         |             |
| `IsRequiredCustomerZipCode`      | bit       |          |          |         |             |
| `IsRequiredGeneralManagerEmail`  | bit       |          |          |         |             |
| `IsRequiredGeneralManagerName`   | bit       |          |          |         |             |
| `IsRequiredExperienceGuideName`  | bit       |          |          |         |             |
| `IsRequiredExperienceGuideEmail` | bit       |          |          |         |             |
| `IsRequiredLoyaltyEmail`         | bit       |          |          |         |             |
| `IsRequiredLoyaltyName`          | bit       |          |          |         |             |
| `IsRequiredVehicleMake`          | bit       |          |          |         |             |
| `IsRequiredVehicleModel`         | bit       |          |          |         |             |
| `IsRequiredVehicleYear`          | bit       |          |          |         |             |
| `IsActive`                       | bit       |          |          |         |             |
| `CreatedBy`                      | varchar   |          |          |         |             |
| `CreatedDate`                    | datetime2 |          |          |         |             |
| `ModifiedBy`                     | varchar   |          |          |         |             |
| `ModifiedDate`                   | datetime2 |          |          |         |             |
| `DimSurveyID`                    | int       |          | ✓        |         |             |

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.DimSurvey → dbo.DimSurveyAudit
  - Confidence: 80%
  - Evidence: Exact column name match: "campaignid" in both tables
  - Column: `CampaignID` → `CampaignID`
- **column_match**: dbo.DimSurvey → dbo.vw_GoogleAds
  - Confidence: 80%
  - Evidence: Exact column name match: "campaignid" in both tables
  - Column: `CampaignID` → `campaignId`
- **column_match**: dbo.DimSurvey → dbo.vw_GoogleAds_Advertising
  - Confidence: 80%
  - Evidence: Exact column name match: "campaignid" in both tables
  - Column: `CampaignID` → `campaignId`
- **column_match**: dbo.DimSurvey → dbo.vw_GoogleAds_Advertising_new
  - Confidence: 80%
  - Evidence: Exact column name match: "campaignid" in both tables
  - Column: `CampaignID` → `campaignId`
- **column_match**: dbo.DimSurvey → dbo.DimSurveyAudit
  - Confidence: 80%
  - Evidence: Exact column name match: "emailid" in both tables
  - Column: `EmailID` → `EmailID`
- **column_match**: dbo.DimSurvey → dbo.DimSurveyAudit
  - Confidence: 80%
  - Evidence: Exact column name match: "surveyid" in both tables
  - Column: `SurveyID` → `SurveyID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
