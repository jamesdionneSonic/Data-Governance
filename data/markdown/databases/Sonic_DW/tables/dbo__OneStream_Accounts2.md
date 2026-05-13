---
name: OneStream_Accounts2
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
column_count: 12
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

| Name         | Type    | Nullable | Identity | Default | Description |
| ------------ | ------- | -------- | -------- | ------- | ----------- |
| `SECLevel1`  | varchar | ✓        |          |         |             |
| `SECLevel2`  | varchar | ✓        |          |         |             |
| `SECLevel3`  | varchar | ✓        |          |         |             |
| `SECLevel4`  | varchar | ✓        |          |         |             |
| `SECLevel5`  | varchar | ✓        |          |         |             |
| `SECLevel6`  | varchar | ✓        |          |         |             |
| `SECLevel7`  | varchar | ✓        |          |         |             |
| `SECLevel8`  | varchar | ✓        |          |         |             |
| `SECLevel9`  | varchar | ✓        |          |         |             |
| `SECLevel10` | varchar | ✓        |          |         |             |
| `SECLevel11` | varchar | ✓        |          |         |             |
| `SECLevel0`  | varchar | ✓        |          |         |             |

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
