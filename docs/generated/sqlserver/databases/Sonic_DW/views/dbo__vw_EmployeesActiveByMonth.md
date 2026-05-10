---
name: vw_EmployeesActiveByMonth
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
CREATE VIEW [dbo].[vw_EmployeesActiveByMonth]
AS
SELECT FiscalMonthKey, EndDateKey, AsoEmployeeNumber, EntityKey, AsoDepartmentCode, OriginalHireDate, TerminationDate, ThroughDate, AsoJobCode, IsActive, IsTerm, Department
,[AsoSupervisorID]
      ,[AsoSupervisorName]
FROM   dbo.Fact_EmployeesActiveByMonth
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
