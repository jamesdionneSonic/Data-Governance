---
name: usp_Dim_SECRollup_reseed
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
,SecLev
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
