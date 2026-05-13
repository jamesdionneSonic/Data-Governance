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
depends_on:
  - Fact_EmployeesActiveByMonth
dependency_count: 1
column_count: 14
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Fact_EmployeesActiveByMonth** (U )

## Columns

| Name                | Type    | Nullable | Description |
| ------------------- | ------- | -------- | ----------- |
| `FiscalMonthKey`    | int     |          |             |
| `EndDateKey`        | int     | ✓        |             |
| `AsoEmployeeNumber` | int     |          |             |
| `EntityKey`         | int     | ✓        |             |
| `AsoDepartmentCode` | varchar |          |             |
| `OriginalHireDate`  | int     |          |             |
| `TerminationDate`   | int     |          |             |
| `ThroughDate`       | int     | ✓        |             |
| `AsoJobCode`        | varchar | ✓        |             |
| `IsActive`          | int     |          |             |
| `IsTerm`            | int     |          |             |
| `Department`        | varchar |          |             |
| `AsoSupervisorID`   | int     |          |             |
| `AsoSupervisorName` | varchar |          |             |

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

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
