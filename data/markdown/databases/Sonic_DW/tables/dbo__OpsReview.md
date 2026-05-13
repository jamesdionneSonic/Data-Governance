---
name: OpsReview
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - OpsReviewItem
row_count: 0
size_kb: 0
column_count: 7
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

| Name                 | Type     | Nullable | Identity | Default | Description |
| -------------------- | -------- | -------- | -------- | ------- | ----------- |
| `OpsReviewID`        | int      |          | ✓        |         |             |
| `CreatedByUserName`  | varchar  | ✓        |          |         |             |
| `ModifiedByUserName` | varchar  | ✓        |          |         |             |
| `CreatedOnDateTime`  | datetime | ✓        |          |         |             |
| `ModifiedOnDateTime` | datetime | ✓        |          |         |             |
| `ServiceType`        | varchar  | ✓        |          |         |             |
| `IsSubmitted`        | int      | ✓        |          |         |             |

## Constraints

- **Primary Key**: PK130
  - Columns: OpsReviewID

## Indexes

- **PK130** (NONCLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: OpsReviewID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **explicit_fk**: dbo.OpsReviewItem → dbo.OpsReview
  - Confidence: 100%
  - Evidence: undefined
  - Column: `OpsReviewID` → `OpsReviewID`
- **column_match**: dbo.OpsReview → dbo.OpsReviewItem
  - Confidence: 80%
  - Evidence: Exact column name match: "opsreviewid" in both tables
  - Column: `OpsReviewID` → `OpsReviewID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
