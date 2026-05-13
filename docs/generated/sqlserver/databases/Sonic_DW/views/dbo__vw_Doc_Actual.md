---
name: vw_Doc_Actual
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

2- **Type**: View

- **Schema**: dbo

## Definition

```sql
CREATE VIEW dbo.vw_Doc_Actual
AS
SELECT        a.EntityKey, a.DateKey, a.GroupElementSort, a.GroupElement, a.GroupSubElement, a.Amount, a.StatCount, a.MetricTypeKey, a.DateKey AS DocActiveDate, CASE WHEN d .MonthStartDateKey =
                             (SELECT        CONVERT(varchar(10), DATEADD(m, DATEDIFF(m, 0, getdate()), 0), 112)) THEN
                             (SELECT        CONVERT(varchar(10), getdate(), 112)) ELSE 19000101 END AS DocLYDate, d.FiscalMonthKey AS FiscalMonthKeyLY, CAST(a.MetricTypeKey AS VARCHAR(10)) + CAST(a.DateKey AS VARCHAR(10)) +
                             (SELECT        RIGHT('0000' + CAST(a.GroupElementSort AS VARCHAR(10)), 4) AS Expr1) + CAST(a.EntityKey AS VARCHAR(10)) AS DocTableID, d1.FiscalMonthKey AS DOCMonthKey
FROM            dbo.vw_Dim_date AS d1 INNER JOIN
                         dbo.Doc_Actual AS a INNER JOIN
                         dbo.TRN_LY AS t ON a.DateKey = t.DateKey_LY INNER JOIN
                         dbo.vw_Dim_date AS d ON t.DateKey = d.DateKey INNER JOIN
                         dbo.Dim_Entity ON a.EntityKey = dbo.Dim_Entity.EntityKey ON d1.DateKey = a.DateKey
WHERE        (dbo.Dim_Entity.EntDOCReportFlag = 'Active')

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
