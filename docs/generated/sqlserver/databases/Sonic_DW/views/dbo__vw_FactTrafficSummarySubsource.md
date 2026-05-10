---
name: vw_FactTrafficSummarySubsource
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

CREATE VIEW [dbo].[vw_FactTrafficSummarySubsource]
AS
SELECT        tsss.EntityKey, tsss.UpTypeKey, tsss.szNewUsed, tsss.EventDateKey AS DateKey, tsss.LeadSourceKey, tsss.LeadSubSourceKey, tsss.LeadCount, tsss.ShowroomVisits, tsss.Bebacks, tsss.Sold, tsss.ApptCreated, 
                         tsss.ApptDue, tsss.ApptShown, tsss.ApptSold, tsss.ApptConfirmed, tsss.Demos, tsss.WriteUps, tsss.TOs, tsss.Appraisals, tsss.ApptAttemptedConfirmed, tsss.ApprApptCreated, tsss.ApprApptDue, tsss.ApprApp
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
