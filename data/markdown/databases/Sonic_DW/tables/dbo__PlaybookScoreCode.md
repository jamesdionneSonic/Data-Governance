---
name: PlaybookScoreCode
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - PlaybookAnswer
  - PlaybookAnswer_SonicPriceReplacement
  - PlaybookAnswerReset
row_count: 0
size_kb: 0
column_count: 4
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

| Name            | Type    | Nullable | Identity | Default | Description |
| --------------- | ------- | -------- | -------- | ------- | ----------- |
| `ScoreCodeID`   | int     |          | ✓        |         |             |
| `ScoreCode`     | varchar | ✓        |          |         |             |
| `ScoreCodeDesc` | varchar | ✓        |          |         |             |
| `ScoreIsValid`  | bit     | ✓        |          |         |             |

## Constraints

- **Primary Key**: PK_PlaybookScoreCode
  - Columns: ScoreCodeID

## Indexes

- **PK_PlaybookScoreCode** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: ScoreCodeID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.PlaybookAnswer → dbo.PlaybookScoreCode
  - Confidence: 80%
  - Evidence: Exact column name match: "scorecodeid" in both tables
  - Column: `ScoreCodeID` → `ScoreCodeID`
- **column_match**: dbo.PlaybookAnswer_SonicPriceReplacement → dbo.PlaybookScoreCode
  - Confidence: 80%
  - Evidence: Exact column name match: "scorecodeid" in both tables
  - Column: `ScoreCodeID` → `ScoreCodeID`
- **column_match**: dbo.PlaybookAnswerReset → dbo.PlaybookScoreCode
  - Confidence: 80%
  - Evidence: Exact column name match: "scorecodeid" in both tables
  - Column: `ScoreCodeID` → `ScoreCodeID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
