---
name: SoxReviewItem
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - SoxReviewResult
row_count: 0
size_kb: 0
column_count: 11
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
| `ReviewItemID`            | int      |          |          |         |             |
| `ReviewItem`              | varchar  | ✓        |          |         |             |
| `SectionName`             | varchar  | ✓        |          |         |             |
| `SectionNumber`           | int      | ✓        |          |         |             |
| `SubSectionName`          | varchar  | ✓        |          |         |             |
| `SubSectionNumber`        | int      | ✓        |          |         |             |
| `Meta_IsActive`           | int      | ✓        |          |         |             |
| `Meta_ExpiredDate`        | datetime | ✓        |          |         |             |
| `ReviewItemNumber`        | int      | ✓        |          |         |             |
| `ReviewItemDefaultResult` | int      | ✓        |          |         |             |
| `Meta_IsEchoPark`         | int      | ✓        |          |         |             |

## Constraints

- **Primary Key**: SoxReviewItemPK
  - Columns: ReviewItemID

## Indexes

- **SoxReviewItemPK** (NONCLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: ReviewItemID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **explicit_fk**: dbo.SoxReviewResult → dbo.SoxReviewItem
  - Confidence: 100%
  - Evidence: undefined
  - Column: `ReviewItemID` → `ReviewItemID`
- **column_match**: dbo.SoxReviewItem → dbo.SoxReviewResult
  - Confidence: 80%
  - Evidence: Exact column name match: "reviewitemid" in both tables
  - Column: `ReviewItemID` → `ReviewItemID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
