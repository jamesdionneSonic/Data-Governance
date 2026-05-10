---
name: usp_FactTrafficSummaryDailyDept
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
extracted_at: 2026-05-09T12:34:14.349Z
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
	@ApprApptDue IN
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
