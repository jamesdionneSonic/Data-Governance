---
name: usp_FactTrafficSummary_TMR_Export
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

CREATE PROCEDURE [dbo].[usp_FactTrafficSummary_TMR_Export]
    @FactTrafficSummaryID int,
	@LeadCount INT,
    @ShowroomVisits int,
	@Bebacks int,
	@Sold int,
	@ApptCreated int,
	@ApptDue int,
	@ApptShown int,
	@ApptSold int,
	@ApptConfirmed int,
	@Demos int,
	@WriteUps int,
	@TOs int,
	@Appraisals int,
	@Lost int,
	@BadLead int,
	@BoughtElsewhere int,
	@Reassigned int,
	@ETLExecution_ID int
AS
BEGIN
    SET NOCOUNT ON;

update	FactTrafficSummary_TMR_Export
set		LeadCount = @LeadCount
		,ShowroomVisits = @ShowroomVisits
		, Bebacks = @Bebacks
		, Sold = @Sold
		, ApptCreated = @ApptCreated
		, ApptDue = @ApptDue
		, ApptShown = @ApptShown
		, ApptSold = @ApptSold
		, ApptConfirmed = ApptConfirmed
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
		, Meta_RowLastChangeDate = GetDate()
Where	FactTrafficSummaryID = @FactTrafficSummaryID
;

END


```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
