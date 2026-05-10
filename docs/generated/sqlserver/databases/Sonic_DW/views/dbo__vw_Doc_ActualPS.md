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
extracted_at: 2026-05-09T12:34:14.349Z
---

## Overview

2- **Type**: View
- **Schema**: dbo

## Definition

```sql
/*WHERE        (e.EntDOCReportFlag = 'Active')*/
CREATE VIEW dbo.vw_Doc_ActualPS
AS
SELECT        a.EntityKey, a.DateKey, a.GroupElementSort, m.GroupElement, m.GroupSubElement, a.Amount, a.StatCount, a.MetricTypeKey, a.DateKey AS DocActiveDate, CASE WHEN d .MonthStartDateKey =
                             (SELECT        CONVERT(varchar(10), DATEADD(m, DATEDIFF(m, 0, getdate()), 0), 112)) THEN
                             (SELECT        CONVERT(varchar(10), getdate(), 112)) ELSE 19000101 END
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
