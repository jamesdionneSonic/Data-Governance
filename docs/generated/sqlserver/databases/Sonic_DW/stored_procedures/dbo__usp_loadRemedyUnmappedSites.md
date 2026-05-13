---
name: usp_loadRemedyUnmappedSites
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




CREATE PROC [dbo].[usp_loadRemedyUnmappedSites]
AS

/*********************************************************

Author: Sudip Karki
Description: Merges Unmapped SiteIds from RemedyTicketData to DimRemedyUnmappedSites
Log:    Created on: 11.09.2018


***********************************************************/

BEGIN


; WITH UnmappedSites AS
(
SELECT DISTINCT RTD.TicketNumber,
				 RTD.Site_ID ,
				 0 AS DWProcessed,
				 RTD.TicketNumber AS Meta_NaturalKey,
				 RTD.Meta_SourceSystemName,
				 RTD.Meta_Src_Sys_ID,
				 RTD.User_ID
	FROM ETL_Staging.stage.FactRemedyTicketData  AS RTD
	LEFT JOIN Sonic_DW.dbo.DimEntityRelationship AS DER
	ON RTRIM(LTRIM(DER.AttributeField)) = LTRIM(RTRIM(RTD.Site_ID))
	LEFT JOIN Sonic_DW.dbo.DimEntityRelationshipType AS DERT
	ON DERT.RelationshipTypeGuid = DER.RelationshipTypeGuid
	AND DERT.RelationshipType = 'Faster'
WHERE DER.RelationshipGuid IS NULL
	AND RTD.Site_ID IS NOT NULL
)

MERGE Sonic_DW.dbo.DimRemedyUnmappedSites AS TGT
USING UnmappedSites AS SRC
ON SRC.TicketNumber = TGT.TicketNumber

WHEN NOT MATCHED THEN
INSERT
(
	TicketNumber,
	Site_ID,
	DWProcessed,
	Meta_LoadDate,
	Meta_NaturalKey,
	Meta_RowLastChangeDate,
	Meta_SourceSystemName,
	Meta_Src_Sys_ID,
	[User_ID]
)
VALUES
(
	SRC.TicketNumber,
	SRC.Site_ID,
	SRC.DWProcessed,
	GETDATE(),
	SRC.Meta_NaturalKey,
	GETDATE(),
	SRC.Meta_SourceSystemName,
	SRC.Meta_Src_Sys_ID,
	SRC.[User_ID]
)

WHEN MATCHED AND TGT.Site_ID != SRC.Site_ID THEN UPDATE SET

	TGT.Site_ID	= SRC.Site_ID,
	TGT.Meta_NaturalKey	=	SRC.Meta_NaturalKey,
	TGT.Meta_RowLastChangeDate	=	GETDATE(),
	TGT.Meta_SourceSystemName	= SRC.Meta_SourceSystemName,
	TGT.Meta_Src_Sys_ID	= SRC.Meta_Src_Sys_ID,
	TGT.[User_ID]	= SRC.[User_ID];


END


```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
