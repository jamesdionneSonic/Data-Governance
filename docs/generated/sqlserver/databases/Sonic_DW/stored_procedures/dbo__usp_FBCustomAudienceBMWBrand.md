---
name: usp_FBCustomAudienceBMWBrand
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

/*
Author: JayCharan
Create Date: June 28, 2021
Create Desc: This procedure Merge's audience IDs which we end everyday to Facebook
*/
CREATE  
	

 PROCEDURE [dbo].[usp_FBCustomAudienceBMWBrand] (
	@MetaSourceSystemName VARCHAR(50)
	,@MetaSourceSystemID INT
	,@MetaLoadDate DATETIME
	,@MetaDataDate DATE
	,@MetaComputerName VARCHAR(50)
	,@MetaUserId VARCHAR(50)
	,@ETLExecutionID VARCHAR(20)
	)
AS
BEGIN
	INSERT INTO dbo.FBCustomAudience (
		AudienceID
		,CustomerID
		,FirstNa
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
