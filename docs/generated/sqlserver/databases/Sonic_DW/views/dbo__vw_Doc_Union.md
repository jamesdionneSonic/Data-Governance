---
name: vw_Doc_Union
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
CREATE VIEW dbo.vw_Doc_Union
AS
SELECT        U.EntityKey, U.DateKey, U.GroupElementSort, U.GroupElement, U.GroupSubElement, U.Amount, U.StatCount, U.MetricTypeKey, U.DocActiveDate, U.DocLYDate, U.FiscalMonthKeyLY, U.DocTableID, D.FOpsDaysMonth, 
                         D.VOpsDaysMonth, CAST(CAST(D.FiscalMonthKey AS char(6)) + CAST(CAST(CEILING(CAST(D.DayNumberOfMonth AS FLOAT) / 7) AS char(1)) + CAST(D.DayNumberOfWeek_Sun_Start AS char(1)) AS Char(2)) AS INT) 
                         AS D
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
