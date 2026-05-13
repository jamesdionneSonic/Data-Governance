---
name: Doc_Budget
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
column_count: 9
index_count: 4
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
| `GroupElement`     | varchar | ✓        |          |         |             |
| `GroupSubElement`  | varchar | ✓        |          |         |             |
| `Amount`           | numeric | ✓        |          |         |             |
| `StatCount`        | money   | ✓        |          |         |             |
| `MetricTypeKey`    | int     |          |          |         |             |

## Constraints

- **Primary Key**: PK_DocBudget
  - Columns: DocBudgetID

## Indexes

- **IDX_DocBudget_EntityDate** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: EntityKey ASC, DateKey ASC
  - Included Columns: GroupElementSort, Amount
- **IDX_DocBudget_SortDateMetric** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: GroupElementSort ASC, DateKey ASC, MetricTypeKey ASC
  - Included Columns: EntityKey, Amount
- **IX_Doc_Budget_DateKey_MetricTypeKey** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: DateKey ASC, MetricTypeKey ASC
  - Included Columns: EntityKey, GroupElementSort, Amount
- **PK_DocBudget** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: DocBudgetID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.Doc_Budget → dbo.Doc_Budget_Dev
  - Confidence: 80%
  - Evidence: Exact column name match: "docbudgetid" in both tables
  - Column: `DocBudgetID` → `DocBudgetID`
- **column_match**: dbo.Doc_Budget → dbo.Doc_BudgetPS
  - Confidence: 80%
  - Evidence: Exact column name match: "docbudgetid" in both tables
  - Column: `DocBudgetID` → `DocBudgetID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
