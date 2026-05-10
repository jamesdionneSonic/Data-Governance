---
name: usp_eLead_Notification
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
Create PROCEDURE [dbo].[usp_eLead_Notification]
(@Profile1 VARCHAR(250),
 @ToLine1  VARCHAR(1000),
 @LoadDate DATETIME,
 @xmlXML   VARCHAR(8000) OUTPUT
)
AS
     BEGIN
         DECLARE @Profile NVARCHAR(MAX)= 'SONIC ETL Mail Profile' --@Profile       
         , @ToLine NVARCHAR(MAX)= @ToLine1, @Body_Line1 NVARCHAR(MAX)= 'eLead Export Summary', @tableHTML NVARCHAR(MAX)= '', @Body_Line2 VARCHAR(100)= 'Start Time :'+CONVERT(VARCHAR(20), @LoadDate, 100)+' End Time :'+CONVERT(VARCHAR(20), G
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
