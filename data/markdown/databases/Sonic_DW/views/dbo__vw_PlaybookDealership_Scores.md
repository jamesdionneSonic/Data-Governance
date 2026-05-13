---
name: vw_PlaybookDealership_Scores
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - PlaybookAnswer
  - PlaybookEntityRel
  - PlaybookName
  - PlaybookQuestions
  - PlaybookScoreCode
  - PlaybookStatus
  - PlaybookSurvey
  - vw_Dim_Entity
  - vw_PlaybookAnswer
  - vw_PlaybookSurvey
dependency_count: 10
column_count: 5
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.PlaybookAnswer** (U )
- **dbo.PlaybookEntityRel** (U )
- **dbo.PlaybookName** (U )
- **dbo.PlaybookQuestions** (U )
- **dbo.PlaybookScoreCode** (U )
- **dbo.PlaybookStatus** (U )
- **dbo.PlaybookSurvey** (U )
- **dbo.vw_Dim_Entity** (V )
- **dbo.vw_PlaybookAnswer** (V )
- **dbo.vw_PlaybookSurvey** (V )

## Columns

| Name         | Type    | Nullable | Description |
| ------------ | ------- | -------- | ----------- |
| `Region`     | varchar | ✓        |             |
| `Dealership` | varchar | ✓        |             |
| `Score`      | int     | ✓        |             |
| `Max_Score`  | float   | ✓        |             |
| `Score_Pct`  | float   | ✓        |             |

## Definition

