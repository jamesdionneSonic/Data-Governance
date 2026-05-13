---
name: OpsReviewItem
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - OpsServiceDealership
  - OpsReviewItemDetail
  - Metric
  - MetricReport
  - OpsReview
row_count: 0
size_kb: 0
column_count: 6
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

| Name                  | Type    | Nullable | Identity | Default | Description |
| --------------------- | ------- | -------- | -------- | ------- | ----------- |
| `OpsReviewItemID`     | int     |          | ✓        |         |             |
| `ServiceID`           | int     |          |          |         |             |
| `StatusID`            | int     |          |          |         |             |
| `OwnerID`             | varchar |          |          |         |             |
| `OpsReviewID`         | int     |          |          |         |             |
| `IsBusinessImpacting` | int     | ✓        |          |         |             |

## Constraints

- **Primary Key**: PK126
  - Columns: OpsReviewItemID

## Indexes

- **IDX_OpsReviewID** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: OpsReviewID ASC
  - Included Columns: OpsReviewItemID, ServiceID
- **PK126** (NONCLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: OpsReviewItemID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **explicit_fk**: dbo.OpsReviewItem → dbo.OpsAssociate
  - Confidence: 100%
  - Evidence: undefined
  - Column: `OwnerID` → `Username`
- **explicit_fk**: dbo.OpsReviewItem → dbo.OpsReview
  - Confidence: 100%
  - Evidence: undefined
  - Column: `OpsReviewID` → `OpsReviewID`
- **explicit_fk**: dbo.OpsServiceDealership → dbo.OpsReviewItem
  - Confidence: 100%
  - Evidence: undefined
  - Column: `OpsReviewItemID` → `OpsReviewItemID`
- **explicit_fk**: dbo.OpsReviewItemDetail → dbo.OpsReviewItem
  - Confidence: 100%
  - Evidence: undefined
  - Column: `OpsReviewItemID` → `OpsReviewItemID`
- **explicit_fk**: dbo.OpsReviewItem → dbo.OpsService
  - Confidence: 100%
  - Evidence: undefined
  - Column: `ServiceID` → `ServiceID`
- **explicit_fk**: dbo.OpsReviewItem → dbo.OpsStatus
  - Confidence: 100%
  - Evidence: undefined
  - Column: `StatusID` → `StatusID`
- **column_match**: dbo.Metric → dbo.OpsReviewItem
  - Confidence: 80%
  - Evidence: Exact column name match: "statusid" in both tables
  - Column: `StatusID` → `StatusID`
- **column_match**: dbo.MetricReport → dbo.OpsReviewItem
  - Confidence: 80%
  - Evidence: Exact column name match: "statusid" in both tables
  - Column: `StatusID` → `StatusID`
- **column_match**: dbo.OpsReviewItem → dbo.OpsReviewItemDetail
  - Confidence: 80%
  - Evidence: Exact column name match: "statusid" in both tables
  - Column: `StatusID` → `StatusID`
- **column_match**: dbo.OpsReviewItem → dbo.OpsStatus
  - Confidence: 80%
  - Evidence: Exact column name match: "statusid" in both tables
  - Column: `StatusID` → `StatusID`
- **column_match**: dbo.OpsReviewItem → dbo.PlaybookStatus
  - Confidence: 80%
  - Evidence: Exact column name match: "statusid" in both tables
  - Column: `StatusID` → `StatusID`
- **column_match**: dbo.OpsReviewItem → dbo.START_Metrics
  - Confidence: 80%
  - Evidence: Exact column name match: "statusid" in both tables
  - Column: `StatusID` → `StatusID`
- **column_match**: dbo.OpsReview → dbo.OpsReviewItem
  - Confidence: 80%
  - Evidence: Exact column name match: "opsreviewid" in both tables
  - Column: `OpsReviewID` → `OpsReviewID`
- **column_match**: dbo.OpsReviewItem → dbo.OpsReviewItemDetail
  - Confidence: 80%
  - Evidence: Exact column name match: "opsreviewitemid" in both tables
  - Column: `OpsReviewItemID` → `OpsReviewItemID`
- **column_match**: dbo.OpsReviewItem → dbo.OpsServiceDealership
  - Confidence: 80%
  - Evidence: Exact column name match: "opsreviewitemid" in both tables
  - Column: `OpsReviewItemID` → `OpsReviewItemID`
- **column_match**: dbo.OpsReviewItem → dbo.OpsService
  - Confidence: 80%
  - Evidence: Exact column name match: "serviceid" in both tables
  - Column: `ServiceID` → `ServiceID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
