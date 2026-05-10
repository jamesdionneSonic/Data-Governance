---
name: vw_FactTrafficSummaryDaily
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
CREATE VIEW dbo.vw_FactTrafficSummaryDaily
AS
SELECT        tsd.FactTrafficSummaryDailyID, tsd.EntityKey, tsd.FiscalMonthDateKey AS DateKey, tsd.szNewUsed, tsd.LeadCount, tsd.ShowroomVisits, tsd.Bebacks, tsd.Sold, tsd.ApptCreated, tsd.ApptDue, tsd.ApptShown, tsd.ApptSold, 
                         tsd.ApptConfirmed, tsd.Demos, tsd.WriteUps, tsd.TOs, tsd.Appraisals, tsd.Lost, tsd.BadLead, tsd.BoughtElsewhere, tsd.Reassigned, tsd.Meta_LoadDate, tsd.ETLExecution_ID, tsd.Meta_ComputerName, tsd.Me
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
