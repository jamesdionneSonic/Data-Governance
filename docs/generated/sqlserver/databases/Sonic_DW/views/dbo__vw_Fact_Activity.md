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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

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

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
