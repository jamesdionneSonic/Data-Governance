---
name: usp_Load_FactFocusBudget
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
dependency_count: 0
parameter_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Definition

```sql





-- =============================================
-- Author:        Umberto Sartori
-- Create date:  06/6/2016
-- Description:   Inserts records in FactFocusBudget table
-- =============================================

CREATE PROCEDURE [dbo].[usp_Load_FactFocusBudget] (
	@ETLExecution_ID int
)

AS
SET NOCOUNT ON;

MERGE INTO dbo.FactFocusBudget AS tgt
USING (select YearMonth,
			EntityKey,
			'NVBudgetCount' as BudgetMetricName,
			'Units' as BudgetMetricType,
			1 as NewVehicleFlag,
			NVBudgetCount as BudgetAmount,
			ETLExecution_ID,
			Meta_SrcSysID,
			[User_ID],
			Meta_ComputerName,
			Meta_RowEffectiveDate,
			Meta_RowExpiredDate,
			Meta_RowIsCurrent,
			Meta_SourceSystemName,
			Meta_RowLastChangeDate,
			Meta_LoadDate
		from etl_staging.[extract].FactFocusBudget
		UNION
		select YearMonth,
			EntityKey,
			'UVBudgetCount' as BudgetMetricName,
			'Units' as BudgetMetricType,
			0 as NewVehicleFlag,
			UVBudgetCount as BudgetAmount,
			ETLExecution_ID,
			Meta_SrcSysID,
			[User_ID],
			Meta_ComputerName,
			Meta_RowEffectiveDate,
			Meta_RowExpiredDate,
			Meta_RowIsCurrent,
			Meta_SourceSystemName,
			Meta_RowLastChangeDate,
			Meta_LoadDate
		from etl_staging.[extract].FactFocusBudget) AS src
	ON src.EntityKey = tgt.EntityKey and
	   src.YearMonth = tgt.YearMonth and
	   src.BudgetMetricName = tgt.BudgetMetricName and
	   src.BudgetMetricType = tgt.BudgetMetricType and
	   src.NewVehicleFlag = tgt.NewVehicleFlag
WHEN MATCHED AND src.ETLExecution_ID = @ETLExecution_ID
	THEN
		UPDATE SET
			tgt.BudgetAmount = src.BudgetAmount
			,tgt.Meta_RowLastChangeDate = src.Meta_RowLastChangeDate
			,tgt.ETLExecution_ID = src.ETLExecution_ID
WHEN NOT MATCHED BY TARGET
	THEN
		INSERT (
			YearMonth
			,EntityKey
			,BudgetMetricName
			,BudgetMetricType
			,NewVehicleFlag
			,BudgetAmount
			,Meta_NaturalKey
			,Meta_SrcSysID
			,[User_ID]
			,Meta_ComputerName
			,Meta_RowEffectiveDate
			,Meta_RowExpiredDate
			,Meta_RowIsCurrent
			,Meta_SourceSystemName
			,Meta_RowLastChangeDate
			,Meta_AuditKey
			,Meta_AuditScore
			,Meta_Checksum
			,Meta_LoadDate
			,ETLExecution_ID
			)
		VALUES (
			src.YearMonth
			,src.EntityKey
			,src.BudgetMetricName
			,src.BudgetMetricType
			,src.NewVehicleFlag
			,src.BudgetAmount
			,''
			,src.Meta_SrcSysID
			,src.[User_ID]
			,src.Meta_ComputerName
			,src.Meta_RowEffectiveDate
			,src.Meta_RowExpiredDate
			,src.Meta_RowIsCurrent
			,src.Meta_SourceSystemName
			,src.Meta_RowLastChangeDate
			,-1
			,-1
			,-1
			,src.Meta_LoadDate
			,@ETLExecution_ID
			);







```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
