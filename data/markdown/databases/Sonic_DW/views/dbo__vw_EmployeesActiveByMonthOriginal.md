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
depends_on:
  - Dim_Entity
  - DimAssociate
  - vw_Dim_Associate
  - vw_Dim_Month
dependency_count: 4
column_count: 12
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Entity** (U )
- **dbo.DimAssociate** (U )
- **dbo.vw_Dim_Associate** (V )
- **dbo.vw_Dim_Month** (V )

## Columns

| Name                | Type    | Nullable | Description |
| ------------------- | ------- | -------- | ----------- |
| `FiscalMonthKey`    | int     |          |             |
| `EndDateKey`        | int     | ✓        |             |
| `AsoEmployeeNumber` | int     |          |             |
| `EntityKey`         | int     | ✓        |             |
| `AsoDepartmentCode` | varchar | ✓        |             |
| `OriginalHireDate`  | int     | ✓        |             |
| `TerminationDate`   | int     | ✓        |             |
| `ThroughDate`       | varchar | ✓        |             |
| `AsoJobCode`        | varchar | ✓        |             |
| `IsActive`          | int     |          |             |
| `IsTerm`            | int     |          |             |
| `AsoDepartment`     | varchar | ✓        |             |

## Definition

```sql
CREATE VIEW dbo.vw_EmployeesActiveByMonthOriginal
AS
SELECT monthx.FiscalMonthKey, monthx.EndDateKey, monthx.AsoEmployeeNumber, monthx.EntityKey, ASJC.AsoDepartmentCode, monthx.OriginalHireDate, monthx.TerminationDate, monthx.ThroughDate, ASJC.AsoJobCode,
             (CASE WHEN OriginalHireDate <= StartDateKey THEN 1 ELSE 0 END) AS IsActive, (CASE WHEN monthx.EndDateKey < ThroughDate THEN 0 ELSE 1 END) AS IsTerm, ASJC.AsoDepartment
FROM   (SELECT m.FiscalMonthKey, m.EndDateKey, a.AsoEmployeeNumber, a.EntityKey, a.OriginalHireDate, a.TerminationDate, a.ThroughDate
             FROM    dbo.vw_Dim_Month AS m INNER JOIN
                               (SELECT TOP (100) PERCENT AsoEmployeeNumber, EntityKey, MIN(AsoLastHireDateKey) AS OriginalHireDate, MAX(AsoTerminationDateKey) AS TerminationDate, REPLACE(MAX(AsoTerminationDateKey), 19000101, CONVERT(CHAR(8), EOMonth(GETDATE()), 112) + 1)
                                            AS ThroughDate
                               FROM    dbo.vw_Dim_Associate
                               WHERE (EntityKey IN
                                                (SELECT EntityKey
                                                FROM    dbo.Dim_Entity
                                                WHERE (EntDefaultDlrshpLvl1 = 1)))
                               GROUP BY AsoEmployeeNumber, EntityKey) AS a ON m.EndDateKey >= a.OriginalHireDate AND m.StartDateKey <= a.ThroughDate) AS monthx INNER JOIN
             dbo.vw_Dim_Month ON monthx.FiscalMonthKey = dbo.vw_Dim_Month.FiscalMonthKey LEFT OUTER JOIN
                 (SELECT AsoEmployeeNumber, AsoJobCode, AsoDepartmentCode, AsoDepartment
                 FROM    dbo.DimAssociate
                 WHERE (AssociateKey IN
                                  (SELECT MAX(AssociateKey) AS AssociateKey
                                  FROM    dbo.DimAssociate AS DimAssociate_1
                                  WHERE (Meta_RowIsCurrent = 'Y')
                                  GROUP BY AsoEmployeeNumber))) AS ASJC ON monthx.AsoEmployeeNumber = ASJC.AsoEmployeeNumber

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
