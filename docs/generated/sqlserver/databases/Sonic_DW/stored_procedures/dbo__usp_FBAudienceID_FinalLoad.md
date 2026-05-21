---
name: usp_FBAudienceID_FinalLoad
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
CREATE PROCEDURE [dbo].[usp_FBAudienceID_FinalLoad]
(@MetaLoadDate     DATETIME,
 @MetaDataDate     DATE,
 @MetaComputerName VARCHAR(50),
 @MetaUserId       VARCHAR(50),
 @ETLExecutionID   VARCHAR(20)
)
AS
     BEGIN
         INSERT INTO FBAudienceUnsoldShowroom
         (AudienceID,
          FirstName,
          LastName,
          Email,
          EntityKey,
          EntDealerLvl1,
          lChildCompanyID,
          lCompanyID,
          dtProspectIn,
          LoadStatus,
          ErrorCode,
          MetaDataDate,
          MetaLoadDate,
          MetaComputerName,
          MetaUserId,
          ETLExecutionID
         )
                SELECT AudienceID,
                       FirstName,
                       LastName,
                       Email,
                       EntityKey,
                       EntDealerLvl1,
                       lChildCompanyID,
                       lCompanyID,
                       dtProspectIn,
                       Status,
                       ErrorStatus,
                       @MetaDataDate,
                       @MetaLoadDate,
                       @MetaComputerName,
                       @MetaUserId,
                       @ETLExecutionID
                FROM ETL_Staging.[dbo].StgFBAudienceUnsoldShowroom_Final(nolock);
     END

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
