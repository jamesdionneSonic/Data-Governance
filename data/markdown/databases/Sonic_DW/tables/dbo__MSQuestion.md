---
name: MSQuestion
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - MSAnswer
row_count: 0
size_kb: 0
column_count: 7
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

| Name                 | Type    | Nullable | Identity | Default | Description |
| -------------------- | ------- | -------- | -------- | ------- | ----------- |
| `MSQuestionID`       | int     |          |          |         |             |
| `MSSectionNumber`    | int     | ✓        |          |         |             |
| `MSSectionName`      | varchar | ✓        |          |         |             |
| `MSQuestionNumber`   | int     | ✓        |          |         |             |
| `MSQuestion`         | varchar | ✓        |          |         |             |
| `MSPointsPossible`   | int     | ✓        |          |         |             |
| `MSReviewGuidelines` | varchar | ✓        |          |         |             |

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.MSAnswer → dbo.MSQuestion
  - Confidence: 80%
  - Evidence: Exact column name match: "msquestionid" in both tables
  - Column: `MSQuestionID` → `MSQuestionID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
