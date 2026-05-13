---
name: usp_UpdateOpsReviewItem
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - OpsReviewItemDetail
  - OpsStatus
dependency_count: 2
parameter_count: 8
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.OpsReviewItemDetail** (U )
- **dbo.OpsStatus** (U )

## Parameters

| Name                   | Type     | Output | Default |
| ---------------------- | -------- | ------ | ------- |
| `@OpsReviewItemID`     | int      | No     | No      |
| `@StatusID`            | int      | No     | No      |
| `@UserName`            | varchar  | No     | No      |
| `@Owner`               | varchar  | No     | No      |
| `@IsBusinessImpacting` | int      | No     | No      |
| `@ActionItems`         | varchar  | No     | No      |
| `@Comments`            | varchar  | No     | No      |
| `@DateTimeCreated`     | datetime | No     | No      |

## Definition

```sql

CREATE Procedure [dbo].[usp_UpdateOpsReviewItem]
--exec  usp_UpdateOpsReviewItem 24,  '89,91,86', 4, 'Doug.Morgan', 'Doug.Morgan', 1, 'Fix the Wifi', 'The GMs are screaming about it', '2014-12-11 09:45:48.077'

@OpsReviewItemID int,
--@EntityKey varchar(100),
@StatusID int,
@UserName varchar(30),
@Owner varchar(30),
@IsBusinessImpacting int,
@ActionItems varchar(2000),
@Comments varchar(2000),
@DateTimeCreated datetime

as

Declare @dealer varchar(20)
Declare @BeginPlace int
Declare @EndPlace int
Declare @DealerLen int
Declare @Counter int

Create table #OpsReviewTemp
--Drop table OpsReviewTemp
(OpsReviewItemID int,

--EntityKey varchar(100),
StatusID int,
UserName varchar(30),
Owner varchar(30),
IsBusinessImpacting int,
ActionItems varchar(2000),
Comments varchar(2000),
DateTimeCreated datetime)

Insert into #OpsReviewTemp
Values (
@OpsReviewItemID,
--@EntityKey ,
@StatusID,
@UserName ,
@Owner,
@IsBusinessImpacting,
@ActionItems,
@Comments,
@DateTimeCreated
)

--Select * from #OpsReviewTemp
/*------   Insert OpsReviewItemDetail    ---------------*/
--Select OpsReviewItemID,ActionItems,Comments, UserName,Null,Getdate(),Null,s.StatusID
--from #OpsReviewTemp t
--join OpsStatus s
--on s.StatusID = t.StatusID

IF NOT EXISTS (SELECT * FROM OpsReviewItemDetail WHERE OpsReviewItemID = @OpsReviewItemID)
Insert into OpsReviewItemDetail

Select OpsReviewItemID,ActionItems,Comments, UserName,Null,Getdate(),Null,s.StatusID
from #OpsReviewTemp t
join OpsStatus s
on s.StatusID = t.StatusID
where comments is not null
or ActionItems is not null



/*--------  Update OpsReviewItem Data  -------------*/
Update Sonic_DW.dbo.OpsReviewItem
Set StatusID = @StatusID,
IsBusinessImpacting = @IsBusinessImpacting,
OwnerID = @Owner
where OpsReviewItemID = @OpsReviewItemID

Update Sonic_DW.dbo.OpsReviewItemDetail
Set Comments = @Comments,
ActionItems = @ActionItems,
ModifiedOn = @DateTimeCreated,
ModifiedByUserName = @UserName
where OpsReviewItemID = @OpsReviewItemID

--Select * from OpsReviewItem
--where OpsReviewItemID = @OpsReviewItemID


/*----------Insert Dealership/Service records into OpsServiceDealership-------*/

--select @dealer = @EntityKey
--select @DealerLen = len(@dealer)
--select @BeginPlace = 1
--select @Counter = @DealerLen - len(replace(@dealer,',','')) +1


--While @Counter >0
--Begin
--select @EndPlace = Case when charindex(',',@dealer,@beginplace)-1 <=0 then len(@dealer) else charindex(',',@dealer,@beginplace)-1 end
----select substring(@Dealer,@BeginPlace,@EndPlace)

--Insert into OpsServiceDealership
--select substring(@Dealer,@BeginPlace,@EndPlace),@OpsReviewItemID

--select @dealer = substring(@dealer,@endplace+2,len(@dealer)-(@endplace))
----select @Dealer
--select @Counter = @counter -1
--End

--Select * from OpsServiceDealership where OpsReviewItemID = @OpsReviewItemID

/*--------Truncates
Truncate table OpsServiceDealership
Truncate table OpsReviewItemDetail
*/



```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
