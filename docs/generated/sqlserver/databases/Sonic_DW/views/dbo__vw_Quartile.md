---
name: vw_Quartile
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

2- **Type**: View

- **Schema**: dbo

## Definition

```sql


CREATE VIEW [dbo].[vw_Quartile]
AS
SELECT     x.EntDealerLvl1, q.dtMonthEnd, q.lLotUpNew, q.lLotUpUsed, q.lLotUpSoldNew, q.lLotUpSoldUsed, q.lDemo, q.lWriteUps, q.lTO, q.lPhoneUpNew,
                      q.lPhoneUpUsed, q.lPhoneUpApptNew, q.lPhoneUpApptUsed, q.lPhoneUpApptShowNew, q.lPhoneUpApptShowUsed, q.lPhoneUpApptSoldNew,
                      q.lPhoneUpApptSoldUsed, q.lPhoneUpSoldNew, q.lPhoneUpSoldUsed, q.lWebUpNew, q.lWebUpUsed, q.lWebUpApptNew, q.lWebUpApptUsed,
                      q.lWebUpApptShowNew, q.lWebUpApptShowUsed, q.lWebUpApptSoldNew, q.lWebUpApptSoldUsed, q.lWebUpSoldNew, q.lWebUpSoldUsed,
                      q.lResponseTimeNumberInSet, q.lResponseTimeTotalMinutes, q.lTotalApptSetMTD, q.lTotalApptShowedMTD, q.lTotalApptSoldMTD,
                      q.lTotalSurveysMTD, q.lTotalSurveysSoldMTD, m.StartDate, d2.DateKey
FROM         dbo.xrefQuartileDealership AS x INNER JOIN
                      dbo.tblQuartile AS q ON x.COMPANYID = q.COMPANYID INNER JOIN
                      dbo.Dim_Date AS d1 ON q.dtMonthEnd = d1.FullDate INNER JOIN
                          (SELECT     MAX(Dim_Date_1.DateKey) AS DateKey, Dim_Date_1.FiscalMonth, Dim_Date_1.FiscalYear
                            FROM          dbo.tblQuartile AS tblQuartile_1 INNER JOIN
                                                   dbo.Dim_Date AS Dim_Date_1 ON tblQuartile_1.dtMonthEnd = Dim_Date_1.FullDate
                            GROUP BY Dim_Date_1.FiscalMonth, Dim_Date_1.FiscalYear) AS a ON d1.DateKey = a.DateKey INNER JOIN
                      dbo.vw_Dim_Month AS m ON a.FiscalYear = m.FiscalYear AND a.FiscalMonth = m.FiscalMonth INNER JOIN
                      dbo.Dim_Date AS d2 ON m.StartDate = d2.FullDate



```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
