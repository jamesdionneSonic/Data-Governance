---
name: stg_OneStream2
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - staging
  - core-schema
depends_on: []
row_count: 0
size_kb: 0
column_count: 27
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

| Name                  | Type     | Nullable | Identity | Default | Description |
| --------------------- | -------- | -------- | -------- | ------- | ----------- |
| `Cube`                | varchar  | ✓        |          |         |             |
| `Entity`              | varchar  | ✓        |          |         |             |
| `Parent`              | varchar  | ✓        |          |         |             |
| `Cons`                | varchar  | ✓        |          |         |             |
| `Scenario`            | varchar  | ✓        |          |         |             |
| `Time`                | varchar  | ✓        |          |         |             |
| `View`                | varchar  | ✓        |          |         |             |
| `Account`             | varchar  | ✓        |          |         |             |
| `Flow`                | varchar  | ✓        |          |         |             |
| `Origin`              | varchar  | ✓        |          |         |             |
| `IC`                  | varchar  | ✓        |          |         |             |
| `UD1`                 | varchar  | ✓        |          |         |             |
| `UD2`                 | varchar  | ✓        |          |         |             |
| `UD3`                 | varchar  | ✓        |          |         |             |
| `UD4`                 | varchar  | ✓        |          |         |             |
| `UD5`                 | varchar  | ✓        |          |         |             |
| `UD6`                 | varchar  | ✓        |          |         |             |
| `UD7`                 | varchar  | ✓        |          |         |             |
| `UD8`                 | varchar  | ✓        |          |         |             |
| `Amount`              | money    | ✓        |          |         |             |
| `HasData`             | varchar  | ✓        |          |         |             |
| `Annotation`          | varchar  | ✓        |          |         |             |
| `Assumptions`         | varchar  | ✓        |          |         |             |
| `AuditComment`        | varchar  | ✓        |          |         |             |
| `Footnote`            | varchar  | ✓        |          |         |             |
| `VarianceExplanation` | varchar  | ✓        |          |         |             |
| `Meta_LoadDate`       | datetime | ✓        |          |         |             |

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
