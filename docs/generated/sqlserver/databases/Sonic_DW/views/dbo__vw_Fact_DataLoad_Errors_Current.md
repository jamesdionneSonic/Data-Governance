---
name: vw_Fact_DataLoad_Errors_Current
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




CREATE VIEW [dbo].[vw_Fact_DataLoad_Errors_Current]
AS
/*****************************************************************************************
DATE		USERNAME		DESCRIPTION
10-1-2013	NCARPENDER		modified script to allow nulls for missing values instead of defaulting to NA
*****************************************************************************************/
WITH 
		Expected_Step1 as 
					(
						SELECT DISTINCT 
						 Src.SourceName
							, tgt.TargetName
							, fac
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
