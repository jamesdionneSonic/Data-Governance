---
name: usp_LoadDimDMSLegacyDealXREF
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

/************************************************************	 exec [dbo].[usp_LoadDimDMSLegacyDealXREF] 

 Created:  DMD on 8/3/2019
 
 CHANGE LOG:
 9/25/2019:	DMD - Added a DISTINCT in source query for MERGE and added Meta_NaturalKey in JOIN for dupes

*************************************************************/
CREATE PROCEDURE [dbo].[usp_LoadDimDMSLegacyDealXREF]
AS

SET NOCOUNT ON;

BEGIN

MERGE dbo.DimDMSLegacyDealXREF AS tgt
	USING	(
				SELECT DISTINCT 	 
						 opp
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
