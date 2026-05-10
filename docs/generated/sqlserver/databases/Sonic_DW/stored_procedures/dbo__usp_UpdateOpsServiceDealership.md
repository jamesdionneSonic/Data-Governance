---
name: usp_UpdateOpsServiceDealership
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



--exec usp_UpdateOpsServiceDealership 190, 260, 1530, 12347,0

CREATE Procedure [dbo].[usp_UpdateOpsServiceDealership]  
--@OldEntityKey int,
@EntityKey int,
@OpsReviewItemID int,
@TicketNumber varchar(20),
@DeleteFlag int



as

SET NoCount On
DECLARE @ConsecDays int

--DELETE Duplicates--
select distinct A.EntityKey,A.OpsReviewItemID,min(ConsecDays) as ConsecDays,a.EntityType,Max(a.TicketNumber) as TicketNumber into #OpsServiceDealershipTemp from 
  [Sonic_DW].[dbo].[Op
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
