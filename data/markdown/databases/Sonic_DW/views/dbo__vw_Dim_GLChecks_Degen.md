---
name: vw_Dim_GLChecks_Degen
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Dim_GLChecks_Degen
dependency_count: 1
column_count: 18
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_GLChecks_Degen** (U )

## Columns

| Name              | Type    | Nullable | Description |
| ----------------- | ------- | -------- | ----------- |
| `GLCheckDegenKey` | int     |          |             |
| `cora_acct_id`    | int     | ✓        |             |
| `companyid`       | varchar | ✓        |             |
| `chknumber`       | varchar | ✓        |             |
| `interfacecode`   | varchar | ✓        |             |
| `journalid`       | varchar | ✓        |             |
| `docdescription`  | varchar | ✓        |             |
| `control`         | varchar | ✓        |             |
| `controltype`     | varchar | ✓        |             |
| `accountnumber`   | varchar | ✓        |             |
| `Payee`           | varchar | ✓        |             |
| `controldesc`     | varchar | ✓        |             |
| `checktype`       | varchar | ✓        |             |
| `vendornumber`    | varchar | ✓        |             |
| `check_address`   | varchar | ✓        |             |
| `check_city`      | varchar | ✓        |             |
| `check_state`     | varchar | ✓        |             |
| `check_zip`       | varchar | ✓        |             |

## Definition

```sql

CREATE VIEW [dbo].[vw_Dim_GLChecks_Degen]
AS
SELECT     GLCheckDegenKey, cora_acct_id, companyid, chknumber, interfacecode, journalid, docdescription, control, controltype, accountnumber, Payee, controldesc,
                      checktype, vendornumber, address AS check_address, city AS check_city, state AS check_state, zip AS check_zip
FROM         dbo.Dim_GLChecks_Degen AS a


```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
