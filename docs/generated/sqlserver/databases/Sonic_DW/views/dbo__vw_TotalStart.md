---
name: vw_TotalStart
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







CREATE View [dbo].[vw_TotalStart] AS

/*********************************************************************************
Author: Sudip Karki
Description: Preps Start Other data sources to be loaded to StartTotalMORMetrics 

Change Log:  1. Created on 10.23.2018


*********************************************************************************/

WITH TotalStart
AS
(SELECT 
		SS.[StartMORSourceId] AS StartMetricsKey
		,[ASIKey] AS SourceMetricsKey
	   ,[EntityKey]
	
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
