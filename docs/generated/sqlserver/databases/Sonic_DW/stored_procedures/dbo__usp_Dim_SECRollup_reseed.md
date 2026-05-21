---
name: usp_Dim_SECRollup_reseed
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

CREATE proc [dbo].[usp_Dim_SECRollup_reseed]
as

--DBCC checkident('Dim_SECRollup', RESEED, -2);
--GO


INSERT INTO [dbo].[Dim_SECRollup](


SecLevel1Code
,SecLevel1Desc
,SecLevel2Code
,SecLevel2Desc
,SecLevel3Code
,SecLevel3Desc
,SecLevel4Code
,SecLevel4Desc
,SecLevel5Code
,SecLevel5Desc
,SecLevel6Code
,SecLevel6Desc
,SecLevel7Code
,SecLevel7Desc
,SecLevel8Code
,SecLevel8Desc
,SecLevel9Code
,SecLevel9Desc
,SecLevel10Code
,SecLevel10Desc
,SecLevel11Code
,SecLevel11Desc
,SecLevel12Code
,SecLevel12Desc
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
-1  ,---------------,MgtLevel11Code
'Unknown',-------------,MgtLevel11Desc
-1  ,---------------,MgtLevel12Code
'Unknown',-------------,MgtLevel12Desc
-1  ,---------------,ETLExecution_ID
-1  ,---------------,,MetaSrc_Sys_ID
'Unknown',-------------,,MetaSourceSystemName
'99991231',---------------,,MetaRowEffectiveDate
'99991231',---------------,,MetaRowExpiredDate
-1  ,---------------,,MetaRowIsCurrent
'99991231',---------------,,MetaRowLastChangedDate
-1  ,---------------,,MetaAuditKey
'Unknown',---------------,,MetaNaturalKey
-1  ---------------,,MetaChecksum
)
--GO

--DBCC checkident('Dim_SECRollup', RESEED, 0);
--GO


--SELECT *
--FROM dbo.Dim_SECRollup AS dc

----DELETE dbo.Dim_SECRollup


```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
