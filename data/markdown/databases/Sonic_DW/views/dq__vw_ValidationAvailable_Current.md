---
name: vw_ValidationAvailable_Current
database: Sonic_DW
type: view
schema: dq
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
dependency_count: 3
column_count: 0
extracted_at: 2026-05-12T20:14:33.860Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dq

## Dependencies

This view depends on:

- **dbo.Dim_Validation** (U )
- **dbo.Fact_DQValidation** (U )
- **dq.vw_Fact_DQValidation** (V )

## Definition

```sql

CREATE VIEW [dq].[vw_ValidationAvailable_Current]
AS
      SELECT
        dv.DateKey
      , dv.ValidationKey
      , dv.RuleName
      , dv.ReportingActive
      , case when count(f.validationkey) <> 0 then 1 else 0 end as ValidationPresent
      , case when valerr.ErrPresent = 1 then 1 else 0 end as ValidationErrors
FROM
      (
            select distinct v.ValidationKey, v.RuleName, ReportingActive, convert(varchar(10),getdate(),112) as datekey
            from dim_Validation v with (nolock)
        ) dv

      left join dbo.fact_DQValidation f with (nolock)
            on dv.datekey = f.datekey
                  and dv.ValidationKey = f.ValidationKey

      left join   (
                              select case when sum(Is_Val_Err) <> 0 then 1 else 0 end as ErrPresent
                                    , ValidationKey
                              from dq.vw_Fact_DQValidation
                              where datekey = convert(varchar(10),getdate(),112)    /*Only look at the current date*/
                              group by ValidationKey
                        ) valerr
            on dv.ValidationKEy = valerr.ValidationKey
GROUP BY
        dv.ValidationKey
      , dv.RuleName
      , dv.ReportingActive
      , dv.DateKey
      , Case when valerr.ErrPresent = 1 then 1 else 0 end







```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
