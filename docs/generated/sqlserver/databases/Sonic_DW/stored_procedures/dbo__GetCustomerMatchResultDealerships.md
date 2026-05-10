---
name: GetCustomerMatchResultDealerships
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

--EXEC GetCustomerMatchResultQueue 16, 1

CREATE PROCEDURE [dbo].[GetCustomerMatchResultDealerships] ( @threshold INT)
AS 

--DECLARE @threshold int = 20

--DECLARE @Source AS TABLE (
--	ID INT,
--	SourcePersonID INT,
--	MaxScore INT
--	)

--INSERT INTO @Source 

--	SELECT DISTINCT 
--		CMR.ID,
--		CMR.SourcePersonID,
--		MaxScore
--	FROM
--		[Sonic_DW].[dbo].[CustomerMatchResult] CMR
--	JOIN
--	(	SELECT	SourcePersonID,
--				MAX(PotentialMatchScore) AS MaxScore
--		FRO
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
