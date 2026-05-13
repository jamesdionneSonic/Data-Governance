---
name: vw_Fact_Activity
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - FactActivity
dependency_count: 1
column_count: 65
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.FactActivity** (U )

## Columns

| Name                             | Type      | Nullable | Description |
| -------------------------------- | --------- | -------- | ----------- |
| `FactActivityKey`                | bigint    |          |             |
| `EntityKey`                      | int       |          |             |
| `LeadStatusKey`                  | int       |          |             |
| `CreatedOnDateKey`               | int       |          |             |
| `CreatedOnTimeKey`               | int       |          |             |
| `SourceKey`                      | int       |          |             |
| `OpportunityCreatedOnDateKey`    | int       |          |             |
| `CreatedByKey`                   | int       |          |             |
| `ActivityTypeKey`                | int       |          |             |
| `WorkflowKey`                    | int       |          |             |
| `ActivityStatusKey`              | int       |          |             |
| `OpportunityNaturalKey`          | varchar   |          |             |
| `ScheduledStartTimeKey`          | int       |          |             |
| `ScheduledEndTimeKey`            | int       |          |             |
| `ActualStartTimeKey`             | int       |          |             |
| `ActualEndDateKey`               | int       |          |             |
| `ActualEndTimeKey`               | int       |          |             |
| `ModifiedOnDateKey`              | int       |          |             |
| `NextActivityDateDueKey`         | int       |          |             |
| `ScheduledStartDateKey`          | int       |          |             |
| `ActualStartDateKey`             | int       |          |             |
| `ScheduledEndDateKey`            | int       |          |             |
| `ScheduledByKey`                 | int       |          |             |
| `ConfirmedByKey`                 | int       |          |             |
| `CompletedByKey`                 | int       |          |             |
| `ModifiedByKey`                  | int       |          |             |
| `ModifiedOnBehalfByKey`          | int       |          |             |
| `CreatedOnBehalfBykey`           | int       |          |             |
| `VehicleKey`                     | int       |          |             |
| `ActivityCount`                  | int       |          |             |
| `ActualDurationMinutes`          | int       | ✓        |             |
| `AccessoriesPresentedFlag`       | smallint  | ✓        |             |
| `ActivityIsPartOfProcessFlag`    | smallint  | ✓        |             |
| `AppointmentMadeFlag`            | smallint  | ✓        |             |
| `AppraisalCompletedFlag`         | smallint  | ✓        |             |
| `ActivityAttemptedFlag`          | smallint  | ✓        |             |
| `ActivityAutoClosedFlag`         | smallint  | ✓        |             |
| `BypassFollowupFlag`             | smallint  | ✓        |             |
| `CallCenterFlag`                 | smallint  | ✓        |             |
| `ConfirmationSentFlag`           | smallint  | ✓        |             |
| `ConfirmedFlag`                  | smallint  | ✓        |             |
| `ContactSinceFlag`               | smallint  | ✓        |             |
| `CreateNextActivityFlag`         | smallint  | ✓        |             |
| `DemoFlag`                       | smallint  | ✓        |             |
| `ESalesFlag`                     | smallint  | ✓        |             |
| `IsAutomatedFlag`                | smallint  | ✓        |             |
| `LifestyleProductsPresentedFlag` | smallint  | ✓        |             |
| `MetManagerFlag`                 | smallint  | ✓        |             |
| `SIMSReserveVehicleFlag`         | smallint  | ✓        |             |
| `StopWorkflowFlag`               | smallint  | ✓        |             |
| `WriteUpFlag`                    | smallint  | ✓        |             |
| `Meta_ComputerName`              | varchar   |          |             |
| `Meta_LoadDate`                  | datetime2 | ✓        |             |
| `Meta_AuditScore`                | int       | ✓        |             |
| `Meta_SrcSysID`                  | int       | ✓        |             |
| `Meta_SourceSystemName`          | varchar   | ✓        |             |
| `Meta_RowEffectiveDate`          | datetime2 | ✓        |             |
| `Meta_RowExpiredDate`            | datetime2 | ✓        |             |
| `Meta_RowIsCurrent`              | char      | ✓        |             |
| `Meta_RowLastChangedDate`        | datetime2 | ✓        |             |
| `Meta_NaturalKey`                | varchar   | ✓        |             |
| `Meta_Checksum`                  | int       | ✓        |             |
| `ETLExecution_ID`                | int       |          |             |
| `ScribeDeletedOn`                | datetime2 | ✓        |             |
| `FactOpportunityKey`             | bigint    | ✓        |             |

## Definition

```sql

CREATE VIEW [dbo].[vw_Fact_Activity]
AS
SELECT        FactActivityKey, EntityKey, LeadStatusKey, CreatedOnDateKey, CreatedOnTimeKey, SourceKey, OpportunityCreatedOnDateKey, CreatedByKey, ActivityTypeKey, WorkflowKey, ActivityStatusKey,
                         OpportunityNaturalKey, ScheduledStartTimeKey, ScheduledEndTimeKey, ActualStartTimeKey, ActualEndDateKey, ActualEndTimeKey, ModifiedOnDateKey, NextActivityDateDueKey, ScheduledStartDateKey,
                         ActualStartDateKey, ScheduledEndDateKey, ScheduledByKey, ConfirmedByKey, CompletedByKey, ModifiedByKey, ModifiedOnBehalfByKey, CreatedOnBehalfBykey, VehicleKey, ActivityCount,
                         ActualDurationMinutes, AccessoriesPresentedFlag, ActivityIsPartOfProcessFlag, AppointmentMadeFlag, AppraisalCompletedFlag, ActivityAttemptedFlag, ActivityAutoClosedFlag, BypassFollowupFlag,
                         CallCenterFlag, ConfirmationSentFlag, ConfirmedFlag, ContactSinceFlag, CreateNextActivityFlag, DemoFlag, ESalesFlag, IsAutomatedFlag, LifestyleProductsPresentedFlag, MetManagerFlag,
                         SIMSReserveVehicleFlag, StopWorkflowFlag, WriteUpFlag, Meta_ComputerName, Meta_LoadDate, Meta_AuditScore, Meta_SrcSysID, Meta_SourceSystemName, Meta_RowEffectiveDate, Meta_RowExpiredDate,
                         Meta_RowIsCurrent, Meta_RowLastChangedDate, Meta_NaturalKey, Meta_Checksum, ETLExecution_ID, ScribeDeletedOn, FactOpportunityKey
FROM            dbo.FactActivity

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
