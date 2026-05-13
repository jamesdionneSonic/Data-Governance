---
name: usp_eLead_Notification
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
Create PROCEDURE [dbo].[usp_eLead_Notification]
(@Profile1 VARCHAR(250),
 @ToLine1  VARCHAR(1000),
 @LoadDate DATETIME,
 @xmlXML   VARCHAR(8000) OUTPUT
)
AS
     BEGIN
         DECLARE @Profile NVARCHAR(MAX)= 'SONIC ETL Mail Profile' --@Profile
         , @ToLine NVARCHAR(MAX)= @ToLine1, @Body_Line1 NVARCHAR(MAX)= 'eLead Export Summary', @tableHTML NVARCHAR(MAX)= '', @Body_Line2 VARCHAR(100)= 'Start Time :'+CONVERT(VARCHAR(20), @LoadDate, 100)+' End Time :'+CONVERT(VARCHAR(20), GETDATE(), 100), @SourceCount INT, @Metafiledate DATETIME;
         SET @Metafiledate =
         (
             SELECT CAST(CAST(MAX(CloseDateKey) AS VARCHAR) AS DATE)
             FROM dbo.Fact_Service fs
     JOIN dim_vehicle v ON v.VehicleKey = fs.VehicleKey
                  JOIN dim_entity e ON fs.EntityKey = e.EntityKey
             WHERE CPFlag = 1
         );
         SET @SourceCount =
         (
             SELECT COUNT(DISTINCT CAST([Name-File] AS VARCHAR(50)))
             FROM ETL_Staging..stgEleadVehicleServiceExport
	     WHERE CAST([Name-File] AS VARCHAR(50)) IS NOT NULL
         );

     -----------------
         SET @tableHTML = N'<H3 style="font-family:Calibri;font-size:20px;color:#820000" >'+@Body_Line1+'</H3>'+N'<H3 style="font-family:Calibri;font-size:20px;color:#820000" >'+@Body_Line2+'</H3>'+N'<TABLE style=" font-family: Calibri; font-size: small" >'+N'<TR bgcolor=#276399 style=" color:#FFFFFF;word-wrap:break-word;">'+N'<th style="font-family:Calibri;font-size:15px;color:#FFFFFF";><b>Count of Files Generated</b></th>'+N'<th style="font-family:Calibri;font-size:15px;color:#FFFFFF"><b>File Date</b></th>'+N'</TR>'+CAST(
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                (
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    SELECT @SourceCount AS TD,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           '',
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           CAST(@Metafiledate AS DATE) AS TD,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           '' FOR XML PATH('TR'), TYPE
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                ) AS NVARCHAR(MAX));
         SET @tableHTML = @tableHTML+'</TABLE></BODY></HTML>';
         SET @xmlXML = @tableHTML;

 --select @xmlXML;
 --EXEC msdb.dbo.sp_send_dbmail @profile_name = @Profile
 -- ,@recipients = @ToLine
 -- ,@subject = @Subject
 -- ,@body = @xmlXML
 -- ,@body_format = 'HTML';
     END;


```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
