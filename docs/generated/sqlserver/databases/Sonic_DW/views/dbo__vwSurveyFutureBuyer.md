---
name: vwSurveyFutureBuyer
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

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Definition

```sql


CREATE view [dbo].[vwSurveyFutureBuyer] as


With emp as (
select distinct ee.EmployeeKey, a.asolastname + ', '+ asofirstname as EGName, asoworkemailaddress -- ISNULL(ee.WorkEmailAddress,ee.WorkEmailAddress2) AS ExperienceGuideEmailAddress 
            --  , ee.EmployeeFullName AS ExperienceGuideName 
from  DimEmployee ee
-- LEFT JOIN  emp ON a.OwnedByKey = emp.EmployeeKey
join dimassociate a
on a.asolastname + ', '+ a.asofirstname = ee.EmployeeFullName
and a.asojobcode = 'EPGECONS
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
