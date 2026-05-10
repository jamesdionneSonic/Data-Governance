---
name: usp_DOC_Get_Entity
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




CREATE PROCEDURE [dbo].[usp_DOC_Get_Entity] @DateKeyStart INT
	,@DateKeyEnd INT
AS
BEGIN
	WITH AllEntities AS (
			SELECT e.EntityKey
				,e.EntName
				,D.DateKey
				,D.DocRolloverFlag
				,D.IsWeekend
			FROM dbo.Dim_Date D
			CROSS JOIN (
				SELECT DISTINCT EntityKey
					,EntName
				FROM dim_entity
				WHERE EntDOCReportFlag = 'active'
					AND EntDefaultDlrshpLvl2 = 1
					---AND EntLineOfBusiness <> 'EchoPark'---- commented out to get the EchoPark stores- Raj 09
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
