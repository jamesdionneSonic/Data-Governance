---
name: sysdiagrams
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
column_count: 5
index_count: 2
check_constraint_count: 0
extraction_warnings:
  - MISSING_VIEW_DATABASE_STATE
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1

- **Type**: table
- **Schema**: dbo
- **Row Count**: 0
- **Size**: 0 KB

## Columns

| Name           | Type      | Nullable | Identity | Default | Description |
| -------------- | --------- | -------- | -------- | ------- | ----------- |
| `name`         | sysname   |          |          |         |             |
| `principal_id` | int       |          |          |         |             |
| `diagram_id`   | int       |          | ✓        |         |             |
| `version`      | int       | ✓        |          |         |             |
| `definition`   | varbinary | ✓        |          |         |             |

## Constraints

- **Primary Key**: PK**sysdiagr**C2B05B61123EB7A3
  - Columns: diagram_id
- **Unique**: UK_principal_name
  - Columns: principal_id, name

## Indexes

- **PK**sysdiagr**C2B05B61123EB7A3** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: diagram_id ASC
- **UK_principal_name** (NONCLUSTERED)
  - Unique: Yes
  - Primary Key: No
  - Key Columns: principal_id ASC, name ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
