---
name: vw_stg_Dim_Employee
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

/********************************************************
*- Created By CDE 06/08/2012
*- Updated to view to add additional fields CDE 06/08/2012
*- Updated view.Added column EmployeeName 04/01/2015 
   By Bhramar Chandrakar
*********************************************************/
CREATE VIEW [dbo].[vw_stg_Dim_Employee]
AS
WITH cte_stg_Dim_Employee
AS (
	SELECT CONVERT(INT, a.cora_acct_id) AS cora_acct_id
		,CONVERT(VARCHAR(17), a.accountingaccount) AS accountingaccount
		,CONVER
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
