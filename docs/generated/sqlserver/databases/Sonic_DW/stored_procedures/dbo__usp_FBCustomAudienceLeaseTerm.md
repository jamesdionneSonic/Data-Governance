---
name: usp_FBCustomAudienceLeaseTerm
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
/*

Author: Sumit Tandon
Create Date: April 26, 2019
Create Desc: This procedure Merge's audience IDs which we end everyday to Facebook

Sample Call :
    EXEC [Sonic_DW].[dbo].[usp_FBCustomAudienceLeaseTerm]


CREATE OR ALTER By			CREATE OR ALTER Date	   CREATE OR ALTER Notes
---------------	----------	   ---------------------
Jay				2020-09-08	   CREATE OR ALTERed SP to insert Audience IDs which we send everyday to Facebook

*/
CREATE   PROCEDURE [dbo].[usp_FBCustomAudienceLeaseTerm]
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
        INSERT INTO dbo.FBCustomAudience (AudienceID,
                      CustomerID,
                      FirstName,
                      LastName,
                      Email,
					  PhoneNumber,
					  ZipCode,
					  City,
                      EntityKey,
                      EntDealerLvl1,
                      TransactionDate,
                      AudienceType,
                      LoadStatus,
                      ErrorCode,
                      MetaDataDate,
                      MetaLoadDate,
                      MetaComputerName,
                      MetaUserId,
                      MetaSourceSystemName,
                      MetaSrcSysID,
                      ETLExecutionID)
SELECT S.AudienceID,
          S.CustomerID,
          S.FirstName,
          S.LastName,
          S.Email,
		  S.PhoneNumber,
		  S.ZipCode,
		  S.City,
          S.EntityKey,
          S.EntDealerLvl1,
          S.TransactionDate,
          S.AudienceType,
          S.Status,
          S.ErrorStatus,
          @MetaDataDate,
          MetaLoadDate,
          @MetaComputerName,
          @MetaUserId,
          @MetaSourceSystemName,
          @MetaSourceSystemID,
          @ETLExecutionID
         FROM ETL_Staging.[dbo].[StgFBAudienceLeaseTerm] AS S;
          END;



/****** Object:  StoredProcedure [dbo].[usp_FBCustomAudienceFinanceTerm]    Script Date: 9/23/2020 4:08:14 AM ******/
SET ANSI_NULLS ON
--END of SP

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
