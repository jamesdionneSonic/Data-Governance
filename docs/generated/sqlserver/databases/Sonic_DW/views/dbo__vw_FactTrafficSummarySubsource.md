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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Definition

```sql

CREATE VIEW [dbo].[vw_FactTrafficSummarySubsource]
AS
SELECT        tsss.EntityKey, tsss.UpTypeKey, tsss.szNewUsed, tsss.EventDateKey AS DateKey, tsss.LeadSourceKey, tsss.LeadSubSourceKey, tsss.LeadCount, tsss.ShowroomVisits, tsss.Bebacks, tsss.Sold, tsss.ApptCreated,
                         tsss.ApptDue, tsss.ApptShown, tsss.ApptSold, tsss.ApptConfirmed, tsss.Demos, tsss.WriteUps, tsss.TOs, tsss.Appraisals, tsss.ApptAttemptedConfirmed, tsss.ApprApptCreated, tsss.ApprApptDue, tsss.ApprApptShown,
                         tsss.ApprApptAcquired, tsss.ApprApptConfirmed, tsss.Acquired, tsss.IsAppraisalAppt, tsss.BadLead, tsss.Lost, tsss.BoughtElsewhere, tsss.Reassigned, tsss.Meta_Loaddate, tsss.ETLExecution_ID, tsss.Meta_ComputerName,
                         tsss.Meta_UserID, tsss.Meta_RowLastChangeDate, dbo.DimTrafficManagementNewUsed.NewUsedDesc, ut.szUpType, REPLACE(ut.szUpType, ' Up', '') AS SrcUpType, tsss.Active,tsss.Visits
FROM            dbo.FactTrafficSummarySubSource AS tsss LEFT OUTER JOIN
                         dbo.DimUpType AS ut ON tsss.UpTypeKey = ut.UpTypeKey LEFT OUTER JOIN
                         dbo.DimTrafficManagementNewUsed ON tsss.szNewUsed = dbo.DimTrafficManagementNewUsed.NewUsedID
WHERE        (ISNULL(tsss.Active, 1) = 1)

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
