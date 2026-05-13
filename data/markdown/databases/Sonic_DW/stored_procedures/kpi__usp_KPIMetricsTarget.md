---
name: usp_KPIMetricsTarget
database: Sonic_DW
type: procedure
schema: kpi
owner: Data Team
tags:
  - procedure
  - auto-extracted
dependency_count: 1
parameter_count: 6
extracted_at: 2026-05-12T20:14:33.860Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: kpi

## Dependencies

This procedure depends on:

- **kpi.Fact_KPIMetricTarget_TXN** (U )

## Parameters

| Name                | Type     | Output | Default |
| ------------------- | -------- | ------ | ------- |
| `@FactKPITargetKey` | int      | No     | No      |
| `@KPIMetricKey`     | int      | No     | No      |
| `@EntityKey`        | int      | No     | No      |
| `@DateKey`          | int      | No     | No      |
| `@MetricValue`      | decimal  | No     | No      |
| `@Meta_User`        | nvarchar | No     | No      |

## Definition

```sql



CREATE PROCEDURE [kpi].[usp_KPIMetricsTarget]
	 @FactKPITargetKey INT
	,@KPIMetricKey INT
	,@EntityKey INT
	,@DateKey INT
	,@MetricValue decimal(18,2)
	,@Meta_User nvarchar(100)



AS

SET NOCOUNT ON

/* =========================================================================================
    Author:			Lexie McGilis
    Create date:	1/15/2020
    Description:	Insert/Update records for Fact_KPIMetricTarget_TXN - target values for metrics
					entered for the EP KPI report.
========================================================================================= */

BEGIN TRY

	---------------------------------------------------------------------------------------------------------------------------------
	-- INSERT TRXN METRIC VALUES
	---------------------------------------------------------------------------------------------------------------------------------

	IF (SELECT FactKPITargetKey from [kpi].[Fact_KPIMetricTarget_TXN] where EntityKey = @EntityKey and KPIMetricKey=@KPIMetricKey and DateKey = @DateKey) IS NULL

		BEGIN

			INSERT INTO [kpi].[Fact_KPIMetricTarget_TXN]
			SELECT   @KPIMetricKey
					,@EntityKey
					,@DateKey
					,@MetricValue
					,getdate() --@Meta_LoadDate default
					,getdate() --@Meta_UpdateDate default
					,@Meta_User

		END

	ELSE
	---------------------------------------------------------------------------------------------------------------------------------
	-- UPDATE EXISTING METRIC
	---------------------------------------------------------------------------------------------------------------------------------

		BEGIN
			--Update existing KPIMetrics records
			UPDATE [kpi].[Fact_KPIMetricTarget_TXN]
			SET  MetricValue = @MetricValue
				,Meta_RowLastChangeDate = getdate()
				,Meta_UserID = @Meta_User
			WHERE EntityKey = @EntityKey
			and KPIMetricKey=@KPIMetricKey
			and DateKey = @DateKey

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
