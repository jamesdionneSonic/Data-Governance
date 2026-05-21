---
name: DailySnapshot_sims
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
dependency_count: 0
parameter_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Definition

```sql






CREATE PROCEDURE dbo.DailySnapshot_sims

AS

SET NOCOUNT ON;

/* =========================================================================================
    Author:			Brittany Rogers
    Create date:	8/21/2025
    Description:	take a daily snapshot of the in_transit_recon_SimsTab table

========================================================================================= */

BEGIN

TRUNCATE TABLE dbo.Historical_darpts_Sims

INSERT INTO Historical_darpts_Sims (

	vin
	,cbs_status
	,cbs_location
	,store
	,stock_no
	,year
	,make
	,model
	,trim
	,age
	,buyer
	,wherepurchd
	,purchase_date
	,on_purchase_log
	)
	Select
	vin
	,cbs_status
	,cbs_location
	,store
	,stock_no
	,year
	,make
	,model
	,trim
	,age
	,buyer
	,wherepurchd
	,purchase_date
	,onpurchaselog
FROM darpts.In_Transit_Recon_SimsTab;

SET NOCOUNT OFF;

END


```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
