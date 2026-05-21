---
name: usp_FactTrafficSummaryDailyDept
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
dependency_count: 0
parameter_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

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

- **Last Extracted**: 2026-05-12T12:28:27.721Z
