---
name: vw_GoogleAds
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - DimSurvey
  - DimSurveyAudit
row_count: 0
size_kb: 0
column_count: 17
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

| Name                         | Type    | Nullable | Identity | Default | Description |
| ---------------------------- | ------- | -------- | -------- | ------- | ----------- |
| `vwGAdsID`                   | bigint  |          |          |         |             |
| `EntRegion`                  | varchar | ✓        |          |         |             |
| `EntityKey`                  | int     | ✓        |          |         |             |
| `EntDealerLvl1`              | varchar | ✓        |          |         |             |
| `EntBrand`                   | varchar | ✓        |          |         |             |
| `campaignId`                 | varchar | ✓        |          |         |             |
| `campaignName`               | varchar | ✓        |          |         |             |
| `advertisingChannelType`     | varchar | ✓        |          |         |             |
| `Date`                       | date    | ✓        |          |         |             |
| `datekey`                    | int     | ✓        |          |         |             |
| `availableImpressions`       | decimal | ✓        |          |         |             |
| `clicks`                     | decimal | ✓        |          |         |             |
| `conversions`                | decimal | ✓        |          |         |             |
| `cost`                       | decimal | ✓        |          |         |             |
| `impressions`                | decimal | ✓        |          |         |             |
| `lostImpressionsDueToBudget` | decimal | ✓        |          |         |             |
| `lostImpressionsDueToRank`   | decimal | ✓        |          |         |             |

## Constraints

- **Primary Key**: vw_GoogleAdsPK
  - Columns: vwGAdsID

## Indexes

- **vw_GoogleAdsPK** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: vwGAdsID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.DimSurvey → dbo.vw_GoogleAds
  - Confidence: 80%
  - Evidence: Exact column name match: "campaignid" in both tables
  - Column: `CampaignID` → `campaignId`
- **column_match**: dbo.DimSurveyAudit → dbo.vw_GoogleAds
  - Confidence: 80%
  - Evidence: Exact column name match: "campaignid" in both tables
  - Column: `CampaignID` → `campaignId`
- **column_match**: dbo.vw_GoogleAds → dbo.vw_GoogleAds_Advertising
  - Confidence: 80%
  - Evidence: Exact column name match: "campaignid" in both tables
  - Column: `campaignId` → `campaignId`
- **column_match**: dbo.vw_GoogleAds → dbo.vw_GoogleAds_Advertising_new
  - Confidence: 80%
  - Evidence: Exact column name match: "campaignid" in both tables
  - Column: `campaignId` → `campaignId`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