```sql




CREATE VIEW [dbo].[vw_PlaybookDealership_Scores]
AS
select
pa99.[EntRegion]  Region,
pa99.[EntHFMDealershipName]  Dealership,
sum(pa99.WJXBFS1)Score,
sum(pa99.WJXBFS2)Max_Score,
sum(pa99.WJXBFS4)Score_Pct

from
(
select	a16.[EntRegion]  EntRegion,
	a16.[EntDealerLvl1]  EntHFMDealershipName,
	a14.[PbeEntityID]  EntityKey,
	(coalesce(a16.[EntHFMDealershipName], '') + ' - ' + coalesce(a16.[EntBrand], ''))  CustCol_1,
	a14.[PbePlaybookID]  PlaybookID,
	a112.[PlaybookName]  PlaybookName,
	a13.[EntityRelID]  PbeEntityRelID,
	a14.[PbePlaybookYear]  PbePlaybookYear,
	coalesce(pa11.[PlaybookSurveyID], pa12.[PlaybookSurveyID])  PlaybookSurveyID,
	a110.[PlaybookName]  PlaybookName0,
	a13.[PlaybookStatusID]  PstStatusID,
	a111.[StatusDesc]  StatusDesc,
	a19.[SubSectionNumber]  SubSectionNumber,
	a19.[SubSection]  SubSection,
	a19.[QuestionNumber]  QuestionNumber,
	coalesce(pa11.[QuestionID0], pa12.[QuestionID0])  QuestionID,
	a19.[Question]  Question,
	coalesce(pa11.[QuestionID], pa12.[QuestionID])  QuestionID0,
	Case when a19.[SubQuestionNumber] = 'X' then convert (varchar(4),a19.[QuestionNumber]) else convert (varchar(4),a19.[QuestionNumber]) + '.' +a19.[SubQuestionNumber] end  CustCol_24,
	a19.[SectionNumber]  SectionNumber,
	a19.[Section]  Section,
	pa11.[WJXBFS1]  WJXBFS1,
	pa12.[WJXBFS1]  WJXBFS2,
	pa15.[WJXBFS1]  WJXBFS3,
	ISNULL((pa11.[WJXBFS1] / NULLIF(pa15.[WJXBFS1], 0)), 0)  WJXBFS4,
	ISNULL((pa11.[WJXBFS1] / NULLIF(pa12.[WJXBFS1], 0)), 0)  WJXBFS5,
	pa17.[WJXBFS1]  WJXBFS6,
	pa18.[WJXBFS1]  WJXBFS7
from	(select	a11.[QuestionID]  QuestionID,
		a11.[QuestionID]  QuestionID0,
		a11.[PlaybookSurveyID]  PlaybookSurveyID,
		sum(a11.[QuestionScore])  WJXBFS1
	from	PlaybookAnswer	a11
		join	(select	a11.[PlaybookSurveyID]  PlaybookSurveyID,
			a11.[QuestionID]  QuestionID,
			a11.[QuestionID]  QuestionID0
		from	PlaybookAnswer	a11
			join	PlaybookScoreCode	a12
			  on 	(a11.[ScoreCodeID] = a12.[ScoreCodeID])
		where	(a11.[ScoreCodeID] in (3)
		 and a12.[ScoreIsValid] in (1))
		group by	a11.[PlaybookSurveyID],
			a11.[QuestionID],
			a11.[QuestionID]
		having	sum(a11.[QuestionScore]) is not null
		)	pa12
		  on 	(a11.[PlaybookSurveyID] = pa12.[PlaybookSurveyID] and
		a11.[QuestionID] = pa12.[QuestionID0] and
		a11.[QuestionID] = pa12.[QuestionID])
		join	PlaybookScoreCode	a13
		  on 	(a11.[ScoreCodeID] = a13.[ScoreCodeID])
	where	(a11.[ScoreCodeID] in (3)
	 and a13.[ScoreIsValid] in (1))
	group by	a11.[QuestionID],
		a11.[QuestionID],
		a11.[PlaybookSurveyID]
	)	pa11
	full outer join	(select	a11.[QuestionID]  QuestionID,
		a11.[QuestionID]  QuestionID0,
		a11.[PlaybookSurveyID]  PlaybookSurveyID,
		sum(CAST(a11.[PointsPossible] AS REAL))  WJXBFS1
	from	vw_PlaybookAnswer	a11
		join	(select	a11.[PlaybookSurveyID]  PlaybookSurveyID,
			a11.[QuestionID]  QuestionID,
			a11.[QuestionID]  QuestionID0
		from	PlaybookAnswer	a11
			join	PlaybookScoreCode	a12
			  on 	(a11.[ScoreCodeID] = a12.[ScoreCodeID])
		where	(a11.[ScoreCodeID] in (3)
		 and a12.[ScoreIsValid] in (1))
		group by	a11.[PlaybookSurveyID],
			a11.[QuestionID],
			a11.[QuestionID]
		having	sum(a11.[QuestionScore]) is not null
		)	pa12
		  on 	(a11.[PlaybookSurveyID] = pa12.[PlaybookSurveyID] and
		a11.[QuestionID] = pa12.[QuestionID0] and
		a11.[QuestionID] = pa12.[QuestionID])
	group by	a11.[QuestionID],
		a11.[QuestionID],
		a11.[PlaybookSurveyID]
	)	pa12
	  on 	(pa11.[PlaybookSurveyID] = pa12.[PlaybookSurveyID] and
	pa11.[QuestionID0] = pa12.[QuestionID0] and
	pa11.[QuestionID] = pa12.[QuestionID])
	join	PlaybookSurvey	a13
	  on 	(coalesce(pa11.[PlaybookSurveyID], pa12.[PlaybookSurveyID]) = a13.[PlaybookSurveyID])
	join	PlaybookEntityRel	a14
	  on 	(a13.[EntityRelID] = a14.[PbeEntityRelID])
	left outer join	(select	a14.[PbePlaybookID]  PlaybookID,
		sum(CAST(a11.[PointsPossible] AS REAL))  WJXBFS1
	from	vw_PlaybookAnswer	a11
		join	(select	a11.[PlaybookSurveyID]  PlaybookSurveyID,
			a11.[QuestionID]  QuestionID,
			a11.[QuestionID]  QuestionID0
		from	PlaybookAnswer	a11
			join	PlaybookScoreCode	a12
			  on 	(a11.[ScoreCodeID] = a12.[ScoreCodeID])
		where	(a11.[ScoreCodeID] in (3)
		 and a12.[ScoreIsValid] in (1))
		group by	a11.[PlaybookSurveyID],
			a11.[QuestionID],
			a11.[QuestionID]
		having	sum(a11.[QuestionScore]) is not null
		)	pa12
		  on 	(a11.[PlaybookSurveyID] = pa12.[PlaybookSurveyID] and
		a11.[QuestionID] = pa12.[QuestionID0] and
		a11.[QuestionID] = pa12.[QuestionID])
		join	PlaybookSurvey	a13
		  on 	(a11.[PlaybookSurveyID] = a13.[PlaybookSurveyID])
		join	PlaybookEntityRel	a14
		  on 	(a13.[EntityRelID] = a14.[PbeEntityRelID])
	group by	a14.[PbePlaybookID]
	)	pa15
	  on 	(a14.[PbePlaybookID] = pa15.[PlaybookID])
	join	vw_Dim_Entity	a16
	  on 	(a14.[PbeEntityID] = a16.[EntityKey])
	left outer join	(select	a15.[EntDealerLvl1]  EntHFMDealershipName,
		sum(CAST(a11.[PointsPossible] AS REAL))  WJXBFS1
	from	vw_PlaybookAnswer	a11
		join	(select	a11.[PlaybookSurveyID]  PlaybookSurveyID,
			a11.[QuestionID]  QuestionID,
			a11.[QuestionID]  QuestionID0
		from	PlaybookAnswer	a11
			join	PlaybookScoreCode	a12
			  on 	(a11.[ScoreCodeID] = a12.[ScoreCodeID])
		where	(a11.[ScoreCodeID] in (3)
		 and a12.[ScoreIsValid] in (1))
		group by	a11.[PlaybookSurveyID],
			a11.[QuestionID],
			a11.[QuestionID]
		having	sum(a11.[QuestionScore]) is not null
		)	pa12
		  on 	(a11.[PlaybookSurveyID] = pa12.[PlaybookSurveyID] and
		a11.[QuestionID] = pa12.[QuestionID0] and
		a11.[QuestionID] = pa12.[QuestionID])
		join	PlaybookSurvey	a13
		  on 	(a11.[PlaybookSurveyID] = a13.[PlaybookSurveyID])
		join	PlaybookEntityRel	a14
		  on 	(a13.[EntityRelID] = a14.[PbeEntityRelID])
		join	vw_Dim_Entity	a15
		  on 	(a14.[PbeEntityID] = a15.[EntityKey])
	group by	a15.[EntDealerLvl1]
	)	pa17
	  on 	(a16.[EntDealerLvl1] = pa17.[EntHFMDealershipName])
	left outer join	(select	a16.[EntDealerLvl1]  EntHFMDealershipName,
		sum(a11.[QuestionScore])  WJXBFS1
	from	PlaybookAnswer	a11
		join	(select	a11.[PlaybookSurveyID]  PlaybookSurveyID,
			a11.[QuestionID]  QuestionID,
			a11.[QuestionID]  QuestionID0
		from	PlaybookAnswer	a11
			join	PlaybookScoreCode	a12
			  on 	(a11.[ScoreCodeID] = a12.[ScoreCodeID])
		where	(a11.[ScoreCodeID] in (3)
		 and a12.[ScoreIsValid] in (1))
		group by	a11.[PlaybookSurveyID],
			a11.[QuestionID],
			a11.[QuestionID]
		having	sum(a11.[QuestionScore]) is not null
		)	pa12
		  on 	(a11.[PlaybookSurveyID] = pa12.[PlaybookSurveyID] and
		a11.[QuestionID] = pa12.[QuestionID0] and
		a11.[QuestionID] = pa12.[QuestionID])
		join	PlaybookScoreCode	a13
		  on 	(a11.[ScoreCodeID] = a13.[ScoreCodeID])
		join	PlaybookSurvey	a14
		  on 	(a11.[PlaybookSurveyID] = a14.[PlaybookSurveyID])
		join	PlaybookEntityRel	a15
		  on 	(a14.[EntityRelID] = a15.[PbeEntityRelID])
		join	vw_Dim_Entity	a16
		  on 	(a15.[PbeEntityID] = a16.[EntityKey])
	where	(a11.[ScoreCodeID] in (3)
	 and a13.[ScoreIsValid] in (1))
	group by	a16.[EntDealerLvl1]
	)	pa18
	  on 	(a16.[EntDealerLvl1] = pa18.[EntHFMDealershipName])
	join	PlaybookQuestions	a19
	  on 	(coalesce(pa11.[QuestionID0], pa12.[QuestionID0]) = a19.[QuestionID] and
	coalesce(pa11.[QuestionID], pa12.[QuestionID]) = a19.[QuestionID])
	join	vw_PlaybookSurvey	a110
	  on 	(coalesce(pa11.[PlaybookSurveyID], pa12.[PlaybookSurveyID]) = a110.[PlaybookSurveyID])
	join	PlaybookStatus	a111
	  on 	(a13.[PlaybookStatusID] = a111.[StatusID])
	join	PlaybookName	a112
	  on 	(a14.[PbePlaybookID] = a112.[PlaybookID])
) pa99
group by
pa99.[EntRegion],
pa99.[EntHFMDealershipName]
```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
