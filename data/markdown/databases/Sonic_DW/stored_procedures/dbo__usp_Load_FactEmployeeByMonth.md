---
name: usp_Load_FactEmployeeByMonth
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - vw_Dim_Associate_Current
  - vw_Dim_Month
dependency_count: 2
parameter_count: 0
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.vw_Dim_Associate_Current** (V )
- **dbo.vw_Dim_Month** (V )

## Definition

```sql


-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[usp_Load_FactEmployeeByMonth]


AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	DROP TABLE Fact_EmployeesActiveByMonth;

    SELECT
		monthx.FiscalMonthKey,
		monthx.EndDateKey,
		monthx.AsoEmployeeNumber,
		monthx.EntityKey,
		monthx.AsoDepartmentCode,
		monthx.OriginalHireDate,
		(CASE WHEN monthx.TerminationDate = 99991231 THEN 19000101 ELSE monthx.TerminationDate END) AS TerminationDate,
		(CASE WHEN monthx.ThroughDate = 99991231 THEN 19000101 ELSE monthx.ThroughDate END) AS ThroughDate,
		monthx.AsoJobCode,
		(CASE WHEN OriginalHireDate <= StartDateKey AND AsoEmployeeStatus = 'Active' THEN 1 ELSE 0 END) AS IsActive,
		(CASE WHEN monthx.EndDateKey < ThroughDate THEN 0 ELSE 1 END) AS IsTerm,
		monthx.Department
		,AsoSupervisorID
		,AsoSupervisorName
		INTO Fact_EmployeesActiveByMonth
	FROM
	(SELECT m.FiscalMonthKey, m.EndDateKey, a.AsoEmployeeNumber,a.asoemployeestatus, a.EntityKey, a.OriginalHireDate, a.TerminationDate, a.ThroughDate, a.AsoJobCode, a.AsoDepartmentCode, a.Department,a.AsoSupervisorID, a.AsoSupervisorName
     FROM dbo.vw_Dim_Month AS m
	    INNER JOIN
		(SELECT TOP (100) PERCENT AsoEmployeeNumber,
		EntityKey,
		AsoDepartmentCode,
		AsoJobCode,
		AsoOriginalHireDateKey AS OriginalHireDate,
		AsoTerminationDateKey AS TerminationDate,
		AsoDepartment As Department,
		REPLACE(AsoTerminationDateKey,19000101,CONVERT(CHAR(8), EOMonth(GETDATE()), 112) + 1) AS ThroughDate
		,AsoSupervisorID
		,asoemployeestatus
		,AsoSupervisorName
		--MIN(AsoLastHireDateKey) AS OriginalHireDate,
		--MAX(AsoTerminationDateKey) AS TerminationDate,
		--REPLACE(MAX(AsoTerminationDateKey),
  --      19000101,
		--CONVERT(CHAR(8), EOMonth(GETDATE()), 112) + 1) AS ThroughDate
        FROM dbo.vw_Dim_Associate_Current
        --WHERE (EntityKey IN (SELECT EntityKey FROM dbo.Dim_Entity WHERE (EntDefaultDlrshpLvl1 = 1)))
        --GROUP BY AsoEmployeeNumber, EntityKey
		) AS a ON m.EndDateKey >= a.OriginalHireDate AND m.StartDateKey <= a.ThroughDate) AS monthx
		INNER JOIN
        dbo.vw_Dim_Month ON monthx.FiscalMonthKey = dbo.vw_Dim_Month.FiscalMonthKey
		--LEFT OUTER JOIN
  --      (SELECT AsoEmployeeNumber, AsoJobCode, AsoDepartmentCode
  --       FROM dbo.DimAssociate
  --       WHERE (AssociateKey IN (SELECT MAX(AssociateKey) AS AssociateKey
  --                               FROM dbo.DimAssociate AS DimAssociate_1
  --                               WHERE (Meta_RowIsCurrent = 'Y')
  --                               GROUP BY AsoEmployeeNumber))) AS ASJC ON monthx.AsoEmployeeNumber = ASJC.AsoEmployeeNumber;

CREATE NONCLUSTERED INDEX [IDX_FiscalMonthKey] ON [dbo].[Fact_EmployeesActiveByMonth]
([FiscalMonthKey] ASC)
INCLUDE ([AsoEmployeeNumber],[AsoJobCode],[IsActive],[IsTerm]) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]

CREATE NONCLUSTERED INDEX [IDX_AsoEmployeeNumber] ON [dbo].[Fact_EmployeesActiveByMonth]
([AsoEmployeeNumber],[AsoDepartmentCode],[OriginalHireDate],[TerminationDate],[AsoJobCode])
INCLUDE ([FiscalMonthKey],[EntityKey],[IsActive],[IsTerm])

CREATE NONCLUSTERED INDEX [IDX_FiscalMonthEntityKey]
ON [dbo].[Fact_EmployeesActiveByMonth] ([FiscalMonthKey],[EntityKey])
INCLUDE ([AsoEmployeeNumber],[AsoDepartmentCode],[OriginalHireDate],[TerminationDate],[AsoJobCode],[IsActive],[IsTerm])


END

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
