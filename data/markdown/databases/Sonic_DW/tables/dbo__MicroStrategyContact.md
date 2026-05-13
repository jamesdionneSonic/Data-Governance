---
name: MicroStrategyContact
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - DM_MSDynamicDistribution
row_count: 0
size_kb: 0
column_count: 6
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

| Name                     | Type    | Nullable | Identity | Default | Description |
| ------------------------ | ------- | -------- | -------- | ------- | ----------- |
| `ContactID`              | int     | ✓        |          |         |             |
| `EmailAddress`           | varchar | ✓        |          |         |             |
| `MSTRMetadataDeviceGUID` | varchar | ✓        |          |         |             |
| `MSTRMetadataUserID`     | varchar | ✓        |          |         |             |
| `Name`                   | varchar | ✓        |          |         |             |
| `Personalization`        | varchar | ✓        |          |         |             |

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.DM_MSDynamicDistribution → dbo.MicroStrategyContact
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
