---
name: usp_FactTrafficSummary_TMR_Export
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - Facttrafficsummary_TMR_Export
dependency_count: 1
parameter_count: 19
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.Facttrafficsummary_TMR_Export** (U )

## Parameters

| Name                    | Type | Output | Default |
| ----------------------- | ---- | ------ | ------- |
| `@FactTrafficSummaryID` | int  | No     | No      |
| `@LeadCount`            | int  | No     | No      |
| `@ShowroomVisits`       | int  | No     | No      |
| `@Bebacks`              | int  | No     | No      |
| `@Sold`                 | int  | No     | No      |
| `@ApptCreated`          | int  | No     | No      |
| `@ApptDue`              | int  | No     | No      |
| `@ApptShown`            | int  | No     | No      |
| `@ApptSold`             | int  | No     | No      |
| `@ApptConfirmed`        | int  | No     | No      |
| `@Demos`                | int  | No     | No      |
| `@WriteUps`             | int  | No     | No      |
| `@TOs`                  | int  | No     | No      |
| `@Appraisals`           | int  | No     | No      |
| `@Lost`                 | int  | No     | No      |
| `@BadLead`              | int  | No     | No      |
| `@BoughtElsewhere`      | int  | No     | No      |
| `@Reassigned`           | int  | No     | No      |
| `@ETLExecution_ID`      | int  | No     | No      |

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

- **Last Extracted**: 2026-05-13T11:28:24.843Z
