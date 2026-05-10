---
name: uspLoadDimPosition
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



CREATE PROCEDURE [dbo].[uspLoadDimPosition]
AS

BEGIN
MERGE dbo.DimPosition tgt USING 
(
SELECT 	PositionTitle
		,PositionDescription
		,Meta_ComputerName
		,Meta_LoadDate
		,Meta_RowLastChangeDate
		,User_ID
		,Meta_NaturalKey 
		,Meta_SourceSystemName
		,Meta_SrcSysID
FROM ETL_Staging.stage.DimPositionStaging
WHERE Meta_NaturalKey IS NOT NULL
) src
		ON LTRIM(RTRIM(src.PositionTitle)) = LTRIM(RTRIM(tgt.PositionKey))
		AND ISNULL(src.Meta_NaturalKey,-1) = ISNULL(tgt.Met
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
