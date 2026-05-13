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
depends_on:
  - DimTrafficManagementNewUsed
  - DimUpType
  - FactTrafficSummarySubSource
dependency_count: 3
column_count: 41
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.DimTrafficManagementNewUsed** (U )
- **dbo.DimUpType** (U )
- **dbo.FactTrafficSummarySubSource** (U )

## Columns

| Name                     | Type     | Nullable | Description |
| ------------------------ | -------- | -------- | ----------- |
| `EntityKey`              | int      |          |             |
| `UpTypeKey`              | int      |          |             |
| `szNewUsed`              | varchar  | ✓        |             |
| `DateKey`                | int      |          |             |
| `LeadSourceKey`          | int      |          |             |
| `LeadSubSourceKey`       | int      |          |             |
| `LeadCount`              | int      | ✓        |             |
| `ShowroomVisits`         | int      | ✓        |             |
| `Bebacks`                | int      | ✓        |             |
| `Sold`                   | int      | ✓        |             |
| `ApptCreated`            | int      | ✓        |             |
| `ApptDue`                | int      | ✓        |             |
| `ApptShown`              | int      | ✓        |             |
| `ApptSold`               | int      | ✓        |             |
| `ApptConfirmed`          | int      | ✓        |             |
| `Demos`                  | int      | ✓        |             |
| `WriteUps`               | int      | ✓        |             |
| `TOs`                    | int      | ✓        |             |
| `Appraisals`             | int      | ✓        |             |
| `ApptAttemptedConfirmed` | int      | ✓        |             |
| `ApprApptCreated`        | int      | ✓        |             |
| `ApprApptDue`            | int      | ✓        |             |
| `ApprApptShown`          | int      | ✓        |             |
| `ApprApptAcquired`       | int      | ✓        |             |
| `ApprApptConfirmed`      | int      | ✓        |             |
| `Acquired`               | int      | ✓        |             |
| `IsAppraisalAppt`        | int      | ✓        |             |
| `BadLead`                | int      | ✓        |             |
| `Lost`                   | int      | ✓        |             |
| `BoughtElsewhere`        | int      | ✓        |             |
| `Reassigned`             | int      | ✓        |             |
| `Meta_Loaddate`          | datetime |          |             |
| `ETLExecution_ID`        | int      |          |             |
| `Meta_ComputerName`      | varchar  | ✓        |             |
| `Meta_UserID`            | varchar  | ✓        |             |
| `Meta_RowLastChangeDate` | datetime | ✓        |             |
| `NewUsedDesc`            | varchar  | ✓        |             |
| `szUpType`               | varchar  | ✓        |             |
| `SrcUpType`              | varchar  | ✓        |             |
| `Active`                 | bit      | ✓        |             |
| `Visits`                 | int      | ✓        |             |

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

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
