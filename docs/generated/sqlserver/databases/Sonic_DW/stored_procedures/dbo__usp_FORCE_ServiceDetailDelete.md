---
name: usp_FORCE_ServiceDetailDelete
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
-- Author:		Owen D. McPeak Analytic Vision
-- Create date: 2013-09-19
-- Description:	Delete from Fact_ServiceDetail
-- =============================================
CREATE PROCEDURE [dbo].[usp_FORCE_ServiceDetailDelete] @closedatekey int
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
			'delete from fact_ServiceDetail where ' + @cora
			exec(@sql)
		end
	else
		begin
		-- Determine if a historical load is specified in the DateControl table
		if exists(select 1 from ETL_Staging.dbo.FORCE_DateControl where HistoricalLoad  = 1)
			truncate table fact_ServiceDetail
		else
			begin

				-- delete open ROs
				;with CTE as
				(
				select servicekey from Fact_Service where ROStatus = 0
				)
				delete from Fact_ServiceDetail where ServiceKey in (select ServiceKey from CTE)

				-- Incremental load
				declare @cnt int = 1
				while @cnt <> 0
					begin
						begin transaction

							;with CTE as
							(
							select servicekey from Fact_Service where CloseDateKey >= @closedatekey
							)
							delete from Fact_ServiceDetail where ServiceKey in (select ServiceKey from CTE)

						set @cnt = @@rowcount
						commit transaction
					end

			end
	end

END

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
