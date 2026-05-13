---
name: OpsService
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - OpsReviewItem
  - OpsReviewItem
row_count: 0
size_kb: 0
column_count: 7
index_count: 2
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

| Name                | Type    | Nullable | Identity | Default | Description |
| ------------------- | ------- | -------- | -------- | ------- | ----------- |
| `ServiceID`         | int     |          |          |         |             |
| `ServiceName`       | varchar | ✓        |          |         |             |
| `ServiceCategory`   | varchar | ✓        |          |         |             |
| `ServiceType`       | varchar | ✓        |          |         |             |
| `ServiceDataSource` | varchar | ✓        |          |         |             |
| `IsActive`          | int     | ✓        |          |         |             |
| `SortOrder`         | int     | ✓        |          |         |             |

## Constraints

- **Primary Key**: PK124
  - Columns: ServiceID

## Indexes

- **IDX_ServiceType** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: ServiceType ASC
- **PK124** (NONCLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: ServiceID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **explicit_fk**: dbo.OpsReviewItem → dbo.OpsService
  - Confidence: 100%
  - Evidence: undefined
  - Column: `ServiceID` → `ServiceID`
- **column_match**: dbo.OpsReviewItem → dbo.OpsService
  - Confidence: 80%
  - Evidence: Exact column name match: "serviceid" in both tables
  - Column: `ServiceID` → `ServiceID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
