---
name: spLoadDimPricingGrid
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on: []
dependency_count: 0
parameter_count: 0
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Definition

```sql

/*****************************************************************************************
-- CHANGE LOG
-- 07/03/2019:	DMD - Created procedure
*****************************************************************************************/

--EXEC [dbo].[spLoadDimPricingGrid]


CREATE PROC [dbo].[spLoadDimPricingGrid]
AS

with CTE as
(select
	cora_acct_id,gridname,begsoldhrs,GridDollarsActual,centincrement,convert(date,rowlastupdated ) as rowlastupdated
from
	ETL_Staging.wrk.DMS_PricingGrid_staging
)
,CTB as
(
select PgrHdrcora_acct_id,PgrGridName,PgrBeginHours,PgrGridDollarsActual,PgrCentIncrement
from sonic_dw.dbo.Dim_PricingGrid
)
,CTC as
(
select EE.cora_acct_id,EE.GridName,EE.BegSoldHrs,EE.GridDollarsActual ,BB.PgrGridDollarsActual,EE.rowlastupdated
from CTE EE left join
CTB BB on
EE.cora_acct_id = BB.PgrHdrcora_acct_id
and EE.GridName = BB.PgrGridName
and EE.BegSoldHrs = BB.PgrBeginHours
where BB.PgrGridDollarsActual <> EE.GridDollarsActual
)
,CTD as
(
select distinct CC.cora_acct_id,GridName,CONVERT(date,max(rowlastupdated)) as rowlastupdated
from CTC CC
group by cora_acct_id,GridName
)
select
     CONVERT(VARCHAR(40), a.centincrement) AS PgrCentIncrement
	,a.cora_acct_id AS PgrHdrcora_acct_id
	,CONVERT(varchar(50), a.GridName) AS PgrGridName
	,CONVERT(varchar(255), a.GridDescription) AS PgrGridDescription
	,CONVERT(char(1), a.CalcType) AS PgrCalcType
	,'Unknown' AS PgrGroupName
	,CONVERT(numeric(10, 2), a.BegSoldHrs) AS PgrBeginHours
	,CONVERT(numeric(10, 2), a.EndSoldHrs) AS PgrEndHours
	,CONVERT(money, a.GridDollarsActual) AS PgrGridDollarsActual
	,CONVERT(bit, COALESCE(a.ActiveFlag, 1)) AS PgrIsActive
	,CONVERT(VARCHAR(40), a.hostitemid) AS PgrHostitemid
	,CONVERT(bit, 0) AS PgrIsTest
	,CONVERT(varchar(50), a.Meta_NaturalKey) AS Meta_NaturalKey
	,CONVERT(date,DD.rowlastupdated) as MetaRowEffectiveDate
	,CONVERT(Date,'9999-12-31') as MetaRowExpiredDate
INTO #PGUpdate
from
	ETL_Staging.wrk.DMS_PricingGrid_staging a
	inner join CTD DD on a.cora_acct_id = DD.cora_acct_id and a.GridName = DD.GridName
--WHERE a.GridName='070118'

BEGIN
MERGE sonic_dw.dbo.Dim_PricingGrid tgt
	USING
		(
			SELECT
			   	PgrCentIncrement
				,PgrHdrcora_acct_id
				,PgrGridName
				,PgrGridDescription
				,PgrCalcType
				,PgrGroupName
				,PgrBeginHours
				,PgrEndHours
				,PgrGridDollarsActual
				,PgrIsActive
				,PgrHostitemid
				,PgrIsTest
				,Meta_NaturalKey
				,MetaRowEffectiveDate
				,MetaRowExpiredDate
			FROM #PGUpdate
			--WHERE lDelPersonID <> -1
			--GROUP BY lKeepPersonID, lDelPersonID, dtMerged --ORDER BY lDelPersonID
		)  SRC
	ON
			tgt.PgrHdrcora_acct_id = src.PgrHdrcora_acct_id
		AND ISNULL(tgt.PgrGridName,'') = ISNULL(src.PgrGridName,'')
		--AND ISNULL(tgt.PgrGridDescription,'') = ISNULL(src.PgrGridDescription,'')
		AND ISNULL(tgt.PgrGroupName,'') = ISNULL(src.PgrGroupName,'')
		--AND ISNULL(tgt.PgrBeginHours,-1) = ISNULL(src.PgrBeginHours,-1)
		--AND ISNULL(tgt.PgrEndHours,-1) = ISNULL(src.PgrEndHours,-1)
		--AND ISNULL(tgt.PgrGridDollarsActual,-1) = ISNULL(src.PgrGridDollarsActual,-1)
		--AND ISNULL(tgt.PgrIsActive,1) = ISNULL(src.PgrIsActive,1)
		AND ISNULL(tgt.PgrHostItemID,'') = ISNULL(src.PgrHostitemid,'')
		AND ISNULL(tgt.Meta_NaturalKey,'') = ISNULL(src.Meta_NaturalKey,'')

WHEN MATCHED
AND ISNULL(tgt.PgrCalcType,'') <> ISNULL(src.PgrCalcType,'')

THEN UPDATE SET
  		  TGT.PgrCalcType = src.PgrCalcType
		 ,TGT.[Meta_RowLastChangedDate] = GETDATE()
		 ,TGT.Meta_RowIsCurrent   = 'Y'

      ;

DROP TABLE #PGUpdate
END

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
