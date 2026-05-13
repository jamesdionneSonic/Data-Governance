---
name: vw_Doc_ActualPS
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Dim_Entity
  - Doc_ActualPS
  - Doc_MetricsPS
  - TRN_LY
  - vw_Dim_date
dependency_count: 5
column_count: 13
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

2- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Entity** (U )
- **dbo.Doc_ActualPS** (U )
- **dbo.Doc_MetricsPS** (U )
- **dbo.TRN_LY** (U )
- **dbo.vw_Dim_date** (V )

## Columns

| Name               | Type    | Nullable | Description |
| ------------------ | ------- | -------- | ----------- |
| `EntityKey`        | int     |          |             |
| `DateKey`          | int     |          |             |
| `GroupElementSort` | int     |          |             |
| `GroupElement`     | varchar | ✓        |             |
| `GroupSubElement`  | varchar | ✓        |             |
| `Amount`           | numeric | ✓        |             |
| `StatCount`        | money   | ✓        |             |
| `MetricTypeKey`    | int     |          |             |
| `DocActiveDate`    | int     |          |             |
| `DocLYDate`        | int     | ✓        |             |
| `FiscalMonthKeyLY` | int     | ✓        |             |
| `DocTableID`       | varchar | ✓        |             |
| `DOCMonthKey`      | int     | ✓        |             |

## Definition

```sql
/*WHERE        (e.EntDOCReportFlag = 'Active')*/
CREATE VIEW dbo.vw_Doc_ActualPS
AS
SELECT        a.EntityKey, a.DateKey, a.GroupElementSort, m.GroupElement, m.GroupSubElement, a.Amount, a.StatCount, a.MetricTypeKey, a.DateKey AS DocActiveDate, CASE WHEN d .MonthStartDateKey =
                             (SELECT        CONVERT(varchar(10), DATEADD(m, DATEDIFF(m, 0, getdate()), 0), 112)) THEN
                             (SELECT        CONVERT(varchar(10), getdate(), 112)) ELSE 19000101 END AS DocLYDate, d.FiscalMonthKey AS FiscalMonthKeyLY, CAST(a.MetricTypeKey AS VARCHAR(10)) + CAST(a.DateKey AS VARCHAR(10)) +
                             (SELECT        RIGHT('0000' + CAST(a.GroupElementSort AS VARCHAR(10)), 4) AS Expr1) + CAST(a.EntityKey AS VARCHAR(10)) AS DocTableID, d1.FiscalMonthKey AS DOCMonthKey
FROM            dbo.vw_Dim_date AS d1 INNER JOIN
                         dbo.Doc_ActualPS AS a INNER JOIN
                         dbo.TRN_LY AS t ON a.DateKey = t.DateKey_LY INNER JOIN
                         dbo.vw_Dim_date AS d ON t.DateKey = d.DateKey INNER JOIN
                         dbo.Dim_Entity AS e ON a.EntityKey = e.EntityKey ON d1.DateKey = a.DateKey INNER JOIN
                         dbo.Doc_MetricsPS AS m ON a.GroupElementSort = m.GroupElementSort

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
