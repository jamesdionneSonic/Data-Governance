---
name: vw_xrfCoraCompanyPrefix
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Dim_Entity
  - xrfCoraCompanyPrefix
dependency_count: 2
column_count: 2
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Entity** (U )
- **dbo.xrfCoraCompanyPrefix** (U )

## Columns

| Name           | Type | Nullable | Description |
| -------------- | ---- | -------- | ----------- |
| `EntityKey`    | int  | ✓        |             |
| `cora_acct_id` | int  | ✓        |             |

## Definition

```sql
CREATE VIEW dbo.vw_xrfCoraCompanyPrefix
AS
SELECT        c.EntityKey, CCP.cora_acct_id
FROM            dbo.Dim_Entity AS c RIGHT OUTER JOIN
                         dbo.xrfCoraCompanyPrefix AS CCP ON c.EntCora_Account_ID = CCP.related_acctg_cora_acct_id AND c.EntADPCompanyID = CONVERT(varchar(3), CCP.Companyid) AND c.EntAccountingPrefix = CCP.Prefix

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
