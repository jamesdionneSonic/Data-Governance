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
depends_on:
  - DimTrafficManagementNewUsed
  - FactTrafficSummaryDaily
dependency_count: 2
column_count: 57
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.DimTrafficManagementNewUsed** (U )
- **dbo.FactTrafficSummaryDaily** (U )

## Columns

| Name                        | Type     | Nullable | Description |
| --------------------------- | -------- | -------- | ----------- |
| `FactTrafficSummaryDailyID` | int      |          |             |
| `EntityKey`                 | int      | ✓        |             |
| `DateKey`                   | int      |          |             |
| `szNewUsed`                 | varchar  | ✓        |             |
| `LeadCount`                 | int      | ✓        |             |
| `ShowroomVisits`            | int      | ✓        |             |
| `Bebacks`                   | int      | ✓        |             |
| `Sold`                      | int      | ✓        |             |
| `ApptCreated`               | int      | ✓        |             |
| `ApptDue`                   | int      | ✓        |             |
| `ApptShown`                 | int      | ✓        |             |
| `ApptSold`                  | int      | ✓        |             |
| `ApptConfirmed`             | int      | ✓        |             |
| `Demos`                     | int      | ✓        |             |
| `WriteUps`                  | int      | ✓        |             |
| `TOs`                       | int      | ✓        |             |
| `Appraisals`                | int      | ✓        |             |
| `Lost`                      | int      | ✓        |             |
| `BadLead`                   | int      | ✓        |             |
| `BoughtElsewhere`           | int      | ✓        |             |
| `Reassigned`                | int      | ✓        |             |
| `Meta_LoadDate`             | datetime | ✓        |             |
| `ETLExecution_ID`           | int      | ✓        |             |
| `Meta_ComputerName`         | varchar  |          |             |
| `Meta_UserID`               | varchar  |          |             |
| `Meta_RowLastChangeDate`    | datetime | ✓        |             |
| `szUpType`                  | varchar  | ✓        |             |
| `ApptAttemptedConfirmed`    | int      | ✓        |             |
| `ApprApptCreated`           | int      | ✓        |             |
| `ApprApptDue`               | int      | ✓        |             |
| `ApprApptShown`             | int      | ✓        |             |
| `ApprApptAcquired`          | int      | ✓        |             |
| `ApprApptConfirmed`         | int      | ✓        |             |
| `Acquired`                  | int      | ✓        |             |
| `IsAppraisalAppt`           | int      | ✓        |             |
| `TextLeadCount`             | int      | ✓        |             |
| `TextOptInRequest`          | int      | ✓        |             |
| `TextNoOptInRequest`        | int      | ✓        |             |
| `TextOptIn`                 | int      | ✓        |             |
| `TextOptOut`                | int      | ✓        |             |
| `TextSent`                  | int      | ✓        |             |
| `TextReceived`              | int      | ✓        |             |
| `TextAppt`                  | int      | ✓        |             |
| `TextSold`                  | int      | ✓        |             |
| `NewUsedDesc`               | varchar  | ✓        |             |
| `SrcUpType`                 | varchar  | ✓        |             |
| `TextPhoneNumber`           | int      |          |             |
| `TextNoPhoneNumber`         | int      |          |             |
| `TextLeadCountNoPhone`      | int      | ✓        |             |
| `TextOptInRequestNoPhone`   | int      | ✓        |             |
| `TextNoOptInRequestNoPhone` | int      | ✓        |             |
| `TextOptInNoPhone`          | int      | ✓        |             |
| `TextOptOutNoPhone`         | int      | ✓        |             |
| `TextSentNoPhone`           | int      | ✓        |             |
| `TextReceivedNoPhone`       | int      | ✓        |             |
| `TextApptNoPhone`           | int      | ✓        |             |
| `TextSoldNoPhone`           | int      | ✓        |             |

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

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
