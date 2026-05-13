---
name: eLeadProjectionID_History
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
column_count: 9
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

| Name                | Type      | Nullable | Identity | Default | Description |
| ------------------- | --------- | -------- | -------- | ------- | ----------- |
| `eLeadProjectionID` | int       |          |          |         |             |
| `EntityKey`         | int       |          |          |         |             |
| `FiscalMonthKey`    | int       | ✓        |          |         |             |
| `NewUsed`           | varchar   |          |          |         |             |
| `Tracking`          | int       | ✓        |          |         |             |
| `LeadCountTY`       | int       | ✓        |          |         |             |
| `EleadsDMSSold`     | int       | ✓        |          |         |             |
| `SysStartTime`      | datetime2 |          |          |         |             |
| `SysEndTime`        | datetime2 |          |          |         |             |

## Indexes

- **ix_eLeadProjectionID_History** (CLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: SysEndTime ASC, SysStartTime ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.eLeadProjectionID_History → dbo.Fact_elead_projections
  - Confidence: 80%
  - Evidence: Exact column name match: "eleadprojectionid" in both tables
  - Column: `eLeadProjectionID` → `eLeadProjectionID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
