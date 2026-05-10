---
name: uspScoresDimActivityStatusLoad
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


--declare @inserted int, @updated int;


--exec dbo.uspScoresDimActivityStatusLoad '7/18/2017', 40, '7/18/2017', 'SCORESMSCRM', 55618,  @inserted, @updated  ,'usartori', 'shqbt0091'

-- =============================================    
-- Author:        Umberto Sartori   
-- Create date:  04/25/2016    
-- Description:   Inserts DimActivityStatus
-- =============================================    
CREATE PROCEDURE [dbo].[uspScoresDimActivityStatusLoad] (
	@MetaRowEffectiveDate da
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
