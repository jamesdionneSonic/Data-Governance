---
name: Associate_Proration
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on: []
row_count: 0
size_kb: 0
column_count: 13
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

| Name                | Type     | Nullable | Identity | Default | Description |
| ------------------- | -------- | -------- | -------- | ------- | ----------- |
| `FileMonth`         | int      |          |          |         |             |
| `AsoTimeClockID`    | varchar  |          |          |         |             |
| `AsoLocation`       | int      |          |          |         |             |
| `AsoDMS4Digit`      | int      |          |          |         |             |
| `AsoEmployeeNumber` | int      |          |          |         |             |
| `AsoJobCode`        | varchar  |          |          |         |             |
| `AsoecJobtitle`     | varchar  |          |          |         |             |
| `BeginDate`         | int      |          |          |         |             |
| `EndDate`           | int      |          |          |         |             |
| `TotDays`           | int      |          |          |         |             |
| `Available`         | int      |          |          |         |             |
| `Pct`               | float    |          |          |         |             |
| `Meta_LoadDate`     | datetime |          |          |         |             |

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.Associate_Proration → dbo.Associate_Proration_Exception
  - Confidence: 80%
  - Evidence: Exact column name match: "asotimeclockid" in both tables
  - Column: `AsoTimeClockID` → `AsoTimeClockID`
- **column_match**: dbo.Associate_Proration → dbo.DimAssociate
  - Confidence: 80%
  - Evidence: Exact column name match: "asotimeclockid" in both tables
  - Column: `AsoTimeClockID` → `AsoTimeClockID`
- **column_match**: dbo.Associate_Proration → dbo.DimAssociate_0418
  - Confidence: 80%
  - Evidence: Exact column name match: "asotimeclockid" in both tables
  - Column: `AsoTimeClockID` → `AsoTimeClockID`
- **column_match**: dbo.Associate_Proration → dbo.DimAssociate_07282023
  - Confidence: 80%
  - Evidence: Exact column name match: "asotimeclockid" in both tables
  - Column: `AsoTimeClockID` → `AsoTimeClockID`
- **column_match**: dbo.Associate_Proration → dbo.DimAssociate_0816
  - Confidence: 80%
  - Evidence: Exact column name match: "asotimeclockid" in both tables
  - Column: `AsoTimeClockID` → `AsoTimeClockID`
- **column_match**: dbo.Associate_Proration → dbo.DimAssociate_914_new
  - Confidence: 80%
  - Evidence: Exact column name match: "asotimeclockid" in both tables
  - Column: `AsoTimeClockID` → `AsoTimeClockID`
- **column_match**: dbo.Associate_Proration → dbo.DimAssociate_bk_0413
  - Confidence: 80%
  - Evidence: Exact column name match: "asotimeclockid" in both tables
  - Column: `AsoTimeClockID` → `AsoTimeClockID`
- **column_match**: dbo.Associate_Proration → dbo.DimAssociate_FULL
  - Confidence: 80%
  - Evidence: Exact column name match: "asotimeclockid" in both tables
  - Column: `AsoTimeClockID` → `AsoTimeClockID`
- **column_match**: dbo.Associate_Proration → dbo.DimAssociate_newfile
  - Confidence: 80%
  - Evidence: Exact column name match: "asotimeclockid" in both tables
  - Column: `AsoTimeClockID` → `AsoTimeClockID`
- **column_match**: dbo.Associate_Proration → dbo.DimAssociate0711
  - Confidence: 80%
  - Evidence: Exact column name match: "asotimeclockid" in both tables
  - Column: `AsoTimeClockID` → `AsoTimeClockID`
- **column_match**: dbo.Associate_Proration → dbo.DimAssociate0829
  - Confidence: 80%
  - Evidence: Exact column name match: "asotimeclockid" in both tables
  - Column: `AsoTimeClockID` → `AsoTimeClockID`
- **column_match**: dbo.Associate_Proration → dbo.DimAssociate1010
  - Confidence: 80%
  - Evidence: Exact column name match: "asotimeclockid" in both tables
  - Column: `AsoTimeClockID` → `AsoTimeClockID`
- **column_match**: dbo.Associate_Proration → dbo.DimAssociate110724
  - Confidence: 80%
  - Evidence: Exact column name match: "asotimeclockid" in both tables
  - Column: `AsoTimeClockID` → `AsoTimeClockID`
- **column_match**: dbo.Associate_Proration → dbo.ProrationReport
  - Confidence: 80%
  - Evidence: Exact column name match: "asotimeclockid" in both tables
  - Column: `AsoTimeClockID` → `AsoTimeClockID`
- **column_match**: dbo.Associate_Proration → dbo.testassociate
  - Confidence: 80%
  - Evidence: Exact column name match: "asotimeclockid" in both tables
  - Column: `AsoTimeClockID` → `AsoTimeClockID`
- **column_match**: dbo.Associate_Proration → dbo.zzzDim_Associate
  - Confidence: 80%
  - Evidence: Exact column name match: "asotimeclockid" in both tables
  - Column: `AsoTimeClockID` → `AsoTimeClockID`
- **column_match**: dbo.Associate_Proration → dbo.zzzzDimAssociate
  - Confidence: 80%
  - Evidence: Exact column name match: "asotimeclockid" in both tables
  - Column: `AsoTimeClockID` → `AsoTimeClockID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
