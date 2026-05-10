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
extracted_at: 2026-05-09T12:34:14.349Z
---

## Overview

1- **Type**: View
- **Schema**: dbo

## Definition

```sql
CREATE VIEW dbo.vw_xrfCoraCompanyPrefix
AS
SELECT        c.EntityKey, CCP.cora_acct_id
FROM            dbo.Dim_Entity AS c RIGHT OUTER JOIN
                         dbo.xrfCoraCompanyPrefix AS CCP ON c.EntCora_Account_ID = CCP.related_acctg_cora_acct_id AND c.EntADPCompanyID = CONVERT(varchar(3), CCP.Companyid) AND c.EntAccountingPrefix = CCP.Prefix

```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
