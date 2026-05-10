---
name: usp_Load_SoxReview
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




CREATE Procedure [dbo].[usp_Load_SoxReview]
	@EntityKey int,
	@ReviewerUserID varchar(50),
	@ControllerName varchar(50)
	
	As
	
SET NOCOUNT ON
BEGIN TRY	

DECLARE @IsEchoParkStore INT = CASE (SELECT EntLineOfBusiness FROM dbo.Dim_Entity WHERE EntityKey = @EntityKey) WHEN 'EchoPark' THEN 1 ELSE 0 END

INSERT INTO [Sonic_DW].[dbo].[SoxReview]

     SELECT
		
           @EntityKey
           ,GETDATE()
           ,@ControllerName
           ,'' 
           ,@ReviewerUser
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
