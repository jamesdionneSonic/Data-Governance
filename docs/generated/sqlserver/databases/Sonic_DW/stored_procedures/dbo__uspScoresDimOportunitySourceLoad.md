---
name: uspScoresDimOportunitySourceLoad
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











-- ================================================    
-- Author:       Umberto Sartori  
-- Create date:  14/18/2017
-- Description:  Inserts/Update DimOpportunitySource dimension table
--
-- ubs - 4/18/2017 - added source sytem name and ID to target table.
-- ================================================   
CREATE PROCEDURE [dbo].[uspScoresDimOportunitySourceLoad] (
	@MetaComputerName VARCHAR(50)
	,@MetaSrcSysID INT
	,@MetaUserID VARCHAR(50)
	,@MetaLoadDate
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
