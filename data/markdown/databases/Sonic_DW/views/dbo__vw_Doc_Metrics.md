---
name: vw_Doc_Metrics
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
column_count: 6
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

| Name               | Type     | Nullable | Description |
| ------------------ | -------- | -------- | ----------- |
| `GroupID`          | int      |          |             |
| `AccAccount`       | varchar  |          |             |
| `GroupElementSort` | int      | ✓        |             |
| `GroupElement`     | varchar  | ✓        |             |
| `TXNMetric`        | smallint | ✓        |             |
| `RVPMetric`        | smallint | ✓        |             |

## Definition

```sql
CREATE VIEW dbo.vw_DOC_Metrics
AS
SELECT        dbo.Doc_AccountGrouping.GroupID, dbo.Doc_AccountGrouping.AccAccount, dbo.Doc_AccountGrouping.GroupElementSort, dbo.Dim_DOCMetrics.GroupElement, dbo.Dim_DOCMetrics.TXNMetric,
                         dbo.Dim_DOCMetrics.RVPMetric
FROM            dbo.Dim_DOCMetrics INNER JOIN
                         dbo.Doc_AccountGrouping ON dbo.Dim_DOCMetrics.GroupElementSort = dbo.Doc_AccountGrouping.GroupElementSort

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
