---
name: vw_Fact_GLSchedule
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
/*************************************************************************************************************

*- Updated RAJ 04/02/2015 added new column Meta_LoadDate

***************************************************************************************************************/
CREATE VIEW dbo.vw_Fact_GLSchedule
AS
SELECT        dbo.Fact_GLSchedule.GLSchedKey, dbo.Fact_GLSchedule.EntityKey, dbo.Fact_GLSchedule.AccountKey, dbo.Fact_GLSchedule.CurrentMonthKey, dbo.Fact_GLSchedule.Accoun
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
