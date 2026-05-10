---
name: usp_Load_FactOpportunity
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

/************************************************************	 exec [dbo].[usp_Load_FactOpportunity] 9299
-- Created By ubs on 5/24/2016
-- Load query to create FactOpportunity dw data set
---- 5/24/16 ubs - first draft 
---- 6/22/16 ubs - added MetaActionFlag filter to "NOT MATCHED" section
---- 12/7/16 ubs - added code to update FactOpportunityKey in FactActivity records after MERGE.
---- 03/12/2018 - RAJ - added few columns in the merge statement for the factopportunity
---- 08/13/20
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
