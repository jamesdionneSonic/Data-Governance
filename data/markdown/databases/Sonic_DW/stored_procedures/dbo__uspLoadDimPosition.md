---
name: uspLoadDimPosition
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - DimPosition
dependency_count: 1
parameter_count: 0
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.DimPosition** (U )

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
		AND ISNULL(src.Meta_NaturalKey,-1) = ISNULL(tgt.Meta_NatrualKey,-1)
		AND src.Meta_SourceSystemName = tgt.Meta_SourceSystemName
		AND src.Meta_SrcSysID = tgt.Meta_SrcSysID

WHEN NOT MATCHED THEN INSERT
(
		 PositionTitle
		,PositionDescription
		,Meta_ComputerName
		,Meta_LoadDate
		,Meta_RowLastChangeDate
		,User_ID
		,Meta_NatrualKey
		,Meta_SourceSystemName
		,Meta_SrcSysID
)

VALUES
(
		 src.PositionTitle
		,src.PositionDescription
		,src.Meta_ComputerName
		,src.Meta_LoadDate
		,src.Meta_RowLastChangeDate
		,src.User_ID
		,src.Meta_NaturalKey
		,src.Meta_SourceSystemName
		,src.Meta_SrcSysID
)

WHEN MATCHED AND
		tgt.PositionDescription <> src.PositionDescription

THEN UPDATE SET
		 tgt.PositionTitle = src.PositionTitle
		,tgt.PositionDescription = src.PositionDescription
		,tgt.Meta_RowLastChangeDate = GETDATE()
;
END
```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
