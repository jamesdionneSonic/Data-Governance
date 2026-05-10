---
name: vw_Dim_Quarter
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


/* Name: dbo.vw_Dim_Quarter
* Created by: Sonic Automotive
* Change Control:
* Date			Developer Name		Change Description
* 20250812		Hermann Brandi		Added column FiscalQuarterKey
* 20250829		Hermann Brandi		Added column FiscalQuarterKeyLY for transformations.
*
*/
CREATE   VIEW [dbo].[vw_Dim_Quarter]
AS
SELECT
	DISTINCT CAST(CAST(FiscalYear as varchar) + CAST(FiscalQuarter as varchar) AS INT) As FiscalQuarterKey
	, CAST(CAST(FiscalYear - 1 as VarChar) + CAST(FiscalQuarter as varcha
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
