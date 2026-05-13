---
name: usp_BTRequests
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - BT_Requests
  - BT_RequestsRecord
  - usp_BTRequestRecord
dependency_count: 3
parameter_count: 12
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.BT_Requests** (U )
- **dbo.BT_RequestsRecord** (U )
- **dbo.usp_BTRequestRecord** (P )

## Parameters

| Name                  | Type     | Output | Default |
| --------------------- | -------- | ------ | ------- |
| `@BTIssuesKey`        | int      | No     | No      |
| `@EntityKey`          | int      | No     | No      |
| `@IssueOwner`         | varchar  | No     | No      |
| `@IssueComment`       | varchar  | No     | No      |
| `@IssueCompleteDate`  | date     | No     | No      |
| `@IssueTicket`        | nvarchar | No     | No      |
| `@IssueTicketOpened`  | varchar  | No     | No      |
| `@IssueCategoryID`    | int      | No     | No      |
| `@IssueResolution`    | varchar  | No     | No      |
| `@RequesterName`      | varchar  | No     | No      |
| `@GMName`             | varchar  | No     | No      |
| `@MicroStrategyLogin` | varchar  | No     | No      |

## Definition

```sql

-- =============================================
-- Author:		Jonathan Henin
-- Create date: 8/31/2016
-- Description:	Insert Record for BTRequests
-- =============================================
CREATE PROCEDURE [dbo].[usp_BTRequests]
	@BTIssuesKey INT,
	@EntityKey INT,
	@IssueOwner VARCHAR(250),
	@IssueComment VARCHAR(2000),
	@IssueCompleteDate DATE,
	@IssueTicket NVARCHAR(50),
	@IssueTicketOpened VARCHAR(50),
	@IssueCategoryID INT,
	@IssueResolution VARCHAR(2000),
	@RequesterName VARCHAR(250),
	@GMName VARCHAR(250),
	@MicroStrategyLogin VARCHAR(250)


AS

SET NOCOUNT ON

BEGIN TRY

DECLARE @BTKey INT

IF @BTIssuesKey IS NULL

	BEGIN

	--Check to see if there is a record entry for today, if not, create one before adding Issue.
	 SELECT @BTKey = (SELECT BTKey FROM dbo.BT_RequestsRecord WHERE EntityKey = @EntityKey AND DateKey = (CONVERT([varchar](10),getdate(),(112))))

		IF @BTKey IS NULL

			BEGIN

				--Add New Record Entry
				EXECUTE [dbo].[usp_BTRequestRecord] @EntityKey, @GMName, @MicroStrategyLogin

				--Grab new Entries Key
				SELECT @BTKey = (SELECT BTKey FROM dbo.BT_RequestsRecord WHERE EntityKey = @EntityKey AND DateKey = (CONVERT([varchar](10),getdate(),(112))))

			END

		INSERT INTO [dbo].[BT_Requests]
				([BTKey]
				,[OwnerName]
				,[IssueComment]
				,[IssueCompleteDateKey]
				,[IssueTicketOpened]
				,[IssueTicket]
				,[IssueCategoryID]
				,[IssueResolution]
				,[RequesterName])
			VALUES
				(@BTKey
				,@IssueOwner
				,@IssueComment
				,NULL
				,@IssueTicketOpened
				,@IssueTicket
				,COALESCE(@IssueCategoryID, 0)
				,@IssueResolution
				,@RequesterName)
	END

ELSE

BEGIN

	UPDATE [dbo].[BT_Requests]
	   SET [IssueComment] = @IssueComment
		  ,[IssueCompleteDateKey] = (CONVERT([varchar](10),@IssueCompleteDate,(112)))
		  ,[IssueTicket] = @IssueTicket
		  ,[IssueCategoryID] = @IssueCategoryID
		  ,[IssueResolution] = @IssueResolution
	 WHERE BTIssuesKey = @BTIssuesKey

END

END TRY

BEGIN CATCH
    SELECT ERROR_NUMBER() AS ErrorNumber, ERROR_MESSAGE() AS ErrorMessage
    RETURN -1
END CATCH

SET NOCOUNT OFF



```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
