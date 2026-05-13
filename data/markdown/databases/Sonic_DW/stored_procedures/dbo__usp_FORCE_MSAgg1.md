---
name: usp_FORCE_MSAgg1
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - vw_Fact_Service
  - vw_Fact_ServiceDetail
dependency_count: 2
parameter_count: 0
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.vw_Fact_Service** (V )
- **dbo.vw_Fact_ServiceDetail** (V )

## Definition

```sql




-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[usp_FORCE_MSAgg1]

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
drop table DM_FORCE_Summary


;with gopa1 as
 (select	a11.[ServiceAdvisorKey]  ServiceAdvisorKey,
		a11.[ServiceType]  ServiceType,
		a11.[EntityKey]  EntityKey,
		a11.[CloseDateKey]  DateKey,
		sum(a11.[CPFlag])  CPLIRO,
		sum(a11.[INTFlag])  INTLIRO,
		sum(a11.[OTHFlag])  OTHLIRO,
		sum(a11.[WTYFlag])  WTYLIRO,
		sum(a11.[MenuClosedFlag])  MenuCls,
		sum(a11.[MenuOpportunityFlag])  MenuUps,
		sum(a11.[ROCount])  ROCountDetail,
		sum(a11.[DaysOpen])  DaysOpen,
		sum(a11.[MenuSoldFlag])  MenuCount,
		sum(a11.[Discounts])  Discounts,
		sum(a11.[LaborDiscount])  DiscountsLabor,
		sum(a11.[PartsDiscount])  DiscountsParts,
		sum(a11.[ShopSuppliesSales])  SSPSales,
		sum(a11.[ShopSuppliesCost])  SSPCost,
		sum((Case when a11.[ServiceType] in ('WTY') then a11.[ShopSuppliesSales] else NULL end))  WTYSSPSales,
		sum((Case when a11.[ServiceType] in ('WTY') then a11.[ShopSuppliesCost] else NULL end))  WTYSSPCost,
		sum((Case when a11.[ServiceType] in ('CP') then a11.[ShopSuppliesSales] else NULL end))  CPSSPSales,
		sum((Case when a11.[ServiceType] in ('CP') then a11.[ShopSuppliesCost] else NULL end))  CPSSPCost,
		sum((Case when a11.[ServiceType] in ('INT') then a11.[ShopSuppliesSales] else NULL end))  INTSSPSales,
		sum((Case when a11.[ServiceType] in ('INT') then a11.[ShopSuppliesCost] else NULL end))  INTSSPCost,
		sum((Case when a11.[ServiceType] in ('OTH') then a11.[ShopSuppliesSales] else NULL end))  OTHSSPSales,
		sum((Case when a11.[ServiceType] in ('OTH') then a11.[ShopSuppliesCost] else NULL end))  OTHSSPCost,
		sum((Case when a11.[originappl] in ('3PA_DEALERLOGIX', 'DealerLOGIX', '3PA_DLRLOGI', 'DLRLOGIX','3PA_ELEAD','DLRLOGI','ELEAD','XTIMEIN') then a11.[ROCount] else NULL end))  CountofDLX,
		sum((Case when a11.[originappl] in ('Carink') then a11.[ROCount] else NULL end))  CountofSplitRO
	from	dbo.vw_Fact_Service	a11
	where	(a11.[ROStatus] = 1)
	group by	a11.[ServiceAdvisorKey],
		a11.[ServiceType],
		a11.[EntityKey],
		a11.[CloseDateKey]
	),
	 gopa2 as
 (select	a12.[ServiceAdvisorKey]  ServiceAdvisorKey,
		a11.[ServiceType]  ServiceType,
		a11.[EntityKey]  EntityKey,
		a12.[CloseDateKey]  DateKey,
		sum((Case when (a11.[OpcOpCodeGroup] in ('Repair') and a11.[LineItemType] in ('CP')) then a11.[LaborSale] else NULL end))  RprLS,
		sum((Case when (a11.[OpcOpCodeGroup] in ('Repair') and a11.[LineItemType] in ('CP')) then a11.[SoldHours] else NULL end))  RprHours,
		sum((Case when (a11.[OpcOpCodeGroup] in ('NA') and a11.[LineItemType] in ('CP')) then a11.[LaborSale] else NULL end))  NALS,
		sum((Case when (a11.[OpcOpCodeGroup] in ('NA') and a11.[LineItemType] in ('CP')) then a11.[SoldHours] else NULL end))  NAHours,
		sum((Case when (a11.[LineItemType] in ('CP') and a11.[OpcOpCodeGroup] in ('Maint')) then a11.[LaborSale] else NULL end))  MaintLS,
		sum((Case when (a11.[LineItemType] in ('CP') and a11.[OpcOpCodeGroup] in ('Maint')) then a11.[SoldHours] else NULL end))  MaintHours,
		sum((Case when a11.[LineItemType] in ('CP') then a11.[SoldHours] else NULL end))  CPFRH,
		sum((Case when a11.[LineItemType] in ('WTY') then a11.[SoldHours] else NULL end))  WTYFRH,
		sum((Case when a11.[LineItemType] in ('WTY') then a11.[LaborSale] else NULL end))  WTYLaborSales,
		sum((Case when a11.[LineItemType] in ('WTY') then a11.[PartsSale] else NULL end))  WTYPartsSales,
		sum((Case when a11.[LineItemType] in ('WTY') then a11.[PartsCost] else NULL end))  WTYPartsCost,
		sum((Case when a11.[LineItemType] in ('WTY') then a11.[LaborCost] else NULL end))  WTYLaborCost,
		sum((Case when a11.[LineItemType] in ('WTY') then a11.[MiscSale] else NULL end))  WTYMiscSales,
		sum((Case when a11.[LineItemType] in ('WTY') then a11.[MiscCost] else NULL end))  WTYMiscCost,
		sum((Case when a11.[LineItemType] in ('WTY') then a11.[ItemCount] else NULL end))  WTYItemCount,
		sum((Case when a11.[LineItemType] in ('CP') then a11.[LaborSale] else NULL end))  CPLaborSales,
		sum((Case when a11.[LineItemType] in ('CP') then a11.[PartsSale] else NULL end))  CPPartsSales,
		sum((Case when a11.[LineItemType] in ('CP') then a11.[PartsCost] else NULL end))  CPPartsCost,
		sum((Case when a11.[LineItemType] in ('CP') then a11.[LaborCost] else NULL end))  CPLaborCost,
		sum((Case when a11.[LineItemType] in ('CP') then a11.[MiscCost] else NULL end))  CPMiscCost,
		sum((Case when a11.[LineItemType] in ('CP') then a11.[MiscSale] else NULL end))  CPMiscSales,
		sum(a11.[OneLineItemFlag])  OneLineItem,
		sum(a11.[ItemCount])  CountofROLine,
		sum(a11.[SoldHours])  SoldHours,
		sum(a11.[GridOpportunityFlag])  GridOP,
		sum(a11.[GridOpportunityDoneFlag])  GridOpDone,
		sum(a11.[LaborSale])  LaborSales,
		sum(a11.[LaborCost])  LaborCost,
		sum(a11.[PartsCost])  PartsCost,
		sum(a11.[PartsSale])  PartsSales,
		sum(a11.[VIPCount])  VIPReinspection,
		max(a11.[HourRate])  DoorRate,
		max(a11.[TargetHourRate])  TargetHourRate,
		sum(a11.[OffGridFlag])  GridOverRide,
		sum(a11.[Upsell])  UpsellCount,
		sum(a11.[OPCWeight])  OPCWeight,
		sum(a11.[FDCICount])  FDCICount,
		sum(a11.[CustomerPayCount])  CPItemCount,
		sum(a11.[MiscSale])  MiscSales,
		sum(a11.[MiscCost])  MiscCost,
		sum((Case when a11.[Upsell] = 1 then a11.[LaborSale] else NULL end))  UpsellSales,
		sum((Case when a11.[Upsell] = 1 then a11.[SoldHours] else NULL end))  UpsellHours,
		sum((Case when a11.[LineItemType] in ('OTH') then a11.[LaborSale] else NULL end))  OTHLaborSales,
		sum((Case when a11.[LineItemType] in ('OTH') then a11.[LaborCost] else NULL end))  OTHLaborCost,
		sum((Case when a11.[LineItemType] in ('OTH') then a11.[PartsCost] else NULL end))  OTHPartsCost,
		sum((Case when a11.[LineItemType] in ('OTH') then a11.[PartsSale] else NULL end))  OTHPartsSales,
		sum((Case when a11.[LineItemType] in ('OTH') then a11.[SoldHours] else NULL end))  OTHFRH,
		sum((Case when a11.[LineItemType] in ('OTH') then a11.[MiscSale] else NULL end))  OTHMiscSales,
		sum((Case when a11.[LineItemType] in ('OTH') then a11.[MiscCost] else NULL end))  OTHMiscCost,
		sum((Case when a11.[LineItemType] in ('OTH') then a11.[ItemCount] else NULL end))  OTHItemCount,
		sum((Case when a11.[LineItemType] in ('INT') then a11.[SoldHours] else NULL end))  INTFRH,
		sum((Case when a11.[LineItemType] in ('INT') then a11.[PartsSale] else NULL end))  INTPartsSales,
		sum((Case when a11.[LineItemType] in ('INT') then a11.[PartsCost] else NULL end))  INTPartsCost,
		sum((Case when a11.[LineItemType] in ('INT') then a11.[LaborCost] else NULL end))  INTLaborCost,
		sum((Case when a11.[LineItemType] in ('INT') then a11.[LaborSale] else NULL end))  INTLaborSales,
		sum((Case when a11.[LineItemType] in ('INT') then a11.[MiscSale] else NULL end))  INTMiscSales,
		sum((Case when a11.[LineItemType] in ('INT') then a11.[MiscCost] else NULL end))  INTMiscCost,
		sum((Case when a11.[LineItemType] in ('INT') then a11.[ItemCount] else NULL end))  INTItemCount,
		sum((Case when (coalesce(a11.[OpcMenu], 'UKN') in ('Menu', 'Menu Basic', 'Menu Rec', 'Menu Value', 'Basic', 'Rec', 'Value') and a11.[LineItemType] in ('CP')) then a11.[SoldHours] else NULL end))  MenuHours,
		sum((Case when (a11.[OpcOpCodeGroup] in ('Competitive') and a11.[LineItemType] in ('CP')) then a11.[SoldHours] else NULL end))  CompHours,
		sum((Case when (a11.[OpcOpCodeGroup] in ('Competitive') and a11.[LineItemType] in ('CP')) then a11.[LaborSale] else NULL end))  CompLS,
		sum((Case when (a11.[LineItemType] in ('CP') and a11.[OpcOpCodeGroup] in ('LOF')) then a11.[SoldHours] else NULL end))  LOFHours,
		sum((Case when (a11.[LineItemType] in ('CP') and a11.[OpcOpCodeGroup] in ('LOF')) then a11.[LaborSale] else NULL end))  LOFLS
	from	dbo.vw_Fact_ServiceDetail	a11
		join	dbo.vw_Fact_Service	a12
		  on 	(a11.[ServiceKey] = a12.[ServiceKey])
	where	(a12.[ROStatus] = 1)
	group by	a12.[ServiceAdvisorKey],
		a11.[ServiceType],
		a11.[EntityKey],
		a12.[CloseDateKey]
	)select	coalesce(pa11.[DateKey], pa12.[DateKey])  DateKey,
	coalesce(pa11.[EntityKey], pa12.[EntityKey])  EntityKey,
	coalesce(pa11.[ServiceType], pa12.[ServiceType])  ServiceType,
	coalesce(pa11.[ServiceAdvisorKey], pa12.[ServiceAdvisorKey])  ServiceAdvisorKey,
	pa11.[CPLIRO]  CPLIRO,
	pa11.[INTLIRO]  INTLIRO,
	pa11.[OTHLIRO]  OTHLIRO,
	pa11.[WTYLIRO]  WTYLIRO,
	pa12.[RprLS]  RprLS,
	pa12.[RprHours]  RprHours,
	pa12.[NALS]  NALS,
	pa12.[NAHours]  NAHours,
	pa12.[MaintLS]  MaintLS,
	pa12.[MaintHours]  MaintHours,
	pa12.[CPFRH]  CPFRH,
	pa12.[WTYFRH]  WTYFRH,
	pa12.[CPLaborSales]  CPLaborSales,
	pa12.[WTYLaborSales]  WTYLaborSales,
	pa12.[OneLineItem]  OneLineItem,
	pa12.[CountofROLine]  CountofROLine,
	pa12.[SoldHours]  SoldHours,
	pa12.[GridOP]  GridOP,
	pa12.[GridOpDone]  GridOpDone,
	pa12.[LaborSales]  LaborSales,
	pa12.[LaborCost]  LaborCost,
	pa11.[MenuCls]  MenuCls,
	pa11.[MenuUps]  MenuUps,
	pa12.[PartsCost]  PartsCost,
	pa12.[PartsSales]  PartsSales,
	pa11.[ROCountDetail]  ROCountDetail,
	pa12.[VIPReinspection]  VIPReinspection,
	pa12.[DoorRate]  DoorRate,
	pa11.[DaysOpen]  DaysOpen,
	pa12.[TargetHourRate]  TargetHourRate,
	pa12.[GridOverRide]  GridOverRide,
	pa12.[UpsellCount]  UpsellCount,
	pa12.[UpsellSales]  UpsellSales,
	pa12.[UpsellHours]  UpsellHours,
	pa12.[OPCWeight]  OPCWeight,
	pa12.[FDCICount]  FDCICount,
	pa11.[MenuCount]  MenuCount,
	pa12.[CPItemCount]  CPItemCount,
	pa12.[WTYPartsSales]  WTYPartsSales,
	pa12.[CPPartsSales]  CPPartsSales,
	pa12.[WTYPartsCost]  WTYPartsCost,
	pa12.[CPPartsCost]  CPPartsCost,
	pa12.[WTYLaborCost]  WTYLaborCost,
	pa12.[CPLaborCost]  CPLaborCost,
	pa12.[OTHLaborSales]  OTHLaborSales,
	pa12.[OTHLaborCost]  OTHLaborCost,
	pa12.[OTHPartsCost]  OTHPartsCost,
	pa12.[OTHPartsSales]  OTHPartsSales,
	pa12.[CPMiscCost]  CPMiscCost,
	pa12.[CPMiscSales]  CPMiscSales,
	pa12.[INTFRH]  INTFRH,
	pa12.[OTHFRH]  OTHFRH,
	pa11.[Discounts]  Discounts,
	pa11.[DiscountsLabor] DiscountsLabor,
	pa11.[DiscountsParts] DiscountsParts,
	pa12.[MenuHours]  MenuHours,
	pa12.[CompHours]  CompHours,
	pa12.[CompLS]  CompLS,
	pa12.[LOFHours]  LOFHours,
	pa12.[LOFLS]  LOFLS,
	pa12.[INTPartsSales]  INTPartsSales,
	pa12.[INTPartsCost]  INTPartsCost,
	pa12.[INTLaborCost]  INTLaborCost,
	pa12.[INTLaborSales]  INTLaborSales,
	pa12.[MiscSales]  MiscSales,
	pa12.[MiscCost]  MiscCost,
	pa11.[SSPSales]  SSPSales,
	pa11.[SSPCost]  SSPCost,
	pa12.[INTMiscSales]  INTMiscSales,
	pa12.[INTMiscCost]  INTMiscCost,
	pa11.[INTSSPSales]  INTSSPSales,
	pa11.[INTSSPCost]  INTSSPCost,
	pa12.[WTYMiscSales]  WTYMiscSales,
	pa12.[WTYMiscCost]  WTYMiscCost,
	pa11.[WTYSSPSales]  WTYSSPSales,
	pa11.[WTYSSPCost]  WTYSSPCost,
	pa11.[CPSSPSales]  CPSSPSales,
	pa11.[CPSSPCost]  CPSSPCost,
	pa12.[OTHMiscSales]  OTHMiscSales,
	pa12.[OTHMiscCost]  OTHMiscCost,
	pa11.[OTHSSPSales]  OTHSSPSales,
	pa11.[OTHSSPCost]  OTHSSPCost,
	pa11.[CountofDLX]  CountofDLX,
	pa11.[CountofSplitRO]  CountofSplitRO,
	pa12.[WTYItemCount] WTYItemCount,
	pa12.[INTItemCount] INTItemCount,
	pa12.[OTHItemCount] OTHItemCount
into DM_FORCE_SUMMARY
from	gopa1	pa11
	full outer join	gopa2	pa12
	  on 	(pa11.[DateKey] = pa12.[DateKey] and
	pa11.[EntityKey] = pa12.[EntityKey] and
	pa11.[ServiceAdvisorKey] = pa12.[ServiceAdvisorKey] and
	pa11.[ServiceType] = pa12.[ServiceType])

CREATE NONCLUSTERED INDEX [IDX_DM_FORCE_DateKey] ON [dbo].[DM_FORCE_SUMMARY]
(
	[DateKey] ASC
)
INCLUDE ( [EntityKey],
[ServiceType],
[ServiceAdvisorKey],
[INTLIRO],
[WTYLIRO],
[RprLS],
[RprHours],
[NALS],
[NAHours],
[MaintLS],
[MaintHours],
[CPFRH],
[WTYFRH],
[CPLaborSales],
[WTYLaborSales],
[OneLineItem],
[CountofROLine],
[SoldHours],
[GridOP],
[GridOpDone],
[LaborSales],
[LaborCost],
[MenuCls],
[MenuUps],
[PartsCost],
[PartsSales],
[ROCountDetail],
[VIPReinspection],
[DoorRate],
[DaysOpen],
[TargetHourRate],
[GridOverRide],
[UpsellCount],
[UpsellSales],
[UpsellHours],
[OPCWeight],
[FDCICount],
[MenuCount],
[CPItemCount],
[WTYPartsSales],
[CPPartsSales],
[WTYPartsCost],
[CPPartsCost],
[WTYLaborCost],
[CPLaborCost],
[OTHLaborSales],
[CPMiscCost],
[CPMiscSales],
[INTFRH],
[OTHFRH],
[Discounts],
[DiscountsLabor],
[DiscountsParts],
[MenuHours],
[CompHours],
[CompLS],
[LOFHours],
[LOFLS],
[INTPartsSales],
[INTPartsCost],
[INTLaborCost],
[INTLaborSales],
[MiscSales],
[MiscCost],
[SSPSales],
[SSPCost],
[INTMiscSales],
[INTMiscCost],
[INTSSPSales],
[INTSSPCost],
[WTYMiscSales],
[WTYMiscCost],
[WTYSSPSales],
[WTYSSPCost],
[CPSSPSales],
[CPSSPCost],
[WTYItemCount],
[INTItemCount],
[OTHItemCount],
[CountofDLX],
[CountofSplitRO]) WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]



END


```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
