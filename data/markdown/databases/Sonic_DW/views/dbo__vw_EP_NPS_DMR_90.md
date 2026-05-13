---
name: vw_EP_NPS_DMR_90
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on: []
dependency_count: 0
column_count: 7
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Columns

| Name                  | Type    | Nullable | Description |
| --------------------- | ------- | -------- | ----------- |
| `Dealership`          | varchar | ✓        |             |
| `EntityKey`           | int     |          |             |
| `ExperienceGuideName` | varchar | ✓        |             |
| `Detractors`          | int     | ✓        |             |
| `Passives`            | int     | ✓        |             |
| `Promoters`           | int     | ✓        |             |
| `Answercount`         | int     | ✓        |             |

## Definition

```sql




CREATE VIEW [dbo].[vw_EP_NPS_DMR_90]
AS

select e.entdealerlvl1 Dealership
		, e.EntityKey
		, REPLACE(dsa.ExperienceGuideName, ', ', ',') AS ExperienceGuideName
		, SUM(CASE WHEN a.QuestionAnswer < 7 THEN 1 ELSE 0 END) AS Detractors
		, SUM(CASE WHEN a.QuestionAnswer BETWEEN 7 AND 8 THEN 1 ELSE 0 END) AS Passives
		, SUM(CASE WHEN a.QuestionAnswer > 8 THEN 1 ELSE 0 END) AS Promoters
		, count(*) AS Answercount
from sonic_dw.dbo.factsurveyauditdetail a
join sonic_dw.dbo.dimsurveyquestion q
on a.questionID = q.questionID
join sonic_dw.dbo.dimsurveyauditdetail dsad
on dsad.SurveyAuditDetailKey = a.surveyauditdetailkey
join sonic_dw.dbo.dimsurveyaudit dsa
on dsa.surveyauditkey = dsad.surveyauditkey
join sonic_dw.dbo.vw_dim_entityEP e
on e.entitykey = dsa.EntityKey
where 1=1
		and questionnumber = 1 -- this is the new NPS question number
		and dsa.BuyerType<> 'Future Buyer' -- exclude future buyer surveys
		and q.Meta_SourceSystemName = 'IBEX' -- this is the new data source
		and cast(a.datesubmitted as date) >= DATEADD(DD, - 90, GETDATE())
group by e.entdealerlvl1 , e.EntityKey
		, REPLACE(dsa.ExperienceGuideName, ', ', ',')

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
