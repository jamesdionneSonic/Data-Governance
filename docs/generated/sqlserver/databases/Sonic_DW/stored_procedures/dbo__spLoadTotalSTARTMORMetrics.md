---
name: spLoadTotalSTARTMORMetrics
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




CREATE PROC [dbo].[spLoadTotalSTARTMORMetrics]
AS 

/*********************************************************************************
Author: Sudip Karki
Description: Merges Start Other data sources to StartTotalMORMetrics table

Change Log:  1. Created on 10.23.2018


*********************************************************************************/

BEGIN
DECLARE @Summary TABLE ( [Action] VARCHAR(20));
--DECLARE @Inserts INT, @Updates INT;


MERGE StartTotalMORMetrics
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
