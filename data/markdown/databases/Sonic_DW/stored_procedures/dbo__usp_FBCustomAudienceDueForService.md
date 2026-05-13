---
name: usp_FBCustomAudienceDueForService
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - FBCustomAudience
dependency_count: 1
parameter_count: 7
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.FBCustomAudience** (U )

## Parameters

| Name                    | Type     | Output | Default |
| ----------------------- | -------- | ------ | ------- |
| `@MetaSourceSystemName` | varchar  | No     | No      |
| `@MetaSourceSystemID`   | int      | No     | No      |
| `@MetaLoadDate`         | datetime | No     | No      |
| `@MetaDataDate`         | date     | No     | No      |
| `@MetaComputerName`     | varchar  | No     | No      |
| `@MetaUserId`           | varchar  | No     | No      |
| `@ETLExecutionID`       | varchar  | No     | No      |

## Definition

```sql
CREATE   PROCEDURE [dbo].[usp_FBCustomAudienceDueForService]
(@MetaSourceSystemName VARCHAR(50),
 @MetaSourceSystemID   INT,
 @MetaLoadDate         DATETIME,
 @MetaDataDate         DATE,
 @MetaComputerName     VARCHAR(50),
 @MetaUserId           VARCHAR(50),
 @ETLExecutionID       VARCHAR(20)
)
AS
     BEGIN
         INSERT INTO dbo.FBCustomAudience (
		AudienceID
		,CustomerID
		,FirstName
		,LastName
		,Email
		,PhoneNumber
		,ZipCode
		,City
		,EntityKey
		,EntDealerLvl1
		,TransactionDate
		,AudienceType
		,LoadStatus
		,ErrorCode
		,MetaDataDate
		,MetaLoadDate
		,MetaComputerName
		,MetaUserId
		,MetaSourceSystemName
		,MetaSrcSysID
		,ETLExecutionID
		)
	SELECT S.AudienceID
		,S.CustomerID
		,S.FirstName
		,S.LastName
		,S.Email
		,S.PhoneNumber
		,S.ZipCode
		,S.City
		,S.EntityKey
		,S.EntDealerLvl1
		,S.TransactionDate
		,S.AudienceType
		,S.STATUS
		,S.ErrorStatus
		,@MetaDataDate
		,MetaLoadDate
		,@MetaComputerName
		,@MetaUserId
		,@MetaSourceSystemName
		,@MetaSourceSystemID
		,@ETLExecutionID
	FROM ETL_Staging.[dbo].[StgFBAudienceServiceDue] AS S;
END;
--END of SP

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
