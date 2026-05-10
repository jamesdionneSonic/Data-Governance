---
name: usp_LoadDimDepartmentCDK_tables_FTS
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

CREATE   PROCEDURE dbo.usp_LoadDimDepartmentCDK_tables_FTS (
	@bMTD BIT = NULL,
	@bMonthLong BIT = NULL)
AS

/*** @@bMTD ******************************************************************************/
IF @bMTD = 1
BEGIN
	/******** DimDepartmentCDK *********/
	MERGE sonic_dw.dbo.DimDepartmentCDK AS tgt
	USING (
		SELECT DISTINCT Department
		FROM [ETL_Staging]..[StageTrafficSummaryDailyDepartment_MTD]
	) AS src
	ON tgt.Department = src.Department
	-- WHEN MATCHED -- since there a
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
