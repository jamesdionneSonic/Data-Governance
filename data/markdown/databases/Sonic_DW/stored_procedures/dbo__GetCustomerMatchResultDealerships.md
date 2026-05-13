---
name: GetCustomerMatchResultDealerships
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on: []
dependency_count: 0
parameter_count: 1
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Parameters

| Name         | Type | Output | Default |
| ------------ | ---- | ------ | ------- |
| `@threshold` | int  | No     | No      |

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
--		FROM
--			[Sonic_DW].[dbo].[CustomerMatchResult]
--		WHERE
--			ISNULL(Exclude, 0) = 0
--		GROUP BY
--			SourcePersonID
--		HAVING
--			MAX(PotentialMatchScore) > @threshold
--	)	AS	SP
--	ON CMR.SourcePersonID = SP.SourcePersonID
--	WHERE
--		MatchPersonID IS NULL
--	OR	PotentialMatchScore >= @threshold
--	AND ISNULL(Exclude, 0) = 0
--	AND CMR.SourcePersonID = SP.SourcePersonID
--	AND CMR.MatchPersonID IS NULL

--SELECT
--	CMR.EntityKey AS EntityKey,
--	DE.EntDealerLvl0 AS StoreName,
--	COUNT(SRC.ID) AS PendingCount
--FROM
--	[Sonic_DW].[dbo].[CustomerMatchResult] CMR
--	INNER JOIN @Source SRC ON CMR.ID = SRC.ID
--	INNER JOIN [Sonic_DW].[dbo].DIM_Entity DE ON CMR.EntityKey = DE.EntityKey
--WHERE
--	DE.EntActive = 'Active'
--	AND DE.CurrentPrefixFlag = 'Active'
--	AND DE.EntADPActive = 'Active'
--	AND DE.EntDefaultDlrshpLvl1 = 1
--GROUP BY
--	CMR.EntityKey, DE.EntDealerLvl0
--ORDER BY
--	StoreName, EntityKey, PendingCount

--DECLARE @threshold int = 20;
--DECLARE @EntityKey Int = 89;

WITH nullMatchID as (
	SELECT	CMR.ID, CMR.EntityKey, CMR.SourcePersonID
	FROM	[Sonic_DW].[dbo].[CustomerMatchResult] CMR
			INNER JOIN (
				SELECT	SourcePersonID
				FROM	[Sonic_DW].[dbo].[CustomerMatchResult]
				WHERE	ISNULL(Exclude, 0) = 0
						AND ISNULL([Remove],0) = 0
						AND PotentialMatchScore >= @threshold
						AND Meta_LoadDate >= DATEADD(DAY, DATEDIFF(DAY, 0, GETDATE())-30, 0)
				GROUP BY SourcePersonID
				)	AS	SP ON CMR.SourcePersonID = SP.SourcePersonID
	WHERE	MatchPersonID IS NULL
	),
matchedID as (
	SELECT	cmr.EntityKey, cmr.ID
	FROM	SONIC_DW.DBO.CustomerMatchResult cmr
			inner join nullMatchID as nmid	on  nmid.id = cmr.id
	WHERE 	ISNULL(CMR.Exclude,0) = 0
		AND ISNULL(CMR.[Remove],0) = 0
		AND cmr.Meta_LoadDate >= DATEADD(DAY, DATEDIFF(DAY, 0, GETDATE())-30, 0)
	)
select	de.EntityKey
		, entdealerlvl0 as StoreName
		,  count(1) as PendingCount
from	matchedid as m
		inner join sonic_dw.dbo.dim_entity as de on m.entitykey = de.entitykey
group by de.entdealerlvl0, de.entitykey
order by de.entdealerlvl0
```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
