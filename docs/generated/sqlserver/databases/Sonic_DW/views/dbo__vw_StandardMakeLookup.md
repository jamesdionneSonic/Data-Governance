---
name: vw_StandardMakeLookup
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
extracted_at: 2026-05-09T12:34:14.349Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Definition

```sql

--- Updated by Raj on --01/11/2013-------
--- Modified: Jo Carter		Date: 2017-11-29	Changed to use synonyms
--- RJ - Removed the active filter and added row number to get the latest records from DMS -  2026-02-18

CREATE   view [dbo].[vw_StandardMakeLookup]
as 

WITH cte_Make AS (
SELECT DISTINCT
            v.VehMakeCode
           ,m.[StandardMakeCode]
           ,CASE WHEN m.[StandardMakeCode] = 'FRT' THEN 'Freightliner'
                 WHEN m.[StandardMakeCode] = 'GENNV' THEN 
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
