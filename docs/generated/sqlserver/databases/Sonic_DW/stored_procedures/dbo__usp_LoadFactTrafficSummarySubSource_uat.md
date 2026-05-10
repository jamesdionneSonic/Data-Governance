---
name: usp_LoadFactTrafficSummarySubSource_uat
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


-- =================================================   
-- Author:       Derrick Davis
-- Create date:  06/12/2023    
-- 08/02/2023:	DMD - Added row counts for process management
-- =================================================    
CREATE PROCEDURE [dbo].[usp_LoadFactTrafficSummarySubSource] 
(
	@ReadRowCnts INT OUTPUT,
	@InsertedRowCnts INT OUTPUT,
	@UpdatedRowCnts INT OUTPUT
)
--(
--	@Meta_ComputerName VARCHAR(50)
--	,@MetaSrcSysID INT
--	,@MetaSourceSystemName VARCHAR(2
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
