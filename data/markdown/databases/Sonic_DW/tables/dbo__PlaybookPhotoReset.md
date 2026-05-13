---
name: PlaybookPhotoReset
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - PlaybookAnswer
  - PlaybookAnswerReset
  - PlaybookName
  - PlaybookPhoto
  - PlaybookPhoto
  - PlaybookPhoto
row_count: 0
size_kb: 0
column_count: 9
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

| Name               | Type     | Nullable | Identity | Default | Description |
| ------------------ | -------- | -------- | -------- | ------- | ----------- |
| `PlayboookPhotoID` | int      | ✓        |          |         |             |
| `ScoreID`          | int      | ✓        |          |         |             |
| `PhotoLocation`    | varchar  | ✓        |          |         |             |
| `PhotoDesc`        | varchar  | ✓        |          |         |             |
| `PhotoCreateDate`  | datetime | ✓        |          |         |             |
| `PhotoUserID`      | varchar  | ✓        |          |         |             |
| `EntityKey`        | int      | ✓        |          |         |             |
| `PlaybookID`       | int      |          |          |         |             |
| `ResetDate`        | date     | ✓        |          |         |             |

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.PlaybookAnswer → dbo.PlaybookPhotoReset
  - Confidence: 80%
  - Evidence: Exact column name match: "playbookid" in both tables
  - Column: `PlaybookID` → `PlaybookID`
- **column_match**: dbo.PlaybookAnswerReset → dbo.PlaybookPhotoReset
  - Confidence: 80%
  - Evidence: Exact column name match: "playbookid" in both tables
  - Column: `PlaybookID` → `PlaybookID`
- **column_match**: dbo.PlaybookName → dbo.PlaybookPhotoReset
  - Confidence: 80%
  - Evidence: Exact column name match: "playbookid" in both tables
  - Column: `PlaybookID` → `PlaybookID`
- **column_match**: dbo.PlaybookPhotoReset → dbo.PlaybookQuestions
  - Confidence: 80%
  - Evidence: Exact column name match: "playbookid" in both tables
  - Column: `PlaybookID` → `PlaybookID`
- **column_match**: dbo.PlaybookPhotoReset → dbo.PlaybookQuestions_Stage
  - Confidence: 80%
  - Evidence: Exact column name match: "playbookid" in both tables
  - Column: `PlaybookID` → `PlaybookID`
- **column_match**: dbo.PlaybookPhotoReset → dbo.PlaybookSurvey
  - Confidence: 80%
  - Evidence: Exact column name match: "playbookid" in both tables
  - Column: `PlaybookID` → `PlaybookID`
- **column_match**: dbo.PlaybookPhoto → dbo.PlaybookPhotoReset
  - Confidence: 80%
  - Evidence: Exact column name match: "playboookphotoid" in both tables
  - Column: `PlayboookPhotoID` → `PlayboookPhotoID`
- **column_match**: dbo.PlaybookPhoto → dbo.PlaybookPhotoReset
  - Confidence: 80%
  - Evidence: Exact column name match: "scoreid" in both tables
  - Column: `ScoreID` → `ScoreID`
- **column_match**: dbo.PlaybookPhoto → dbo.PlaybookPhotoReset
  - Confidence: 80%
  - Evidence: Exact column name match: "photouserid" in both tables
  - Column: `PhotoUserID` → `PhotoUserID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
