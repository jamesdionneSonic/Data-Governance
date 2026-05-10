---
name: usp_Load_Fact_Activity_BK_0124
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





/************************************************************	
--
-- Created By ubs on 3/29/2016
-- Query to create FactActivity load data set
---- 3/28/16 ubs - first draft
---- 1/30/17 ubs - remove activities that are not linked to a deal
---- 11/7/17 ubs - removed "opp.ETLExecutionID = @ETLExecutionID" filter from MERGE
---- 12/5/17 ubs - added code to identify and save activities whose activity type has changed.
*************************************************************/
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
