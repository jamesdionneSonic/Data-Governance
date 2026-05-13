---
name: vw_PlayBookSummary_Scores
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

1- **Type**: View

- **Schema**: dbo

## Definition

```sql
CREATE VIEW dbo.vw_PlayBookSummary_Scores
AS
SELECT     pa99.EntRegion AS Region, pa99.EntHFMDealershipName AS Dealership, SUM(pa99.WJXBFS1) AS Score, SUM(pa99.WJXBFS2) AS Max_Score, SUM(pa99.WJXBFS4)
                      AS Score_Pct, pa99.PlaybookID, pa99.PbePlaybookYear, SUM(pa99.WJXBFS1) / SUM(pa99.WJXBFS2) AS TotalScore, pa99.PbePlaybookYear - 1 AS pbYearLY,
                      dbo.PlaybookName.PlaybookNameSub, pa99.EntityKey
FROM         (SELECT     a16.EntRegion, a16.EntDealerLvl1 AS EntHFMDealershipName, a14.PbeEntityID AS EntityKey, COALESCE (a16.EntHFMDealershipName, '')
                                              + ' - ' + COALESCE (a16.EntBrand, '') AS CustCol_1, a14.PbePlaybookID AS PlaybookID, a112.PlaybookName, a13.EntityRelID AS PbeEntityRelID,
                                              a14.PbePlaybookYear, COALESCE (pa11.PlaybookSurveyID, pa12_5.PlaybookSurveyID) AS PlaybookSurveyID, a110.PlaybookName AS PlaybookName0,
                                              a13.PlaybookStatusID AS PstStatusID, a111.StatusDesc, a19.SubSectionNumber, a19.SubSection, a19.QuestionNumber, COALESCE (pa11.QuestionID0,
                                              pa12_5.QuestionID0) AS QuestionID, a19.Question, COALESCE (pa11.QuestionID, pa12_5.QuestionID) AS QuestionID0,
                                              CASE WHEN a19.[SubQuestionNumber] = 'X' THEN CONVERT(varchar(4), a19.[QuestionNumber]) ELSE CONVERT(varchar(4), a19.[QuestionNumber])
                                              + '.' + a19.[SubQuestionNumber] END AS CustCol_24, a19.SectionNumber, a19.Section, pa11.WJXBFS1, pa12_5.WJXBFS1 AS WJXBFS2,
                                              pa15.WJXBFS1 AS WJXBFS3, ISNULL(pa11.WJXBFS1 / NULLIF (pa15.WJXBFS1, 0), 0) AS WJXBFS4, ISNULL(pa11.WJXBFS1 / NULLIF (pa12_5.WJXBFS1,
                                              0), 0) AS WJXBFS5, pa17.WJXBFS1 AS WJXBFS6, pa18.WJXBFS1 AS WJXBFS7
                       FROM          (SELECT     a11.QuestionID, a11.QuestionID AS QuestionID0, a11.PlaybookSurveyID, SUM(a11.QuestionScore) AS WJXBFS1
                                               FROM          dbo.PlaybookAnswer AS a11 INNER JOIN
                                                                          (SELECT     a11.PlaybookSurveyID, a11.QuestionID, a11.QuestionID AS QuestionID0
                                                                            FROM          dbo.PlaybookAnswer AS a11 INNER JOIN
                                                                                                   dbo.PlaybookScoreCode AS a12 ON a11.ScoreCodeID = a12.ScoreCodeID
                                                                            WHERE      (a11.ScoreCodeID IN (3)) AND (a12.ScoreIsValid IN (1))
                                                                            GROUP BY a11.PlaybookSurveyID, a11.QuestionID, a11.QuestionID
                                                                            HAVING      (SUM(a11.QuestionScore) IS NOT NULL)) AS pa12 ON a11.PlaybookSurveyID = pa12.PlaybookSurveyID AND
                                                                      a11.QuestionID = pa12.QuestionID0 AND a11.QuestionID = pa12.QuestionID INNER JOIN
                                                                      dbo.PlaybookScoreCode AS a13 ON a11.ScoreCodeID = a13.ScoreCodeID
                                               WHERE      (a11.ScoreCodeID IN (3)) AND (a13.ScoreIsValid IN (1))
                                               GROUP BY a11.QuestionID, a11.QuestionID, a11.PlaybookSurveyID) AS pa11 FULL OUTER JOIN
                                                  (SELECT     a11.QuestionID, a11.QuestionID AS QuestionID0, a11.PlaybookSurveyID, SUM(CAST(a11.PointsPossible AS REAL)) AS WJXBFS1
                                                    FROM          dbo.vw_PlaybookAnswer AS a11 INNER JOIN
                                                                               (SELECT     a11.PlaybookSurveyID, a11.QuestionID, a11.QuestionID AS QuestionID0
                                                                                 FROM          dbo.PlaybookAnswer AS a11 INNER JOIN
                                                                                                        dbo.PlaybookScoreCode AS a12 ON a11.ScoreCodeID = a12.ScoreCodeID
                                                                                 WHERE      (a11.ScoreCodeID IN (3)) AND (a12.ScoreIsValid IN (1))
                                                                                 GROUP BY a11.PlaybookSurveyID, a11.QuestionID, a11.QuestionID
                                                                                 HAVING      (SUM(a11.QuestionScore) IS NOT NULL)) AS pa12_4 ON a11.PlaybookSurveyID = pa12_4.PlaybookSurveyID AND
                                                                           a11.QuestionID = pa12_4.QuestionID0 AND a11.QuestionID = pa12_4.QuestionID
                                                    GROUP BY a11.QuestionID, a11.QuestionID, a11.PlaybookSurveyID) AS pa12_5 ON pa11.PlaybookSurveyID = pa12_5.PlaybookSurveyID AND
                                              pa11.QuestionID0 = pa12_5.QuestionID0 AND pa11.QuestionID = pa12_5.QuestionID INNER JOIN
                                              dbo.PlaybookSurvey AS a13 ON COALESCE (pa11.PlaybookSurveyID, pa12_5.PlaybookSurveyID) = a13.PlaybookSurveyID INNER JOIN
                                              dbo.PlaybookEntityRel AS a14 ON a13.EntityRelID = a14.PbeEntityRelID LEFT OUTER JOIN
                                                  (SELECT     a14.PbePlaybookID AS PlaybookID, SUM(CAST(a11.PointsPossible AS REAL)) AS WJXBFS1
                                                    FROM          dbo.vw_PlaybookAnswer AS a11 INNER JOIN
                                                                               (SELECT     a11.PlaybookSurveyID, a11.QuestionID, a11.QuestionID AS QuestionID0
                                                                                 FROM          dbo.PlaybookAnswer AS a11 INNER JOIN
                                                                                                        dbo.PlaybookScoreCode AS a12 ON a11.ScoreCodeID = a12.ScoreCodeID
                                                                                 WHERE      (a11.ScoreCodeID IN (3)) AND (a12.ScoreIsValid IN (1))
                                                                                 GROUP BY a11.PlaybookSurveyID, a11.QuestionID, a11.QuestionID
                                                                                 HAVING      (SUM(a11.QuestionScore) IS NOT NULL)) AS pa12_3 ON a11.PlaybookSurveyID = pa12_3.PlaybookSurveyID AND
                                                                           a11.QuestionID = pa12_3.QuestionID0 AND a11.QuestionID = pa12_3.QuestionID INNER JOIN
                                                                           dbo.PlaybookSurvey AS a13 ON a11.PlaybookSurveyID = a13.PlaybookSurveyID INNER JOIN
                                                                           dbo.PlaybookEntityRel AS a14 ON a13.EntityRelID = a14.PbeEntityRelID
                                                    GROUP BY a14.PbePlaybookID) AS pa15 ON a14.PbePlaybookID = pa15.PlaybookID INNER JOIN
                                              dbo.vw_Dim_Entity AS a16 ON a14.PbeEntityID = a16.EntityKey LEFT OUTER JOIN
                                                  (SELECT     a15.EntDealerLvl1 AS EntHFMDealershipName, SUM(CAST(a11.PointsPossible AS REAL)) AS WJXBFS1
                                                    FROM          dbo.vw_PlaybookAnswer AS a11 INNER JOIN
                                                                               (SELECT     a11.PlaybookSurveyID, a11.QuestionID, a11.QuestionID AS QuestionID0
                                                                                 FROM          dbo.PlaybookAnswer AS a11 INNER JOIN
                                                                                                        dbo.PlaybookScoreCode AS a12 ON a11.ScoreCodeID = a12.ScoreCodeID
                                                                                 WHERE      (a11.ScoreCodeID IN (3)) AND (a12.ScoreIsValid IN (1))
                                                                                 GROUP BY a11.PlaybookSurveyID, a11.QuestionID, a11.QuestionID
                                                                                 HAVING      (SUM(a11.QuestionScore) IS NOT NULL)) AS pa12_2 ON a11.PlaybookSurveyID = pa12_2.PlaybookSurveyID AND
                                                                           a11.QuestionID = pa12_2.QuestionID0 AND a11.QuestionID = pa12_2.QuestionID INNER JOIN
                                                                           dbo.PlaybookSurvey AS a13 ON a11.PlaybookSurveyID = a13.PlaybookSurveyID INNER JOIN
                                                                           dbo.PlaybookEntityRel AS a14 ON a13.EntityRelID = a14.PbeEntityRelID INNER JOIN
                                                                           dbo.vw_Dim_Entity AS a15 ON a14.PbeEntityID = a15.EntityKey
                                                    GROUP BY a15.EntDealerLvl1) AS pa17 ON a16.EntDealerLvl1 = pa17.EntHFMDealershipName LEFT OUTER JOIN
                                                  (SELECT     a16.EntDealerLvl1 AS EntHFMDealershipName, SUM(a11.QuestionScore) AS WJXBFS1
                                                    FROM          dbo.PlaybookAnswer AS a11 INNER JOIN
                                                                               (SELECT     a11.PlaybookSurveyID, a11.QuestionID, a11.QuestionID AS QuestionID0
                                                                                 FROM          dbo.PlaybookAnswer AS a11 INNER JOIN
                                                                                                        dbo.PlaybookScoreCode AS a12 ON a11.ScoreCodeID = a12.ScoreCodeID
                                                                                 WHERE      (a11.ScoreCodeID IN (3)) AND (a12.ScoreIsValid IN (1))
                                                                                 GROUP BY a11.PlaybookSurveyID, a11.QuestionID, a11.QuestionID
                                                                                 HAVING      (SUM(a11.QuestionScore) IS NOT NULL)) AS pa12_1 ON a11.PlaybookSurveyID = pa12_1.PlaybookSurveyID AND
                                                                           a11.QuestionID = pa12_1.QuestionID0 AND a11.QuestionID = pa12_1.QuestionID INNER JOIN
                                                                           dbo.PlaybookScoreCode AS a13 ON a11.ScoreCodeID = a13.ScoreCodeID INNER JOIN
                                                                           dbo.PlaybookSurvey AS a14 ON a11.PlaybookSurveyID = a14.PlaybookSurveyID INNER JOIN
                                                                           dbo.PlaybookEntityRel AS a15 ON a14.EntityRelID = a15.PbeEntityRelID INNER JOIN
                                                                           dbo.vw_Dim_Entity AS a16 ON a15.PbeEntityID = a16.EntityKey
                                                    WHERE      (a11.ScoreCodeID IN (3)) AND (a13.ScoreIsValid IN (1))
                                                    GROUP BY a16.EntDealerLvl1) AS pa18 ON a16.EntDealerLvl1 = pa18.EntHFMDealershipName INNER JOIN
                                              dbo.PlaybookQuestions AS a19 ON COALESCE (pa11.QuestionID0, pa12_5.QuestionID0) = a19.QuestionID AND COALESCE (pa11.QuestionID,
                                              pa12_5.QuestionID) = a19.QuestionID INNER JOIN
                                              dbo.vw_PlaybookSurvey AS a110 ON COALESCE (pa11.PlaybookSurveyID, pa12_5.PlaybookSurveyID) = a110.PlaybookSurveyID INNER JOIN
                                              dbo.PlaybookStatus AS a111 ON a13.PlaybookStatusID = a111.StatusID INNER JOIN
                                              dbo.PlaybookName AS a112 ON a14.PbePlaybookID = a112.PlaybookID) AS pa99 INNER JOIN
                      dbo.PlaybookName ON pa99.PlaybookID = dbo.PlaybookName.PlaybookID
GROUP BY pa99.EntRegion, pa99.EntHFMDealershipName, pa99.PlaybookID, pa99.PbePlaybookYear, pa99.PbePlaybookYear - 1, dbo.PlaybookName.PlaybookNameSub,
                      pa99.EntityKey

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
