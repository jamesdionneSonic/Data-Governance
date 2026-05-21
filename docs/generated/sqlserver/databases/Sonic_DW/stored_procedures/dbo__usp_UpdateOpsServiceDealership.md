---
name: usp_UpdateOpsServiceDealership
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
  [Sonic_DW].[dbo].[OpsServiceDealership] A
  join (  SELECT entitykey,
              OpsReviewItemID--,
             -- count(entitykey)
  FROM [Sonic_DW].[dbo].[OpsServiceDealership]
  group by EntityKey,
  OpsReviewItemID
  having count(entitykey)>1) as B
  on A.EntityKey = B.EntityKey
  and A.OpsReviewItemID = B.OpsReviewItemID
  group by A.EntityKey,A.OpsReviewItemID,A.EntityType
  order by A.OpsReviewItemID,A.EntityKey

  --Select * from #OpsServiceDealershipTemp


  Delete B
  from [Sonic_DW].[dbo].[OpsServiceDealership] B
  join #OpsServiceDealershipTemp A
  on A.EntityKey = B.EntityKey
  and A.OpsReviewItemID = B.OpsReviewItemID

  Insert into [Sonic_DW].[dbo].[OpsServiceDealership]
  select distinct * from #OpsServiceDealershipTemp

  Drop table #OpsServiceDealershipTemp


SET @ConsecDays = isnull((SELECT (sd.ConsecDays + 1) FROM	dbo.OpsReviewItem AS i INNER JOIN
															dbo.OpsServiceDealership AS sd ON i.OpsReviewItemID = sd.OpsReviewItemID INNER JOIN
															dbo.vw_OpsReview AS r ON i.OpsReviewID = r.OpsReviewID INNER JOIN
															dbo.Dim_Date AS d ON d.DateKey = r.DateKey
													 WHERE	sd.EntityKey = @EntityKey AND
															i.ServiceID = (SELECT i1.ServiceID FROM dbo.OpsReviewItem i1 WHERE i1.OpsReviewItemID = @OpsReviewItemID) AND
															i.OpsReviewID = (SELECT max(r1.OpsReviewID) FROM	dbo.vw_OpsReview r1 INNER JOIN
																												dbo.Dim_Date AS d1 ON d1.DateKey = r1.DateKey WHERE d1.FullDate = DateAdd(d,-1,CAST(GETDATE() AS DATE))
															)),1)

IF @DeleteFlag = 1
Delete [dbo].[OpsServiceDealership]

     Where
           @EntityKey = EntityKey
           and @OpsReviewItemID = OpsReviewItemID

--End

Else

--begin tran
Update [dbo].[OpsServiceDealership]
set TicketNumber = @TicketNumber
where Entitykey = @EntityKey
and OpsReviewItemID = @OpsReviewItemID



```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
