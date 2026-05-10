---
name: vw_Doc_Booked
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
extracted_at: 2026-05-09T12:34:14.349Z
---

## Overview

1- **Type**: View
- **Schema**: dbo

## Definition

```sql
CREATE VIEW dbo.vw_Doc_Booked
AS
SELECT        b.EntityKey, b.DateKey, b.GroupElementSort, b.GroupElement, b.GroupSubElement, b.Amount, b.StatCount, b.MetricTypeKey, b.DateKey AS DocActiveDate, b.DateKey AS DocLYDate, 
                         dbo.Dim_Date.FiscalMonthKey AS FiscalMonthKeyLY, CAST(b.MetricTypeKey AS VARCHAR(10)) + CAST(b.DateKey AS VARCHAR(10)) +
                             (SELECT        RIGHT('0000' + CAST(b.GroupElementSort AS VARCHAR(10)), 4) AS Expr1) + CAST(b.EntityKey
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
