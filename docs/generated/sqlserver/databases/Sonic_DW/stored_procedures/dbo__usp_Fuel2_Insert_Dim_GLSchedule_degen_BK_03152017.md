---
name: usp_Fuel2_Insert_Dim_GLSchedule_degen_BK_03152017
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
/* ************************************************************************
	Author:			NCarpender	
	Create date:	20150331
	Description:	This code creates the insert to add values into the 
					dim_GLSchedule_degen table for new records.
*************************************************************************/
CREATE PROCEDURE usp_Fuel2_Insert_Dim_GLSchedule_degen
	@InsertedRows int output
AS
BEGIN
	SET NOCOUNT ON;

		-----------------------------------------------------------------
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
