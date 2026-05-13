---
name: Syndicate_Floorplan_Summary
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
column_count: 15
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

| Name                       | Type     | Nullable | Identity | Default | Description |
| -------------------------- | -------- | -------- | -------- | ------- | ----------- |
| `Bank_SentDate`            | date     |          |          |         |             |
| `Funding_Count`            | int      | ✓        |          |         |             |
| `Funding_Count_Posted`     | int      | ✓        |          |         |             |
| `Funding_Amount`           | money    | ✓        |          |         |             |
| `Funding_Amount_Posted`    | money    | ✓        |          |         |             |
| `Transfer_Count`           | int      | ✓        |          |         |             |
| `SS_Transfers`             | int      | ✓        |          |         |             |
| `SS_Transfer_Count_Posted` | int      | ✓        |          |         |             |
| `SS_Transfers_Same_Store`  | int      | ✓        |          |         |             |
| `SS_Debit_Transfers`       | int      | ✓        |          |         |             |
| `Payoff_Count`             | int      | ✓        |          |         |             |
| `Payoff_Count_Posted`      | int      | ✓        |          |         |             |
| `Payoff_Amount`            | money    | ✓        |          |         |             |
| `Payoff_Amount_Posted`     | money    | ✓        |          |         |             |
| `Meta_LoadDate`            | datetime | ✓        |          |         |             |

## Indexes

- **ClusteredIndex-20200825-140256** (CLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: Bank_SentDate DESC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
