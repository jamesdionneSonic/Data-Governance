---
name: usp_eLeadProjectionMerge
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on: []
dependency_count: 0
parameter_count: 0
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Definition

```sql

CREATE PROCEDURE [dbo].usp_eLeadProjectionMerge
AS


	MERGE [Sonic_DW].[dbo].[Fact_elead_projections] AS T
	USING [Sonic_DW].[dbo].[vw_elead_projections_live] AS S
	ON (T.EntityKey = S.EntityKey AND T.NewUsed = S.NewUsed)
	WHEN MATCHED THEN
	UPDATE SET [FiscalMonthKey] = S.FiscalMonthKey
				,[Tracking] = S.Tracking
				,[LeadCountTY] = S.LeadCountTY

	WHEN NOT MATCHED BY TARGET

	THEN INSERT
		([EntityKey]
		,[FiscalMonthKey]
		,[NewUsed]
		,[Tracking]
		,[LeadCountTY]
		,[EleadsDMSSold]
		)
	VALUES
		(S.EntityKey
		,S.FiscalMonthKey
		,S.NewUsed
		,S.Tracking
		,S.LeadCountTY
		,S.EleadsDMSSold);
```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
