---
name: usp_update_dim_gldetail_flag
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
-- Author:		<Larry Owens>
-- Create date: <09/15/2011>
-- Description:	<This will update the DetScheduleActiveFlag depending on whether it finds the given dim record for a given conrol in the current month schedule. 
--              If it does, the flag is set to true.  If it doesn't, the flag is set to false >
-- =============================================
CREATE PROCEDURE [dbo].[usp_update_dim_gldetail_flag]
AS
BEGIN
	-- SET NOCOUNT O
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
