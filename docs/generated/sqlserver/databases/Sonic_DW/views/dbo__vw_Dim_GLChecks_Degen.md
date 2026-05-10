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
extracted_at: 2026-05-09T12:34:14.349Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Definition

```sql

CREATE VIEW [dbo].[vw_Dim_GLChecks_Degen]
AS
SELECT     GLCheckDegenKey, cora_acct_id, companyid, chknumber, interfacecode, journalid, docdescription, control, controltype, accountnumber, Payee, controldesc, 
                      checktype, vendornumber, address AS check_address, city AS check_city, state AS check_state, zip AS check_zip
FROM         dbo.Dim_GLChecks_Degen AS a


```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
