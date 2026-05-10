---
name: vw_Adjust
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

2- **Type**: View
- **Schema**: dbo

## Definition

```sql
CREATE VIEW dbo.vw_Adjust
AS
SELECT        e.EntityKey, e.EntDealerLvl1 AS Dealership, e.EntADPCompanyID, e.EntEssCode, d.CalendarYearMonth, d.FullDate AS AccountingDate, a.Level8, a.Level8_Description, 
                         CASE WHEN a.level7 LIKE '%Adjustment%' THEN 'Under 90 Days' WHEN a.level7 LIKE '%Chargeback%' THEN 'Over 90 Days' ELSE 'Unknown' END AS OverUnder90Days, fi.FIGLProductCategory, ee.EmployeeName, 
                         g.DetControl AS Control, g.DetControl2 AS Contr
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
