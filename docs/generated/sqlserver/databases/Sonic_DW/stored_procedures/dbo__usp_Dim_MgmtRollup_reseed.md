---
name: usp_Dim_MgmtRollup_reseed
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
,MetaSrc_Sys_ID
,MetaSourceSystemName
,MetaRowEffectiveDate
,MetaRowExpiredDate
,MetaRowIsCurrent
,MetaRowLastChangedDate
,MetaAuditKey
,MetaNaturalKey
,MetaChecksum
	)
VALUES
(

-1  ,---------------,MgtLevel1Code
'Unknown',-------------,MgtLevel1Desc
-1  ,---------------,MgtLevel2Code
'Unknown',-------------,MgtLevel2Desc
-1  ,---------------,MgtLevel3Code
'Unknown',-------------,MgtLevel3Desc
-1  ,---------------,MgtLevel4Code
'Unknown',------------,MgtLevel4Desc
-1  ,---------------,MgtLevel5Code
'Unknown',------------,MgtLevel5Desc
-1  ,---------------,MgtLevel6Code
'Unknown',
-1,
'Unknown',-------------,MgtLevel7Desc
-1  ,---------------,MgtLevel8Code
'Unknown',------------,MgtLevel8Desc
-1  ,---------------,MgtLevel9Code
'Unknown',-------------,MgtLevel9Desc
-1  ,---------------,MgtLevel10Code
'Unknown',-------------,MgtLevel10Desc
-1  ,---------------,ETLExecution_ID
-1  ,---------------,MetaSrc_Sys_ID
'Unknown',-------------,MetaSourceSystemName
'99991231',---------------,MetaRowEffectiveDate
'99991231',---------------,MetaRowExpiredDate
-1  ,---------------,MetaRowIsCurrent
'99991231',---------------,MetaRowLastChangedDate
-1  ,---------------,MetaAuditKey
'Unknown',---------------,MetaNaturalKey
-1  ---------------,MetaChecksum
)
--GO

--DBCC checkident('Dim_MgmtRollup', RESEED, 0);
--GO


--SELECT *
--FROM dbo.Dim_MgmtRollup AS dc

----DELETE dbo.Dim_MgmtRollup

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
