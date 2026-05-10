---
name: vw_Dim_OpCode
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

1- **Type**: View
- **Schema**: dbo

## Definition

```sql


/***********************************************************************
* - Updated by Jonathan Henin
* - Updated 02/18/2014
* - Used by MicroStrategy
*
*
***********************************************************************
*/

CREATE VIEW [dbo].[vw_Dim_OpCode]
AS
SELECT        a.OpCodeKey, a.OpcCoraAcctId, a.OpcOpCode, a.OpcOpCodeDescription_Original, a.OpcOpCodeDescription, OPC.OpcOpCodeCategory, 
                         CASE WHEN OPC.OpcOpCodeCategory LIKE 'LOF%' THEN 'LO
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
