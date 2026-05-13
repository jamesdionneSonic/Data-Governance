---
name: usp_DOC_Get_Entity
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
dependency_count: 0
parameter_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
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
					---AND EntLineOfBusiness <> 'EchoPark'---- commented out to get the EchoPark stores- Raj 09/04/2018
				) e
			WHERE D.DateKey BETWEEN @DateKeyStart
					AND @DateKeyEnd
			)

	SELECT ae.EntityKey
		,ae.EntName
		,ae.DateKey
	FROM AllEntities ae
	JOIN [dbo].[Doc_Projection_Schedule] s ON ae.DocRolloverFlag = s.DocRolloverFlag
		AND IsWeekend = 'N'
	WHERE NOT EXISTS (
			SELECT *
			FROM Doc_Record dr
			WHERE ae.EntityKey = dr.EntityKey
				AND ae.DateKey = dr.DocDateKey
			)
	ORDER BY DateKey
	SET NOCOUNT OFF

	END






```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
