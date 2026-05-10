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
extracted_at: 2026-05-09T12:34:14.349Z
---

## Overview

1- **Type**: View
- **Schema**: dbo

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
join sonic_dw.dbo.dimsur
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
