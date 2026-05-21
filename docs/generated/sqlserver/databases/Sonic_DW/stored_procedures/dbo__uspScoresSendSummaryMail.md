---
name: uspScoresSendSummaryMail
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


-- =====================================================
-- Author:       Bhramar Chandrakar
-- Create date:  14/03/2016
-- Description:  Send Process Summary In Mail
-- =====================================================
CREATE PROCEDURE [dbo].[uspScoresSendSummaryMail] (
	@LoadDate DATETIME
	,@Profile VARCHAR(500)
	,@ToLine VARCHAR(500)
	,@Prefix VARCHAR(500)
	,@PackageName NVARCHAR(100)
	,@DeletedRowCount INT
	)
AS
BEGIN
	DECLARE @tableHTML NVARCHAR(MAX)
		,@Subject VARCHAR(100)
		,@Header VARCHAR(100)
		,@Body_Line1 VARCHAR(100)
		,@Body_Line2 VARCHAR(100);

	SET @Subject = @Prefix + ' ' + @PackageName + ' Load' + ' Summary as on ' + CONVERT(VARCHAR(20), @LoadDate, 107);
	SET @Header = 'ETL Execution Summary';
	SET @Body_Line1 = 'Start Time :' + CONVERT(VARCHAR(20), @LoadDate, 100)
	SET @Body_Line2 = ' End Time :' + CONVERT(VARCHAR(20), GETDATE(), 100)

	IF @PackageName = 'ScoresDimVehicleSoughtXref'
	BEGIN
		SET @tableHTML = N'<H2 style="font-family:Calibri;font-size:30px;color:#820000">' + @Header + '</H2>' + N'<H3 style="font-family:Calibri;font-size:20px;color:#820000" >' + @Body_Line1 + '</H3>' + N'<H3 style="font-family:Calibri;font-size:20px;color:#820000" >' + @Body_Line2 + '</H3>' + N'<TABLE style=" font-family: Calibri; font-size: small" >' + N'<TR bgcolor=#276399 style=" color:#FFFFFF;word-wrap:break-word;">' + N'<th style="font-family:Calibri;font-size:15px;color=#FFFFFF";></font><b> &nbsp;Source Rows&nbsp; </b></th>' + N'<th style="font-family:Calibri;font-size:15px;color=#FFFFFF"></font><b> &nbsp;Inserted Rows&nbsp; </b></th>' + N'<th style="font-family:Calibri;font-size:15px;color=#FFFFFF"></font><b> &nbsp;Updated Rows&nbsp; </b></th>' + N'<th style="font-family:Calibri;font-size:15px;color=#FFFFFF"></font><b> &nbsp;Unchanged Rows&nbsp; </b></th>' + N'<th style="font-family:Calibri;font-size:15px;color=#FFFFFF"></font><b> &nbsp;Deleted Rows&nbsp; </b></th>' + N'</TR>' + CAST((
					SELECT (
							SELECT TOP 1 Source_Rows
							FROM SSIS.Audit.Fact_DataAudit
							WHERE Package_Name = 'ScoresDimVehicleSoughtXref'
								AND CAST(EndTime AS DATE) = CAST(@LoadDate AS DATE)
							ORDER BY EndTime DESC
							) AS TD
						,''
						,(
							SELECT TOP 1 Inserted_Rows
							FROM SSIS.Audit.Fact_DataAudit
							WHERE Package_Name = 'ScoresDimVehicleSoughtXref'
								AND CAST(EndTime AS DATE) = CAST(@LoadDate AS DATE)
							ORDER BY EndTime DESC
							) AS TD
						,''
						,(
							SELECT TOP 1 Updated_Rows
							FROM SSIS.Audit.Fact_DataAudit
							WHERE Package_Name = 'ScoresDimVehicleSoughtXref'
								AND CAST(EndTime AS DATE) = CAST(@LoadDate AS DATE)
							ORDER BY EndTime DESC
							) AS TD
						,''
						,(
							SELECT TOP 1 Source_Rows - (Inserted_Rows + Updated_Rows + @DeletedRowCount)
							FROM SSIS.Audit.Fact_DataAudit
							WHERE Package_Name = 'ScoresDimVehicleSoughtXref'
								AND CAST(EndTime AS DATE) = CAST(@LoadDate AS DATE)
							ORDER BY EndTime DESC
							) AS TD
						,''
						,(
							SELECT @DeletedRowCount
							) AS TD
						,''
					FOR XML PATH('TR')
						,TYPE
					) AS NVARCHAR(MAX))
	END
	ELSE
	BEGIN
		SET @tableHTML = N'<H2 style="font-family:Calibri;font-size:30px;color:#820000">' + @Header + '</H2>' + N'<H3 style="font-family:Calibri;font-size:20px;color:#820000" >' + @Body_Line1 + '</H3>' + N'<H3 style="font-family:Calibri;font-size:20px;color:#820000" >' + @Body_Line2 + '</H3>' + N'<TABLE style=" font-family: Calibri; font-size: small" >' + N'<TR bgcolor=#276399 style=" color:#FFFFFF;word-wrap:break-word;">' + N'<th style="font-family:Calibri;font-size:15px;color=#FFFFFF";></font><b> &nbsp;Source Rows&nbsp; </b></th>' + N'<th style="font-family:Calibri;font-size:15px;color=#FFFFFF"></font><b> &nbsp;Inserted Rows&nbsp; </b></th>' + N'<th style="font-family:Calibri;font-size:15px;color=#FFFFFF"></font><b> &nbsp;Updated Rows&nbsp; </b></th>' + N'<th style="font-family:Calibri;font-size:15px;color=#FFFFFF"></font><b> &nbsp;Unchanged Rows&nbsp; </b></th>' + N'<th style="font-family:Calibri;font-size:15px;color=#FFFFFF"></font><b> &nbsp;Deleted Rows&nbsp; </b></th>' + N'</TR>' + CAST((
					SELECT (
							SELECT TOP 1 Source_Rows
							FROM SSIS.Audit.Fact_DataAudit
							WHERE Package_Name = @PackageName
								AND CAST(EndTime AS DATE) = CAST(@LoadDate AS DATE)
							ORDER BY EndTime DESC
							) AS TD
						,''
						,(
							SELECT TOP 1 Inserted_Rows
							FROM SSIS.Audit.Fact_DataAudit
							WHERE Package_Name = @PackageName
								AND CAST(EndTime AS DATE) = CAST(@LoadDate AS DATE)
							ORDER BY EndTime DESC
							) AS TD
						,''
						,(
							SELECT TOP 1 Updated_Rows
							FROM SSIS.Audit.Fact_DataAudit
							WHERE Package_Name = @PackageName
								AND CAST(EndTime AS DATE) = CAST(@LoadDate AS DATE)
							ORDER BY EndTime DESC
							) AS TD
						,''
						,(
							SELECT TOP 1 Source_Rows - (Inserted_Rows + Updated_Rows + @DeletedRowCount)
							FROM SSIS.Audit.Fact_DataAudit
							WHERE Package_Name = @PackageName
								AND CAST(EndTime AS DATE) = CAST(@LoadDate AS DATE)
							ORDER BY EndTime DESC
							) AS TD
						,''
						,(
							SELECT @DeletedRowCount
							) AS TD
						,''
					FOR XML PATH('TR')
						,TYPE
					) AS NVARCHAR(MAX))
	END

	----------------------------------------------------------------
	SET @tableHTML = @tableHTML + N'</table>';

	EXEC msdb.dbo.sp_send_dbmail @profile_name = @Profile
		,@recipients = @ToLine
		,@subject = @Subject
		,@body = @tableHTML
		,@body_format = 'HTML';
END



```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
