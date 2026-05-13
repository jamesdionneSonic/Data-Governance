---
name: usp_FORCE_ServiceDelete
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - Fact_Service
dependency_count: 1
parameter_count: 1
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.Fact_Service** (U )

## Parameters

| Name            | Type | Output | Default |
| --------------- | ---- | ------ | ------- |
| `@closedatekey` | int  | No     | No      |

## Definition

```sql
-- =============================================
-- Author:		Owen D. McPeak Analytic Vision
-- Create date: 2013-09-19
-- Description:	Delete from Fact_Service
-- =============================================
CREATE PROCEDURE [dbo].[usp_FORCE_ServiceDelete] @closedatekey int
AS
BEGIN
	SET NOCOUNT ON;

	declare @sql varchar(max)

	-- Determine if there are coras specified for filtering
	if exists(select 1 from ETL_Staging.dbo.FORCE_CoraFilter)
		begin

			-- Pivot the filter rows to the format (999,998,997)
			declare @cora varchar(max) = ''
			select @cora=@cora+cora_acct_id+',' from ETL_Staging.dbo.FORCE_CoraFilter
			select @cora = ' cora_acct_id_service in (' + substring(@cora,1,len(@cora)-1) + ')'

			-- execute the sql
			select @sql =
			'delete from fact_Service where ' + @cora
			exec(@sql)
		end
	else
		begin
		-- Determine if a historical load is specified in the DateControl table
		if exists(select 1 from ETL_Staging.dbo.FORCE_DateControl where HistoricalLoad  = 1)
			truncate table fact_Service
		else
			begin

				-- delete open ROs
				delete from fact_Service where ROStatus = 0

				-- Incremental load
				declare @cnt int = 1
				while @cnt <> 0
					begin
						begin transaction
						delete top (50000)  from fact_service where closedatekey >= @closedatekey
						set @cnt = @@rowcount
						commit transaction
					end

			end
	end
END


```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
