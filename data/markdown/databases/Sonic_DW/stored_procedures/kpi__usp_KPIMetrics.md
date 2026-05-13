---
name: usp_KPIMetrics
database: Sonic_DW
type: procedure
schema: kpi
owner: Data Team
tags:
  - procedure
  - auto-extracted
dependency_count: 2
parameter_count: 15
extracted_at: 2026-05-12T20:14:33.860Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: kpi

## Dependencies

This procedure depends on:

- **kpi.Dim_KPIMetrics** (U )
- **kpi.Dim_MetricClass** (U )

## Parameters

| Name               | Type     | Output | Default |
| ------------------ | -------- | ------ | ------- |
| `@KPIMetricKey`    | int      | No     | No      |
| `@KPIMetricDesc`   | nvarchar | No     | No      |
| `@IsManual`        | bit      | No     | No      |
| `@IsAvg`           | bit      | No     | No      |
| `@IsActive`        | bit      | No     | No      |
| `@Meta_LoadDate`   | datetime | No     | No      |
| `@Meta_User`       | nvarchar | No     | No      |
| `@MetricClassA`    | bit      | No     | No      |
| `@MetricClassB`    | bit      | No     | No      |
| `@MetricClassC`    | bit      | No     | No      |
| `@targetsortorder` | int      | No     | No      |
| `@endingfact`      | bit      | No     | No      |
| `@TargetIsAvg`     | bit      | No     | No      |
| `@IsKPI`           | bit      | No     | No      |
| `@IsDMR`           | bit      | No     | No      |

## Definition

```sql





CREATE PROCEDURE [kpi].[usp_KPIMetrics]
	 @KPIMetricKey INT
	,@KPIMetricDesc nvarchar(100)
	,@IsManual BIT
	,@IsAvg BIT
	,@IsActive BIT
	,@Meta_LoadDate datetime
	,@Meta_User nvarchar(100)
	,@MetricClassA BIT
	,@MetricClassB BIT
	,@MetricClassC BIT
	,@targetsortorder INT
	,@endingfact BIT
	,@TargetIsAvg BIT
	,@IsKPI BIT
	,@IsDMR BIT

AS

SET NOCOUNT ON

/* =========================================================================================
    Author:			Lexie McGilis
    Create date:	11/17/2020
    Description:	Insert/Update records from kpi.Dim_KPIMetrics and kpi.Dim_MetricClass
					for EP KPI Reporting

					-- Update 2.15.2022 LM
					Added in IsKPI and IsDMR metric flags for reporting.
========================================================================================= */

BEGIN TRY

	DECLARE @NewMetricKey int

	---------------------------------------------------------------------------------------------------------------------------------
	-- INSERT NEW METRIC
	---------------------------------------------------------------------------------------------------------------------------------

	IF (SELECT KPIMetricKey from [kpi].[Dim_KPIMetrics] where KPIMetricKey = @KPIMetricKey) IS NULL

		BEGIN

			INSERT INTO [kpi].[Dim_KPIMetrics]
			SELECT   @KPIMetricDesc
					,coalesce(@IsManual,0)
					,coalesce(@IsAvg,0)
					,1 --,@IsActive default
					,getdate() --@Meta_LoadDate default
					,getdate() --@Meta_UpdateDate default
					,@Meta_User
					,@targetsortorder
					,coalesce(@endingfact,0)
					,coalesce(@TargetIsAvg,0)
					,coalesce(@IsKPI,0)
					,coalesce(@IsDMR,0)

			SET @NewMetricKey = (select KPIMetricKey from [kpi].[Dim_KPIMetrics] where KPIMetricDesc =  @KPIMetricDesc and Meta_User = @Meta_User)

			INSERT INTO [kpi].[Dim_MetricClass]
			SELECT KPIMetricKey, Class
			FROM (SELECT @NewMetricKey as KPIMetricKey
							, cast(case when @MetricClassA=1 then 'Hub' else null end as varchar(30)) as ClassA
							, cast(case when @MetricClassB=1 then 'Spoke' else null end as varchar(30)) as ClassB
							, cast(case when @MetricClassC=1 then 'Pickup Center' else null end as varchar(30)) as ClassC
					) as c1
			UNPIVOT (Class for MetricKey in
						(ClassA, ClassB, ClassC)) as c2
		END

	ELSE
	---------------------------------------------------------------------------------------------------------------------------------
	-- UPDATE EXISTING METRIC
	---------------------------------------------------------------------------------------------------------------------------------

		BEGIN
			--Update existing KPIMetrics records
			UPDATE [kpi].[Dim_KPIMetrics]
			SET  KPIMetricDesc = @KPIMetricDesc
				,IsManual = coalesce(@IsManual,0)
				,IsAvg = coalesce(@IsAvg,0)
				,IsActive = coalesce(@IsActive,0)
				,Meta_UpdateDate = getdate()
				,Meta_User = @Meta_User
				,TargetSortOrder = @TargetSortOrder
				,EndingFact =coalesce(@EndingFact,0)
				,TargetIsAvg = coalesce(@TargetIsAvg,0)
				,IsKPI = coalesce(@IsKPI,0)
				,IsDMR = coalesce(@IsDMR,0)
			WHERE KPIMetricKey = @KPIMetricKey

			--Delete existing MetricClass records
			DELETE FROM [kpi].[Dim_MetricClass]
			WHERE KPIMetricKey = @KPIMetricKey

			--Insert Updated MetricClass records
			INSERT INTO [kpi].[Dim_MetricClass]
			SELECT KPIMetricKey, Class
			FROM (SELECT @KPIMetricKey as KPIMetricKey
							, cast(case when @MetricClassA=1 then 'Hub' else null end as varchar(30)) as ClassA
							, cast(case when @MetricClassB=1 then 'Spoke' else null end as varchar(30)) as ClassB
							, cast(case when @MetricClassC=1 then 'Pickup Center' else null end as varchar(30)) as ClassC
					) as c1
			UNPIVOT (Class for MetricKey in
						(ClassA, ClassB, ClassC)) as c2
		END

END TRY

BEGIN CATCH
    SELECT ERROR_NUMBER() AS ErrorNumber, ERROR_MESSAGE() AS ErrorMessage
    RETURN -1
END CATCH

SET NOCOUNT OFF



```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
