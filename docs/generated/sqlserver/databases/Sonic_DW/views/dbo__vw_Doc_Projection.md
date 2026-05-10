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
extracted_at: 2026-05-09T12:34:14.349Z
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
                             (SELECT        RIGHT('0000' + CAST(d
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
