---
name: Fact_CorporateUnionOverride
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - fact-table
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

| Name                        | Type  | Nullable | Identity | Default | Description |
| --------------------------- | ----- | -------- | -------- | ------- | ----------- |
| `CorporateUnionOverrideKey` | int   |          | ✓        |         |             |
| `EntityKey`                 | int   | ✓        |          |         |             |
| `FiscalMonthKey`            | int   | ✓        |          |         |             |
| `AccountMgmtKey`            | int   | ✓        |          |         |             |
| `CorpDepartmentKey`         | int   | ✓        |          |         |             |
| `SECRollupKey`              | int   | ✓        |          |         |             |
| `ScenarioKey`               | int   | ✓        |          |         |             |
| `Amount`                    | money | ✓        |          |         |             |
| `StatCount`                 | money | ✓        |          |         |             |

## Constraints

- **Primary Key**: PK**Corporat**523B151859487EC4
  - Columns: CorporateUnionOverrideKey

## Indexes

- **PK**Corporat**523B151859487EC4** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: CorporateUnionOverrideKey ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
