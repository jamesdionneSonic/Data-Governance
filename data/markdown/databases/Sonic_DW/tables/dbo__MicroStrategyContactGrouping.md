---
name: MicroStrategyContactGrouping
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - DM_MSDynamicDistribution
  - DM_MSDynamicDistribution
  - MicroStrategyContact
row_count: 0
size_kb: 0
column_count: 5
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

| Name                     | Type    | Nullable | Identity | Default | Description |
| ------------------------ | ------- | -------- | -------- | ------- | ----------- |
| `GroupingID`             | int     |          | ✓        |         |             |
| `GroupingDESC`           | varchar | ✓        |          |         |             |
| `MSTRMetadataDeviceGUID` | varchar | ✓        |          |         |             |
| `Personalization`        | varchar | ✓        |          |         |             |
| `MicroStrategyGroup`     | varchar | ✓        |          |         |             |

## Constraints

- **Primary Key**: PK_MicroStrategyContactGrouping
  - Columns: GroupingID

## Indexes

- **PK_MicroStrategyContactGrouping** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: GroupingID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.DM_MSDynamicDistribution → dbo.MicroStrategyContactGrouping
  - Confidence: 80%
  - Evidence: Exact column name match: "groupingid" in both tables
  - Column: `GroupingID` → `GroupingID`
- **column_match**: dbo.DM_MSDynamicDistribution → dbo.MicroStrategyContactGrouping
  - Confidence: 80%
  - Evidence: Exact column name match: "mstrmetadatadeviceguid" in both tables
  - Column: `MSTRMetadataDeviceGUID` → `MSTRMetadataDeviceGUID`
- **column_match**: dbo.MicroStrategyContact → dbo.MicroStrategyContactGrouping
  - Confidence: 80%
  - Evidence: Exact column name match: "mstrmetadatadeviceguid" in both tables
  - Column: `MSTRMetadataDeviceGUID` → `MSTRMetadataDeviceGUID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
