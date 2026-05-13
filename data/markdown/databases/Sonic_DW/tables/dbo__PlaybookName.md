---
name: PlaybookName
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

| Name              | Type    | Nullable | Identity | Default | Description |
| ----------------- | ------- | -------- | -------- | ------- | ----------- |
| `PlaybookID`      | int     |          |          |         |             |
| `PlaybookName`    | varchar | ✓        |          |         |             |
| `PlaybookNameSub` | varchar | ✓        |          |         |             |
| `PlaybookYear`    | int     | ✓        |          |         |             |

## Constraints

- **Primary Key**: PK_Playbook
  - Columns: PlaybookID

## Indexes

- **PK_Playbook** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: PlaybookID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.PlaybookAnswer → dbo.PlaybookName
  - Confidence: 80%
  - Evidence: Exact column name match: "playbookid" in both tables
  - Column: `PlaybookID` → `PlaybookID`
- **column_match**: dbo.PlaybookAnswerReset → dbo.PlaybookName
  - Confidence: 80%
  - Evidence: Exact column name match: "playbookid" in both tables
  - Column: `PlaybookID` → `PlaybookID`
- **column_match**: dbo.PlaybookName → dbo.PlaybookPhotoReset
  - Confidence: 80%
  - Evidence: Exact column name match: "playbookid" in both tables
  - Column: `PlaybookID` → `PlaybookID`
- **column_match**: dbo.PlaybookName → dbo.PlaybookQuestions
  - Confidence: 80%
  - Evidence: Exact column name match: "playbookid" in both tables
  - Column: `PlaybookID` → `PlaybookID`
- **column_match**: dbo.PlaybookName → dbo.PlaybookQuestions_Stage
  - Confidence: 80%
  - Evidence: Exact column name match: "playbookid" in both tables
  - Column: `PlaybookID` → `PlaybookID`
- **column_match**: dbo.PlaybookName → dbo.PlaybookSurvey
  - Confidence: 80%
  - Evidence: Exact column name match: "playbookid" in both tables
  - Column: `PlaybookID` → `PlaybookID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
