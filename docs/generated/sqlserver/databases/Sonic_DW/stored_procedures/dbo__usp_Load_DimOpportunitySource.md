---
name: usp_Load_DimOpportunitySource
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
-- Author:        Umberto Sartori 
-- Create date:  04/1/2016    
-- Description:   Inserts/Update opportunity source Dimension records (type 1)

-- 11/2/2016 - ubs - add szMapGroup to target table load.
-- =============================================   

CREATE PROCEDURE [dbo].[usp_Load_DimOpportunitySource] (
	@MetaComputerName VARCHAR(50)
	,@MetaSrcSysID INT
	,@MetaUserID VARCHAR(50)
	,@MetaLoadDate DATETI
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
