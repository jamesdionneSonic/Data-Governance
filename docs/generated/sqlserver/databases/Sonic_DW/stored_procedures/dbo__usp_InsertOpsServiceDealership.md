---
name: usp_InsertOpsServiceDealership
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





CREATE Procedure [dbo].[usp_InsertOpsServiceDealership]
@EntDealerLvl1 varchar(50),
@OpsReviewItemID int,
@EntityType varchar(50),
@TicketNumber varchar(20) = null


as

DECLARE @ConsecDays int
SET @ConsecDays = isnull((SELECT (max(sd.ConsecDays) + 1) FROM	dbo.OpsReviewItem AS i INNER JOIN
															dbo.OpsServiceDealership AS sd ON i.OpsReviewItemID = sd.OpsReviewItemID INNER JOIN
															dbo.vw_OpsReview AS r ON i.OpsReviewID = r.OpsReviewID INNER JOIN
															dbo.Dim_Date AS d ON d.DateKey = r.DateKey INNER JOIN
															dbo.Dim_Entity AS e on sd.entitykey = e.entitykey
													 WHERE	e.entdealerlvl1 = @EntDealerLvl1 AND
															i.ServiceID = (SELECT i1.ServiceID FROM dbo.OpsReviewItem i1 WHERE i1.OpsReviewItemID = @OpsReviewItemID) AND
															i.OpsReviewID = (SELECT max(r1.OpsReviewID) FROM	dbo.vw_OpsReview r1 INNER JOIN
																												dbo.Dim_Date AS d1 ON d1.DateKey = r1.DateKey WHERE d1.FullDate = DateAdd(d,-1,CAST(GETDATE() AS DATE)) AND r1.servicetype = (SELECT servicetype FROM dbo.OpsReviewItem i1 WHERE i1.OpsReviewItemID = @OpsReviewItemID)
															)),1)


IF @EntityType in ('BT Service','Dealership')



INSERT INTO [dbo].[OpsServiceDealership]
           ([EntityKey]
           ,[OpsReviewItemID]
		   ,[ConsecDays]
		   ,[EntityType]
		   ,[TicketNumber])

    select entitykey
		   ,@OpsReviewItemID
		   ,@ConsecDays
		   ,@EntityType
		   ,@TicketNumber

	 from [Sonic_DW].[dbo].[Dim_Entity]
where entdealerlvl1 = @EntDealerLvl1
and EntBTOpsReportFlag = 'Active'



	 --VALUES
  --         (@EntityKey
  --         ,@OpsReviewItemID
		--   ,@ConsecDays
		--   ,@EntityType)
ELSE

SET @ConsecDays = isnull((SELECT (max(sd.ConsecDays) + 1) FROM	dbo.OpsReviewItem AS i INNER JOIN
															dbo.OpsServiceDealership AS sd ON i.OpsReviewItemID = sd.OpsReviewItemID INNER JOIN
															dbo.vw_OpsReview AS r ON i.OpsReviewID = r.OpsReviewID INNER JOIN
															dbo.Dim_Date AS d ON d.DateKey = r.DateKey INNER JOIN
															dbo.Dim_Entity AS e on sd.entitykey = e.entitykey
													 WHERE	e.EntDMSServerName = @EntDealerLvl1 AND
															i.ServiceID = (SELECT i1.ServiceID FROM dbo.OpsReviewItem i1 WHERE i1.OpsReviewItemID = @OpsReviewItemID) AND
															i.OpsReviewID = (SELECT max(r1.OpsReviewID) FROM	dbo.vw_OpsReview r1 INNER JOIN
																												dbo.Dim_Date AS d1 ON d1.DateKey = r1.DateKey WHERE d1.FullDate = DateAdd(d,-1,CAST(GETDATE() AS DATE)) AND r1.servicetype = (SELECT servicetype FROM dbo.OpsReviewItem i1 WHERE i1.OpsReviewItemID = @OpsReviewItemID)
															)),1)

Insert Into [dbo].[OpsServiceDealership]
           ([EntityKey]
           ,[OpsReviewItemID]
		   ,[ConsecDays]
		   ,[EntityType]
		   ,[TicketNumber])

		   select entitykey
		   ,@OpsReviewItemID
		   ,@ConsecDays
		   ,@EntityType
		   ,@TicketNumber

		   from [Sonic_DW].[dbo].[Dim_Entity]
where EntDMSServerName = @EntDealerLvl1
and EntBTOpsReportFlag = 'Active'






```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
