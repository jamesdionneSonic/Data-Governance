---
name: Doc_BudgetPS
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - Doc_Budget
  - Doc_Budget_Dev
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

| Name               | Type    | Nullable | Identity | Default | Description |
| ------------------ | ------- | -------- | -------- | ------- | ----------- |
| `DocBudgetID`      | int     |          | ✓        |         |             |
| `EntityKey`        | int     |          |          |         |             |
| `DateKey`          | int     |          |          |         |             |
| `GroupElementSort` | int     |          |          |         |             |
| `Amount`           | numeric | ✓        |          |         |             |
| `StatCount`        | money   | ✓        |          |         |             |
| `MetricTypeKey`    | int     |          |          |         |             |

## Constraints

- **Primary Key**: PK_DocBudgetPS
  - Columns: DocBudgetID

## Indexes

- **IDX_DocBudget_EntityDate** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: EntityKey ASC, DateKey ASC
  - Included Columns: GroupElementSort, Amount
- **PK_DocBudgetPS** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: DocBudgetID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.Doc_Budget → dbo.Doc_BudgetPS
  - Confidence: 80%
  - Evidence: Exact column name match: "docbudgetid" in both tables
  - Column: `DocBudgetID` → `DocBudgetID`
- **column_match**: dbo.Doc_Budget_Dev → dbo.Doc_BudgetPS
  - Confidence: 80%
  - Evidence: Exact column name match: "docbudgetid" in both tables
  - Column: `DocBudgetID` → `DocBudgetID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
