---
name: usp_FORCE_ServiceDetailDelete
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
extracted_at: 2026-05-09T12:34:14.349Z
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

			-- Pivot the
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
