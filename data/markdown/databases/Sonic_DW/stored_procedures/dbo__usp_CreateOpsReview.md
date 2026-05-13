---
name: usp_CreateOpsReview
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - OpsAssociate
  - OpsReview
  - OpsReviewItem
  - OpsReviewItemDetail
dependency_count: 4
parameter_count: 2
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.OpsAssociate** (U )
- **dbo.OpsReview** (U )
- **dbo.OpsReviewItem** (U )
- **dbo.OpsReviewItemDetail** (U )

## Parameters

| Name          | Type    | Output | Default |
| ------------- | ------- | ------ | ------- |
| `@UserName`   | varchar | No     | No      |
| `@DummyValue` | int     | No     | No      |

## Definition

```sql





--exec usp_CreateOpsReview_Test 'Doug.Morgan',1



CREATE PROCEDURE [dbo].[usp_CreateOpsReview]
@UserName varchar(30),
@DummyValue int

as

Declare @ServiceType varchar(30)

Select @ServiceType = (select ServiceType from OpsAssociate where Username = @Username)


INSERT INTO [dbo].[OpsReview]
           ([CreatedByUserName]
           ,[ModifiedByUserName]
           ,[CreatedOnDateTime]
           ,[ModifiedOnDateTime]
		   ,ServiceType)

	 Select @UserName
           ,Null
           ,Getdate()
           ,Null
		   ,a.ServiceType

		  From Sonic_DW.dbo.OpsAssociate a
		  where @UserName = a.UserName



/*Create new OpsReviewItem records for new OpsReview */

DECLARE @LastReviewID int = (select top 1 OpsReviewID from Sonic_DW.dbo.OpsReview where ServiceType = @ServiceType  and OpsReviewID not in (select top 1 OpsReviewID from Sonic_DW.dbo.OpsReview where ServiceType = @ServiceType order by OpsReviewID desc) order by OpsReviewID DESC )


INSERT INTO [dbo].[OpsReviewItem]
           ([ServiceID]
           ,[StatusID]
           ,[OwnerID]
           ,[OpsReviewID]
           ,[IsBusinessImpacting])


	SELECT ServiceID,
			StatusID,
			OwnerID,
			OpsReviewID,
			IsBusinessImpacting
	FROM
	(select s.ServiceID,
		(Case when StatusID in (1,2) then 0 else StatusID end) as StatusID,
		(Case when StatusID in (1,2) then 'Unassigned' else OwnerID end) as OwnerID,
		(select top 1 OpsReviewID from Sonic_DW.dbo.OpsReview order by OpsReviewID desc) as OpsReviewID,
		(Case when StatusID in (1,2) then 0 else IsBusinessImpacting end) as IsBusinessImpacting
	from Sonic_dw.dbo.OpsReviewItem i
	join Sonic_dw.dbo.OpsService s
	on i.ServiceID = s.ServiceID
	where s.IsActive =1 and OpsReviewID = @LastReviewID) a
	UNION ALL
	(select ServiceID,
			0 As StatusID,
			'Unassigned' AS OwnerID,
			(select top 1 OpsReviewID from Sonic_DW.dbo.OpsReview order by OpsReviewID desc) as OpsReviewID,
			0 As IsBusinessImpacting
			FROM Sonic_Dw.dbo.OpsService
			WHERE IsActive = 1 AND ServiceType = @ServiceType AND ServiceID NOT IN (SELECT ServiceID FROM Sonic_dw.dbo.OpsReviewItem WHERE OpsReviewID = @LastReviewID))


/*This section was used for testing and needs to be replaced with the original, which copied previous comments into the new review.
--INSERT INTO [dbo].[OpsReviewItem]
--           ([ServiceID]
--           ,[StatusID]
--           ,[OwnerID]
--           ,[OpsReviewID]
--           ,[IsBusinessImpacting])

--select
--ServiceID
--	,0 as StatusID
--	,'Unassigned' as OwnerID
--	,(select top 1 OpsReviewID from Sonic_DW.dbo.OpsReview where CreatedByUserName = @UserName order by OpsReviewID desc) as OpsReview-- where ServiceType = 'DBA' order by OpsReviewID desc) as OpsReviewID
--	,0 as IsBusinessImpacting

--	from OpsService s
--	join OpsAssociate a
--	on a.ServiceType = s.ServiceType
--	join OpsReview r
--	on r.CreatedByUserName = a.Username
--	and r.ServiceType = s.ServiceType
--	where @UserName = a.Username
--	and r.OpsReviewID = (select top 1 OpsReviewID from Sonic_DW.dbo.OpsReview where ServiceType = a.ServiceType order by OpsReviewID desc)
--	and s.IsActive = 1
	 */
--  end of the testing section of code.


	/*------  Add Comments from existing Items to new Review------*/

	INSERT INTO [dbo].[OpsReviewItemDetail]
           ([OpsReviewItemID]
           ,[ActionItems]
           ,[Comments]
           ,[CreatedByUserName]
           ,[ModifiedByUserName]
           ,[CreatedOn]
           ,[ModifiedOn]
           ,[StatusID])


SELECT
      [OpsReviewItemID]
      ,[ActionItems]
      ,[Comments]
      ,[CreatedByUserName]
      ,[ModifiedByUserName]
      ,[CreatedOn]
      ,[ModifiedOn]
      ,[StatusID]
  FROM [Sonic_DW].[dbo].[OpsReviewItemDetail]
  where OpsReviewItemID in (select OpsReviewItemID from OpsReviewItem
  where OpsReviewID = (select top 1 OpsReviewID from Sonic_DW.dbo.OpsReview where OpsReviewID not in (select top 1 OpsReviewID from Sonic_DW.dbo.OpsReview order by OpsReviewID desc) order by OpsReviewID DESC ))




```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
