---
name: spELead_CustomerMatchResult_Merged
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on: []
dependency_count: 0
parameter_count: 0
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Definition

```sql

/**********************************************************************************************************************************
-- CHANGE LOG
-- 6/25/2019:	DMD - Created procedure
-- 8/19/2019:	DMD - Updated procedure to account for MERGE statement trying to update rows more than once
************************************************************************************************************************************/

--EXEC [dbo].[spELead_CustomerMatchResult_Merged]


CREATE PROC [dbo].[spELead_CustomerMatchResult_Merged]
AS

BEGIN
MERGE [Sonic_DW].[dbo].[CustomerMatchResult] TGT
	USING
		(
		SELECT * FROM
			(
			SELECT
			   RowNum = ROW_NUMBER() OVER (PARTITION BY cms.ID ORDER BY cms.ID)
			  ,cms.ID
			  ,del.[lKeepPersonID]
			  ,del.[lDelPersonID]
			  ,del.[dtMerged]
			  ,cms.SourcePersonID
			  ,ISNULL(cms.MatchPersonID,cms.SourcePersonID) AS MatchPersonID
			  ,cms.EntityKey
			FROM [ETL_Staging].[stage].[eLeadDupeMergeStaging] del
			INNER JOIN [Sonic_DW].[dbo].[CustomerMatchResult] cms
				ON del.lDelPersonID = ISNULL(cms.MatchPersonID,cms.SourcePersonID)
			WHERE del.lDelPersonID <> -1
			GROUP BY ID,lKeepPersonID, lDelPersonID, dtMerged,cms.SourcePersonID,ISNULL(cms.MatchPersonID,cms.SourcePersonID),cms.EntityKey
			--ORDER BY lDelPersonID, ID
			) mrg
			WHERE mrg.RowNum = 1
		)  SRC
	ON
		ISNULL(TGT.MatchPersonID,TGT.SourcePersonID) = SRC.[lDelPersonID]
		AND TGT.ID = SRC.ID
		AND ISNULL(TGT.MatchPersonID,TGT.SourcePersonID) = SRC.MatchPersonID
		--AND TGT.SourcePersonID = SRC.SourcePersonID
		AND TGT.EntityKey = SRC.EntityKey
		AND ISNULL(TGT.[Remove],0) = 0


--WHEN NOT MATCHED THEN

WHEN MATCHED

THEN UPDATE SET
  		  TGT.[Remove] = 1
		 ,TGT.[Meta_RowLastChangedDate] = GETDATE()
		 ,TGT.[Meta_RowLastDMLAction]   = 'U'

      ;


END





```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
