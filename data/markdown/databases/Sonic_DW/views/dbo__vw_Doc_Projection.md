---
name: vw_Doc_Projection
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Dim_Date
  - Dim_Entity
  - Doc_Projection
dependency_count: 3
column_count: 17
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

2- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Date** (U )
- **dbo.Dim_Entity** (U )
- **dbo.Doc_Projection** (U )

## Columns

| Name               | Type     | Nullable | Description |
| ------------------ | -------- | -------- | ----------- |
| `DocProjectionID`  | int      |          |             |
| `EntityKey`        | int      |          |             |
| `DateKey`          | int      |          |             |
| `GroupElementSort` | int      |          |             |
| `GroupElement`     | varchar  | ✓        |             |
| `GroupSubElement`  | varchar  | ✓        |             |
| `Amount`           | numeric  | ✓        |             |
| `StatCount`        | money    | ✓        |             |
| `MetricTypeKey`    | int      |          |             |
| `ControllerUserID` | varchar  | ✓        |             |
| `UpdateDate`       | datetime | ✓        |             |
| `DocID`            | int      |          |             |
| `DocActiveDate`    | int      |          |             |
| `DocLYDate`        | int      |          |             |
| `FiscalMonthKeyLY` | int      | ✓        |             |
| `DocTableID`       | varchar  | ✓        |             |
| `DOCMonthKey`      | int      | ✓        |             |

## Definition

```sql
CREATE VIEW dbo.vw_Doc_Projection
AS
SELECT        d.DocProjectionID, d.EntityKey, d.DateKey, d.GroupElementSort, d.GroupElement, d.GroupSubElement, d.Amount, d.StatCount, d.MetricTypeKey, d.ControllerUserID, d.UpdateDate, d.DocID, d.DateKey AS DocActiveDate,
                         d.DateKey AS DocLYDate, dbo.Dim_Date.FiscalMonthKey AS FiscalMonthKeyLY, CAST(d.MetricTypeKey AS VARCHAR(10)) + CAST(d.DateKey AS VARCHAR(10)) +
                             (SELECT        RIGHT('0000' + CAST(d.GroupElementSort AS VARCHAR(10)), 4) AS Expr1) + CAST(d.EntityKey AS VARCHAR(10)) AS DocTableID, d1.FiscalMonthKey AS DOCMonthKey
FROM            dbo.Doc_Projection AS d WITH (NOLOCK) INNER JOIN
                         dbo.Dim_Date ON d.DateKey = dbo.Dim_Date.DateKey INNER JOIN
                         dbo.Dim_Entity ON d.EntityKey = dbo.Dim_Entity.EntityKey INNER JOIN
                         dbo.Dim_Date AS d1 ON dbo.Dim_Date.DocRolloverDate = d1.DateKey
WHERE        (dbo.Dim_Entity.EntDOCReportFlag = 'Active')

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
