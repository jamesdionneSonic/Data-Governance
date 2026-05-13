---
name: uspScoresFactActivityLoadNotification
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on: []
dependency_count: 0
parameter_count: 2
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Parameters

| Name              | Type     | Output | Default |
| ----------------- | -------- | ------ | ------- |
| `@LoadDate`       | datetime | No     | No      |
| `@ETLExecutionId` | int      | No     | No      |

## Definition

```sql

CREATE Procedure [dbo].[uspScoresFactActivityLoadNotification]
(
@LoadDate DateTime,
@ETLExecutionId Int
)
as
/*r
Author 	: Amrendra Kumar
Date 	: 17-03-2016
Remarks	: This process sends alert about the last updated/Inserted RowCount For FactActivity Table
*/

IF (
SELECT COUNT(*)
FROM SSIS.Audit.Fact_DataAudit
WHERE ETLExecution_id=@ETLExecutionId
		) > 0
BEGIN
	DECLARE @Profile NVARCHAR(MAX) = 'Sonic ETL Mail Profile' --@Profile
		,@ToLine NVARCHAR(MAX) ='amrendra.kumar@sonicautomotive.com;Bedanta.Bordoloi@sonicautomotive.com;Bhramar.Chandrakar@sonicautomotive.com;sailendra.shetty@AffineAnalytics.com;Apoorva.Kumar@AffineAnalytics.com'
		--'sailendra.shetty@AffineAnalytics.com'
		--'amrendra.kumar@sonicautomotive.com;Bedanta.Bordoloi@sonicautomotive.com;Bhramar.Chandrakar@sonicautomotive.com;sailendra.shetty@AffineAnalytics.com;Apoorva.Kumar@AffineAnalytics.com'
		--(select ConfiguredValue from SSIS.Config.SSIS_Configurations where ConfigurationFilter like 'SIMS_Refresh_ETLEmailList')
		--'amrendra.kumar@sonicautomotive.com;Bedanta.Bordoloi@sonicautomotive.com;Bhramar.Chandrakar@sonicautomotive.com,sailendra.shetty@AffineAnalytics.com;Apoorva.Kumar@AffineAnalytics.com'
		,@Subject NVARCHAR(MAX) = 'Status of FactActivity Load'
		,@Body_Line1 NVARCHAR(MAX) = 'FactActivity Load Summary'
		,@tableHTML NVARCHAR(MAX) = ''
		,@xmlXML VARCHAR(MAX)
		,@Body_Line2 VARCHAR(100) = 'Start Time :' + CONVERT(VARCHAR(20), @LoadDate, 100) + ' End Time :' + CONVERT(VARCHAR(20), GETDATE(), 100);


		---------------------------------
		SET @tableHTML =  N'<H3 style="font-family:Calibri;font-size:20px;color:#820000" >' + @Body_Line1 + '</H3>'
		+N'<H3 style="font-family:Calibri;font-size:20px;color:#820000" >' + @Body_Line2 + '</H3>'
		+ N'<TABLE style=" font-family: Calibri; font-size: small" >'
		+ N'<TR bgcolor=#276399 style=" color:#FFFFFF;word-wrap:break-word;">'
		+ N'<th style="font-family:Calibri;font-size:15px;color:#FFFFFF";><b>Source Rows</b></th>'
		+ N'<th style="font-family:Calibri;font-size:15px;color:#FFFFFF"><b>Inserted Rows</b></th>'
		+ N'<th style="font-family:Calibri;font-size:15px;color:#FFFFFF"><b>Updated Rows</b></th>'
		+ N'<th style="font-family:Calibri;font-size:15px;color:#FFFFFF"><b>UnChanged Rows</b></th>'
		+ N'</TR>' + CAST((
					SELECT (
							SELECT Source_Rows
							FROM SSIS.Audit.Fact_DataAudit
							WHERE ETLExecution_id=@ETLExecutionId
							) AS TD
						,''
						,(
							SELECT TOP 1 Inserted_Rows
							FROM SSIS.Audit.Fact_DataAudit
							WHERE ETLExecution_id=@ETLExecutionId
							) AS TD
						,''
						,(
							SELECT TOP 1 Updated_Rows
							FROM SSIS.Audit.Fact_DataAudit
							WHERE ETLExecution_id=@ETLExecutionId
							) AS TD
						,''
						,(
							SELECT TOP 1 Source_Rows-(Inserted_Rows+Updated_Rows) as UnChanged_Rows
							FROM SSIS.Audit.Fact_DataAudit
							WHERE ETLExecution_id=@ETLExecutionId
							) AS TD
						,''
					FOR XML PATH('TR')
						,TYPE
					) AS NVARCHAR(MAX))

	SET @tableHTML = @tableHTML + '</TABLE></BODY></HTML>';
	SET @xmlXML = @tableHTML;

	--select @xmlXML;
	EXEC msdb.dbo.sp_send_dbmail @profile_name = @Profile
		,@recipients = @ToLine
		,@subject = @Subject
		,@body = @xmlXML
		,@body_format = 'HTML';

END



```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
