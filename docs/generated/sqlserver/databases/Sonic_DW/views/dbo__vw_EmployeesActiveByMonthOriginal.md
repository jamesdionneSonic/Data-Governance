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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
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

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
