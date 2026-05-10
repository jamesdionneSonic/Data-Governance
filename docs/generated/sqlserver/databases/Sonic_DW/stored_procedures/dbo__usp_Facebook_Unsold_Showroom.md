---
name: usp_Facebook_Unsold_Showroom
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

  
    
    
CREATE PROCEDURE [dbo].[usp_Facebook_Unsold_Showroom]    
 @LastLoadDate DATE,  
 @FBAudiencePeriod int    
AS    
BEGIN    
    
 DECLARE @StartDtProspectIn DATETIME = DATEADD(dd, -@FBAudiencePeriod, @LastLoadDate)    
    ,@EndDtProspectIn DATETIME = @LastLoadDate    
    
 SELECT DISTINCT
 opp.lPersonID,    
    LTRIM(RTRIM([cust].[szFirstName])) AS FirstName,    
    LTRIM(RTRIM([cust].[szLastName])) AS LastName,    
    em.szAddress AS Email,    
    opp.lChi
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
