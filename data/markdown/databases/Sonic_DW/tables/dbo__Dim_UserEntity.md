---
name: Dim_UserEntity
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - dimension
  - core-schema
depends_on: []
row_count: 0
size_kb: 0
column_count: 12
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

| Name                         | Type     | Nullable | Identity | Default     | Description |
| ---------------------------- | -------- | -------- | -------- | ----------- | ----------- |
| `UserEntityKey`              | int      |          | ✓        |             |             |
| `EmployeeID`                 | int      |          |          |             |             |
| `EntityKey`                  | int      |          |          |             |             |
| `UE_isActive`                | bit      |          |          | ((1))       |             |
| `UE_isDefault`               | bit      |          |          | ((0))       |             |
| `UE_isGM`                    | bit      |          |          | ((0))       |             |
| `UE_isController`            | bit      |          |          | ((0))       |             |
| `UE_DOCPermission`           | int      |          |          | ((0))       |             |
| `Meta_RowCreatedDate`        | datetime |          |          | (getdate()) |             |
| `Meta_RowLastChangedDate`    | datetime |          |          | (getdate()) |             |
| `Meta_LastChangeUserName`    | varchar  | ✓        |          |             |             |
| `UE_TitleTrackingPermission` | int      |          |          | ((0))       |             |

## Constraints

- **Primary Key**: PK_Dim_UserEntity
  - Columns: UserEntityKey

## Indexes

- **PK_Dim_UserEntity** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: UserEntityKey ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
