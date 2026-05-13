---
name: vwFloorPlanBankTRNFile
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on: []
dependency_count: 0
column_count: 6
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Columns

| Name              | Type    | Nullable | Description |
| ----------------- | ------- | -------- | ----------- |
| `Dealer_From_CIN` | varchar | ✓        |             |
| `VIN`             | varchar | ✓        |             |
| `Dealer_To_CIN`   | varchar | ✓        |             |
| `Account_ID_To`   | varchar | ✓        |             |
| `EffectiveDate`   | date    | ✓        |             |
| `Stock_Number`    | varchar |          |             |

## Definition

```sql




CREATE view [dbo].[vwFloorPlanBankTRNFile] as

/********************************************************************************************/
/* Author: Lindsay DePree		Date: 2020-06-03		Comments: Intial Creation			*/
/* Modified:					Date:					Comments:							*/
/********************************************************************************************/

-------------------TRN FILE MANUAL------------------------
---effective date should be last date we sent to bank
-----------------------------------------------------------

--declare @MaxBankDate datetime = (select max(FND_Bank_SentDate) from Sonic_DW.[dbo].[Syndicate_Floorplan_Funding])
with
maxDate as (
	--select	convert(date,max(FND_Bank_SentDate),101) as MaxBankDate
	--from	Sonic_DW.[dbo].[Syndicate_Floorplan_Funding]
	select LastBankDate as MaxBankDate
	from (	select top 2 convert(date,FND_Bank_SentDate,101) as LastBankDate, ROW_NUMBER () OVER ( order by convert(date,FND_Bank_SentDate,101) desc) as RN
			from	Sonic_DW.[dbo].[Syndicate_Floorplan_Funding]
			group by convert(date,FND_Bank_SentDate,101)
			order by convert(date,FND_Bank_SentDate,101) desc
			) as d
	where RN = 2
)
select	*
from	(
----vehicles funded in pool line from last day we sent a file to the bank
		select	'70076' as Dealer_From_CIN --pool static CIN 70076
				, fnd.VIN
				, act.cin as Dealer_To_CIN
				, act.account as Account_ID_To
				, dt.maxBankDate as EffectiveDate
				, fnd.Stockno as Stock_Number
		FROM	Sonic_DW.[dbo].[Syndicate_Floorplan_Funding] fnd
				inner join maxDate dt on convert(date,fnd.Meta_LoadDate) = dt.MaxBankDate
				LEFT JOIN [Sonic_DW].[dbo].[Syndicate_FPAccounts] act ON fnd.entitykey = act.entitykey
		WHERE	SSC_FND_file_loadflag = 1 AND fnd.GLSchedKey IS NOT NULL --Raj update ASM 12/14/2020
		Union
-------plus last bank day SST transfers
		select	pact.cin as Dealer_From_CIN --pool static CIN 70076
				, fnd.VIN
				, fact.cin as Dealer_To_CIN
				, fact.account as Account_ID_To
				, convert(varchar, fnd.Meta_LoadDate, 101) as EffectiveDate
				, Stockno as Stock_Number
		FROM	Sonic_DW.[dbo].[Syndicate_Floorplan_Funding] as fnd
				inner join maxDate dt on convert(date,fnd.Meta_LoadDate) = dt.MaxBankDate
				INNER JOIN Sonic_DW.[dbo].[Syndicate_Floorplan_Payoff] pay on fnd.vin = pay.vin
				LEFT JOIN [Sonic_DW].[dbo].[Syndicate_FPAccounts] fact ON fnd.entitykey = fact.entitykey
				LEFT JOIN [Sonic_DW].[dbo].[Syndicate_FPAccounts] pact ON pay.entitykey = pact.entitykey
		WHERE	fnd.TRN_File_LoadFlag =1
				and convert(date,fnd.Meta_LoadDate) = convert(date,pay.Meta_LoadDate) --load dates match
				and fact.cin <> pact.cin
		) recs
;




```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
