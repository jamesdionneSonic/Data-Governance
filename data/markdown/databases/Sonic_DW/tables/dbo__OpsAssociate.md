---
name: OpsAssociate
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - OpsReviewItem
row_count: 0
size_kb: 0
column_count: 7
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

| Name          | Type    | Nullable | Identity | Default | Description |
| ------------- | ------- | -------- | -------- | ------- | ----------- |
| `Username`    | varchar |          |          |         |             |
| `Firstname`   | varchar | ✓        |          |         |             |
| `Lastname`    | varchar | ✓        |          |         |             |
| `AsoPhoneNum` | varchar | ✓        |          |         |             |
| `AsoEmail`    | varchar | ✓        |          |         |             |
| `ServiceType` | varchar | ✓        |          |         |             |
| `ActiveFlag`  | bit     | ✓        |          |         |             |

## Constraints

- **Primary Key**: PK123
  - Columns: Username

## Indexes

- **PK123** (NONCLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: Username ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **explicit_fk**: dbo.OpsReviewItem → dbo.OpsAssociate
  - Confidence: 100%
  - Evidence: undefined
  - Column: `OwnerID` → `Username`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
