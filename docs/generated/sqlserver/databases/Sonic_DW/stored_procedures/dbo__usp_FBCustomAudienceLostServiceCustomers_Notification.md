---
name: usp_FBCustomAudienceLostServiceCustomers_Notification
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

CREATE PROCEDURE [dbo].[usp_FBCustomAudienceLostServiceCustomers_Notification]
(@Profile1       VARCHAR(250),
 @ToLine1        VARCHAR(1000),
 @LoadDate       DATETIME,
 @ETLExecutionId INT,
 @xmlXML         VARCHAR(8000) OUTPUT
)
AS
     BEGIN
         DECLARE @Profile NVARCHAR(MAX)= 'SONIC ETL Mail Profile' --@Profile
         , @ToLine NVARCHAR(MAX)= @ToLine1, @Body_Line1 NVARCHAR(MAX)= 'Facebook Custom Audience Lost Service Customers Upload Summary',
     @tableHTML NVARCHAR(MAX)= '', @Body_Line2 VARCHAR(100)= 'Start Time :'+CONVERT(VARCHAR(20), @LoadDate, 100)+
     ' End Time :'+CONVERT(VARCHAR(20), GETDATE(), 100), @SourceCount INT, @FailedCount INT, @SuccessCount INT, @Metafiledate DATETIME, @NewCount INT;
         SET @Metafiledate =
         (
             SELECT MAX(MetaLoadDate)
             FROM ETL_Staging.dbo.StgFBAudienceLostServiceCustomers
         );
         SET @SourceCount =
         (
             SELECT COUNT(*)
             FROM ETL_Staging.dbo.StgFBAudienceLostServiceCustomers
         );
         SET @FailedCount =
         (
             SELECT COUNT(*)
             FROM ETL_Staging.dbo.FailedAudienceIDLostServiceCustomer
         );
     SET @NewCount =
     (
     Select COUNT(*)
     FROM FBCustomAudience WHERE AudienceType = 'LostServiceCustomers'
     AND ETLExecutionID = @ETLExecutionId
     )

         SELECT @SuccessCount = @SourceCount - @FailedCount;

 ---------------------------------
         SET @tableHTML = N'<H3 style="font-family:Calibri;font-size:20px;color:#820000" >'+
     @Body_Line1+'</H3>'+N'<H3 style="font-family:Calibri;font-size:20px;color:#820000" >'+
     @Body_Line2+'</H3>'+N'<TABLE style=" font-family: Calibri; font-size: small">'+
     N'<TR bgcolor=#276399 style=" color:#FFFFFF;word-wrap:break-word;">'+
     N'<th style="font-family:Calibri;font-size:15px;color:#FFFFFF";><b>Source Count</b></th>'+
     N'<th style="font-family:Calibri;font-size:15px;color:#FFFFFF"><b>Count of Audience ID(s) Processed Successfully</b></th>'+
     N'<th style="font-family:Calibri;font-size:15px;color:#FFFFFF"><b>Count of Audience ID(s) Newly Inserted</b></th>'+
     N'<th style="font-family:Calibri;font-size:15px;color:#FFFFFF"><b>Count of AudienceID(s) Failed</b></th>'+
     N'<th style="font-family:Calibri;font-size:15px;color:#FFFFFF"><b>Upload Date</b></th>'+N'</TR>'+
     CAST(
                    (
                        SELECT @SourceCount AS TD,
                               '',
                               @SuccessCount AS TD,
                               '',
       @NewCount AS TD,
                               '',
                               @FailedCount AS TD,
                               '',
                               CAST(@Metafiledate AS DATE) AS TD,
                               '' FOR XML PATH('TR'), TYPE
                    ) AS NVARCHAR(MAX));
         SET @tableHTML = @tableHTML+'</TABLE></BODY></HTML>';
         SET @xmlXML = @tableHTML;
     END;

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
