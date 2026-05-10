---
name: vw_EmployeesActiveByMonthOriginal
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
CREATE VIEW dbo.vw_EmployeesActiveByMonthOriginal
AS
SELECT monthx.FiscalMonthKey, monthx.EndDateKey, monthx.AsoEmployeeNumber, monthx.EntityKey, ASJC.AsoDepartmentCode, monthx.OriginalHireDate, monthx.TerminationDate, monthx.ThroughDate, ASJC.AsoJobCode, 
             (CASE WHEN OriginalHireDate <= StartDateKey THEN 1 ELSE 0 END) AS IsActive, (CASE WHEN monthx.EndDateKey < ThroughDate THEN 0 ELSE 1 END) AS IsTerm, ASJC.AsoDepartment
FROM   (SELECT m.FiscalMonthKey, m.EndDateKey, a.AsoEmploy
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
