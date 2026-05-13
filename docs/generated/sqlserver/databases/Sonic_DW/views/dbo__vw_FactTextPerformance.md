---
name: vw_FactTextPerformance
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Definition

```sql



/************************************************************************************************************************************************
* CREATED: 2024-12-19 Author: Derrick Davis   Created vw_FactTextPerformance view for Turbo/Microstrategy
*
* MODIFIED:2025-07-18 Author:Sunil Rawal    Modified Views for fixing TextOptin/TextOptOut Data.
*
*************************************************************************************************************************************************/

CREATE     VIEW [dbo].[vw_FactTextPerformance]
AS

 WITH maxEdit AS
 (
 SELECT DISTINCT MAX(CAST(dtp.Meta_RowLastChangeDate AS DATE)) AS MaxEditDate
     ,sd.DateKey AS StartDate
     ,ed.DateKey AS EndDate
 FROM [Sonic_DW].[dbo].[DimTextPerformance] dtp (NOLOCK)
 INNER JOIN (SELECT * FROM Sonic_DW.dbo.Dim_Date (NOLOCK) WHERE IsFirstDayOfMonth = 'Y') sd
  --ON sd.CalendarYearMonth = LEFT(dtp.ProspectInDate,7)
  ON sd.FullDate = CONVERT(DATE,dtp.ProspectInDate)
  --AND sd.IsFirstDayOfMonth = 'Y'
 INNER JOIN (SELECT * FROM Sonic_DW.dbo.Dim_Date (NOLOCK) WHERE IsLastDayOfMonth = 'Y') ed
  ON sd.CalendarYearMonth = ed.CalendarYearMonth
  --AND ed.IsLastDayOfMonth = 'Y'
 GROUP BY sd.DateKey, ed.DateKey
 )



 SELECT  f.EntityKey
       ,f.DateKey
    ,f.EntityDt
       ,f.szNewUsed
       ,f.UpTypeKey
       ,SUM(f.TextLeadCount) TextLeadCount
       ,SUM(f.TextOptInRequest) TextOptInRequest
       ,SUM(f.TextNoOptInRequest) TextNoOptInRequest
       ,SUM(f.TextOptIn) TextOptIn
       ,SUM(f.TextOptOut) TextOptOut
       ,SUM(f.TextSent) TextSent
       ,SUM(f.TextReceived) TextReceived
       ,SUM(f.TextAppt) TextAppt
       ,SUM(f.TextSold) TextSold
       ,SUM(f.TextLeadCountNoPhone) TextLeadCountNoPhone
       ,SUM(f.TextOptInRequestNoPhone) TextOptInRequestNoPhone
       ,SUM(f.TextNoOptInRequestNoPhone) TextNoOptInRequestNoPhone
       ,SUM(f.TextOptInNoPhone) TextOptInNoPhone
       ,SUM(f.TextOptOutNoPhone) TextOptOutNoPhone
       ,SUM(f.TextSentNoPhone) TextSentNoPhone
       ,SUM(f.TextReceivedNoPhone) TextReceivedNoPhone
       ,SUM(f.TextApptNoPhone) TextApptNoPhone
       ,SUM(f.TextSoldNoPhone) TextSoldNoPhone
 --into ##CheckOP
FROM
(


  SELECT dtp.[EntityKey]
 ,dtp.[DateKey]
    ,dtp.[DateKey] AS EntityDt
      ,dtp.[szNewUsed]
      ,ut.[UpTypeKey]
   ,SUM(CASE WHEN ISNULL(dtp.[PhoneNumber],'NoPhone') != 'NoPhone' THEN dtp.[TextLeadCount] ELSE 0 END) AS [TextLeadCount]
      ,0 AS [TextOptInRequest]
      ,SUM(CASE WHEN ISNULL(dtp.[PhoneNumber],'NoPhone') != 'NoPhone' THEN dtp.[TextNoOptInRequest] ELSE 0 END) AS [TextNoOptInRequest]
      ,0 AS [TextOptIn]
      ,0 AS [TextOptOut]
      ,0 AS [TextSent]
      ,0 AS [TextReceived]
      ,SUM(CASE WHEN ISNULL(dtp.[PhoneNumber],'NoPhone') != 'NoPhone' THEN dtp.[TextAppt] ELSE 0 END) AS [TextAppt]
      ,SUM(CASE WHEN ISNULL(dtp.[PhoneNumber],'NoPhone') != 'NoPhone' THEN dtp.[TextSold] ELSE 0 END) AS [TextSold]
      ,SUM(CASE WHEN ISNULL(dtp.[PhoneNumber],'NoPhone') = 'NoPhone' THEN dtp.[TextLeadCount] ELSE 0 END) AS [TextLeadCountNoPhone]
      ,0 AS [TextOptInRequestNoPhone]
      ,SUM(CASE WHEN ISNULL(dtp.[PhoneNumber],'NoPhone') = 'NoPhone' THEN dtp.[TextNoOptInRequest] ELSE 0 END) AS [TextNoOptInRequestNoPhone]
      ,0 AS [TextOptInNoPhone]
      ,0 AS [TextOptOutNoPhone]
      ,0 AS [TextSentNoPhone]
      ,0 AS [TextReceivedNoPhone]
      ,SUM(CASE WHEN ISNULL(dtp.[PhoneNumber],'NoPhone') = 'NoPhone' THEN dtp.[TextAppt] ELSE 0 END) AS [TextApptNoPhone]
      ,SUM(CASE WHEN ISNULL(dtp.[PhoneNumber],'NoPhone') = 'NoPhone' THEN dtp.[TextSold] ELSE 0 END) AS [TextSoldNoPhone]
  FROM [Sonic_DW].[dbo].[DimTextPerformance] dtp
 JOIN [Sonic_DW].[dbo].DimUpType ut
  ON dtp.[szUpType] = ISNULL(ut.szUpType,ut.UpType)
  WHERE ISNULL(dtp.Active,1) = 1
  AND CAST(dtp.Meta_RowLastChangeDate AS DATE) = (SELECT MaxEditDate FROM maxEdit m (NOLOCK) WHERE dtp.DateKey BETWEEN m.StartDate AND m.EndDate)
 GROUP BY
   dtp.[EntityKey]
   ,dtp.[DateKey]
   ,dtp.[szNewUsed]
   ,ut.[UpTypeKey]
UNION
SELECT dtp.[EntityKey]
      ,dtp.DateKey
   ,dd.[DateKey] AS EntityDt
      ,dtp.[szNewUsed]
      ,ut.[UpTypeKey]
    ,0 AS [TextLeadCount]
      ,SUM(CASE WHEN ISNULL(dtp.[PhoneNumber],'NoPhone') != 'NoPhone' THEN dtp.[TextOptInRequest] ELSE 0 END) AS [TextOptInRequest]
      ,0 AS [TextNoOptInRequest]
      ,0 AS [TextOptIn]
      ,0 AS [TextOptOut]
      ,0 AS [TextSent]
      ,0 AS [TextReceived]
      ,0 AS [TextAppt]
      ,0 AS [TextSold]
      ,0 AS [TextLeadCountNoPhone]
      ,SUM(CASE WHEN ISNULL(dtp.[PhoneNumber],'NoPhone') = 'NoPhone' THEN dtp.[TextOptInRequest] ELSE 0 END) AS [TextOptInRequestNoPhone]
      ,0 AS [TextNoOptInRequestNoPhone]
      ,0 AS [TextOptInNoPhone]
      ,0 AS [TextOptOutNoPhone]
      ,0 AS [TextSentNoPhone]
      ,0 AS [TextReceivedNoPhone]
      ,0 AS [TextApptNoPhone]
      ,0 AS [TextSoldNoPhone]

--select dtp.*,ut.[UpTypeKey]
  FROM [Sonic_DW].[dbo].[DimTextPerformance] dtp
 JOIN [Sonic_DW].[dbo].DimUpType ut
  ON dtp.[szUpType] = ISNULL(ut.szUpType,ut.UpType)
 JOIN Sonic_DW.dbo.Dim_Date dd
  ON CONVERT(DATE,dtp.OptInSentDate) = dd.FullDate
  WHERE ISNULL(dtp.Active,1) = 1
  AND CAST(dtp.Meta_RowLastChangeDate AS DATE) = (SELECT MaxEditDate FROM maxEdit m (NOLOCK) WHERE dtp.DateKey BETWEEN m.StartDate AND m.EndDate)
 GROUP BY
   dtp.[EntityKey]
   ,dtp.DateKey
   ,dd.[DateKey]
   ,dtp.[szNewUsed]
   ,ut.[UpTypeKey]

UNION

SELECT dtp.[EntityKey]
   --,dtp.[DateKey]
   --,dd.DateKey AS Entitydt
   ,dd.DateKey
   ,dtp.DateKey As Entitydt
      ,dtp.[szNewUsed]
      ,ut.[UpTypeKey]
    ,0 AS [TextLeadCount]
      ,0 AS [TextOptInRequest]
      ,0 AS [TextNoOptInRequest]
   ,SUM(CASE WHEN ISNULL(dtp.[PhoneNumber],'NoPhone') != 'NoPhone' THEN dtp.[TextOptIn] ELSE 0 END) AS [TextOptIn]
      --,0 AS [TextOptIn]
   ,SUM(CASE WHEN ISNULL(dtp.[PhoneNumber],'NoPhone') != 'NoPhone' THEN dtp.[TextOptOut] ELSE 0 END) AS [TextOptOut]
      --,0 AS [TextOptOut]
      ,0 AS [TextSent]
      ,0 AS [TextReceived]
      ,0 AS [TextAppt]
      ,0 AS [TextSold]
      ,0 AS [TextLeadCountNoPhone]
      ,0 AS [TextOptInRequestNoPhone]
      ,0 AS [TextNoOptInRequestNoPhone]
      --,0 AS [TextOptInNoPhone]
      --,0 AS [TextOptOutNoPhone]
  , SUM(CASE WHEN ISNULL(dtp.[PhoneNumber],'NoPhone') = 'NoPhone' THEN dtp.[TextOptIn] ELSE 0 END) AS TextOptInNoPhone
  , SUM(CASE WHEN ISNULL(dtp.[PhoneNumber],'NoPhone') = 'NoPhone' THEN dtp.[TextOptOut] ELSE 0 END) AS TextOptOutNoPhone
      ,0 AS [TextSentNoPhone]
      ,0 AS [TextReceivedNoPhone]
      ,0 AS [TextApptNoPhone]
      ,0 AS [TextSoldNoPhone]

--select dtp.*,ut.[UpTypeKey]
  FROM [Sonic_DW].[dbo].[DimTextPerformance] dtp
 JOIN [Sonic_DW].[dbo].DimUpType ut
  ON dtp.[szUpType] = ISNULL(ut.szUpType,ut.UpType)
 JOIN Sonic_DW.dbo.Dim_Date dd
  ON CONVERT(DATE,dtp.OptInSentDate) = dd.FullDate
  WHERE ISNULL(dtp.Active,1) = 1
  AND CAST(dtp.Meta_RowLastChangeDate AS DATE) = (SELECT MaxEditDate FROM maxEdit m (NOLOCK) WHERE dtp.DateKey BETWEEN m.StartDate AND m.EndDate)
 GROUP BY
   dtp.[EntityKey]
   ,dd.DateKey
   ,dtp.[DateKey]
   ,dtp.[szNewUsed]
   ,ut.[UpTypeKey]

UNION

SELECT dtp.[EntityKey]
      ,dd.[DateKey]
   ,dtp.DateKey AS entitydt
      ,dtp.[szNewUsed]
      ,ut.[UpTypeKey]
      ,0 AS [TextLeadCount]
      ,0 AS [TextOptInRequest]
      ,0 AS [TextNoOptInRequest]
      ,0 AS [TextOptIn]
      ,0 AS [TextOptOut]
      ,SUM(CASE WHEN ISNULL(dtp.[PhoneNumber],'NoPhone') != 'NoPhone' THEN dtp.[TextSent] ELSE 0 END) AS [TextSent]
      ,SUM(CASE WHEN ISNULL(dtp.[PhoneNumber],'NoPhone') != 'NoPhone' THEN dtp.[TextReceived] ELSE 0 END) AS [TextReceived]
      ,0 AS [TextAppt]
      ,0 AS [TextSold]
      ,0 AS [TextLeadCountNoPhone]
      ,0 AS [TextOptInRequestNoPhone]
      ,0 AS [TextNoOptInRequestNoPhone]
      ,0 AS [TextOptInNoPhone]
      ,0 AS [TextOptOutNoPhone]
      ,SUM(CASE WHEN ISNULL(dtp.[PhoneNumber],'NoPhone') = 'NoPhone' THEN dtp.[TextSent] ELSE 0 END) AS [TextSentNoPhone]
      ,SUM(CASE WHEN ISNULL(dtp.[PhoneNumber],'NoPhone') = 'NoPhone' THEN dtp.[TextReceived] ELSE 0 END) AS [TextReceivedNoPhone]
      ,0 AS [TextApptNoPhone]
      ,0 AS [TextSoldNoPhone]

---select dtp.*,dd.Datekey
  FROM [Sonic_DW].[dbo].[DimTextPerformance] dtp
 JOIN [Sonic_DW].[dbo].DimUpType ut
  ON dtp.[szUpType] = ISNULL(ut.szUpType,ut.UpType)
 JOIN Sonic_DW.dbo.Dim_Date dd
  ON CONVERT(DATE,dtp.Receiveddt) = dd.FullDate
   WHERE ISNULL(dtp.Active,1) = 1
  AND CAST(dtp.Meta_RowLastChangeDate AS DATE) = (SELECT MaxEditDate FROM maxEdit m (NOLOCK) WHERE dtp.DateKey BETWEEN m.StartDate AND m.EndDate)
 GROUP BY
   dtp.[EntityKey]
   ,dd.[DateKey]
   ,dtp.DateKey
   ,dtp.[szNewUsed]
   ,ut.[UpTypeKey]

)f
GROUP BY
  f.[EntityKey]
 ,f.[DateKey]
 ,f.EntityDt
 ,f.[szNewUsed]
 ,f.[UpTypeKey]




```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
