---
name: spUpdateTotalStartFlag
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





CREATE PROC [dbo].[spUpdateTotalStartFlag]

AS 
/*********************************************************************************
Author: Sudip Karki
Description: Updates Start Other data sources LoadProcessed Flag 

Change Log:  1. Created on 10.23.2018


*********************************************************************************/

BEGIN 

-- Tag the processed records 

UPDATE SRC
SET SRC.[Load_Processed] = 1
	FROM [Sonic_DW].[dbo].[Fact_ASI] AS SRC
	INNER JO
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
