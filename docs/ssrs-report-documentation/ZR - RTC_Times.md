# ZR - RTC_Times

Generated: 2026-06-15  
SSRS path: `/RTC/ZR - RTC_Times`  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Purpose

This report supports inventory review by showing vehicle inventory, pricing, or stock-level information used to monitor availability, pricing issues, and operational follow-up.

## Executive Summary

| Field               | Value                                            |
| ------------------- | ------------------------------------------------ |
| Report name         | `ZR - RTC_Times`                                 |
| SSRS path           | `/RTC/ZR - RTC_Times`                            |
| Status signal       | Review candidate: no executions in last 6 months |
| Created             | 2014-10-17 13:43:29                              |
| Modified            | 2017-12-13 10:15:34                              |
| Modified by         | SONIC\Mark.Starnes                               |
| Last 6 months usage | 0 executions by 0 users                          |
| Last execution      | NULL                                             |
| Subscriptions       | 0                                                |

## Shared Data Sources

| Report datasource | Shared datasource            | Connection                   | Credential mode | Enabled |
| ----------------- | ---------------------------- | ---------------------------- | --------------- | ------- |
| `SIMS6200`        | `/RTC/Data Sources/SIMS6200` | `Not available from catalog` |                 |         |

## User Parameters

No user-facing report parameters were found in the RDL definition.

## Data Logic

1. Dataset `DataSet1` (Text): DECLARE @FromDate AS DATETIME = NULL DECLARE @ToDate AS DATETIME = NULL --Run Tues-Fri IF @FromDate IS NULL SET @FromDate = (SELECT DATEADD(DAY, DATEDIFF(DAY, 0, GETDATE()-1), 0)) IF @ToDate IS NULL SET @ToDate = (SELECT DATEADD(DAY, DATEDIFF(DAY, 0, GETDATE()-1)+1, 0)) --Prior day, Friday -3, Saturday -2, Sunday -1 --...

## Backend Dependencies

| Object or command hint                | Notes                                     |
| ------------------------------------- | ----------------------------------------- |
| `SIMS6200.dbo.SAC_Status_Log`         | Referenced by one or more report datasets |
| `SIMS6200.dbo.Sonic_Appraisal_Center` | Referenced by one or more report datasets |
| `SIMS6200.dbo.Vehicle_Inventory`      | Referenced by one or more report datasets |

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: `/RTC/ZR - RTC_Times`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed above.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

## Technical Appendix

### Dataset Commands

#### DataSet1

Type: `Text`

