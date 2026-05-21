---
name: vw_PlaybookSurveyStatus
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

CREATE VIEW [dbo].[vw_PlaybookSurveyStatus]
AS
SELECT        A.PlaybookID, A.FiscalQuarter AS SurveyQuarter, A.EntityKey, ps.PlaybookSurveyID, COALESCE (ps.PlaybookStatusID, 0) AS PlaybookStatusID
FROM            (SELECT        PlaybookID, FiscalQuarter, EntityKey
                          FROM            (SELECT DISTINCT EE.PlaybookID, d.FiscalQuarter, EE.EntityKey
                                                    FROM            (SELECT        e1.EntityKey, p1.PlaybookID, p1.PlaybookName, p1.PlaybookNameSub, p1.PlaybookYear
                                                                              FROM            (SELECT        EntityKey
                                                                                                        FROM            dbo.Dim_Entity
                                                                                                        WHERE        (EntPlaybookReportFlag = 'Active') AND (EntDefaultDlrshpLvl1 = 1)) AS e1 CROSS JOIN
                                                                                                            (SELECT        PlaybookID, PlaybookName, PlaybookNameSub, PlaybookYear
                                                                                                              FROM            dbo.PlaybookName
                                                                                                              WHERE        (PlaybookNameSub NOT LIKE '%Collision%')) AS p1) AS EE INNER JOIN
                                                                                  (SELECT        FiscalQuarter, FiscalYear
                                                                                    FROM            dbo.vw_Dim_date
                                                                                    WHERE        (FullDate < GETDATE())) AS d ON EE.PlaybookYear = d.FiscalYear
                                                    UNION ALL
                                                    SELECT DISTINCT EE_1.PlaybookID, d_1.FiscalQuarter, EE_1.EntityKey
                                                    FROM            (SELECT        e1_1.EntityKey, p1_1.PlaybookID, p1_1.PlaybookName, p1_1.PlaybookNameSub, p1_1.PlaybookYear
                                                                              FROM            (SELECT        EntityKey
                                                                                                        FROM            dbo.Dim_Entity AS Dim_Entity_1
                                                                                                        WHERE        (EntPlaybookReportFlag = 'Active') AND (EntDefaultDlrshpLvl1 = 1) AND (EntHasBodyShop = 'BodyShop')) AS e1_1 CROSS JOIN
                                                                                                            (SELECT        PlaybookID, PlaybookName, PlaybookNameSub, PlaybookYear
                                                                                                              FROM            dbo.PlaybookName AS PlaybookName_1
                                                                                                              WHERE        (PlaybookNameSub LIKE '%Collision%')) AS p1_1) AS EE_1 INNER JOIN
                                                                                 (SELECT        FiscalQuarter, FiscalYear
                                                                                   FROM            dbo.vw_Dim_date AS vw_Dim_date_1
                                                                                   WHERE        (FullDate < GETDATE())) AS d_1 ON EE_1.PlaybookYear = d_1.FiscalYear) AS a_1) AS A LEFT OUTER JOIN
                         dbo.PlaybookSurvey AS ps ON A.EntityKey = ps.EntityKey AND A.PlaybookID = ps.PlaybookID AND A.FiscalQuarter = ps.SurveyQuarter


```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
