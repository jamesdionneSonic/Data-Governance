---
name: usp_FBCustomAudienceCarCashAppSoldAudience
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
CREATE PROCEDURE [dbo].[usp_FBCustomAudienceCarCashAppSoldAudience]  
(@MetaSourceSystemName VARCHAR(50),  
 @MetaSourceSystemID   INT,  
 @MetaLoadDate         DATETIME,  
 @MetaDataDate         DATE,  
 @MetaComputerName     VARCHAR(50),  
 @MetaUserId           VARCHAR(50),  
 @ETLExecutionID       VARCHAR(20)  
)  
AS
--select * from ETL_Staging.[dbo].[StgFBAudienceCarCashAppSoldAudience]  --482887
     BEGIN  
        INSERT INTO dbo.FBCustomAudience (
		AudienceID
		,Customer
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
