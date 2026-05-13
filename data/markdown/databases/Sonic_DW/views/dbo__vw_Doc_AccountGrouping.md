---
name: vw_Doc_AccountGrouping
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Dim_DOCMetrics
  - Doc_AccountGrouping
dependency_count: 2
column_count: 4
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_DOCMetrics** (U )
- **dbo.Doc_AccountGrouping** (U )

## Columns

| Name               | Type    | Nullable | Description |
| ------------------ | ------- | -------- | ----------- |
| `GroupElementSort` | int     |          |             |
| `GroupElement`     | varchar | ✓        |             |
| `GroupSubElement`  | varchar | ✓        |             |
| `AccAccount`       | varchar | ✓        |             |

## Definition

```sql
CREATE VIEW dbo.vw_DocAccountGrouping
AS
SELECT        TOP (100) PERCENT m.GroupElementSort, m.GroupElement, m.GroupSubElement, ag.AccAccount
FROM            dbo.Doc_AccountGrouping AS ag RIGHT OUTER JOIN
                         dbo.Dim_DOCMetrics AS m ON ag.GroupElementSort = m.GroupElementSort
ORDER BY m.GroupElementSort

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
