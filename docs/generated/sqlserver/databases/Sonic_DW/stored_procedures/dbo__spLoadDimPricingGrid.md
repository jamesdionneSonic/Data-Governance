---
name: spLoadDimPricingGrid
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

/*****************************************************************************************
-- CHANGE LOG
-- 07/03/2019:	DMD - Created procedure
*****************************************************************************************/

--EXEC [dbo].[spLoadDimPricingGrid]


CREATE PROC [dbo].[spLoadDimPricingGrid]
AS 

with CTE as
(select 
	cora_acct_id,gridname,begsoldhrs,GridDollarsActual,centincrement,convert(date,rowlastupdated ) as rowlastupdated
from 
	ETL_Staging.wrk.DMS_P
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
