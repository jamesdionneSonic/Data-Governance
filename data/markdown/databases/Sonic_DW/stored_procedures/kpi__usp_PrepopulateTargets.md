---
name: usp_PrepopulateTargets
database: Sonic_DW
type: procedure
schema: kpi
owner: Data Team
tags:
  - procedure
  - auto-extracted
dependency_count: 2
parameter_count: 3
extracted_at: 2026-05-12T20:14:33.860Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: kpi

## Dependencies

This procedure depends on:

- **dbo.vw_Dim_EntityEP** (V )
- **kpi.Fact_KPIMetricTarget_TXN** (U )

## Parameters

| Name                       | Type     | Output | Default |
| -------------------------- | -------- | ------ | ------- |
| `@SourceMonthStartDateKey` | int      | No     | No      |
| `@LoadMonthStartDateKey`   | int      | No     | No      |
| `@Meta_User`               | nvarchar | No     | No      |

## Definition

```sql


CREATE PROCEDURE [kpi].[usp_PrepopulateTargets]
	 @SourceMonthStartDateKey INT
	,@LoadMonthStartDateKey INT
	,@Meta_User nvarchar(100)


AS

SET NOCOUNT ON

/* =========================================================================================
    Author:			Lexie McGillis
    Create date:	3/17/2022
    Description:	Inserts target values for the KPI report from a previous month.
========================================================================================= */

BEGIN TRY

	---------------------------------------------------------------------------------------------------------------------------------
	-- Delete Existing Target Records
	---------------------------------------------------------------------------------------------------------------------------------

			DELETE FROM  kpi.Fact_KPIMetricTarget_TXN
			WHERE Datekey = @LoadMonthStartDateKey



	---------------------------------------------------------------------------------------------------------------------------------
	-- Insert New Records into Load Month from Source Month
	---------------------------------------------------------------------------------------------------------------------------------

			INSERT INTO kpi.Fact_KPIMetricTarget_TXN
			SELECT t.KPIMetricKey, t.entitykey, @LoadMonthStartDateKey DateKey,  t.MetricValue, getdate(), getdate(), @Meta_User
			from kpi.Fact_KPIMetricTarget_TXN t
			join vw_Dim_EntityEP e -- only active EP entities
			on e.entitykey = t.EntityKey
			where t.MetricValue is not null
			and t.MetricValue <>0
			and t.datekey = @SourceMonthStartDateKey



END TRY

BEGIN CATCH
    SELECT ERROR_NUMBER() AS ErrorNumber, ERROR_MESSAGE() AS ErrorMessage
    RETURN -1
END CATCH

SET NOCOUNT OFF




```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
