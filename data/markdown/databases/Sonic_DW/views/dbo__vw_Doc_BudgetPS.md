---
name: vw_Doc_BudgetPS
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
  - Doc_BudgetPS
  - Doc_MetricsPS
dependency_count: 4
column_count: 15
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Date** (U )
- **dbo.Dim_Entity** (U )
- **dbo.Doc_BudgetPS** (U )
- **dbo.Doc_MetricsPS** (U )

## Columns

| Name               | Type    | Nullable | Description |
| ------------------ | ------- | -------- | ----------- |
| `DocBudgetID`      | bigint  | ✓        |             |
| `EntityKey`        | int     |          |             |
| `DateKey`          | int     | ✓        |             |
| `GroupElementSort` | int     |          |             |
| `GroupElement`     | varchar | ✓        |             |
| `GroupSubElement`  | varchar | ✓        |             |
| `Amount`           | numeric | ✓        |             |
| `StatCount`        | money   | ✓        |             |
| `MetricTypeKey`    | int     |          |             |
| `DocActiveDate`    | int     | ✓        |             |
| `DocLYDate`        | int     | ✓        |             |
| `FiscalMonthKeyLY` | int     | ✓        |             |
| `DocTableID`       | varchar | ✓        |             |
| `DocRolloverDate`  | int     | ✓        |             |
| `DOCMonthKey`      | int     | ✓        |             |

## Definition

```sql

CREATE VIEW [dbo].[vw_Doc_BudgetPS]
AS
SELECT        b.DocBudgetID, b.EntityKey, b.DateKey, b.GroupElementSort, b.GroupElement, b.GroupSubElement, b.Amount, b.StatCount, b.MetricTypeKey, CASE WHEN b.DateKey =
                             (SELECT        CONVERT(varchar(10), DATEADD(m, DATEDIFF(m, 0, getdate()), 0), 112)) THEN
                             (SELECT        CONVERT(varchar(10), getdate(), 112)) ELSE 19000101 END AS DocActiveDate, b.DateKey AS DocLYDate, dbo.Dim_Date.FiscalMonthKey AS FiscalMonthKeyLY, CAST(b.MetricTypeKey AS VARCHAR(10))
                         + CAST(b.DateKey AS VARCHAR(10)) +
                             (SELECT        RIGHT('0000' + CAST(b.GroupElementSort AS VARCHAR(10)), 4) AS Expr1) + CAST(b.EntityKey AS VARCHAR(10)) AS DocTableID, dbo.Dim_Date.DocRolloverDate,
                         dbo.Dim_Date.FiscalMonthKey AS DOCMonthKey
FROM            ((SELECT        b.DocBudgetID, b.EntityKey, b.DateKey, b.GroupElementSort, m.GroupElement, m.GroupSubElement, b.Amount, b.StatCount, b.MetricTypeKey
                            FROM            Doc_BudgetPS b
                            LEFT JOIN Doc_MetricsPS m
                            ON b.GroupElementSort = m.GroupElementSort
                            UNION ALL
                            SELECT        (ROW_NUMBER() OVER (ORDER BY e.EntityKey, m.GroupElementSort ASC) + b.DocBudgetID) AS DocBudgetID, e.EntityKey, CONVERT(CHAR(8), DATEADD(month, DATEDIFF(month, 0, CONVERT(date,
                         CONVERT(CHAR(8), d .DocRolloverDate, 120))), 0), 112) AS DateKey, m.GroupElementSort, m.GroupElement, m.GroupSubElement, 0 AS Amount, 0 AS StatCount, 3 AS MetricTypeKey
FROM            dbo.Dim_Entity e CROSS JOIN
                             (SELECT        Max(DocBudgetID) AS DocBudgetID
                               FROM            dbo.Doc_BudgetPS) AS b CROSS JOIN
                         Doc_MetricsPS AS m CROSS JOIN
                         Dim_Date AS d
WHERE        (e.EntDOCReportFlag = 'Active' AND e.EntDefaultDlrshpLvl1 = 1 AND e.EntityKey <> 82) AND d .FullDate = CAST(GETDATE() AS DATE) AND EntityKey NOT IN
                             (SELECT        EntityKey
                               FROM            Doc_BudgetPS
WHERE DateKey >= (SELECT FORMAT(DocRolloverDate,'yyyyMMdd')
  FROM [Sonic_DW].[dbo].[vw_Dim_date]
  WHERE FullDate = DATEADD(mm, DATEDIFF(m,0,GETDATE()),0))))) AS b INNER JOIN
dbo.Dim_Date ON b.DateKey = dbo.Dim_Date.DateKey INNER JOIN
dbo.Dim_Entity ON b.EntityKey = dbo.Dim_Entity.EntityKey
--WHERE        (dbo.Dim_Entity.EntDOCReportFlag = 'Active')

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
