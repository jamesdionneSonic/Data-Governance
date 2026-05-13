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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Definition

```sql
CREATE VIEW dbo.vw_FactTrafficSummaryDaily
AS
SELECT        tsd.FactTrafficSummaryDailyID, tsd.EntityKey, tsd.FiscalMonthDateKey AS DateKey, tsd.szNewUsed, tsd.LeadCount, tsd.ShowroomVisits, tsd.Bebacks, tsd.Sold, tsd.ApptCreated, tsd.ApptDue, tsd.ApptShown, tsd.ApptSold,
                         tsd.ApptConfirmed, tsd.Demos, tsd.WriteUps, tsd.TOs, tsd.Appraisals, tsd.Lost, tsd.BadLead, tsd.BoughtElsewhere, tsd.Reassigned, tsd.Meta_LoadDate, tsd.ETLExecution_ID, tsd.Meta_ComputerName, tsd.Meta_UserID,
                         tsd.Meta_RowLastChangeDate, tsd.szUpType, tsd.ApptAttemptedConfirmed, tsd.ApprApptCreated, tsd.ApprApptDue, tsd.ApprApptShown, tsd.ApprApptAcquired, tsd.ApprApptConfirmed, tsd.Acquired, tsd.IsAppraisalAppt,
                         tsd.TextLeadCount, tsd.TextOptInRequest, tsd.TextNoOptInRequest, tsd.TextOptIn, tsd.TextOptOut, tsd.TextSent, tsd.TextReceived, tsd.TextAppt, tsd.TextSold, dbo.DimTrafficManagementNewUsed.NewUsedDesc,
                         REPLACE(tsd.szUpType, ' Up', '') AS SrcUpType, 0 AS TextPhoneNumber, 0 AS TextNoPhoneNumber, tsd.TextLeadCountNoPhone, tsd.TextOptInRequestNoPhone, tsd.TextNoOptInRequestNoPhone, tsd.TextOptInNoPhone,
                         tsd.TextOptOutNoPhone, tsd.TextSentNoPhone, tsd.TextReceivedNoPhone, tsd.TextApptNoPhone, tsd.TextSoldNoPhone
FROM            dbo.FactTrafficSummaryDaily AS tsd INNER JOIN
                         dbo.DimTrafficManagementNewUsed ON tsd.szNewUsed = dbo.DimTrafficManagementNewUsed.NewUsedID

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
