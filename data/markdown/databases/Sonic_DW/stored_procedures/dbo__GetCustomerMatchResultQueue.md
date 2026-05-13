---
name: GetCustomerMatchResultQueue
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on: []
dependency_count: 0
parameter_count: 2
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
| `@entityKey` | int  | No     | No      |

## Definition

```sql

--EXEC GetCustomerMatchResultQueue 10, 368

/****************************** CHANGE LOG ********************************************************************************************************************************************
4/19/2019	DMD	-	Added additional JOIN so that MatchedFields column is populated using only unique MatchField values of each Match person ID per SourcePersonID
6/21/2019	DMD	-	Added Remove exclusions per PBI 3219 and corrected "MAX(PotentialMatchScore) >= @threshold" to include greater than or equal to threshold value (previously was only >)
8/6/2019	DMD -	Added date limitation to only display results for last 30 days max per PBI 3834
****************************** CHANGE LOG END *****************************************************************************************************************************************/

CREATE PROCEDURE [dbo].[GetCustomerMatchResultQueue] ( @threshold INT, @entityKey INT)
AS
--DECLARE @threshold int = 2
--DECLARE @EntityKey Int = 368

DECLARE @Source AS TABLE (
	ID INT,
	SourcePersonID INT,
	MaxScore INT
	)

INSERT INTO @Source

	SELECT DISTINCT
		CMR.ID,
		CMR.SourcePersonID,
		MaxScore
	FROM
		[Sonic_DW].[dbo].[CustomerMatchResult] CMR
	INNER JOIN
	(	SELECT	SourcePersonID,
				MAX(PotentialMatchScore) AS MaxScore
		FROM
			[Sonic_DW].[dbo].[CustomerMatchResult]
		WHERE
			(ISNULL(Exclude, 0) = 0	AND ISNULL([Remove],0) = 0)
			AND EntityKey = @entityKey
		GROUP BY
			SourcePersonID
		HAVING
			MAX(PotentialMatchScore) >= @threshold
	)	AS	SP
	ON CMR.SourcePersonID = SP.SourcePersonID
	WHERE
		MatchPersonID IS NULL
	OR	PotentialMatchScore >= @threshold
	AND (ISNULL(Exclude, 0) = 0 AND ISNULL([Remove],0) = 0)
	AND CMR.SourcePersonID = SP.SourcePersonID
	AND CMR.MatchPersonID IS NULL

SELECT
	SRC.MaxScore,
	CMR.SourcePersonID,
	mf.MatchedFields,
	CMR.OpptyType AS OpportunityType,
	CMR.OpptySource AS OpportunitySource,
	CMR.DateCreated,
	CMR.CreatedBy AS Employee,
	CMR.FirstName,
	CMR.LastName,
	CMR.PhoneNumber1,
	CMR.PhoneNumber2,
	CMR.PhoneNumber3,
	CMR.EmailAddress,
	CMR.StreetAddress,
	CMR.City,
	CMR.[State],
	CMR.Zip,
	CMR.VOIMake,
	CMR.VOIModel,
	CMR.VOIStockNumber,
	CMR.VOIVIN,
	CMR.TradeVIN,
	CMR.DMSCustomerID,
	CMR.DMSDealID
	--,cmr.Exclude
	--,cmr.Remove
FROM
	[Sonic_DW].[dbo].[CustomerMatchResult] CMR
	INNER JOIN @Source SRC ON CMR.ID = SRC.ID
	INNER JOIN										---- Added 4/19/19 by DMD for MatchedFields update
	(SELECT 	p.EntityKey
				,p.SourcePersonID
				--,[FirstName], [LastName], [PhoneNumber1], [PhoneNumber2], [PhoneNumber3], [EmailAddress], [StreetAddress], [City], [State], [Zip], [VOIMake], [VOIModel], [VOIStockNumber], [VOIVIN], [TradeVIN]
				,CONCAT	(ISNULL(NULLIF([FirstName]+';',';'),'')
						, ISNULL(NULLIF([LastName]+';',';'),'')
						, ISNULL(NULLIF([PhoneNumber1]+';',';'),'')
						, ISNULL(NULLIF([PhoneNumber2]+';',';'),'')
						, ISNULL(NULLIF([PhoneNumber3]+';',';'),'')
						, ISNULL(NULLIF([EmailAddress]+';',';'),'')
						, ISNULL(NULLIF([StreetAddress]+';',';'),'')
						, ISNULL(NULLIF([City]+';',';'),'')
						, ISNULL(NULLIF([State]+';',';'),'')
						, ISNULL(NULLIF([Zip]+';',';'),'')
						, ISNULL(NULLIF([VOIMake]+';',';'),'')
						, ISNULL(NULLIF([VOIModel]+';',';'),'')
						, ISNULL(NULLIF([VOIStockNumber]+';',';'),'')
						, ISNULL(NULLIF([VOIVIN]+';',';'),'')
						, ISNULL(NULLIF([TradeVIN]+';',';'),'')
						) AS MatchedFields
		FROM
		(SELECT DISTINCT v.VALUE AS RowN ,EntityKey, SourcePersonID, v.VALUE FROM Sonic_DW.dbo.CustomerMatchResult c CROSS APPLY STRING_SPLIT(MatchedFields,';') v
		WHERE MatchPersonID IS NOT NULL AND PotentialMatchScore >= @threshold
			AND v.value <> ''
			AND c.EntityKey = @entityKey
			AND (ISNULL(c.Exclude,0) = 0 AND ISNULL(c.[Remove],0) = 0)
		)s
		PIVOT (	MAX(s.VALUE) FOR s.RowN IN ([FirstName], [LastName], [PhoneNumber1], [PhoneNumber2], [PhoneNumber3], [EmailAddress], [StreetAddress], [City], [State], [Zip], [VOIMake], [VOIModel], [VOIStockNumber], [VOIVIN], [TradeVIN])) p
	) mf
	ON CMR.EntityKey = mf.EntityKey
	AND CMR.SourcePersonID = mf.SourcePersonID
WHERE 	(ISNULL(CMR.Exclude,0) = 0 AND ISNULL(CMR.[Remove],0) = 0)
		AND Meta_LoadDate >= 	DATEADD(DAY, DATEDIFF(DAY, 0, GETDATE())-30, 0)				----8/6/2019	DMD -	Added date limitation to only display results for last 30 days max per PBI 3834





```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
