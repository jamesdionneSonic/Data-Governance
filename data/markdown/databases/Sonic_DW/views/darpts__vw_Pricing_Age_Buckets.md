---
name: vw_Pricing_Age_Buckets
database: Sonic_DW
type: view
schema: darpts
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T20:14:33.860Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: darpts

## Definition

```sql



CREATE VIEW [darpts].[vw_Pricing_Age_Buckets]
AS
WITH age_buckets
AS (
	SELECT *
	FROM (
		VALUES ('<10')
			,('10-16')
			,('17-23')
			,('24-30')
			,('31-37')
			,('38-44')
			,('45-51')
			,('52-58')
			,('59+')
		) AS a(bucket)
	)
SELECT DISTINCT cast(getdate() AS DATE) AS TodaysDate
	,Market
	,bucket
	,bm.business_model_type_nm
FROM [D1-DASQL-01,11010].[DA_Group].rpt.Pricing_Report_Main_Full
CROSS JOIN age_buckets
CROSS JOIN (SELECT business_model_type_nm
	FROM [D1-DASQL-01,11010].[DA_Group].src.dim_business_model_type
	WHERE active=1)bm
WHERE market IS NOT NULL
	AND market <> 'Tactical'
	AND market <> 'Alfa Romeo'

```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
