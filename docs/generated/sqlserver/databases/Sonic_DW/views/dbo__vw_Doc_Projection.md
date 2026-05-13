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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

2- **Type**: View

- **Schema**: dbo

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

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
