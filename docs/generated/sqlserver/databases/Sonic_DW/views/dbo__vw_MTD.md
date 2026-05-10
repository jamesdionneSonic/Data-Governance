---
name: vw_MTD
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
CREATE VIEW dbo.vw_MTD
AS
SELECT     dbo.vw_Dim_date.DateKey AS MTD_DateKey, vw_Dim_date_1.DateKey
FROM         dbo.vw_Dim_date CROSS JOIN
                      dbo.vw_Dim_date AS vw_Dim_date_1
WHERE     (dbo.vw_Dim_date.FullDate BETWEEN vw_Dim_date_1.Month_StartDate AND vw_Dim_date_1.FullDate) AND (vw_Dim_date_1.DateKey BETWEEN 
                      20080101 AND 20200101)

```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
