---
name: usp_Fuel_Incremental_DM
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on: []
dependency_count: 0
parameter_count: 0
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Definition

```sql

-- =============================================
-- Author:		<Jonathan Henin>
-- Create date: <1/16/2013>
-- Description:	<Create a table needed for incremental load of FUEL>
-- =============================================
CREATE PROCEDURE [dbo].[usp_Fuel_Incremental_DM]
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;



    -- Insert statements for procedure here

/****** Object:  Table [dbo].[FUEL_Incremental_Date]    Script Date: 01/16/2013 11:12:36 ******/
declare @mydate datetime
declare @myintdate int
set @mydate = dateadd(m,-1,getdate())
set @myintdate = CONVERT(varchar(10),DATEADD(dd,-(DAY(@mydate)-1),@mydate),112)

DELETE FROM [Sonic_DW].[dbo].[DM_FUEL_Dashboard]
      WHERE (DateKey >= @myintdate)


END

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
