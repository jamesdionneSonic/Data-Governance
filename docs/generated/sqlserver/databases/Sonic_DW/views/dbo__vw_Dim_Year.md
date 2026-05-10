---
name: vw_Dim_Year
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

/* Name: dbo.vw_Dim_Year
* Created by: Sonic Automotive
* Change Control:
* Date			Developer Name		Change Description
* 20250829		Hermann Brandi		Added column FiscalYearLY for transformations.
*
*/

CREATE VIEW [dbo].[vw_Dim_Year]
AS
SELECT     TOP (100) PERCENT FiscalYear,  FiscalYear -1 AS FiscalYearLY, CAST(DATEADD(month, (FiscalYear - 1900) * 12, 0) AS DATETIME) AS FiscalYearDate, CAST(DATEADD(month, 
                      (FiscalYear + 1 - 1900) * 12, 0) AS DATETIME) - 1 AS FiscalYea
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
