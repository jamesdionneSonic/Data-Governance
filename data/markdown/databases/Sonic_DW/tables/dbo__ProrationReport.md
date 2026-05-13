---
name: ProrationReport
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - Associate_Proration
  - Associate_Proration_Exception
  - DimAssociate
  - DimAssociate_0418
  - DimAssociate_07282023
  - DimAssociate_0816
  - DimAssociate_914_new
  - DimAssociate_bk_0413
  - DimAssociate_FULL
  - DimAssociate_newfile
  - DimAssociate0711
  - DimAssociate0829
  - DimAssociate1010
  - DimAssociate110724
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

| Name                | Type     | Nullable | Identity | Default     | Description |
| ------------------- | -------- | -------- | -------- | ----------- | ----------- |
| `FileMonth`         | varchar  | ✓        |          |             |             |
| `AsoTimeClockID`    | varchar  | ✓        |          |             |             |
| `AsoLocation`       | varchar  | ✓        |          |             |             |
| `AsoDMS4Digit`      | varchar  | ✓        |          |             |             |
| `AsoJobCode`        | varchar  | ✓        |          |             |             |
| `AsoecJobtitle`     | varchar  | ✓        |          |             |             |
| `AsoEmployeeNumber` | varchar  | ✓        |          |             |             |
| `BeginDate`         | varchar  | ✓        |          |             |             |
| `EndDate`           | varchar  | ✓        |          |             |             |
| `TotDays`           | varchar  | ✓        |          |             |             |
| `Available`         | varchar  | ✓        |          |             |             |
| `pct`               | varchar  | ✓        |          |             |             |
| `Meta_LoadDate`     | datetime | ✓        |          | (getdate()) |             |

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.Associate_Proration → dbo.ProrationReport
  - Confidence: 80%
  - Evidence: Exact column name match: "asotimeclockid" in both tables
  - Column: `AsoTimeClockID` → `AsoTimeClockID`
- **column_match**: dbo.Associate_Proration_Exception → dbo.ProrationReport
  - Confidence: 80%
  - Evidence: Exact column name match: "asotimeclockid" in both tables
  - Column: `AsoTimeClockID` → `AsoTimeClockID`
- **column_match**: dbo.DimAssociate → dbo.ProrationReport
  - Confidence: 80%
  - Evidence: Exact column name match: "asotimeclockid" in both tables
  - Column: `AsoTimeClockID` → `AsoTimeClockID`
- **column_match**: dbo.DimAssociate_0418 → dbo.ProrationReport
  - Confidence: 80%
  - Evidence: Exact column name match: "asotimeclockid" in both tables
  - Column: `AsoTimeClockID` → `AsoTimeClockID`
- **column_match**: dbo.DimAssociate_07282023 → dbo.ProrationReport
  - Confidence: 80%
  - Evidence: Exact column name match: "asotimeclockid" in both tables
  - Column: `AsoTimeClockID` → `AsoTimeClockID`
- **column_match**: dbo.DimAssociate_0816 → dbo.ProrationReport
  - Confidence: 80%
  - Evidence: Exact column name match: "asotimeclockid" in both tables
  - Column: `AsoTimeClockID` → `AsoTimeClockID`
- **column_match**: dbo.DimAssociate_914_new → dbo.ProrationReport
  - Confidence: 80%
  - Evidence: Exact column name match: "asotimeclockid" in both tables
  - Column: `AsoTimeClockID` → `AsoTimeClockID`
- **column_match**: dbo.DimAssociate_bk_0413 → dbo.ProrationReport
  - Confidence: 80%
  - Evidence: Exact column name match: "asotimeclockid" in both tables
  - Column: `AsoTimeClockID` → `AsoTimeClockID`
- **column_match**: dbo.DimAssociate_FULL → dbo.ProrationReport
  - Confidence: 80%
  - Evidence: Exact column name match: "asotimeclockid" in both tables
  - Column: `AsoTimeClockID` → `AsoTimeClockID`
- **column_match**: dbo.DimAssociate_newfile → dbo.ProrationReport
  - Confidence: 80%
  - Evidence: Exact column name match: "asotimeclockid" in both tables
  - Column: `AsoTimeClockID` → `AsoTimeClockID`
- **column_match**: dbo.DimAssociate0711 → dbo.ProrationReport
  - Confidence: 80%
  - Evidence: Exact column name match: "asotimeclockid" in both tables
  - Column: `AsoTimeClockID` → `AsoTimeClockID`
- **column_match**: dbo.DimAssociate0829 → dbo.ProrationReport
  - Confidence: 80%
  - Evidence: Exact column name match: "asotimeclockid" in both tables
  - Column: `AsoTimeClockID` → `AsoTimeClockID`
- **column_match**: dbo.DimAssociate1010 → dbo.ProrationReport
  - Confidence: 80%
  - Evidence: Exact column name match: "asotimeclockid" in both tables
  - Column: `AsoTimeClockID` → `AsoTimeClockID`
- **column_match**: dbo.DimAssociate110724 → dbo.ProrationReport
  - Confidence: 80%
  - Evidence: Exact column name match: "asotimeclockid" in both tables
  - Column: `AsoTimeClockID` → `AsoTimeClockID`
- **column_match**: dbo.ProrationReport → dbo.testassociate
  - Confidence: 80%
  - Evidence: Exact column name match: "asotimeclockid" in both tables
  - Column: `AsoTimeClockID` → `AsoTimeClockID`
- **column_match**: dbo.ProrationReport → dbo.zzzDim_Associate
  - Confidence: 80%
  - Evidence: Exact column name match: "asotimeclockid" in both tables
  - Column: `AsoTimeClockID` → `AsoTimeClockID`
- **column_match**: dbo.ProrationReport → dbo.zzzzDimAssociate
  - Confidence: 80%
  - Evidence: Exact column name match: "asotimeclockid" in both tables
  - Column: `AsoTimeClockID` → `AsoTimeClockID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
