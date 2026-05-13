---
name: Dim_Entity_MERGE_MDS_Data_Push
database: Sonic_DW
type: procedure
schema: dq
owner: Data Team
tags:
  - procedure
  - auto-extracted
dependency_count: 1
parameter_count: 3
extracted_at: 2026-05-12T20:14:33.860Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dq

## Dependencies

This procedure depends on:

- **dbo.Dim_Entity** (U )

## Parameters

| Name            | Type | Output | Default |
| --------------- | ---- | ------ | ------- |
| `@InsertedRows` | int  | Yes    | No      |
| `@UpdatedRows`  | int  | Yes    | No      |
| `@DeletedRows`  | int  | Yes    | No      |

## Definition

```sql

-- =============================================
-- Author:		NCARPENDER
-- Create date: 11/1/2013
-- Description:	merges data from the staging table, which has been populated from MDS, into the entity.
--	USER	DATE		DESCRIPTION
--	NWC		20140828	Added DocReportFlag field
--	NWC		20140930	Added entBrandLvl0 field
--	NWC		20150122	Added EntRetailTradeCenter_Region field
--  NWC		20150219	Added EntRegionalTechnologyManagerID
--  NWC		20150219	Added EntBTOpsReportFlag
--  NWC		20150219	Added EntDMSServerName
-- =============================================
CREATE PROCEDURE [dq].[Dim_Entity_MERGE_MDS_Data_Push]
	@InsertedRows int output
	,@UpdatedRows int output
	,@DeletedRows int output
AS
BEGIN

	SET NOCOUNT ON;

------------------------------------------------------------------------------------------
-- Create a temporary table variable to hold the output actions.
------------------------------------------------------------------------------------------
	DECLARE @SummaryOfChanges TABLE(ChangeOccured int, Change VARCHAR(20));

	insert into @SummaryOfChanges values(0,'UPDATE');
	insert into @SummaryOfChanges values(0,'DELETE');
	insert into @SummaryOfChanges values(0,'INSERT');


------------------------------------------------------------------------------------------
-- Run the merge statement
------------------------------------------------------------------------------------------
MERGE dbo.Dim_Entity as tgt
USING	(
			SELECT
				 [Name]
				,[Code] as EntityKey
				,[EntCora_Account_ID]
				,[EntADPCompanyID]
				,[EntAccountingPrefix]
				,[SCORES_Company_Dealership_ID]
				,SIMSStoreID
				,[EntFDMName]
				,[EntRegionRVP]
				,[EntRegionRVP_Prev]
				,[EntAcquiredDate]
				,[EntAddressLine1]
				,[EntAddressMailingLine1]
				,[EntAddressCity]
				,[EntAddressState]
				,[EntAddressCounty]
				,[EntAddressZipCode]
				,[EntMainPhoneNumber]
				,[EntLegalStructure]
				,[EntOwnershipPct]
				,[EntFranchiseCount]
				,[LegalAssumedName]
				,[SameStoreDate]
				,[EntServiceBayQty]
				,[EntLiftQty]
				,[EntSquareFootage]
				,[EntNumberOfProperties]
				,[EntLeasePropertyQty]
				,[EntLuxuryFlag]
				,[EntBrandOrigin]
				,[EntBrandGroup]
				,[EntBrand]
				,[EntStoreBrandGroup]
				,[EntStoreBrand]
				,[BrandLvl0]
				,[EntDFIDRegion]
				,[EntUVDRegion]
				,[EntDFODRegion]
				,[EntDealerLvl0]
				,[EntDealerLvl1]
				,[EntDealerLvl2]
				,[EntMetroArea]
				,[EntSubRegion]
				,[EntBrand3rdTier]
				,[MetaNaturalKey]
				,[EntEssCode]
				,[HasBodyShop]
				,[EntHFMDealershipName]
				,[EntLatitude]
				,[EntLongitude]
				,[EntDefaultDlrshpLvl0]
				,[EntDefaultDlrshpLvl1]
				,[EntDefaultDlrshpLvl2]
				,[EntCOAType]
				,[EntRCRegion]
				,[EntActive]
				,[CurrentPrefixFlag]
				,[EntFireFlag]
				,[EntEntityType]
				,[HasBodyShopFlag]
				,[ForceReportFlag]
				,[FUELReportFlag]
				,[SIMSReportFlag]
				,[SPEEDReportFlag]
				,[SCORESReportFlag]
				,[FUELIIReportFlag]
				,PlaybookReportFlag
				,DOCReportFlag
				,LineOfBusiness
				,[SoldStatus]
				,[SoldDate]
				,[Legal_Entity]
				,[FacilityBranchType]
				,[HFMActive]
				,[FDMActive]
				,[ADPActive]
				,[EntRetailTradeCenter_Region]	/* NWC 20150122 added column*/
				,[RegionalTechnologyManagerID]	/*NWC 20150219 Added field*/
				,[BTOpsReportFlag]				/*NWC 20150219 Added field*/
				,[DMSServerName]				/*NWC 20150219 Added field*/
				,[ProcessReady]
				,CheckSumHash
				,Meta_LoadDate
				,Meta_LastModifiedDate
				,Meta_Src_Sys_ID
				,[User_ID]
				,Meta_ComputerName
				,ETLExecution_ID
				,MetaRowIsCurrent
			  FROM ETL_Staging.wrk.MDS_Entity_Push_Staging
		) as src
	ON tgt.EntityKey = src.EntityKey

	WHEN MATCHED AND (
						src.ProcessReady = 1
						and
							(
								src.CheckSumHash <> tgt.CheckSumHash
								or tgt.CheckSumHash is null
							)

					)
		THEN
			UPDATE SET
					      [EntName]				= src.[Name]
						, [EntityKey]			= src.[EntityKey]
						, [EntCora_Account_ID]	= src.[EntCora_Account_ID]
						, [EntADPCompanyID]		= src.[EntADPCompanyID]
						, [EntAccountingPrefix] = src.[EntAccountingPrefix]
						, [EntSCORES_Company_Dealership_ID] = src.[SCORES_Company_Dealership_ID]
						, [EntSIMSStoreID]		= src.SIMSStoreID
						, [EntFDMName]			= src.[EntFDMName]
						, [EntRegion]			= src.[EntRegionRVP]
						, [EntRegionRVP_Prev]		= src.[EntRegionRVP_Prev]
						, [EntAcquiredDate]		= src.[EntAcquiredDate]
						, [EntAddressLine1]		= src.[EntAddressLine1]
						, [EntAddressMailingLine1] = src.[EntAddressMailingLine1]
						, [EntAddressCity]		= src.[EntAddressCity]
						, [EntAddressState]		= src.[EntAddressState]
						, [EntAddressCounty]	= src.[EntAddressCounty]
						, [EntAddressZipCode]	= src.[EntAddressZipCode]
						, [EntMainPhoneNumber]	= src.[EntMainPhoneNumber]
						, [EntLegalStructure]	= src.[EntLegalStructure]
						, [EntOwnershipPct]		= src.[EntOwnershipPct]
						, [EntFranchiseCount]	= src.[EntFranchiseCount]
						, [EntLegalAssumedName]	= src.[LegalAssumedName]
						, [EntSameStoreDate]	= src.[SameStoreDate]
						, [EntServiceBayQty]	= src.[EntServiceBayQty]
						, [EntLiftQty]			= src.[EntLiftQty]
						, [EntSquareFootage]	= src.[EntSquareFootage]
						, [EntNumberOfProperties] = src.[EntNumberOfProperties]
						, [EntLeasePropertyQty] = src.[EntLeasePropertyQty]
						, [EntLuxuryFlag]		= src.[EntLuxuryFlag]
						, [EntBrandOrigin]		= src.[EntBrandOrigin]
						, [EntBrandGroup]		= src.[EntBrandGroup]
						, [EntBrand]			= src.[EntBrand]
						, [EntStoreBrandGroup]	= src.[EntStoreBrandGroup]
						, [EntStoreBrand]		= src.[EntStoreBrand]
						, [EntBrandLvl0]		= src.[BrandLvl0]
						, [EntDFIDRegion]		= src.[EntDFIDRegion]
						, [EntUVDRegion]		= src.[EntUVDRegion]
						, [EntDFODRegion]		= src.[EntDFODRegion]
						, [EntDealerLvl0]		= src.[EntDealerLvl0]
						, [EntDealerLvl1]		= src.[EntDealerLvl1]
						, [EntDealerLvl2]		= src.[EntDealerLvl2]
						, [EntMetroArea]		= src.[EntMetroArea]
						, [EntSubRegion]		= src.[EntSubRegion]
						, [EntBrand3rdTier]		= src.[EntBrand3rdTier]
						, [MetaNaturalKey]		= src.[MetaNaturalKey]
						, [EntEssCode]			= src.[EntEssCode]
						, [EntHasBodyShop]		= src.[HasBodyShop]
						, [EntHFMDealershipName] = src.[EntHFMDealershipName]
						, [EntLatitude]			= src.[EntLatitude]
						, [EntLongitude]		= src.[EntLongitude]
						, [EntDefaultDlrshpLvl0] = src.[EntDefaultDlrshpLvl0]
						, [EntDefaultDlrshpLvl1] = src.[EntDefaultDlrshpLvl1]
						, [EntDefaultDlrshpLvl2] = src.[EntDefaultDlrshpLvl2]
						, [EntCOAType]			= src.[EntCOAType]
						, [EntRCRegion]			= src.[EntRCRegion]
						, [EntActive]			= src.[EntActive]
						, [CurrentPrefixFlag]	= src.[CurrentPrefixFlag]
						, [EntFireFlag]			= src.[EntFireFlag]
						, [EntEntityType]		= src.[EntEntityType]
						, [EntHasBodyShopFlag]	= src.[HasBodyShopFlag]
						, [EntForceReportFlag]	= src.[ForceReportFlag]
						, [EntFUELReportFlag]	= src.[FUELReportFlag]
						, [EntSIMSReportFlag]	= src.[SIMSReportFlag]
						, [EntSPEEDReportFlag]	= src.[SPEEDReportFlag]
						, [EntSCORESReportFlag]	= src.[SCORESReportFlag]
						, [EntFUELIIReportFlag]	= src.[FUELIIReportFlag]
						, EntPlaybookReportFlag	= src.PlaybookReportFlag
						, EntDOCReportFlag		= src.DOCReportFlag
						, EntLineOfBusiness		= src.LineOfBusiness
						, [EntSoldStatus]		= src.[SoldStatus]
						, [EntSoldDate]			= src.[SoldDate]
						, [EntLegal_Entity]		= src.[Legal_Entity]
						, [EntFacilityBranchType]	= src.[FacilityBranchType]
						, [EntHFMActive]		= src.[HFMActive]
						, [EntFDMActive]		= src.[FDMActive]
						, [EntADPActive]		= src.[ADPActive]
						, [EntRetailTradeCenter_Region]		= src.[EntRetailTradeCenter_Region]			/* NWC 20150122 added column*/
						, [EntRegionalTechnologyManagerID]	= src.[RegionalTechnologyManagerID]	/*NWC 20150219 Added field*/
						, [EntBTOpsReportFlag]	= src.[BTOpsReportFlag]								/*NWC 20150219 Added field*/
						, [EntDMSServerName]	= src.[DMSServerName]									/*NWC 20150219 Added field*/
						, CheckSumHash			= src.CheckSumHash
						, Meta_LastModifiedDate = src.Meta_LastModifiedDate
						, Meta_Src_Sys_ID		= src.Meta_Src_Sys_ID
						, [User_ID]				= src.[User_ID]
						, Meta_ComputerName		= src.Meta_ComputerName
						, ETLExecution_ID		= src.ETLExecution_ID
						, MetaRowIsCurrent		= src.MetaRowIsCurrent

	WHEN NOT MATCHED BY TARGET AND ProcessReady = 1
		THEN
			INSERT
				(
					   [EntName]
					, [EntityKey]
					, [EntCora_Account_ID]
					, [EntADPCompanyID]
					, [EntAccountingPrefix]
					, EntSCORES_Company_Dealership_ID
					, [EntSIMSStoreID]
					, [EntFDMName]
					, [EntRegion]
					, [EntRegionRVP_Prev]
					, [EntAcquiredDate]
					, [EntAddressLine1]
					, [EntAddressMailingLine1]
					, [EntAddressCity]
					, [EntAddressState]
					, [EntAddressCounty]
					, [EntAddressZipCode]
					, [EntMainPhoneNumber]
					, [EntLegalStructure]
					, [EntOwnershipPct]
					, [EntFranchiseCount]
					, [EntLegalAssumedName]
					, [EntSameStoreDate]
					, [EntServiceBayQty]
					, [EntLiftQty]
					, [EntSquareFootage]
					, [EntNumberOfProperties]
					, [EntLeasePropertyQty]
					, [EntLuxuryFlag]
					, [EntBrandOrigin]
					, [EntBrandGroup]
					, [EntBrand]
					, [EntStoreBrandGroup]
					, [EntStoreBrand]
					, [EntBrandLvl0]
					, [EntDFIDRegion]
					, [EntUVDRegion]
					, [EntDFODRegion]
					, [EntDealerLvl0]
					, [EntDealerLvl1]
					, [EntDealerLvl2]
					, [EntMetroArea]
					, [EntSubRegion]
					, [EntBrand3rdTier]
					, [MetaNaturalKey]
					, [EntEssCode]
					, [EntHasBodyShop]
					, [EntHFMDealershipName]
					, [EntLatitude]
					, [EntLongitude]
					, [EntDefaultDlrshpLvl0]
					, [EntDefaultDlrshpLvl1]
					, [EntDefaultDlrshpLvl2]
					, [EntCOAType]
					, [EntRCRegion]
					, [EntActive]
					, [CurrentPrefixFlag]
					, [EntFireFlag]
					, [EntEntityType]
					, [EntHasBodyShopFlag]
					, [EntForceReportFlag]
					, [EntFUELReportFlag]
					, [EntSIMSReportFlag]
					, [EntSPEEDReportFlag]
					, [EntSCORESReportFlag]
					, [EntFUELIIReportFlag]
					, EntPlaybookReportFlag
					, EntDOCReportFlag
					, EntLineOfBusiness
					, [EntSoldStatus]
					, [EntSoldDate]
					, [EntLegal_Entity]
					, [EntFacilityBranchType]
					, [EntHFMActive]
					, [EntFDMActive]
					, [EntADPActive]
					, [EntRetailTradeCenter_Region]		/* NWC 20150122 added column*/
					, [EntRegionalTechnologyManagerID]	/*NWC 20150219 Added field*/
					, [EntBTOpsReportFlag]				/*NWC 20150219 Added field*/
					, [EntDMSServerName]				/*NWC 20150219 Added field*/
					, CheckSumHash
					, Meta_LoadDate
					, Meta_LastModifiedDate
					, Meta_Src_Sys_ID
					, [User_ID]
					, Meta_ComputerName
					, ETLExecution_ID
					, MetaRowIsCurrent
				)
			VALUES
				(
					  src. [Name]
					, src.[EntityKey]
					, src.[EntCora_Account_ID]
					, src.[EntADPCompanyID]
					, src.[EntAccountingPrefix]
					, src.SCORES_Company_Dealership_ID
					, src.SIMSStoreID
					, src.[EntFDMName]
					, src.[EntRegionRVP]
					, src.[EntRegionRVP_Prev]
					, src.[EntAcquiredDate]
					, src.[EntAddressLine1]
					, src.[EntAddressMailingLine1]
					, src.[EntAddressCity]
					, src.[EntAddressState]
					, src.[EntAddressCounty]
					, src.[EntAddressZipCode]
					, src.[EntMainPhoneNumber]
					, src.[EntLegalStructure]
					, src.[EntOwnershipPct]
					, src.[EntFranchiseCount]
					, src.[LegalAssumedName]
					, src.[SameStoreDate]
					, src.[EntServiceBayQty]
					, src.[EntLiftQty]
					, src.[EntSquareFootage]
					, src.[EntNumberOfProperties]
					, src.[EntLeasePropertyQty]
					, src.[EntLuxuryFlag]
					, src.[EntBrandOrigin]
					, src.[EntBrandGroup]
					, src.[EntBrand]
					, src.[EntStoreBrandGroup]
					, src.[EntStoreBrand]
					, src.[BrandLvl0]
					, src.[EntDFIDRegion]
					, src.[EntUVDRegion]
					, src.[EntDFODRegion]
					, src.[EntDealerLvl0]
					, src.[EntDealerLvl1]
					, src.[EntDealerLvl2]
					, src.[EntMetroArea]
					, src.[EntSubRegion]
					, src.[EntBrand3rdTier]
					, src.[MetaNaturalKey]
					, src.[EntEssCode]
					, src.[HasBodyShop]
					, src.[EntHFMDealershipName]
					, src.[EntLatitude]
					, src.[EntLongitude]
					, src.[EntDefaultDlrshpLvl0]
					, src.[EntDefaultDlrshpLvl1]
					, src.[EntDefaultDlrshpLvl2]
					, src.[EntCOAType]
					, src.[EntRCRegion]
					, src.[EntActive]
					, src.[CurrentPrefixFlag]
					, src.[EntFireFlag]
					, src.[EntEntityType]
					, src.[HasBodyShopFlag]
					, src.[ForceReportFlag]
					, src.[FUELReportFlag]
					, src.[SIMSReportFlag]
					, src.[SPEEDReportFlag]
					, src.[SCORESReportFlag]
					, src.[FUELIIReportFlag]
					, src.PlaybookReportFlag
					, src.DOCReportFlag
					, src.LineOfBusiness
					, src.[SoldStatus]
					, src.[SoldDate]
					, src.[Legal_Entity]
					, src.[FacilityBranchType]
					, src.[HFMActive]
					, src.[FDMActive]
					, src.[ADPActive]
					, src.[EntRetailTradeCenter_Region] /* NWC 20150122 added column*/
					, src.[RegionalTechnologyManagerID]	/*NWC 20150219 Added field*/
					, src.[BTOpsReportFlag]				/*NWC 20150219 Added field*/
					, src.[DMSServerName]				/*NWC 20150219 Added field*/
					, src.CheckSumHash
					, src.Meta_LoadDate
					, src.Meta_LastModifiedDate
					, src.Meta_Src_Sys_ID
					, src.[User_ID]
					, src.Meta_ComputerName
					, src.ETLExecution_ID
					, src.MetaRowIsCurrent
				)
	WHEN NOT MATCHED BY SOURCE THEN
		DELETE

		OUTPUT 1, $action INTO @SummaryOfChanges;

------------------------------------------------------------------------------------------
--	Return resutls of the merge to show actions taken
------------------------------------------------------------------------------------------

	set @InsertedRows = (select sum(ChangeOccured) as cnt from @SummaryOfChanges where Change = 'INSERT')
	set @UpdatedRows = (select sum(ChangeOccured) as cnt from @SummaryOfChanges where Change = 'UPDATE')
	set @DeletedRows = (select sum(ChangeOccured) as cnt from @SummaryOfChanges where Change = 'DELETE');

	SELECT Change, sum(ChangeOccured) AS CountPerChange FROM @SummaryOfChanges GROUP BY Change;

END


```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
