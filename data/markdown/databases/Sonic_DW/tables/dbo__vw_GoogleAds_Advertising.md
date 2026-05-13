---
name: vw_GoogleAds_Advertising
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
  - vw_GoogleAds
row_count: 0
size_kb: 0
column_count: 20
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
| `vwGAdsAdvID`                | bigint  |          |          |         |             |
| `EntRegion`                  | varchar | ✓        |          |         |             |
| `EntityKey`                  | int     | ✓        |          |         |             |
| `EntDealerLvl1`              | varchar | ✓        |          |         |             |
| `EntBrand`                   | varchar | ✓        |          |         |             |
| `campaignId`                 | varchar | ✓        |          |         |             |
| `campaignName`               | varchar | ✓        |          |         |             |
| `advertisingChannelType`     | varchar | ✓        |          |         |             |
| `CampaignSegment`            | varchar | ✓        |          |         |             |
| `CampaignGroup`              | varchar | ✓        |          |         |             |
| `Date`                       | date    | ✓        |          |         |             |
| `datekey`                    | int     | ✓        |          |         |             |
| `availableImpressions`       | decimal | ✓        |          |         |             |
| `clicks`                     | decimal | ✓        |          |         |             |
| `conversions`                | decimal | ✓        |          |         |             |
| `cost`                       | decimal | ✓        |          |         |             |
| `impressions`                | decimal | ✓        |          |         |             |
| `lostImpressionsDueToBudget` | decimal | ✓        |          |         |             |
| `lostImpressionsDueToRank`   | decimal | ✓        |          |         |             |
| `Labels`                     | varchar | ✓        |          |         |             |

## Constraints

- **Primary Key**: vw_GoogleAds_AdvertisingPK
  - Columns: vwGAdsAdvID

## Indexes

- **vw_GoogleAds_AdvertisingPK** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: vwGAdsAdvID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.DimSurvey → dbo.vw_GoogleAds_Advertising
  - Confidence: 80%
  - Evidence: Exact column name match: "campaignid" in both tables
  - Column: `CampaignID` → `campaignId`
- **column_match**: dbo.DimSurveyAudit → dbo.vw_GoogleAds_Advertising
  - Confidence: 80%
  - Evidence: Exact column name match: "campaignid" in both tables
  - Column: `CampaignID` → `campaignId`
- **column_match**: dbo.vw_GoogleAds → dbo.vw_GoogleAds_Advertising
  - Confidence: 80%
  - Evidence: Exact column name match: "campaignid" in both tables
  - Column: `campaignId` → `campaignId`
- **column_match**: dbo.vw_GoogleAds_Advertising → dbo.vw_GoogleAds_Advertising_new
  - Confidence: 80%
  - Evidence: Exact column name match: "campaignid" in both tables
  - Column: `campaignId` → `campaignId`
- **column_match**: dbo.vw_GoogleAds_Advertising → dbo.vw_GoogleAds_Advertising_new
  - Confidence: 80%
  - Evidence: Exact column name match: "vwgadsadvid" in both tables
  - Column: `vwGAdsAdvID` → `vwGAdsAdvID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
