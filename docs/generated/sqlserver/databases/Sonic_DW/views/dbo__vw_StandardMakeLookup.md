---
name: vw_StandardMakeLookup
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

--- Updated by Raj on --01/11/2013-------
--- Modified: Jo Carter		Date: 2017-11-29	Changed to use synonyms
--- RJ - Removed the active filter and added row number to get the latest records from DMS -  2026-02-18

CREATE   view [dbo].[vw_StandardMakeLookup]
as

WITH cte_Make AS (
SELECT DISTINCT
            v.VehMakeCode
           ,m.[StandardMakeCode]
           ,CASE WHEN m.[StandardMakeCode] = 'FRT' THEN 'Freightliner'
                 WHEN m.[StandardMakeCode] = 'GENNV' THEN 'Non-Vehicle'
                 WHEN m.[StandardMakeCode] = 'MACK' THEN 'MACK'
                 WHEN m.[StandardMakeCode] = 'PETR' THEN 'Peterbilt'
                 WHEN m.[StandardMakeCode] = 'HIN' THEN 'Hino Trucks'
                 WHEN m.[StandardMakeCode] = 'UD' THEN 'UD Trucks'
                 ELSE k.make_desc
            END AS Make_Desc
           ,COUNT(v.VehVIN) AS vehicleCount
  FROM      Sonic_DW.dbo.Dim_Vehicle v
            LEFT OUTER JOIN [ETL_Staging].[dbo].[StandardMakeLookup] m ON v.VehMakeCode = m.vehmakecode
            --LEFT OUTER JOIN SynVehLocMake as K --[cor-sql-02].webv.dbo.veh_loc_make k
            LEFT OUTER JOIN (SELECT
                                   Make_CD ,make_desc,Act_Flg,Last_chng_Dttm,
                                   Row_Number() over (PARTITION BY Make_CD ORDER BY Act_Flg desc, Last_chng_Dttm DESC) as RowNum
                              FROM SynVehLocMake) k
				ON  k.make_cd = m.standardmakecode
				--AND k.act_flg = 1
				AND k.RowNum=1
  GROUP BY  v.VehMakeCode
           ,m.StandardMakeCode
           ,CASE WHEN m.[StandardMakeCode] = 'FRT' THEN 'Freightliner'
                 WHEN m.[StandardMakeCode] = 'GENNV' THEN 'Non-Vehicle'
                 WHEN m.[StandardMakeCode] = 'MACK' THEN 'MACK'
                 WHEN m.[StandardMakeCode] = 'PETR' THEN 'Peterbilt'
                 WHEN m.[StandardMakeCode] = 'HIN' THEN 'Hino Trucks'
                 WHEN m.[StandardMakeCode] = 'UD' THEN 'UD Trucks'
                 ELSE k.make_desc
            END
)
SELECT
VehMakeCode
,ISNULL(StandardMakeCode, 'Unknown') AS StandardMakeCode
,ISNULL(Make_Desc, 'Unknown') AS Make_Desc
,vehicleCount
FROM cte_Make
;

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
