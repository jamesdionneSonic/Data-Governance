---
name: usp_FBCustomAudienceCarCashUnSoldAudience
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
CREATE PROCEDURE [dbo].[usp_FBCustomAudienceCarCashUnSoldAudience]
(@MetaSourceSystemName VARCHAR(50),
 @MetaSourceSystemID   INT,
 @MetaLoadDate         DATETIME,
 @MetaDataDate         DATE,
 @MetaComputerName     VARCHAR(50),
 @MetaUserId           VARCHAR(50),
 @ETLExecutionID       VARCHAR(20)
)
AS
--select * from ETL_Staging.[dbo].[StgFBAudienceCarCashUnSoldAudience]  --482887
     BEGIN
         INSERT INTO dbo.FBCustomAudience (
		AudienceID
		,CustomerID
		,FirstName
		,LastName
		,Email,PhoneNumber
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
		,S.Email,S.PhoneNumber
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
	FROM ETL_Staging.[dbo].[StgFBAudienceCarCashUnSoldAudience] AS S;
END;


```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
