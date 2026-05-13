---
name: usp_FactTrafficSummaryDailyDept
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - FactTrafficSummaryDailyDept
dependency_count: 1
parameter_count: 27
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.FactTrafficSummaryDailyDept** (U )

## Parameters

| Name                             | Type | Output | Default |
| -------------------------------- | ---- | ------ | ------- |
| `@FactTrafficSummaryDailyDeptID` | int  | No     | No      |
| `@LeadCount`                     | int  | No     | No      |
| `@ShowroomVisits`                | int  | No     | No      |
| `@Bebacks`                       | int  | No     | No      |
| `@Sold`                          | int  | No     | No      |
| `@ApptCreated`                   | int  | No     | No      |
| `@ApptDue`                       | int  | No     | No      |
| `@ApptShown`                     | int  | No     | No      |
| `@ApptSold`                      | int  | No     | No      |
| `@ApptConfirmed`                 | int  | No     | No      |
| `@Demos`                         | int  | No     | No      |
| `@WriteUps`                      | int  | No     | No      |
| `@TOs`                           | int  | No     | No      |
| `@Appraisals`                    | int  | No     | No      |
| `@Lost`                          | int  | No     | No      |
| `@BadLead`                       | int  | No     | No      |
| `@BoughtElsewhere`               | int  | No     | No      |
| `@Reassigned`                    | int  | No     | No      |
| `@ETLExecution_ID`               | int  | No     | No      |
| `@ApptAttemptedConfirmed`        | int  | No     | No      |
| `@ApprApptCreated`               | int  | No     | No      |
| `@ApprApptDue`                   | int  | No     | No      |
| `@ApprApptShown`                 | int  | No     | No      |
| `@ApprApptAcquired`              | int  | No     | No      |
| `@ApprApptConfirmed`             | int  | No     | No      |
| `@Acquired`                      | int  | No     | No      |
| `@IsAppraisalAppt`               | int  | No     | No      |

## Definition

```sql


CREATE   PROCEDURE [dbo].[usp_FactTrafficSummaryDailyDept]
    @FactTrafficSummaryDailyDeptID INT,
	@LeadCount INT,
    @ShowroomVisits INT,
	@Bebacks INT,
	@Sold INT,
	@ApptCreated INT,
	@ApptDue INT,
	@ApptShown INT,
	@ApptSold INT,
	@ApptConfirmed INT,
	@Demos INT,
	@WriteUps INT,
	@TOs INT,
	@Appraisals INT,
	@Lost INT,
	@BadLead INT,
	@BoughtElsewhere INT,
	@Reassigned INT,
	@ETLExecution_ID INT,
	@ApptAttemptedConfirmed INT,
	@ApprApptCreated INT,
	@ApprApptDue INT,
	@ApprApptShown INT,
	@ApprApptAcquired INT,
	@ApprApptConfirmed INT,
	@Acquired INT,
	@IsAppraisalAppt INT
AS
BEGIN
    SET NOCOUNT ON;

UPDATE	FactTrafficSummaryDailyDept
SET		LeadCount = @LeadCount
		,ShowroomVisits = @ShowroomVisits
		, Bebacks = @Bebacks
		, Sold = @Sold
		, ApptCreated = @ApptCreated
		, ApptDue = @ApptDue
		, ApptShown = @ApptShown
		, ApptSold = @ApptSold
		, ApptConfirmed = @ApptConfirmed
		, Demos = @Demos
		, WriteUps = @WriteUps
		, TOs = @TOs
		, Appraisals = @Appraisals
		, Lost = @Lost
		, BadLead = @BadLead
		, BoughtElsewhere = @BoughtElsewhere
		, Reassigned = @Reassigned
		, ETLExecution_ID = @ETLExecution_ID
		, Meta_ComputerName = HOST_NAME()
		, Meta_UserID = SYSTEM_USER
		, Meta_RowLastChangeDate = GETDATE()
		,ApptAttemptedConfirmed = @ApptAttemptedConfirmed
		,ApprApptCreated = @ApprApptCreated
		,ApprApptDue = @ApprApptDue
		,ApprApptShown = @ApprApptShown
		,ApprApptAcquired = @ApprApptAcquired
		,ApprApptConfirmed = @ApprApptConfirmed
		,Acquired = @Acquired
		,IsAppraisalAppt = @IsAppraisalAppt
WHERE	FactTrafficSummaryDailyDeptID = @FactTrafficSummaryDailyDeptID
;

END

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
