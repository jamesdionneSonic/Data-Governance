---
name: uspLoad_FactMSCTasks
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

CREATE     PROCEDURE [dbo].[uspLoad_FactMSCTasks]

AS

BEGIN

UPDATE FMSCT SET
FMSCT.ManualCall = Stage.ManualCall, 
FMSCT.ManualCallCompleted = Stage.ManualCallCompleted, 
FMSCT.ScheduledCall = Stage.ScheduledCall, 
FMSCT.ScheduledCallCompleted = Stage.ScheduledCallCompleted, 
FMSCT.CallsChanged = Stage.CallsChanged, 
FMSCT.ManualEmail = Stage.ManualEmail, 
FMSCT.ManualEmailCompleted = Stage.ManualEmailCompleted, 
FMSCT.ScheduledEmail = Stage.ScheduledEmail, 
FMSCT.ScheduledEma
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
