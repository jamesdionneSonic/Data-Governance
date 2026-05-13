---
name: vw_Pricing_Statuses
database: Sonic_DW
type: view
schema: darpts
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T20:14:33.860Z
---

## Overview

1- **Type**: View

- **Schema**: darpts

## Definition

```sql
CREATE VIEW darpts.vw_Pricing_Statuses
AS
SELECT
ROW_NUMBER() OVER(ORDER BY bm.business_model_type_nm, status.Status_Name) AS ID,
status.Status_Name AS STATUS, bm.business_model_type_nm
FROM            [D1-DASQL-01,11010].DA_Group.dbo.epsims_status_today AS status CROSS JOIN
                             (SELECT        business_model_type_nm
                               FROM            [D1-DASQL-01,11010].DA_Group.src.dim_business_model_type
                               WHERE        (active = 1)) AS bm
WHERE        (status.Status_ID IN (201, 202, 203, 235, 236, 237, 238, 232, 231, 224, 215, 225, 227, 233, 304, 305, 306, 214, 217, 216, 219, 218, 226))

```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
