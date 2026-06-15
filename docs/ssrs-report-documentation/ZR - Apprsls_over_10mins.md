# ZR - Apprsls_over_10mins

Generated: 2026-06-15  
SSRS path: `/RTC/ZR - Apprsls_over_10mins`  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Purpose

This report supports inventory review by showing vehicle inventory, pricing, or stock-level information used to monitor availability, pricing issues, and operational follow-up.

## Executive Summary

| Field               | Value                                            |
| ------------------- | ------------------------------------------------ |
| Report name         | `ZR - Apprsls_over_10mins`                       |
| SSRS path           | `/RTC/ZR - Apprsls_over_10mins`                  |
| Status signal       | Review candidate: no executions in last 6 months |
| Created             | 2014-10-17 13:43:29                              |
| Modified            | 2017-12-13 10:15:31                              |
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

| Object or command hint                  | Notes                                     |
| --------------------------------------- | ----------------------------------------- |
| `SIMS6200.dbo.SAC_Status_Log`           | Referenced by one or more report datasets |
| `SIMS6200.dbo.Sonic_Appraisal_Center`   | Referenced by one or more report datasets |
| `SIMS6200.dbo.Vehicle_Inventory`        | Referenced by one or more report datasets |
| `SIMS6200.dbo.Organization_Association` | Referenced by one or more report datasets |
| `SIMS6200.dbo.Organization`             | Referenced by one or more report datasets |
| `SIMS6200.dbo.vehicle`                  | Referenced by one or more report datasets |

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: `/RTC/ZR - Apprsls_over_10mins`.
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
DECLARE @FromDate AS DATETIME =  NULL DECLARE @ToDate   AS DATETIME = NULL  --Run Tues-Fri IF @FromDate IS NULL SET @FromDate = (SELECT DATEADD(DAY, DATEDIFF(DAY, 0, GETDATE()-1), 0)) IF @ToDate   IS NULL SET @ToDate   = (SELECT DATEADD(DAY, DATEDIFF(DAY, 0, GETDATE()-1)+1, 0)) --Prior day, Friday -3, Saturday -2, Sunday -1 --IF @FromDate IS NULL SET @FromDate = '2013-06-20 00:00:00.000' --IF @ToDate   IS NULL SET @ToDate   = '2013-06-21 00:00:00.000' --Prior day, Friday -3, Saturday -2, Sunday -1   -- 1. Get all SAC records across SIMS for the passed date range. SELECT CASE WHEN sac_status_id IN (401,403) THEN 1     WHEN sac_status_id IN (402,404) THEN 2     END AS RowNumber,*  INTO  #TempMain FROM  SIMS6200.dbo.SAC_Status_Log  WHERE SAC_ID in (SELECT DISTINCT SAC.SAC_ID       FROM SIMS6200.dbo.Sonic_Appraisal_Center SAC      INNER JOIN SIMS6200.dbo.SAC_Status_Log SL  ON SL.SAC_ID   = SAC.SAC_ID      INNER JOIN SIMS6200.dbo.Vehicle_Inventory VI ON VI.Vehicle_ID = SAC.Vehicle_ID AND VI.Store_ID = SAC.Store_ID AND VI.Invtr_ID = SAC.Invtr_ID      WHERE    SL.Creation_Date BETWEEN @FromDate AND @ToDate        AND SL.SAC_Status_ID in (401, 403)             )  AND Creation_Date BETWEEN @FromDate AND @ToDate --Added on 6/24 ORDER BY RowNumber, Creation_Date desc  --SELECT * FROM  #TempMain ORDER BY SAC_ID, Creation_Date DESC -----------------------------------------------------------------------------------------------------   -- 2.1 Get all records which hits SAC queue for review. [Entry records]  SELECT  Status_Log_ID, SAC_ID, SAC_Status_ID, Created_By, Creation_Date  INTO #StartTable FROM #TempMain  WHERE RowNumber = 1 ORDER BY Creation_Date DESC  -- 2.2 Get all records which completed the review. [Exit records] SELECT  Status_Log_ID, SAC_ID, SAC_Status_ID, Created_By, Creation_Date  INTO #EndTable FROM #TempMain  WHERE RowNumber = 2 ORDER BY Creation_Date DESC  --2.3 Delete records whose review is not completed DELETE #StartTable WHERE SAC_ID IN (SELECT DISTINCT SAC_ID FROM #StartTable           WHERE SAC_ID NOT IN (SELECT DISTINCT SAC_ID FROM #EndTable))   SELECT  ROW_NUMBER() OVER(PARTITION BY SAC_ID ORDER BY SAC_ID,Creation_Date) AS "RowNum",     Status_Log_ID, SAC_ID, SAC_Status_ID, Created_By, Creation_Date  INTO #PendingReview FROM #StartTable   SELECT  ROW_NUMBER() OVER(PARTITION BY SAC_ID ORDER BY SAC_ID,Creation_Date) AS "RowNum",   Status_Log_ID, SAC_ID, SAC_Status_ID, Created_By, Creation_Date  INTO #ReviewCompleted FROM #EndTable   /* select * from #TempMain   ORDER BY SAC_ID,  Creation_Date DESC SELECT * FROM #StartTable  SELECT * FROM #EndTable  select * from #PendingReview ORDER BY SAC_ID,  Creation_Date DESC select * from #ReviewCompleted ORDER BY SAC_ID,  Creation_Date DESC */ ----------------------------------------------------------------------------------------------------- -- 3. Get the SAC performance information into temporary table --  * Used temporary tables will be helpful in testing the query SELECT  o.Name as 'Dealership', v.VIN,v.Make, v.Model, vi.Mileage,sac.Modified_By, CAST(DATEPART(HOUR,ST.Creation_Date) AS INT) "HOUR", ST.Creation_Date "Start Time", ET.Creation_Date "End Time", DATEDIFF(SECOND, ST.Creation_Date, ET.Creation_Date) "TimeTaken" --excel /86400, then format to HH:MM:SS  FROM #PendingReview ST INNER JOIN #ReviewCompleted ET ON ST.RowNum = ET.RowNum AND ST.SAC_ID = ET.SAC_ID  join SIMS6200.dbo.Sonic_Appraisal_Center as sac on sac.SAC_ID = st.SAC_ID join SIMS6200.dbo.Organization_Association as oa on oa.Child_Org_ID = sac.Store_ID join SIMS6200.dbo.Organization as o on o.Org_ID = oa.Child_Org_ID join SIMS6200.dbo.vehicle as v on v.Vehicle_ID = sac.Vehicle_ID  cross apply (  select Top 1 *  from SIMS6200.dbo.Vehicle_Inventory as vi  where  vi.Vehicle_ID = sac.Vehicle_ID  and vi.Store_ID = sac.Store_ID  order by  vi.Modification_Date desc ) as vi  WHERE ET.Creation_Date >= ST.Creation_Date and oa.Is_Act = 1 and oa.Parent_Class = 10 ORDER BY CAST(DATEPART(HOUR,ST.Creation_Date) AS INT)  DROP TABLE #TempMain DROP TABLE #StartTable DROP TABLE #EndTable DROP TABLE #PendingReview DROP TABLE #ReviewCompleted
```
