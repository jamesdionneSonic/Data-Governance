---
name: uspScoresDimDealTypeLoad
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
-- Author:        Amrendra Kumar   
-- Create date:  01/07/2016    
-- Description:   Inserts/Update DimLeadStatus

-- 5/1/2016 - ubs - added  SCD type 1 update on DealTypeDesc. Added attributevalue as DealTypeCode, not just natural key.
-- =============================================    
CREATE PROCEDURE [dbo].[uspScoresDimDealTypeLoad] (
	@MetaComputerName VARCHAR(50)
	,@MetaSrcSysID INT
	,@MetaUserID VARCHAR(50)
	,@MetaLoadD
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
