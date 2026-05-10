---
name: usp_FBCustomAudienceCarCashWebSold_Notification
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

CREATE PROCEDURE [dbo].[usp_FBCustomAudienceCarCashWebSold_Notification]      
(@Profile1       VARCHAR(250),      
 @ToLine1        VARCHAR(1000),      
 @LoadDate       DATETIME,      
 @ETLExecutionId INT,      
 @xmlXML         VARCHAR(8000) OUTPUT      
)      
AS      
     BEGIN      
         DECLARE @Profile NVARCHAR(MAX)= 'SONIC ETL Mail Profile' --@Profile             
         , @ToLine NVARCHAR(MAX)= @ToLine1, @Body_Line1 NVARCHAR(MAX)= 'Facebook Custom Audience CarCash 
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