```sql
DECLARE @FromDate AS DATETIME =  NULL DECLARE @ToDate   AS DATETIME = NULL  --Run Tues-Fri IF @FromDate IS NULL SET @FromDate = (SELECT DATEADD(DAY, DATEDIFF(DAY, 0, GETDATE()-1), 0)) IF @ToDate   IS NULL SET @ToDate   = (SELECT DATEADD(DAY, DATEDIFF(DAY, 0, GETDATE()-1)+1, 0)) --Prior day, Friday -3, Saturday -2, Sunday -1 --IF @FromDate IS NULL SET @FromDate = '2013-06-20 00:00:00.000' --IF @ToDate   IS NULL SET @ToDate   = '2013-06-21 00:00:00.000' --Prior day, Friday -3, Saturday -2, Sunday -1   -- 1. Get all SAC records across SIMS for the passed date range. SELECT CASE WHEN sac_status_id IN (401,403) THEN 1     WHEN sac_status_id IN (402,404) THEN 2     END AS RowNumber,*  INTO  #TempMain FROM  SIMS6200.dbo.SAC_Status_Log  WHERE SAC_ID in (SELECT DISTINCT SAC.SAC_ID       FROM SIMS6200.dbo.Sonic_Appraisal_Center SAC      INNER JOIN SIMS6200.dbo.SAC_Status_Log SL  ON SL.SAC_ID   = SAC.SAC_ID      INNER JOIN SIMS6200.dbo.Vehicle_Inventory VI ON VI.Vehicle_ID = SAC.Vehicle_ID AND VI.Store_ID = SAC.Store_ID AND VI.Invtr_ID = SAC.Invtr_ID      WHERE    SL.Creation_Date BETWEEN @FromDate AND @ToDate        AND SL.SAC_Status_ID in (401, 403)             )  AND Creation_Date BETWEEN @FromDate AND @ToDate --Added on 6/24     ORDER BY RowNumber, Creation_Date desc  --SELECT * FROM  #TempMain ORDER BY SAC_ID, Creation_Date DESC -----------------------------------------------------------------------------------------------------   -- 2.1 Get all records which hits SAC queue for review. [Entry records]  SELECT  Status_Log_ID, SAC_ID, SAC_Status_ID, Created_By, Creation_Date  INTO #StartTable FROM #TempMain  WHERE RowNumber = 1 ORDER BY Creation_Date DESC  -- 2.2 Get all records which completed the review. [Exit records] SELECT  Status_Log_ID, SAC_ID, SAC_Status_ID, Created_By, Creation_Date  INTO #EndTable FROM #TempMain  WHERE RowNumber = 2 ORDER BY Creation_Date DESC  --2.3 Delete records whose review is not completed DELETE #StartTable WHERE SAC_ID IN (SELECT DISTINCT SAC_ID FROM #StartTable           WHERE SAC_ID NOT IN (SELECT DISTINCT SAC_ID FROM #EndTable))   SELECT  ROW_NUMBER() OVER(PARTITION BY SAC_ID ORDER BY SAC_ID,Creation_Date) AS "RowNum",     Status_Log_ID, SAC_ID, SAC_Status_ID, Created_By, Creation_Date  INTO #PendingReview FROM #StartTable   SELECT  ROW_NUMBER() OVER(PARTITION BY SAC_ID ORDER BY SAC_ID,Creation_Date) AS "RowNum",   Status_Log_ID, SAC_ID, SAC_Status_ID, Created_By, Creation_Date  INTO #ReviewCompleted FROM #EndTable   /* select * from #TempMain   ORDER BY SAC_ID,  Creation_Date DESC SELECT * FROM #StartTable  SELECT * FROM #EndTable  select * from #PendingReview ORDER BY SAC_ID,  Creation_Date DESC select * from #ReviewCompleted ORDER BY SAC_ID,  Creation_Date DESC */ ----------------------------------------------------------------------------------------------------- -- 3. Get the SAC performance information into temporary table --  * Used temporary tables will be helpful in testing the query SELECT CAST(DATEPART(HOUR,ST.Creation_Date) AS INT) "HOUR",     ST.SAC_ID,      ST.SAC_Status_ID "Start Status", ST.Creation_Date "Start Time",     ET.SAC_Status_ID "End Status", ET.Creation_Date "End Time",     DATEDIFF(SECOND, ST.Creation_Date, ET.Creation_Date) "TimeTaken" INTO #RESULT FROM #PendingReview ST INNER JOIN #ReviewCompleted ET ON ST.RowNum = ET.RowNum AND ST.SAC_ID = ET.SAC_ID WHERE ET.Creation_Date >= ST.Creation_Date ORDER BY CAST(DATEPART(HOUR,ST.Creation_Date) AS INT)    SELECT  [HOUR], COUNT(SAC_ID) "# Of Appraisals",    CAST(  CAST(RIGHT(rtrim(MAX(TimeTaken) / 86400),2) AS INT) * 24       + CAST( RIGHT(rtrim( (MAX(TimeTaken) % 86400) / 3600),2) AS INT) AS VARCHAR) + ':'  + right('0' + rtrim((MAX(TimeTaken) % 3600) / 60),2) + ':'  + right('0' + rtrim(MAX(TimeTaken) % 60),2)  "Longest"    , CAST(  CAST(RIGHT(rtrim(MIN(TimeTaken) / 86400),2) AS INT) * 24       + CAST( RIGHT(rtrim( (MIN(TimeTaken) % 86400) / 3600),2) AS INT) AS VARCHAR) + ':'  + right('0' + rtrim((MIN(TimeTaken) % 3600) / 60),2) + ':'   + right('0' + rtrim(MIN(TimeTaken) % 60),2)    "Shortest"    , CAST(  CAST(RIGHT(rtrim(AVG(TimeTaken) / 86400),2) AS INT) * 24       + CAST( RIGHT(rtrim( (AVG(TimeTaken) % 86400) / 3600),2) AS INT) AS VARCHAR) + ':'  + right('0' + rtrim((AVG(TimeTaken) % 3600) / 60),2) + ':'   + right('0' + rtrim(AVG(TimeTaken) % 60),2)    "Average" INTO #FinalResult  FROM  #RESULT GROUP BY [HOUR]  /* SELECT * FROM #RESULT order by TimeTaken desc SELECT * FROM #FinalResult  */ -----------------------------------------------------------------------------------------------------  CREATE TABLE #SACDetails  (              intHour   INT  NULL ,               varTimeFrame  VARCHAR(30) NULL ,               intNumAppraisals INT  NULL ,              varLongest   VARCHAR(30)  NULL ,              varShortest  VARCHAR(30)  NULL ,              varAverage   VARCHAR(30)  NULL  )    INSERT #SACDetails (intHour, varTimeFrame, intNumAppraisals, varLongest, varShortest, varAverage) VALUES   (00, '00:00 to 01:00', 0, null, null, null), (01, '01:00 to 02:00', 0, null, null, null),  (02, '02:00 to 03:00', 0, null, null, null), (03, '03:00 to 04:00', 0, null, null, null),  (04, '04:00 to 05:00', 0, null, null, null), (05, '05:00 to 06:00', 0, null, null, null),  (06, '06:00 to 07:00', 0, null, null, null), (07, '07:00 to 08:00', 0, null, null, null),  (08, '08:00 to 09:00', 0, null, null, null), (09, '09:00 to 10:00', 0, null, null, null),  (10, '10:00 to 11:00', 0, null, null, null), (11, '11:00 to 12:00', 0, null, null, null),  (12, '12:00 to 13:00', 0, null, null, null), (13, '13:00 to 14:00', 0, null, null, null),  (14, '14:00 to 15:00', 0, null, null, null), (15, '15:00 to 16:00', 0, null, null, null),  (16, '16:00 to 17:00', 0, null, null, null), (17, '17:00 to 18:00', 0, null, null, null),  (18, '18:00 to 19:00', 0, null, null, null), (19, '19:00 to 20:00', 0, null, null, null),  (20, '20:00 to 21:00', 0, null, null, null), (21, '21:00 to 22:00', 0, null, null, null),  (22, '22:00 to 23:00', 0, null, null, null), (23, '23:00 to 24:00', 0, null, null, null)   UPDATE #SACDetails SET intNumAppraisals = [# Of Appraisals],     varLongest   = Longest,     varShortest   = Shortest,     varAverage   = Average  FROM #FinalResult FR INNER JOIN #SACDetails TempSAC ON TempSAC.intHour = FR.[HOUR]  SELECT varTimeFrame "By Hour", intNumAppraisals "Total Appraisal(s)"   , varLongest "Longest"  , varShortest "Shortest", varAverage "Average"    FROM #SACDetails   DROP TABLE #TempMain DROP TABLE #StartTable DROP TABLE #EndTable DROP TABLE #PendingReview DROP TABLE #ReviewCompleted  DROP TABLE #RESULT DROP TABLE #FinalResult DROP TABLE #SACDetails   ------------------------------------------------------------------------------------------------------------
```
