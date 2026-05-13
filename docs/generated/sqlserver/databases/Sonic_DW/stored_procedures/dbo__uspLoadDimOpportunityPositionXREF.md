---
name: uspLoadDimOpportunityPositionXREF
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
dependency_count: 0
parameter_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Definition

```sql



CREATE PROCEDURE [dbo].[uspLoadDimOpportunityPositionXREF]
AS

BEGIN
MERGE dbo.DimOpportunityPositionXREF tgt USING
(
	SELECT DISTINCT --TOP 1000 	6698715
			ISNULL(opp.FactOpportunityKey,-1) AS [FactOpportunityKey]
			,ISNULL(ass.AssociateKey,-1) AS [AssociateKey]
			,opp.EntityKey
			--,stg.lChildCompanyID
			,stg.lDealID
			,opp.Meta_OriginalDealID
			--,stg.lSalespersonID
			,stg.szFirstName
			,stg.szLastName
			,stg.bPrimaryDealAssociate
			,stg.nliPositionType
			,stg.szPositionType
			,stg.bPositionPrimary
			,stg.dwActive
			,stg.dtEntry
			,stg.dtLastEdit
			,stg.dtEntryOpportunity
			,stg.dtLastEditOpportunity
			,stg.Meta_NaturalKey
			,stg.Meta_ComputerName
			,stg.Meta_LoadDate
			,stg.Meta_RowLastChangeDate
			,stg.[Meta_SourceSystemName]
			,stg.Meta_SrcSysID
			,stg.User_ID
			,stg.ETLExecution_ID
			,stg.Meta_LastDMLAction
			,opp.Meta_RowIsCurrent
	FROM [ETL_Staging].[stage].[DimOpportunityPositionStaging] stg
	--  INNER JOIN
	--(
	--	SELECT Meta_NaturalKey, lDealID, lSalespersonID, nliPositionType, szPositionType, MAX(dtLastEdit) AS dtLastEditMax FROM [ETL_Staging].[stage].[DimOpportunityPositionStaging]
	--	GROUP BY Meta_NaturalKey, lDealID, lSalespersonID, nliPositionType, szPositionType
	--	--ORDER BY lDealSalespersonMapID, lDealID, lSalespersonID, nliPositionType, szPositionType
	--) mx
	--ON stg.Meta_NaturalKey = mx.Meta_NaturalKey
	--AND stg.lDealID = mx.lDealID
	--AND stg.lSalespersonID = mx.lSalespersonID
	--AND stg.nliPositionType = mx.nliPositionType
	--AND stg.szPositionType = mx.szPositionType
	--AND stg.dtLastEdit = mx.dtLastEditMax
	LEFT JOIN Sonic_DW.dbo.FactOpportunity opp
		ON stg.lDealID = CONVERT(INT,LTRIM(RTRIM(opp.Meta_OriginalDealID)))
	LEFT JOIN Sonic_DW.dbo.DimAssociate ass
		ON LTRIM(RTRIM(stg.szFirstName)) = LTRIM(RTRIM(ass.asoFirstName))
		AND LTRIM(RTRIM(stg.szLastName)) = LTRIM(RTRIM(ass.asoLastName))
	WHERE (stg.dtEntryOpportunity >=  DATEADD(DAY,-2,CONVERT(DATE,GETDATE())) OR stg.dtLastEditOpportunity >= DATEADD(DAY,-2,CONVERT(DATE,GETDATE())))
	AND ISNULL(stg.dwActiveOpportunity,1) = 1
	AND ass.Meta_RowIsCurrent = 'Y'
	AND opp.Meta_RowIsCurrent = 'Y'
	--AND ISNULL(opp.FactOpportunityKey,-1) <> -1
	--ORDER BY stg.dtEntry
) src
	ON tgt.FactOpportunityKey = src.FactOpportunityKey
	AND tgt.Meta_NaturalKey = src.Meta_NaturalKey
	AND tgt.AssociateKey = src.AssociateKey
	AND CONVERT(INT,LTRIM(RTRIM(tgt.Meta_OriginalDealID))) = CONVERT(INT,LTRIM(RTRIM(src.Meta_OriginalDealID)))
	AND src.Meta_RowIsCurrent = 'Y'

WHEN NOT MATCHED THEN INSERT
(
		 FactOpportunityKey
		,AssociateKey
		,FirstName
		,LastName
		,bPrimary
		,PositionTypeCode
		,PositionType
		,bPositionPrimary
		,dwActive
		,dtEntry
		,dtLastEdit
		,Meta_OriginalDealID
		,Meta_NaturalKey
		,Meta_ComputerName
		,Meta_LoadDate
		,Meta_RowLastChangeDate
		,Meta_SourceSystemName
		,Meta_SrcSysID
		,User_ID
		,ETLExecution_ID
		,Meta_LastDMLAction
)
VALUES
(
		 src.FactOpportunityKey
		,src.AssociateKey
		,src.szFirstName
		,src.szLastName
		,src.bPrimaryDealAssociate
		,src.nliPositionType
		,src.szPositionType
		,src.bPositionPrimary
		,src.dwActive
		,src.dtEntry
		,src.dtLastEdit
		,src.lDealID
		,src.Meta_NaturalKey
		,src.Meta_ComputerName
		,src.Meta_LoadDate
		,src.Meta_RowLastChangeDate
		,src.[Meta_SourceSystemName]
		,src.[Meta_SrcSysID]
		,src.User_ID
		,src.ETLExecution_ID
		,'I'
)

WHEN MATCHED AND
	(tgt.bPrimary <> src.bPrimaryDealAssociate
	OR tgt.PositionTypeCode <> src.nliPositionType
	OR tgt.PositionType <> src.szPositionType
	OR tgt.bPositionPrimary <> src.bPositionPrimary
	OR tgt.dwActive <> src.dwActive
	OR tgt.FirstName <> src.szFirstName
	OR tgt.LastName <> src.szLastName)
	AND ISNULL(src.EntityKey,-1) <> -1
	AND tgt.FactOpportunityKey <> -1
	--AND tgt.AssociateKey = src.AssociateKey
	--AND src.Meta_RowIsCurrent = 'Y'


THEN UPDATE SET
		 tgt.FirstName			= src.szFirstName
		,tgt.LastName			= src.szLastName
		,tgt.bPrimary			= src.bPrimaryDealAssociate
		,tgt.PositionTypeCode	= src.nliPositionType
		,tgt.PositionType		= src.szPositionType
		,tgt.bPositionPrimary	= src.bPositionPrimary
		,tgt.dwActive			= src.dwActive
		,tgt.Meta_RowLastChangeDate = GETDATE()
		,tgt.Meta_LastDMLAction	= 'U'
;


END
```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
