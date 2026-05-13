---
name: OpsServiceDealership
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - OpsReviewItem
  - OpsReviewItemDetail
row_count: 0
size_kb: 0
column_count: 5
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

| Name              | Type    | Nullable | Identity | Default | Description |
| ----------------- | ------- | -------- | -------- | ------- | ----------- |
| `EntityKey`       | int     |          |          |         |             |
| `OpsReviewItemID` | int     | ✓        |          |         |             |
| `ConsecDays`      | int     | ✓        |          |         |             |
| `EntityType`      | varchar | ✓        |          |         |             |
| `TicketNumber`    | varchar | ✓        |          |         |             |

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **explicit_fk**: dbo.OpsServiceDealership → dbo.OpsReviewItem
  - Confidence: 100%
  - Evidence: undefined
  - Column: `OpsReviewItemID` → `OpsReviewItemID`
- **column_match**: dbo.OpsReviewItem → dbo.OpsServiceDealership
  - Confidence: 80%
  - Evidence: Exact column name match: "opsreviewitemid" in both tables
  - Column: `OpsReviewItemID` → `OpsReviewItemID`
- **column_match**: dbo.OpsReviewItemDetail → dbo.OpsServiceDealership
  - Confidence: 80%
  - Evidence: Exact column name match: "opsreviewitemid" in both tables
  - Column: `OpsReviewItemID` → `OpsReviewItemID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
