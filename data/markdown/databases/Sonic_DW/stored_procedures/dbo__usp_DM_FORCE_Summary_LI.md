---
name: usp_DM_FORCE_Summary_LI
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
-- =============================================
-- Author:		Owen D. McPeak
-- Create date: 2014-03-05
-- Description:	Created for Jon Henin
-- =============================================
CREATE PROCEDURE [dbo].[usp_DM_FORCE_Summary_LI]
	AS
BEGIN
	IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DM_FORCE_Summary_LI]') AND type in (N'U'))
		drop table [Sonic_DW].dbo.DM_FORCE_Summary_LI

	SELECT * INTO [Sonic_DW].dbo.DM_FORCE_Summary_LI
	FROM
	(SELECT a.[DateKey]
	,a.[EntityKey]
	,'CP' LineItemType
	,a.[ServiceType]
	,SUM(a.[CPLaborSales]) LaborSales
	,SUM(a.[CPLaborCost]) LaborCost
	,SUM(a.[CPMiscCost]) MiscCost
	,SUM(a.[CPMiscSales]) MiscSales
	,SUM(a.[CPPartsCost]) PartsCost
	,SUM(a.[CPPartsSales]) PartsSales
	,SUM(a.[CPLIRO]) ROADPCount
	,CASE WHEN a.ServiceType = 'CP' THEN SUM(a.[ROCountDetail]) ELSE Sum(0) END ROCountDetail
	,SUM(a.[CPSSPCost]) SSPCost
	,SUM(a.[CPSSPSales]) SSPSales
	,SUM(a.[CPFRH]) SoldHours
	,SUM(a.[CPItemCount]) CountofROLine
	,MAX(b.[FixedOpsDayFlag]) FixedOpsDayFlag
	,MAX(b.[FOpsDaysMonth]) FixedOpsDayMonth
	FROM [Sonic_DW].[dbo].[DM_FORCE_SUMMARY] a
	 JOIN [Sonic_DW].[dbo].[vw_Dim_Date] b
		ON a.[DateKey] = b.[DateKey]
	WHERE a.ServiceType in ('CP')
	 GROUP BY a.[DateKey], a.[EntityKey], a.[ServiceType]
	 HAVING SUM(a.[CPLIRO]) > 0
	UNION
	SELECT a.[DateKey]
	,a.[EntityKey]
	,'WTY' LineItemType
	,a.[ServiceType]
	,SUM(a.[WTYLaborSales]) LaborSales
	,SUM(a.[WTYLaborCost]) LaborCost
	,SUM(a.[WTYMiscCost]) MiscCost
	,SUM(a.[WTYMiscSales]) MiscSales
	,SUM(a.[WTYPartsCost]) PartsCost
	,SUM(a.[WTYPartsSales]) PartsSales
	,SUM(a.[WTYLIRO]) ROADPCount
	,CASE WHEN a.ServiceType = 'WTY' THEN SUM(a.[ROCountDetail]) ELSE Sum(0) END ROCountDetail
	,SUM(a.[WTYSSPCost]) SSPCost
	,SUM(a.[WTYSSPSales]) SSPSales
	,SUM(a.[WTYFRH]) SoldHours
	,SUM(a.[WTYItemCount]) CountofROLine
	,MAX(b.[FixedOpsDayFlag]) FixedOpsDayFlag
	,MAX(b.[FOpsDaysMonth]) FixedOpsDayMonth
	FROM [Sonic_DW].[dbo].[DM_FORCE_SUMMARY] a
	 JOIN [Sonic_DW].[dbo].[vw_Dim_Date] b
		ON a.[DateKey] = b.[DateKey]
	WHERE a.ServiceType in ('WTY', 'CP')
	 GROUP BY a.[DateKey], a.[EntityKey], a.[ServiceType]
	 HAVING SUM(a.[WTYLIRO]) > 0
	UNION
	SELECT a.[DateKey]
	,a.[EntityKey]
	,'INT' LineItemType
	,a.[ServiceType]
	,SUM(a.[INTLaborSales]) LaborSales
	,SUM(a.[INTLaborCost]) LaborCost
	,SUM(a.[INTMiscCost]) MiscCost
	,SUM(a.[INTMiscSales]) MiscSales
	,SUM(a.[INTPartsCost]) PartsCost
	,SUM(a.[INTPartsSales]) PartsSales
	,SUM(a.[INTLIRO]) ROADPCount
	,CASE WHEN a.ServiceType = 'INT' THEN SUM(a.[ROCountDetail]) ELSE Sum(0) END ROCountDetail
	,SUM(a.[INTSSPCost]) SSPCost
	,SUM(a.[INTSSPSales]) SSPSales
	,SUM(a.[INTFRH]) SoldHours
	,SUM(a.[INTItemCount]) CountofROLine
	,MAX(b.[FixedOpsDayFlag]) FixedOpsDayFlag
	,MAX(b.[FOpsDaysMonth]) FixedOpsDayMonth
	FROM [Sonic_DW].[dbo].[DM_FORCE_SUMMARY] a
	 JOIN [Sonic_DW].[dbo].[vw_Dim_Date] b
		ON a.[DateKey] = b.[DateKey]
	WHERE a.ServiceType in ('CP', 'INT', 'WTY')
	 GROUP BY a.[DateKey], a.[EntityKey], a.[ServiceType]
	 HAVING SUM(a.[INTLIRO]) > 0
	UNION
	SELECT a.[DateKey]
	,a.[EntityKey]
	,'OTH' LineItemType
	,a.[ServiceType]
	,SUM(a.[OTHLaborSales]) LaborSales
	,SUM(a.[OTHLaborCost]) LaborCost
	,SUM(a.[OTHMiscCost]) MiscCost
	,SUM(a.[OTHMiscSales]) MiscSales
	,SUM(a.[OTHPartsCost]) PartsCost
	,SUM(a.[OTHPartsSales]) PartsSales
	,SUM(a.[OTHLIRO]) ROADPCount
	,CASE WHEN a.ServiceType = 'OTH' THEN SUM(a.[ROCountDetail]) ELSE Sum(0) END ROCountDetail
	,SUM(a.[OTHSSPCost]) SSPCost
	,SUM(a.[OTHSSPSales]) SSPSales
	,SUM(a.[OTHFRH]) SoldHours
	,SUM(a.[OTHItemCount]) CountofROLine
	,MAX(b.[FixedOpsDayFlag]) FixedOpsDayFlag
	,MAX(b.[FOpsDaysMonth]) FixedOpsDayMonth
	FROM [Sonic_DW].[dbo].[DM_FORCE_SUMMARY] a
	 JOIN [Sonic_DW].[dbo].[vw_Dim_Date] b
		ON a.[DateKey] = b.[DateKey]
	WHERE a.ServiceType in ('OTH', 'CP','WTY','INT')
	 GROUP BY a.[DateKey], a.[EntityKey], a.[ServiceType]
	 HAVING SUM(a.[OTHLIRO]) > 0) as a


	CREATE NONCLUSTERED INDEX [IDX_DM_FORCE_Summary_LI]
	ON [Sonic_DW].[dbo].[DM_FORCE_Summary_LI] ([DateKey])
	INCLUDE ([EntityKey],[LineItemType],[ServiceType],[LaborSales],[LaborCost],[MiscCost],[MiscSales],[PartsCost],[PartsSales],[ROADPCount],[ROCountDetail],[SSPCost],[SSPSales],[SoldHours],[CountofROLine])

END

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
