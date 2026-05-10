---
name: uspFloorPlanMaxPayoff
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
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[uspFloorPlanMaxPayoff]
	@MaxPayoffStockType varchar(10), 
	@MaxPayoffAmount numeric(18,0),
	@Meta_UserID varchar(50)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	CREATE TABLE #MaxTemp (
		M
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
