---
name: vw_Doc_Budget
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Definition

```sql
CREATE VIEW dbo.vw_Doc_Budget
AS
SELECT        b.DocBudgetID, b.EntityKey, b.DateKey, b.GroupElementSort, b.GroupElement, b.GroupSubElement, b.Amount, b.StatCount, b.MetricTypeKey, CASE WHEN b.DateKey =
                             (SELECT        CONVERT(varchar(10), DATEADD(m, DATEDIFF(m, 0, getdate()), 0), 112)) THEN
                             (SELECT        CONVERT(varchar(10), getdate(), 112)) ELSE 19000101 END AS DocActiveDate, b.DateKey AS DocLYDate, dbo.Dim_Date.FiscalMonthKey AS FiscalMonthKeyLY, CAST(b.MetricTypeKey AS VARCHAR(10))
                         + CAST(b.DateKey AS VARCHAR(10)) +
                             (SELECT        RIGHT('0000' + CAST(b.GroupElementSort AS VARCHAR(10)), 4) AS Expr1) + CAST(b.EntityKey AS VARCHAR(10)) AS DocTableID, dbo.Dim_Date.DocRolloverDate,
                         dbo.Dim_Date.FiscalMonthKey AS DOCMonthKey
FROM            ((SELECT        b.DocBudgetID, b.EntityKey, b.DateKey, b.GroupElementSort, b.GroupElement, b.GroupSubElement, b.Amount, b.StatCount, b.MetricTypeKey
                            FROM            Doc_Budget b
                            UNION ALL
                            SELECT        (ROW_NUMBER() OVER (ORDER BY e.EntityKey, m.GroupElementSort ASC) + b.DocBudgetID) AS DocBudgetID, e.EntityKey, CONVERT(CHAR(8), DATEADD(month, DATEDIFF(month, 0, CONVERT(date,
                         CONVERT(CHAR(8), d .DocRolloverDate, 120))), 0), 112) AS DateKey, m.GroupElementSort, m.GroupElement, m.GroupSubElement, 0 AS Amount, 0 AS StatCount, 3 AS MetricTypeKey
FROM            dbo.Dim_Entity e CROSS JOIN
                             (SELECT        Max(DocBudgetID) AS DocBudgetID
                               FROM            dbo.Doc_Budget) AS b CROSS JOIN
                         Dim_DOCMetrics AS m CROSS JOIN
                         Dim_Date AS d
WHERE        (e.EntDOCReportFlag = 'Active' AND e.EntDefaultDlrshpLvl1 = 1 AND e.EntityKey <> 82) AND d .FullDate = CAST(GETDATE() AS DATE) AND EntityKey NOT IN
                             (SELECT        EntityKey
                               FROM            Doc_Budget
WHERE DateKey >= (SELECT FORMAT(DocRolloverDate,'yyyyMMdd')
  FROM [Sonic_DW].[dbo].[vw_Dim_date]
  WHERE FullDate = DATEADD(mm, DATEDIFF(m,0,GETDATE()),0))))) AS b INNER JOIN
dbo.Dim_Date ON b.DateKey = dbo.Dim_Date.DateKey INNER JOIN
dbo.Dim_Entity ON b.EntityKey = dbo.Dim_Entity.EntityKey
WHERE        (dbo.Dim_Entity.EntDOCReportFlag = 'Active')

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
