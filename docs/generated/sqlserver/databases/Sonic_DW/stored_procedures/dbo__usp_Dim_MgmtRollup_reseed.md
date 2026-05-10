---
name: usp_Dim_MgmtRollup_reseed
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

CREATE proc [dbo].[usp_Dim_MgmtRollup_reseed]
as

--DBCC checkident('Dim_MgmtRollup', RESEED, -2);
--GO


INSERT INTO [dbo].[Dim_MgmtRollup](

MgtLevel1Code
,MgtLevel1Desc
,MgtLevel2Code
,MgtLevel2Desc
,MgtLevel3Code
,MgtLevel3Desc
,MgtLevel4Code
,MgtLevel4Desc
,MgtLevel5Code
,MgtLevel5Desc
,MgtLevel6Code
,MgtLevel6Desc
,MgtLevel7Code
,MgtLevel7Desc
,MgtLevel8Code
,MgtLevel8Desc
,MgtLevel9Code
,MgtLevel9Desc
,MgtLevel10Code
,MgtLevel10Desc
,ETLExecution_ID
,MetaSr
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
