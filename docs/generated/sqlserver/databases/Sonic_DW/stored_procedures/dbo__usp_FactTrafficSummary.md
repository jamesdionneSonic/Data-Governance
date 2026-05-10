---
name: usp_FactTrafficSummary
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
CREATE PROCEDURE [dbo].[usp_FactTrafficSummary]
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
	@ETLExecution_ID int,	
	@ApptAttemptedConfirmed int,
	@ApprApptCreated int,
	@ApprApptDue int,
	@ApprApptShown int
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
