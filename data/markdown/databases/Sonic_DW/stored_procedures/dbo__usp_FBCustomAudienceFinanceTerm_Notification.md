---
name: usp_FBCustomAudienceFinanceTerm_Notification
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
parameter_count: 5
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

| Name              | Type     | Output | Default |
| ----------------- | -------- | ------ | ------- |
| `@Profile1`       | varchar  | No     | No      |
| `@ToLine1`        | varchar  | No     | No      |
| `@LoadDate`       | datetime | No     | No      |
| `@ETLExecutionId` | int      | No     | No      |
| `@xmlXML`         | varchar  | Yes    | No      |

## Definition

```sql

CREATE PROCEDURE [dbo].[usp_FBCustomAudienceFinanceTerm_Notification]
(@Profile1       VARCHAR(250),
 @ToLine1        VARCHAR(1000),
 @LoadDate       DATETIME,
 @ETLExecutionId INT,
 @xmlXML         VARCHAR(8000) OUTPUT
)
AS
     BEGIN
         DECLARE @Profile NVARCHAR(MAX)= 'SONIC ETL Mail Profile' --@Profile
         , @ToLine NVARCHAR(MAX)= @ToLine1, @Body_Line1 NVARCHAR(MAX)= 'Facebook Custom Audience End of Finance Term Upload Summary',
	    @tableHTML NVARCHAR(MAX)= '', @Body_Line2 VARCHAR(100)= 'Start Time :'+CONVERT(VARCHAR(20), @LoadDate, 100)+
	    ' End Time :'+CONVERT(VARCHAR(20), GETDATE(), 100), @SourceCount INT, @FailedCount INT, @SuccessCount INT, @Metafiledate DATETIME, @NewCount INT;
         SET @Metafiledate =
         (
             SELECT MAX(MetaLoadDate)
             FROM ETL_Staging.dbo.[StgFBAudienceFinanceTerm]
         );
         SET @SourceCount =
         (
             SELECT COUNT(*)
             FROM ETL_Staging.dbo.[StgFBAudienceFinanceTerm]
         );
         SET @FailedCount =
         (
             SELECT COUNT(*)
             FROM ETL_Staging.dbo.FailedAudienceIDEndofFinanceTerm
         );
	    SET @NewCount =
	    (
		   Select COUNT(*)
		   FROM FBCustomAudience WHERE AudienceType = 'EndOfFinanceTerm'
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

- **Last Extracted**: 2026-05-13T11:28:24.843Z
